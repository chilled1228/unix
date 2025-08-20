import { supabase } from './supabase'
import { blogMediaApi } from './blog-api'
import { ImageUploadResult, ImageUploadOptions } from '@/types/blog'

const DEFAULT_OPTIONS: ImageUploadOptions = {
  max_size: 5 * 1024 * 1024, // 5MB
  allowed_types: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  generate_thumbnails: false,
  optimize: true
}

export class ImageUploadError extends Error {
  constructor(message: string, public code?: string) {
    super(message)
    this.name = 'ImageUploadError'
  }
}

export const imageUploadService = {
  /**
   * Validate image file before upload
   */
  validateImage(file: File, options: ImageUploadOptions = {}): void {
    const opts = { ...DEFAULT_OPTIONS, ...options }

    // Check file size
    if (file.size > opts.max_size!) {
      throw new ImageUploadError(
        `File size too large. Maximum size is ${(opts.max_size! / 1024 / 1024).toFixed(1)}MB`,
        'FILE_TOO_LARGE'
      )
    }

    // Check file type
    if (!opts.allowed_types!.includes(file.type)) {
      throw new ImageUploadError(
        `File type not allowed. Allowed types: ${opts.allowed_types!.join(', ')}`,
        'INVALID_FILE_TYPE'
      )
    }
  },

  /**
   * Generate unique filename
   */
  generateFilename(originalName: string, userId: string): string {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    const extension = originalName.split('.').pop()?.toLowerCase() || 'jpg'
    return `${userId}/${timestamp}-${random}.${extension}`
  },

  /**
   * Upload image to Supabase Storage
   */
  async uploadToStorage(
    file: File, 
    filename: string, 
    bucket: string = 'blog-images'
  ): Promise<string> {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filename, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      throw new ImageUploadError(`Failed to upload image: ${error.message}`, 'UPLOAD_FAILED')
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filename)

    return publicUrl
  },

  /**
   * Create media record in database
   */
  async createMediaRecord(
    file: File,
    filename: string,
    publicUrl: string,
    userId: string,
    altText?: string,
    caption?: string
  ) {
    return await blogMediaApi.create({
      filename,
      original_name: file.name,
      file_path: publicUrl,
      file_size: file.size,
      mime_type: file.type,
      alt_text: altText ?? null,
      caption: caption ?? null,
      uploaded_by: userId
    })
  },

  /**
   * Complete image upload process
   */
  async uploadImage(
    file: File,
    userId: string,
    options: ImageUploadOptions & { altText?: string; caption?: string } = {}
  ): Promise<ImageUploadResult> {
    try {
      // Validate the image
      this.validateImage(file, options)

      // Generate filename
      const filename = this.generateFilename(file.name, userId)

      // Upload to storage
      const publicUrl = await this.uploadToStorage(file, filename)

      // Create database record
      const mediaRecord = await this.createMediaRecord(
        file,
        filename,
        publicUrl,
        userId,
        options.altText,
        options.caption
      )

      return {
        url: publicUrl,
        filename: mediaRecord.filename,
        size: file.size,
        alt_text: options.altText
      }
    } catch (error) {
      if (error instanceof ImageUploadError) {
        throw error
      }
      throw new ImageUploadError(
        error instanceof Error ? error.message : 'Unknown upload error',
        'UNKNOWN_ERROR'
      )
    }
  },

  /**
   * Delete image from storage and database
   */
  async deleteImage(mediaId: string, userId: string): Promise<void> {
    try {
      // Get media record
      const media = await blogMediaApi.getById(mediaId)
      if (!media) {
        throw new ImageUploadError('Media not found', 'MEDIA_NOT_FOUND')
      }

      // Check permissions (user owns the media or is admin)
      if (media.uploaded_by !== userId) {
        // This would need to check if user is admin
        throw new ImageUploadError('Permission denied', 'PERMISSION_DENIED')
      }

      // Extract filename from URL
      const urlParts = media.file_path.split('/')
      const filename = urlParts.slice(-2).join('/') // userId/filename

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('blog-images')
        .remove([filename])

      if (storageError) {
        console.error('Failed to delete from storage:', storageError)
        // Continue with database deletion even if storage deletion fails
      }

      // Delete from database
      await blogMediaApi.delete(mediaId)
    } catch (error) {
      if (error instanceof ImageUploadError) {
        throw error
      }
      throw new ImageUploadError(
        error instanceof Error ? error.message : 'Failed to delete image',
        'DELETE_FAILED'
      )
    }
  },

  /**
   * Get optimized image URL with transformations
   */
  getOptimizedUrl(
    originalUrl: string, 
    options: {
      width?: number
      height?: number
      quality?: number
      format?: 'webp' | 'jpeg' | 'png'
    } = {}
  ): string {
    // For now, return original URL
    // In production, you might use a service like Cloudinary or implement Supabase image transformations
    return originalUrl
  },

  /**
   * Resize image on client side before upload
   */
  async resizeImage(
    file: File, 
    maxWidth: number = 1920, 
    maxHeight: number = 1080, 
    quality: number = 0.8
  ): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
        
        if (height > maxHeight) {
          width = (width * maxHeight) / height
          height = maxHeight
        }

        // Set canvas dimensions
        canvas.width = width
        canvas.height = height

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height)
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const resizedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now()
              })
              resolve(resizedFile)
            } else {
              reject(new Error('Failed to resize image'))
            }
          },
          file.type,
          quality
        )
      }

      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = URL.createObjectURL(file)
    })
  },

  /**
   * Generate multiple sizes for responsive images
   */
  async generateResponsiveSizes(file: File): Promise<{
    original: File
    large: File
    medium: File
    small: File
    thumbnail: File
  }> {
    const [large, medium, small, thumbnail] = await Promise.all([
      this.resizeImage(file, 1920, 1080, 0.8),
      this.resizeImage(file, 1200, 800, 0.8),
      this.resizeImage(file, 800, 600, 0.8),
      this.resizeImage(file, 300, 300, 0.7)
    ])

    return {
      original: file,
      large,
      medium,
      small,
      thumbnail
    }
  }
}
