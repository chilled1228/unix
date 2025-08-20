import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BlogPost, blogProseStyles } from '@/components/blog/BlogPost'
import { blogPostsApi } from '@/lib/blog-api'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  try {
    const { slug } = await params
    const post = await blogPostsApi.getBySlug(slug)
    
    if (!post || post.status !== 'published') {
      return {
        title: 'Post Not Found - Unix Timestamp Converter',
      }
    }

    const title = post.meta_title || post.title
    const description = post.meta_description || post.excerpt || 'Read this blog post on Unix Timestamp Converter'
    
    return {
      title: `${title} - Unix Timestamp Converter`,
      description,
      openGraph: {
        title,
        description,
        type: 'article',
        publishedTime: post.published_date || post.created_at,
        modifiedTime: post.updated_at,
        authors: [post.author.full_name || post.author.email],
        images: post.featured_image_url ? [
          {
            url: post.featured_image_url,
            width: 1200,
            height: 630,
            alt: post.title,
          }
        ] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: post.featured_image_url ? [post.featured_image_url] : undefined,
      },
      alternates: {
        canonical: `/blog/${post.slug}`,
      },
    }
  } catch (error) {
    return {
      title: 'Post Not Found - Unix Timestamp Converter',
    }
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  try {
    const { slug } = await params
    const post = await blogPostsApi.getBySlug(slug)
    
    if (!post || post.status !== 'published') {
      notFound()
    }

    // Generate structured data for the blog post
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt || post.meta_description,
      image: post.featured_image_url,
      author: {
        '@type': 'Person',
        name: post.author.full_name || post.author.email,
      },
      publisher: {
        '@type': 'Organization',
        name: 'Unix Timestamp Converter',
        logo: {
          '@type': 'ImageObject',
          url: 'https://unix-timestamp-converter.com/logo.png',
        },
      },
      datePublished: post.published_date || post.created_at,
      dateModified: post.updated_at,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://unix-timestamp-converter.com/blog/${post.slug}`,
      },
      articleSection: post.categories?.[0]?.name,
      keywords: post.tags?.map(tag => tag.name).join(', '),
      wordCount: post.content.replace(/<[^>]*>/g, '').split(/\s+/).length,
      timeRequired: `PT${post.reading_time || 1}M`,
    }

    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: blogProseStyles }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        
        <div className="min-h-screen bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <BlogPost post={post} />
          </div>
        </div>
      </>
    )
  } catch (error) {
    console.error('Error loading blog post:', error)
    notFound()
  }
}
