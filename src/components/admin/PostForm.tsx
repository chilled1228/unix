'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Eye, ArrowLeft, AlertCircle } from 'lucide-react'
import { RichTextEditor } from '@/components/editor/RichTextEditor'
import { blogPostsApi, blogCategoriesApi, blogTagsApi, blogUtils } from '@/lib/blog-api'
import { BlogPost, BlogCategory, BlogTag, BlogPostFormData } from '@/types/blog'
import { useAuth } from '@/contexts/AuthContext'

interface PostFormProps {
  post?: BlogPost
  isEditing?: boolean
}

export function PostForm({ post, isEditing = false }: PostFormProps) {
  const [formData, setFormData] = useState<BlogPostFormData>({
    title: post?.title || '',
    content: post?.content || '',
    excerpt: post?.excerpt || '',
    slug: post?.slug || '',
    status: post?.status || 'draft',
    featured_image_url: post?.featured_image_url || '',
    meta_title: post?.meta_title || '',
    meta_description: post?.meta_description || '',
    category_ids: [],
    tag_ids: []
  })
  
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [tags, setTags] = useState<BlogTag[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)
  
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [categoriesData, tagsData] = await Promise.all([
          blogCategoriesApi.getAll(),
          blogTagsApi.getAll()
        ])
        
        setCategories(categoriesData)
        setTags(tagsData)

        // If editing, fetch the post's categories and tags
        if (isEditing && post) {
          // This would need to be implemented in the API
          // For now, we'll leave the arrays empty
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [isEditing, post])

  // Auto-generate slug from title
  useEffect(() => {
    if (!slugManuallyEdited && formData.title) {
      const newSlug = blogUtils.generateSlug(formData.title)
      setFormData(prev => ({ ...prev, slug: newSlug }))
    }
  }, [formData.title, slugManuallyEdited])

  // Auto-generate excerpt from content
  useEffect(() => {
    if (!formData.excerpt && formData.content) {
      const excerpt = blogUtils.generateExcerpt(formData.content)
      setFormData(prev => ({ ...prev, excerpt }))
    }
  }, [formData.content, formData.excerpt])

  const handleSubmit = async (status: 'draft' | 'published') => {
    if (!user) return

    try {
      setSaving(true)
      setError(null)

      const postData = { ...formData, status }

      // Validate required fields
      if (!postData.title.trim()) {
        throw new Error('Title is required')
      }
      if (!postData.content.trim()) {
        throw new Error('Content is required')
      }
      if (!postData.slug.trim()) {
        throw new Error('Slug is required')
      }

      // Check slug uniqueness
      const isSlugUnique = await blogUtils.isSlugUnique(postData.slug, post?.id)
      if (!isSlugUnique) {
        throw new Error('Slug already exists. Please choose a different one.')
      }

      if (isEditing && post) {
        await blogPostsApi.update(post.id, postData)
      } else {
        await blogPostsApi.create(postData, user.id)
      }

      router.push('/admin/posts')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save post')
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (file: File): Promise<string> => {
    if (!user) throw new Error('User not authenticated')

    const { imageUploadService } = await import('@/lib/image-upload')
    const result = await imageUploadService.uploadImage(file, user.id)
    return result.url
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-brand-secondary-200 rounded w-1/3"></div>
        <div className="h-12 bg-brand-secondary-200 rounded"></div>
        <div className="h-64 bg-brand-secondary-200 rounded"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="p-2 text-brand-secondary-400 hover:text-brand-secondary-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-brand-secondary-900">
              {isEditing ? 'Edit Post' : 'New Post'}
            </h1>
            <p className="text-brand-secondary-600 mt-1">
              {isEditing ? 'Update your blog post' : 'Create a new blog post'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleSubmit('draft')}
            disabled={saving}
            className="px-4 py-2 border border-brand-secondary-300 text-brand-secondary-700 rounded-lg hover:bg-brand-secondary-50 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            onClick={() => handleSubmit('published')}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 bg-brand-primary-600 text-white rounded-lg hover:bg-brand-primary-700 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-brand-secondary-700 mb-2">
              Title *
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 border border-brand-secondary-300 rounded-lg focus:ring-2 focus:ring-brand-primary-500 focus:border-brand-primary-500 text-lg"
              placeholder="Enter post title..."
              required
            />
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-brand-secondary-700 mb-2">
              Slug *
            </label>
            <input
              id="slug"
              type="text"
              value={formData.slug}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, slug: e.target.value }))
                setSlugManuallyEdited(true)
              }}
              className="w-full px-4 py-2 border border-brand-secondary-300 rounded-lg focus:ring-2 focus:ring-brand-primary-500 focus:border-brand-primary-500"
              placeholder="post-slug"
              required
            />
            <p className="text-xs text-brand-secondary-500 mt-1">
              URL-friendly version of the title. Will be auto-generated if left empty.
            </p>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-brand-secondary-700 mb-2">
              Content *
            </label>
            <RichTextEditor
              value={formData.content}
              onChange={(content) => setFormData(prev => ({ ...prev, content }))}
              onImageUpload={handleImageUpload}
              placeholder="Start writing your post content..."
            />
          </div>

          {/* Excerpt */}
          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-brand-secondary-700 mb-2">
              Excerpt
            </label>
            <textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2 border border-brand-secondary-300 rounded-lg focus:ring-2 focus:ring-brand-primary-500 focus:border-brand-primary-500"
              placeholder="Brief description of the post (will be auto-generated if left empty)"
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Featured Image */}
          <div className="bg-white rounded-lg shadow border border-brand-secondary-200 p-6">
            <h3 className="text-lg font-semibold text-brand-secondary-900 mb-4">Featured Image</h3>
            <div>
              <input
                type="url"
                value={formData.featured_image_url}
                onChange={(e) => setFormData(prev => ({ ...prev, featured_image_url: e.target.value }))}
                className="w-full px-3 py-2 border border-brand-secondary-300 rounded-lg focus:ring-2 focus:ring-brand-primary-500 focus:border-brand-primary-500"
                placeholder="Image URL"
              />
              {formData.featured_image_url && (
                <div className="mt-3">
                  <img
                    src={formData.featured_image_url}
                    alt="Featured image preview"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white rounded-lg shadow border border-brand-secondary-200 p-6">
            <h3 className="text-lg font-semibold text-brand-secondary-900 mb-4">Categories</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {categories.map((category) => (
                <label key={category.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.category_ids.includes(category.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData(prev => ({
                          ...prev,
                          category_ids: [...prev.category_ids, category.id]
                        }))
                      } else {
                        setFormData(prev => ({
                          ...prev,
                          category_ids: prev.category_ids.filter(id => id !== category.id)
                        }))
                      }
                    }}
                    className="rounded border-brand-secondary-300 text-brand-primary-600 focus:ring-brand-primary-500"
                  />
                  <span className="text-sm text-brand-secondary-700">{category.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white rounded-lg shadow border border-brand-secondary-200 p-6">
            <h3 className="text-lg font-semibold text-brand-secondary-900 mb-4">SEO</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="meta_title" className="block text-sm font-medium text-brand-secondary-700 mb-1">
                  Meta Title
                </label>
                <input
                  id="meta_title"
                  type="text"
                  value={formData.meta_title}
                  onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                  className="w-full px-3 py-2 border border-brand-secondary-300 rounded-lg focus:ring-2 focus:ring-brand-primary-500 focus:border-brand-primary-500"
                  placeholder="SEO title"
                />
              </div>
              <div>
                <label htmlFor="meta_description" className="block text-sm font-medium text-brand-secondary-700 mb-1">
                  Meta Description
                </label>
                <textarea
                  id="meta_description"
                  value={formData.meta_description}
                  onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-brand-secondary-300 rounded-lg focus:ring-2 focus:ring-brand-primary-500 focus:border-brand-primary-500"
                  placeholder="SEO description"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
