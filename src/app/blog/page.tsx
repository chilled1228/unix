import { Metadata } from 'next'
import { BlogList } from '@/components/blog/BlogList'
import { blogPostsApi } from '@/lib/blog-api'

export const metadata: Metadata = {
  title: 'Blog - Unix Timestamp Converter',
  description: 'Read our latest blog posts about web development, programming, and technology insights.',
  openGraph: {
    title: 'Blog - Unix Timestamp Converter',
    description: 'Read our latest blog posts about web development, programming, and technology insights.',
    type: 'website',
  },
}

export default async function BlogPage() {
  try {
    // Fetch initial posts on the server
    const initialPosts = await blogPostsApi.getPublished({
      limit: 12,
      offset: 0,
      sort_by: 'published_date',
      sort_order: 'desc'
    })

    return (
      <div className="min-h-screen bg-brand-secondary-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-brand-secondary-900 mb-4">
              Our Blog
            </h1>
            <p className="text-xl text-brand-secondary-600 max-w-3xl mx-auto">
              Discover insights, tutorials, and the latest updates from our team. 
              Stay informed about web development, programming, and technology trends.
            </p>
          </div>

          {/* Blog List */}
          <BlogList initialPosts={initialPosts} />
        </div>
      </div>
    )
  } catch (error) {
    return (
      <div className="min-h-screen bg-brand-secondary-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-brand-secondary-900 mb-4">
              Our Blog
            </h1>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-700">Failed to load blog posts. Please try again later.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
