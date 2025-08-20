'use client'

import { useEffect, useState } from 'react'
import { Upload, Search, Filter, Trash2, Download, Copy, Check } from 'lucide-react'
import { ImageUpload, ImageGallery } from './ImageUpload'
import { blogMediaApi } from '@/lib/blog-api'
import { imageUploadService } from '@/lib/image-upload'
import { BlogMedia } from '@/types/blog'
import { useAuth } from '@/contexts/AuthContext'
import { format } from 'date-fns'

export function MediaManager() {
  const [media, setMedia] = useState<BlogMedia[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [uploading, setUploading] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
  
  const { user, isAdmin } = useAuth()

  useEffect(() => {
    fetchMedia()
  }, [])

  const fetchMedia = async () => {
    try {
      setLoading(true)
      // If not admin, only show user's own media
      const data = await blogMediaApi.getAll(isAdmin ? undefined : user?.id)
      setMedia(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load media')
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (url: string) => {
    setUploading(false)
    await fetchMedia() // Refresh the list
  }

  const handleUploadError = (error: string) => {
    setError(error)
    setUploading(false)
  }

  const handleDelete = async (mediaId: string) => {
    if (!user) return

    try {
      await imageUploadService.deleteImage(mediaId, user.id)
      await fetchMedia() // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete image')
    }
  }

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedUrl(url)
      setTimeout(() => setCopiedUrl(null), 2000)
    } catch (err) {
      console.error('Failed to copy URL:', err)
    }
  }

  const downloadImage = (url: string, filename: string) => {
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const filteredMedia = media.filter(item =>
    item.original_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.alt_text?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-brand-secondary-200 rounded w-48 animate-pulse"></div>
        <div className="h-32 bg-brand-secondary-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square bg-brand-secondary-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-secondary-900">Media Library</h1>
          <p className="text-brand-secondary-600 mt-1">
            Upload and manage your images and media files.
          </p>
        </div>
      </div>

      {/* Upload Area */}
      <div className="bg-white rounded-lg shadow border border-brand-secondary-200 p-6">
        <h2 className="text-lg font-semibold text-brand-secondary-900 mb-4">Upload New Image</h2>
        <ImageUpload
          onUpload={handleUpload}
          onError={handleUploadError}
          className="max-w-md"
        />
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow border border-brand-secondary-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-secondary-400" />
              <input
                type="text"
                placeholder="Search images..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-brand-secondary-300 rounded-lg focus:ring-2 focus:ring-brand-primary-500 focus:border-brand-primary-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Media Grid */}
      <div className="bg-white rounded-lg shadow border border-brand-secondary-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-brand-secondary-900">
            Your Images ({filteredMedia.length})
          </h2>
        </div>

        {filteredMedia.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMedia.map((item) => (
              <div key={item.id} className="bg-brand-secondary-50 rounded-lg overflow-hidden">
                {/* Image */}
                <div className="aspect-square relative">
                  <img
                    src={item.file_path}
                    alt={item.alt_text || item.original_name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-medium text-brand-secondary-900 truncate mb-1">
                    {item.original_name}
                  </h3>
                  <p className="text-sm text-brand-secondary-600 mb-2">
                    {(item.file_size / 1024).toFixed(1)} KB • {format(new Date(item.created_at), 'MMM d, yyyy')}
                  </p>
                  
                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => copyToClipboard(item.file_path)}
                      className="flex-1 flex items-center justify-center px-3 py-2 text-sm bg-brand-primary-600 text-white rounded hover:bg-brand-primary-700 transition-colors"
                    >
                      {copiedUrl === item.file_path ? (
                        <>
                          <Check className="w-4 h-4 mr-1" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-1" />
                          Copy URL
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={() => downloadImage(item.file_path, item.original_name)}
                      className="p-2 text-brand-secondary-600 hover:text-brand-secondary-900 hover:bg-brand-secondary-200 rounded transition-colors"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    
                    {(isAdmin || item.uploaded_by === user?.id) && (
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-brand-secondary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-brand-secondary-400" />
            </div>
            <h3 className="text-lg font-medium text-brand-secondary-900 mb-2">
              {searchQuery ? 'No images found' : 'No images uploaded'}
            </h3>
            <p className="text-brand-secondary-600">
              {searchQuery 
                ? 'Try adjusting your search terms.' 
                : 'Upload your first image to get started.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
