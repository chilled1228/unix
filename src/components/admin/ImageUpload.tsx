'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react'
import { imageUploadService, ImageUploadError } from '@/lib/image-upload'
import { useAuth } from '@/contexts/AuthContext'

interface ImageUploadProps {
  onUpload: (url: string) => void
  onError?: (error: string) => void
  accept?: string
  maxSize?: number
  className?: string
  children?: React.ReactNode
}

export function ImageUpload({
  onUpload,
  onError,
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024, // 5MB
  className = '',
  children
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuth()

  const handleUpload = useCallback(async (file: File) => {
    if (!user) {
      onError?.('You must be logged in to upload images')
      return
    }

    try {
      setUploading(true)
      
      // Resize image if it's too large
      const processedFile = file.size > maxSize 
        ? await imageUploadService.resizeImage(file, 1920, 1080, 0.8)
        : file

      const result = await imageUploadService.uploadImage(processedFile, user.id, {
        max_size: maxSize
      })

      onUpload(result.url)
      setPreview(result.url)
    } catch (error) {
      const message = error instanceof ImageUploadError 
        ? error.message 
        : 'Failed to upload image'
      onError?.(message)
    } finally {
      setUploading(false)
    }
  }, [user, maxSize, onUpload, onError])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleUpload(file)
    }
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setDragOver(false)
    
    const file = event.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      handleUpload(file)
    } else {
      onError?.('Please drop an image file')
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault()
    setDragOver(false)
  }

  const clearPreview = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  if (children) {
    return (
      <div className={className}>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
        <div onClick={() => fileInputRef.current?.click()}>
          {children}
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />
      
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Upload preview"
            className="w-full h-48 object-cover rounded-lg border border-brand-secondary-300"
          />
          <button
            onClick={clearPreview}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${dragOver 
              ? 'border-brand-primary-500 bg-brand-primary-50' 
              : 'border-brand-secondary-300 hover:border-brand-primary-400 hover:bg-brand-secondary-50'
            }
            ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {uploading ? (
            <div className="space-y-2">
              <div className="w-8 h-8 border-2 border-brand-primary-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-brand-secondary-600">Uploading...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-12 h-12 bg-brand-secondary-100 rounded-lg flex items-center justify-center mx-auto">
                <Upload className="w-6 h-6 text-brand-secondary-600" />
              </div>
              <div>
                <p className="text-brand-secondary-900 font-medium mb-1">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-brand-secondary-600">
                  PNG, JPG, WebP up to {(maxSize / 1024 / 1024).toFixed(1)}MB
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Image gallery component for media management
interface ImageGalleryProps {
  images: Array<{
    id: string
    url: string
    filename: string
    alt_text?: string
    created_at: string
  }>
  onSelect?: (url: string) => void
  onDelete?: (id: string) => void
  selectable?: boolean
}

export function ImageGallery({ images, onSelect, onDelete, selectable = false }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const handleImageClick = (image: any) => {
    if (selectable && onSelect) {
      onSelect(image.url)
      setSelectedImage(image.id)
    }
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-brand-secondary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
          <ImageIcon className="w-8 h-8 text-brand-secondary-400" />
        </div>
        <h3 className="text-lg font-medium text-brand-secondary-900 mb-2">No images uploaded</h3>
        <p className="text-brand-secondary-600">Upload your first image to get started.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image) => (
        <div
          key={image.id}
          className={`
            relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all
            ${selectedImage === image.id 
              ? 'border-brand-primary-500 ring-2 ring-brand-primary-200' 
              : 'border-transparent hover:border-brand-secondary-300'
            }
          `}
          onClick={() => handleImageClick(image)}
        >
          <div className="aspect-square relative">
            <img
              src={image.url}
              alt={image.alt_text || image.filename}
              className="w-full h-full object-cover"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                {selectable && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelect?.(image.url)
                    }}
                    className="p-2 bg-brand-primary-600 text-white rounded-lg hover:bg-brand-primary-700 transition-colors"
                  >
                    <ImageIcon className="w-4 h-4" />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      if (confirm('Are you sure you want to delete this image?')) {
                        onDelete(image.id)
                      }
                    }}
                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Info */}
          <div className="p-2 bg-white">
            <p className="text-xs text-brand-secondary-600 truncate" title={image.filename}>
              {image.filename}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
