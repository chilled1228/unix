'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  User,
  Clock,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { blogPostsApi } from '@/lib/blog-api'
import { BlogPostWithAuthor, BlogPostFilters, PaginatedResponse } from '@/types/blog'
import { formatDistanceToNow } from 'date-fns'
import { useAuth } from '@/contexts/AuthContext'

export function PostsList() {
  const [posts, setPosts] = useState<PaginatedResponse<BlogPostWithAuthor> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [deleting, setDeleting] = useState<string | null>(null)
  
  const { isEditor, profile } = useAuth()
  const searchParams = useSearchParams()
  const postsPerPage = 10

  useEffect(() => {
    // Get initial filters from URL params
    const status = searchParams.get('status')
    if (status) {
      setStatusFilter(status)
    }
  }, [searchParams])

  useEffect(() => {
    fetchPosts()
  }, [searchQuery, statusFilter, currentPage])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const filters: BlogPostFilters = {
        limit: postsPerPage,
        offset: (currentPage - 1) * postsPerPage,
        sort_by: 'updated_at',
        sort_order: 'desc'
      }

      if (searchQuery) {
        filters.search = searchQuery
      }

      if (statusFilter !== 'all') {
        filters.status = statusFilter as any
      }

      // If user is not an editor, only show their own posts
      if (!isEditor && profile) {
        filters.author_id = profile.id
      }

      const data = await blogPostsApi.getAll(filters)
      setPosts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load posts')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return
    }

    try {
      setDeleting(postId)
      await blogPostsApi.delete(postId)
      await fetchPosts() // Refresh the list
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete post')
    } finally {
      setDeleting(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      published: 'bg-green-100 text-green-800',
      draft: 'bg-yellow-100 text-yellow-800',
      archived: 'bg-gray-100 text-gray-800'
    }
    return styles[status as keyof typeof styles] || styles.draft
  }

  if (loading && !posts) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-brand-secondary-200 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-brand-secondary-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="h-6 bg-brand-secondary-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-brand-secondary-200 rounded w-1/2"></div>
            </div>
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
          <h1 className="text-3xl font-bold text-brand-secondary-900">Posts</h1>
          <p className="text-brand-secondary-600 mt-1">
            Manage your blog posts and content.
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center px-4 py-2 bg-brand-primary-600 text-white rounded-lg hover:bg-brand-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Post
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow border border-brand-secondary-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-secondary-400" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-brand-secondary-300 rounded-lg focus:ring-2 focus:ring-brand-primary-500 focus:border-brand-primary-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-brand-secondary-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-brand-secondary-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-primary-500 focus:border-brand-primary-500"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Posts List */}
      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-700">Error loading posts: {error}</p>
        </div>
      ) : posts && posts.data.length > 0 ? (
        <div className="bg-white rounded-lg shadow border border-brand-secondary-200 overflow-hidden">
          <div className="divide-y divide-brand-secondary-200">
            {posts.data.map((post) => (
              <div key={post.id} className="p-6 hover:bg-brand-secondary-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="text-lg font-medium text-brand-secondary-900 hover:text-brand-primary-600 transition-colors"
                      >
                        {post.title}
                      </Link>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(post.status)}`}>
                        {post.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-brand-secondary-600 mb-2">
                      <span className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {post.author.full_name || post.author.email}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDistanceToNow(new Date(post.updated_at), { addSuffix: true })}
                      </span>
                      <span className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {post.view_count} views
                      </span>
                      {post.reading_time && (
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {post.reading_time} min read
                        </span>
                      )}
                    </div>
                    
                    {post.excerpt && (
                      <p className="text-brand-secondary-600 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {post.status === 'published' && (
                      <Link
                        href={`/blog/${post.slug}`}
                        className="p-2 text-brand-secondary-400 hover:text-brand-primary-600 transition-colors"
                        title="View post"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    )}
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="p-2 text-brand-secondary-400 hover:text-brand-primary-600 transition-colors"
                      title="Edit post"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    {(isEditor || post.author_id === profile?.id) && (
                      <button
                        onClick={() => handleDelete(post.id)}
                        disabled={deleting === post.id}
                        className="p-2 text-brand-secondary-400 hover:text-red-600 transition-colors disabled:opacity-50"
                        title="Delete post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow border border-brand-secondary-200 p-12 text-center">
          <div className="w-12 h-12 bg-brand-secondary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Plus className="w-6 h-6 text-brand-secondary-400" />
          </div>
          <h3 className="text-lg font-medium text-brand-secondary-900 mb-2">No posts found</h3>
          <p className="text-brand-secondary-600 mb-6">
            {searchQuery || statusFilter !== 'all' 
              ? 'Try adjusting your search or filters.' 
              : 'Get started by creating your first blog post.'
            }
          </p>
          <Link
            href="/admin/posts/new"
            className="inline-flex items-center px-4 py-2 bg-brand-primary-600 text-white rounded-lg hover:bg-brand-primary-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Post
          </Link>
        </div>
      )}

      {/* Pagination */}
      {posts && posts.total_pages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-lg shadow border border-brand-secondary-200 px-6 py-4">
          <div className="text-sm text-brand-secondary-600">
            Showing {((currentPage - 1) * postsPerPage) + 1} to {Math.min(currentPage * postsPerPage, posts.count)} of {posts.count} posts
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 text-brand-secondary-400 hover:text-brand-secondary-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-brand-secondary-600">
              Page {currentPage} of {posts.total_pages}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === posts.total_pages}
              className="p-2 text-brand-secondary-400 hover:text-brand-secondary-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
