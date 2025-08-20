import { supabase } from './supabase'
import {
  BlogPost,
  BlogPostWithAuthor,
  BlogPostWithRelations,
  BlogPostFormData,
  BlogPostFilters,
  PaginatedResponse,
  BlogCategory,
  BlogTag,
  BlogMedia,
  UserProfile,
  BlogStats
} from '@/types/blog'

// Blog Posts API
export const blogPostsApi = {
  // Get all posts with filters and pagination
  async getAll(filters: BlogPostFilters = {}): Promise<PaginatedResponse<BlogPostWithAuthor>> {
    let query = supabase
      .from('blog_posts')
      .select(`
        *,
        author:user_profiles(*)
      `, { count: 'exact' })

    // Apply filters
    if (filters.status) {
      query = query.eq('status', filters.status)
    }
    
    if (filters.author_id) {
      query = query.eq('author_id', filters.author_id)
    }
    
    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,content.ilike.%${filters.search}%,excerpt.ilike.%${filters.search}%`)
    }

    // Apply sorting
    const sortBy = filters.sort_by || 'created_at'
    const sortOrder = filters.sort_order || 'desc'
    query = query.order(sortBy, { ascending: sortOrder === 'asc' })

    // Apply pagination
    const limit = filters.limit || 10
    const offset = filters.offset || 0
    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      throw new Error(`Failed to fetch posts: ${error.message}`)
    }

    return {
      data: data || [],
      count: count || 0,
      page: Math.floor(offset / limit) + 1,
      per_page: limit,
      total_pages: Math.ceil((count || 0) / limit)
    }
  },

  // Get published posts for public display
  async getPublished(filters: Omit<BlogPostFilters, 'status'> = {}): Promise<PaginatedResponse<BlogPostWithAuthor>> {
    return this.getAll({ ...filters, status: 'published' })
  },

  // Get single post by ID with full relations
  async getById(id: string): Promise<BlogPostWithRelations | null> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        author:user_profiles(*),
        categories:blog_post_categories(
          category:blog_categories(*)
        ),
        tags:blog_post_tags(
          tag:blog_tags(*)
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Post not found
      }
      throw new Error(`Failed to fetch post: ${error.message}`)
    }

    // Transform the data to match our interface
    return {
      ...data,
      categories: data.categories?.map((c: any) => c.category) || [],
      tags: data.tags?.map((t: any) => t.tag) || []
    }
  },

  // Get single post by slug
  async getBySlug(slug: string): Promise<BlogPostWithRelations | null> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        author:user_profiles(*),
        categories:blog_post_categories(
          category:blog_categories(*)
        ),
        tags:blog_post_tags(
          tag:blog_tags(*)
        )
      `)
      .eq('slug', slug)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Post not found
      }
      throw new Error(`Failed to fetch post: ${error.message}`)
    }

    // Transform the data to match our interface
    return {
      ...data,
      categories: data.categories?.map((c: any) => c.category) || [],
      tags: data.tags?.map((t: any) => t.tag) || []
    }
  },

  // Create new post
  async create(postData: BlogPostFormData, authorId: string): Promise<BlogPost> {
    const { category_ids, tag_ids, ...postFields } = postData

    // Insert the post
    const { data: post, error: postError } = await supabase
      .from('blog_posts')
      .insert({
        ...postFields,
        author_id: authorId
      })
      .select()
      .single()

    if (postError) {
      throw new Error(`Failed to create post: ${postError.message}`)
    }

    // Add categories
    if (category_ids.length > 0) {
      const { error: categoryError } = await supabase
        .from('blog_post_categories')
        .insert(
          category_ids.map(categoryId => ({
            post_id: post.id,
            category_id: categoryId
          }))
        )

      if (categoryError) {
        throw new Error(`Failed to add categories: ${categoryError.message}`)
      }
    }

    // Add tags
    if (tag_ids.length > 0) {
      const { error: tagError } = await supabase
        .from('blog_post_tags')
        .insert(
          tag_ids.map(tagId => ({
            post_id: post.id,
            tag_id: tagId
          }))
        )

      if (tagError) {
        throw new Error(`Failed to add tags: ${tagError.message}`)
      }
    }

    return post
  },

  // Update existing post
  async update(id: string, postData: BlogPostFormData): Promise<BlogPost> {
    const { category_ids, tag_ids, ...postFields } = postData

    // Update the post
    const { data: post, error: postError } = await supabase
      .from('blog_posts')
      .update(postFields)
      .eq('id', id)
      .select()
      .single()

    if (postError) {
      throw new Error(`Failed to update post: ${postError.message}`)
    }

    // Update categories
    await supabase.from('blog_post_categories').delete().eq('post_id', id)
    if (category_ids.length > 0) {
      const { error: categoryError } = await supabase
        .from('blog_post_categories')
        .insert(
          category_ids.map(categoryId => ({
            post_id: id,
            category_id: categoryId
          }))
        )

      if (categoryError) {
        throw new Error(`Failed to update categories: ${categoryError.message}`)
      }
    }

    // Update tags
    await supabase.from('blog_post_tags').delete().eq('post_id', id)
    if (tag_ids.length > 0) {
      const { error: tagError } = await supabase
        .from('blog_post_tags')
        .insert(
          tag_ids.map(tagId => ({
            post_id: id,
            tag_id: tagId
          }))
        )

      if (tagError) {
        throw new Error(`Failed to update tags: ${tagError.message}`)
      }
    }

    return post
  },

  // Delete post
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Failed to delete post: ${error.message}`)
    }
  },

  // Increment view count
  async incrementViewCount(id: string): Promise<void> {
    try {
      const { error } = await supabase.rpc('increment_post_views', { post_id: id })

      if (error) {
        console.error('Failed to increment view count:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        // Don't throw error as this is not critical
      }
    } catch (err) {
      console.error('Error calling increment view count function:', err)
      // Don't throw error as this is not critical
    }
  }
}

// Blog Categories API
export const blogCategoriesApi = {
  async getAll(): Promise<BlogCategory[]> {
    const { data, error } = await supabase
      .from('blog_categories')
      .select('*')
      .order('name')

    if (error) {
      throw new Error(`Failed to fetch categories: ${error.message}`)
    }

    return data || []
  },

  async getById(id: string): Promise<BlogCategory | null> {
    const { data, error } = await supabase
      .from('blog_categories')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      throw new Error(`Failed to fetch category: ${error.message}`)
    }

    return data
  },

  async create(category: Omit<BlogCategory, 'id' | 'created_at' | 'updated_at'>): Promise<BlogCategory> {
    const { data, error } = await supabase
      .from('blog_categories')
      .insert(category)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create category: ${error.message}`)
    }

    return data
  },

  async update(id: string, updates: Partial<BlogCategory>): Promise<BlogCategory> {
    const { data, error } = await supabase
      .from('blog_categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update category: ${error.message}`)
    }

    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('blog_categories')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Failed to delete category: ${error.message}`)
    }
  }
}

// Blog Tags API
export const blogTagsApi = {
  async getAll(): Promise<BlogTag[]> {
    const { data, error } = await supabase
      .from('blog_tags')
      .select('*')
      .order('name')

    if (error) {
      throw new Error(`Failed to fetch tags: ${error.message}`)
    }

    return data || []
  },

  async getById(id: string): Promise<BlogTag | null> {
    const { data, error } = await supabase
      .from('blog_tags')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      throw new Error(`Failed to fetch tag: ${error.message}`)
    }

    return data
  },

  async create(tag: Omit<BlogTag, 'id' | 'created_at' | 'updated_at'>): Promise<BlogTag> {
    const { data, error } = await supabase
      .from('blog_tags')
      .insert(tag)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create tag: ${error.message}`)
    }

    return data
  },

  async update(id: string, updates: Partial<BlogTag>): Promise<BlogTag> {
    const { data, error } = await supabase
      .from('blog_tags')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update tag: ${error.message}`)
    }

    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('blog_tags')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Failed to delete tag: ${error.message}`)
    }
  },

  async findOrCreate(name: string): Promise<BlogTag> {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

    // Try to find existing tag
    const { data: existing } = await supabase
      .from('blog_tags')
      .select('*')
      .eq('slug', slug)
      .single()

    if (existing) {
      return existing
    }

    // Create new tag
    return this.create({ name, slug })
  }
}

