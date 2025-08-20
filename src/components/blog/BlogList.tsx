'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, User, Eye, ChevronLeft, ChevronRight } from 'lucide-react'
import { blogPostsApi } from '@/lib/blog-api'
import { BlogPostWithAuthor, PaginatedResponse } from '@/types/blog'
import { format } from 'date-fns'

interface BlogListProps {
  initialPosts?: PaginatedResponse<BlogPostWithAuthor>
  categorySlug?: string
  tagSlug?: string
  searchQuery?: string
}

export function BlogList({ initialPosts, categorySlug, tagSlug, searchQuery }: BlogListProps) {
  const [posts, setPosts] = useState<PaginatedResponse<BlogPostWithAuthor> | null>(initialPosts || null)
  const [loading, setLoading] = useState(!initialPosts)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  
  const postsPerPage = 12

  useEffect(() => {
    if (!initialPosts) {
      fetchPosts()
    }
  }, [currentPage, categorySlug, tagSlug, searchQuery])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const filters: Parameters<typeof blogPostsApi.getPublished>[0] = {
        limit: postsPerPage,
        offset: (currentPage - 1) * postsPerPage,
        sort_by: 'published_date' as const,
        sort_order: 'desc' as const
      }

      if (searchQuery) {
        filters.search = searchQuery
      }

      const data = await blogPostsApi.getPublished(filters)
      setPosts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load posts')
    } finally {
      setLoading(false)
    }
  }

  if (loading && !posts) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-brand-secondary-200 h-48 rounded-lg mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-brand-secondary-200 rounded w-3/4"></div>
              <div className="h-4 bg-brand-secondary-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-red-700">Error loading posts: {error}</p>
        </div>
      </div>
    )
  }

  if (!posts || posts.data.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <h3 className="text-xl font-semibold text-brand-secondary-900 mb-2">No posts found</h3>
          <p className="text-brand-secondary-600">
            {searchQuery 
              ? `No posts found matching "${searchQuery}"`
              : categorySlug
              ? `No posts found in this category`
              : tagSlug
              ? `No posts found with this tag`
              : 'No blog posts have been published yet.'
            }
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.data.map((post) => (
          <article key={post.id} className="bg-white rounded-lg shadow-lg border border-brand-secondary-200 overflow-hidden hover:shadow-xl transition-shadow">
            {/* Featured Image */}
            {post.featured_image_url && (
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={post.featured_image_url}
                  alt={post.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            
            {/* Content */}
            <div className="p-6">
              {/* Meta */}
              <div className="flex items-center space-x-4 text-sm text-brand-secondary-600 mb-3">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {format(new Date(post.published_date || post.created_at), 'MMM d, yyyy')}
                </span>
                {post.reading_time && (
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {post.reading_time} min read
                  </span>
                )}
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold text-brand-secondary-900 mb-3 line-clamp-2">
                <Link 
                  href={`/blog/${post.slug}`}
                  className="hover:text-brand-primary-600 transition-colors"
                >
                  {post.title}
                </Link>
              </h2>

              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-brand-secondary-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
              )}

              {/* Author and Stats */}
              <div className="flex items-center justify-between pt-4 border-t border-brand-secondary-200">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-brand-secondary-400" />
                  <span className="text-sm text-brand-secondary-600">
                    {post.author.full_name || post.author.email}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-brand-secondary-500">
                  <Eye className="w-4 h-4" />
                  <span>{post.view_count}</span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Pagination */}
      {posts.total_pages > 1 && (
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center px-4 py-2 text-brand-secondary-600 border border-brand-secondary-300 rounded-lg hover:bg-brand-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </button>
          
          <div className="flex items-center space-x-2">
            {Array.from({ length: Math.min(5, posts.total_pages) }, (_, i) => {
              const pageNum = i + 1
              const isActive = pageNum === currentPage
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`
                    px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isActive 
                      ? 'bg-brand-primary-600 text-white' 
                      : 'text-brand-secondary-600 hover:bg-brand-secondary-100'
                    }
                  `}
                >
                  {pageNum}
                </button>
              )
            })}
            
            {posts.total_pages > 5 && (
              <>
                <span className="text-brand-secondary-400">...</span>
                <button
                  onClick={() => setCurrentPage(posts.total_pages)}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-brand-secondary-600 hover:bg-brand-secondary-100 transition-colors"
                >
                  {posts.total_pages}
                </button>
              </>
            )}
          </div>
          
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === posts.total_pages}
            className="flex items-center px-4 py-2 text-brand-secondary-600 border border-brand-secondary-300 rounded-lg hover:bg-brand-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      )}

      {/* Results Info */}
      <div className="text-center text-sm text-brand-secondary-600">
        Showing {((currentPage - 1) * postsPerPage) + 1} to {Math.min(currentPage * postsPerPage, posts.count)} of {posts.count} posts
      </div>
    </div>
  )
}
