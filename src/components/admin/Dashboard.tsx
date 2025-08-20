'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  FileText, 
  Users, 
  Eye, 
  TrendingUp, 
  Plus,
  Calendar,
  Clock
} from 'lucide-react'
import { blogStatsApi } from '@/lib/blog-api'
import { BlogStats, BlogPostWithAuthor } from '@/types/blog'
import { formatDistanceToNow } from 'date-fns'

export function Dashboard() {
  const [stats, setStats] = useState<BlogStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await blogStatsApi.getStats()
        setStats(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load stats')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6">
              <div className="h-4 bg-brand-secondary-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-brand-secondary-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-700">Error loading dashboard: {error}</p>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Posts',
      value: stats?.total_posts || 0,
      icon: FileText,
      color: 'bg-blue-500',
      href: '/admin/posts'
    },
    {
      title: 'Published',
      value: stats?.published_posts || 0,
      icon: TrendingUp,
      color: 'bg-green-500',
      href: '/admin/posts?status=published'
    },
    {
      title: 'Total Views',
      value: stats?.total_views || 0,
      icon: Eye,
      color: 'bg-purple-500'
    },
    {
      title: 'Authors',
      value: stats?.total_authors || 0,
      icon: Users,
      color: 'bg-orange-500',
      href: '/admin/users'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-secondary-900">Dashboard</h1>
          <p className="text-brand-secondary-600 mt-1">
            Welcome back! Here's what's happening with your blog.
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div key={card.title} className="bg-white rounded-lg shadow border border-brand-secondary-200 overflow-hidden">
            {card.href ? (
              <Link href={card.href} className="block p-6 hover:bg-brand-secondary-50 transition-colors">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${card.color}`}>
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-brand-secondary-600">{card.title}</p>
                    <p className="text-2xl font-bold text-brand-secondary-900">{card.value.toLocaleString()}</p>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="p-6">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${card.color}`}>
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-brand-secondary-600">{card.title}</p>
                    <p className="text-2xl font-bold text-brand-secondary-900">{card.value.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Recent Posts */}
      <div className="bg-white rounded-lg shadow border border-brand-secondary-200">
        <div className="px-6 py-4 border-b border-brand-secondary-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-brand-secondary-900">Recent Posts</h2>
            <Link
              href="/admin/posts"
              className="text-sm text-brand-primary-600 hover:text-brand-primary-700 transition-colors"
            >
              View all →
            </Link>
          </div>
        </div>
        <div className="divide-y divide-brand-secondary-200">
          {stats?.recent_posts && stats.recent_posts.length > 0 ? (
            stats.recent_posts.map((post) => (
              <div key={post.id} className="p-6 hover:bg-brand-secondary-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="text-lg font-medium text-brand-secondary-900 hover:text-brand-primary-600 transition-colors"
                    >
                      {post.title}
                    </Link>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-brand-secondary-600">
                      <span className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {post.author.full_name || post.author.email}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
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
                      <p className="text-brand-secondary-600 mt-2 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <span className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${post.status === 'published' 
                        ? 'bg-green-100 text-green-800' 
                        : post.status === 'draft'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                      }
                    `}>
                      {post.status}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center">
              <FileText className="w-12 h-12 text-brand-secondary-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-brand-secondary-900 mb-2">No posts yet</h3>
              <p className="text-brand-secondary-600 mb-4">
                Get started by creating your first blog post.
              </p>
              <Link
                href="/admin/posts/new"
                className="inline-flex items-center px-4 py-2 bg-brand-primary-600 text-white rounded-lg hover:bg-brand-primary-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create First Post
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/admin/posts/new"
          className="bg-white rounded-lg shadow border border-brand-secondary-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="bg-brand-primary-100 p-3 rounded-lg">
              <Plus className="w-6 h-6 text-brand-primary-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-brand-secondary-900">New Post</h3>
              <p className="text-brand-secondary-600">Create a new blog post</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/categories"
          className="bg-white rounded-lg shadow border border-brand-secondary-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-brand-secondary-900">Manage Categories</h3>
              <p className="text-brand-secondary-600">Organize your content</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/media"
          className="bg-white rounded-lg shadow border border-brand-secondary-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-brand-secondary-900">Media Library</h3>
              <p className="text-brand-secondary-600">Upload and manage images</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