// Blog Media API
export const blogMediaApi = {
  async getAll(uploadedBy?: string): Promise<BlogMedia[]> {
    let query = supabase
      .from('blog_media')
      .select('*')
      .order('created_at', { ascending: false })

    if (uploadedBy) {
      query = query.eq('uploaded_by', uploadedBy)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to fetch media: ${error.message}`)
    }

    return data || []
  },

  async getById(id: string): Promise<BlogMedia | null> {
    const { data, error } = await supabase
      .from('blog_media')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      throw new Error(`Failed to fetch media: ${error.message}`)
    }

    return data
  },

  async create(media: Omit<BlogMedia, 'id' | 'created_at' | 'updated_at'>): Promise<BlogMedia> {
    const { data, error } = await supabase
      .from('blog_media')
      .insert(media)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create media record: ${error.message}`)
    }

    return data
  },

  async update(id: string, updates: Partial<BlogMedia>): Promise<BlogMedia> {
    const { data, error } = await supabase
      .from('blog_media')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update media: ${error.message}`)
    }

    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('blog_media')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Failed to delete media: ${error.message}`)
    }
  }
}

// Blog Stats API
export const blogStatsApi = {
  async getStats(): Promise<BlogStats> {
    // Get post counts
    const { data: postStats, error: postStatsError } = await supabase
      .from('blog_posts')
      .select('status')

    if (postStatsError) {
      throw new Error(`Failed to fetch post stats: ${postStatsError.message}`)
    }

    const totalPosts = postStats?.length || 0
    const publishedPosts = postStats?.filter(p => p.status === 'published').length || 0
    const draftPosts = postStats?.filter(p => p.status === 'draft').length || 0

    // Get total views
    const { data: viewStats, error: viewStatsError } = await supabase
      .from('blog_posts')
      .select('view_count')

    if (viewStatsError) {
      throw new Error(`Failed to fetch view stats: ${viewStatsError.message}`)
    }

    const totalViews = viewStats?.reduce((sum, post) => sum + (post.view_count || 0), 0) || 0

    // Get author count
    const { data: authorStats, error: authorStatsError } = await supabase
      .from('user_profiles')
      .select('id')
      .in('role', ['admin', 'editor', 'author'])

    if (authorStatsError) {
      throw new Error(`Failed to fetch author stats: ${authorStatsError.message}`)
    }

    const totalAuthors = authorStats?.length || 0

    // Get recent posts
    const { data: recentPosts, error: recentPostsError } = await supabase
      .from('blog_posts')
      .select(`
        *,
        author:user_profiles(*)
      `)
      .order('created_at', { ascending: false })
      .limit(5)

    if (recentPostsError) {
      throw new Error(`Failed to fetch recent posts: ${recentPostsError.message}`)
    }

    return {
      total_posts: totalPosts,
      published_posts: publishedPosts,
      draft_posts: draftPosts,
      total_views: totalViews,
      total_authors: totalAuthors,
      recent_posts: recentPosts || []
    }
  }
}

// Utility functions
export const blogUtils = {
  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  },

  async isSlugUnique(slug: string, excludeId?: string): Promise<boolean> {
    let query = supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', slug)

    if (excludeId) {
      query = query.neq('id', excludeId)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to check slug uniqueness: ${error.message}`)
    }

    return !data || data.length === 0
  },

  calculateReadingTime(content: string): number {
    const wordsPerMinute = 200
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
  },

  generateExcerpt(content: string, maxLength: number = 150): string {
    const plainText = content.replace(/<[^>]*>/g, '').trim()
    if (plainText.length <= maxLength) {
      return plainText
    }
    return plainText.substring(0, maxLength).replace(/\s+\S*$/, '') + '...'
  }
}
