'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, User, Eye, Tag, ArrowLeft } from 'lucide-react'
import { BlogPostWithRelations } from '@/types/blog'
import { format } from 'date-fns'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { blogPostsApi } from '@/lib/blog-api'

interface BlogPostProps {
  post: BlogPostWithRelations
}

export function BlogPost({ post }: BlogPostProps) {
  const [renderedContent, setRenderedContent] = useState<string>('')
  const [currentUrl, setCurrentUrl] = useState<string>('')

  useEffect(() => {
    // Increment view count when post is viewed
    const incrementViews = async () => {
      try {
        await blogPostsApi.incrementViewCount(post.id)
      } catch (error) {
        console.error('Failed to increment view count:', error)
      }
    }

    incrementViews()
  }, [post.id])

  // Render markdown content and set current URL
  useEffect(() => {
    const renderContent = async () => {
      try {
        if (typeof window !== 'undefined') {
          // Configure marked for better rendering
          marked.setOptions({
            breaks: true,
            gfm: true,
          })

          const html = await marked(post.content)
          const cleanHtml = DOMPurify.sanitize(html)
          setRenderedContent(cleanHtml)
          setCurrentUrl(window.location.href)
        } else {
          // Server-side fallback
          setRenderedContent(post.content.replace(/\n/g, '<br>'))
        }
      } catch (error) {
        console.error('Error rendering content:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        setRenderedContent(`<div class="text-red-600 p-4 bg-red-50 rounded-lg">
          <p><strong>Error rendering content.</strong></p>
          <p>Please try refreshing the page. If the problem persists, the content may need to be updated.</p>
          <details class="mt-2">
            <summary class="cursor-pointer">Error details</summary>
            <pre class="mt-2 text-sm">${errorMessage}</pre>
          </details>
        </div>`)
      }
    }

    renderContent()
  }, [post.content])

  return (
    <article className="max-w-4xl mx-auto">
      {/* Back Button */}
      <div className="mb-8">
        <Link
          href="/blog"
          className="inline-flex items-center text-brand-secondary-600 hover:text-brand-primary-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Link>
      </div>

      {/* Header */}
      <header className="mb-8">
        {/* Categories */}
        {post.categories && post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.categories.map((category) => (
              <Link
                key={category.id}
                href={`/blog/category/${category.slug}`}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-brand-primary-100 text-brand-primary-800 hover:bg-brand-primary-200 transition-colors"
                style={{
                  backgroundColor: category.color ? category.color + '20' : undefined,
                  color: category.color || undefined
                }}
              >
                {category.name}
              </Link>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-brand-secondary-900 mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-6 text-brand-secondary-600 mb-6">
          <div className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            <span className="font-medium">
              {post.author.full_name || post.author.email}
            </span>
          </div>
          
          <div className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            <time dateTime={post.published_date || post.created_at}>
              {format(new Date(post.published_date || post.created_at), 'MMMM d, yyyy')}
            </time>
          </div>
          
          {post.reading_time && (
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              <span>{post.reading_time} min read</span>
            </div>
          )}
          
          <div className="flex items-center">
            <Eye className="w-5 h-5 mr-2" />
            <span>{post.view_count} views</span>
          </div>
        </div>

        {/* Excerpt */}
        {post.excerpt && (
          <div className="text-xl text-brand-secondary-700 leading-relaxed mb-8 p-6 bg-brand-secondary-50 rounded-lg border-l-4 border-brand-primary-500">
            {post.excerpt}
          </div>
        )}
      </header>

      {/* Featured Image */}
      {post.featured_image_url && (
        <div className="relative h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
          <Image
            src={post.featured_image_url}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Content */}
      <div className="max-w-none mb-12">
        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: renderedContent }}
        />
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-brand-secondary-900 mb-4 flex items-center">
            <Tag className="w-5 h-5 mr-2" />
            Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/blog/tag/${tag.slug}`}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-brand-secondary-100 text-brand-secondary-700 hover:bg-brand-secondary-200 transition-colors"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Author Bio */}
      <div className="bg-brand-secondary-50 rounded-lg p-6 mb-8">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-brand-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-8 h-8 text-brand-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-brand-secondary-900 mb-2">
              {post.author.full_name || post.author.email}
            </h3>
            {post.author.bio ? (
              <p className="text-brand-secondary-600">{post.author.bio}</p>
            ) : (
              <p className="text-brand-secondary-600">
                Content creator and developer sharing insights about technology and development.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Share Buttons */}
      <div className="border-t border-brand-secondary-200 pt-8">
        <h3 className="text-lg font-semibold text-brand-secondary-900 mb-4">Share this post</h3>
        <div className="flex space-x-4">
          <button
            onClick={() => {
              const url = currentUrl
              const text = `Check out this post: ${post.title}`
              if (navigator.share) {
                navigator.share({ title: post.title, text, url })
              } else {
                navigator.clipboard.writeText(`${text} ${url}`)
                alert('Link copied to clipboard!')
              }
            }}
            className="px-4 py-2 bg-brand-primary-600 text-white rounded-lg hover:bg-brand-primary-700 transition-colors"
          >
            Share
          </button>
          
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(currentUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Tweet
          </a>
          
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </article>
  )
}

// Add custom prose styles for the blog content
export const blogProseStyles = `
  .prose-brand {
    --tw-prose-body: theme('colors.brand.secondary.700');
    --tw-prose-headings: theme('colors.brand.secondary.900');
    --tw-prose-lead: theme('colors.brand.secondary.600');
    --tw-prose-links: theme('colors.brand.primary.600');
    --tw-prose-bold: theme('colors.brand.secondary.900');
    --tw-prose-counters: theme('colors.brand.secondary.500');
    --tw-prose-bullets: theme('colors.brand.secondary.300');
    --tw-prose-hr: theme('colors.brand.secondary.200');
    --tw-prose-quotes: theme('colors.brand.secondary.900');
    --tw-prose-quote-borders: theme('colors.brand.secondary.200');
    --tw-prose-captions: theme('colors.brand.secondary.500');
    --tw-prose-code: theme('colors.brand.secondary.900');
    --tw-prose-pre-code: theme('colors.brand.secondary.200');
    --tw-prose-pre-bg: theme('colors.brand.secondary.800');
    --tw-prose-th-borders: theme('colors.brand.secondary.300');
    --tw-prose-td-borders: theme('colors.brand.secondary.200');
  }
  
  .prose-brand h1,
  .prose-brand h2,
  .prose-brand h3,
  .prose-brand h4,
  .prose-brand h5,
  .prose-brand h6 {
    font-weight: 700;
    line-height: 1.25;
  }
  
  .prose-brand a {
    text-decoration: none;
    font-weight: 500;
  }
  
  .prose-brand a:hover {
    text-decoration: underline;
  }
  
  .prose-brand blockquote {
    border-left: 4px solid theme('colors.brand.primary.500');
    background: theme('colors.brand.secondary.50');
    padding: 1rem 1.5rem;
    margin: 1.5rem 0;
    border-radius: 0.5rem;
  }
  
  .prose-brand code {
    background: theme('colors.brand.secondary.100');
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
    font-size: 0.875em;
  }
  
  .prose-brand pre {
    background: theme('colors.brand.secondary.900');
    color: theme('colors.brand.secondary.100');
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
  }
  
  .prose-brand pre code {
    background: transparent;
    padding: 0;
    color: inherit;
  }
`
