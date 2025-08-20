import { Database } from './database'

export type UserProfile = Database['public']['Tables']['user_profiles']['Row']
export type BlogPost = Database['public']['Tables']['blog_posts']['Row']
export type BlogCategory = Database['public']['Tables']['blog_categories']['Row']
export type BlogTag = Database['public']['Tables']['blog_tags']['Row']
export type BlogMedia = Database['public']['Tables']['blog_media']['Row']

export type PostStatus = 'draft' | 'published' | 'archived'
export type UserRole = 'admin' | 'editor' | 'author' | 'user'

// Extended types with relationships
export interface BlogPostWithAuthor extends BlogPost {
  author: UserProfile
}

export interface BlogPostWithRelations extends BlogPost {
  author: UserProfile
  categories: BlogCategory[]
  tags: BlogTag[]
}

export interface BlogPostFormData {
  title: string
  content: string
  excerpt?: string
  slug: string
  status: PostStatus
  featured_image_url?: string
  meta_title?: string
  meta_description?: string
  category_ids: string[]
  tag_ids: string[]
}

export interface BlogPostFilters {
  status?: PostStatus
  author_id?: string
  category_id?: string
  tag_id?: string
  search?: string
  limit?: number
  offset?: number
  sort_by?: 'created_at' | 'updated_at' | 'published_date' | 'title' | 'view_count'
  sort_order?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  per_page: number
  total_pages: number
}

export interface BlogStats {
  total_posts: number
  published_posts: number
  draft_posts: number
  total_views: number
  total_authors: number
  recent_posts: BlogPostWithAuthor[]
}

// Form validation types
export interface BlogPostValidation {
  title: string[]
  content: string[]
  slug: string[]
  excerpt: string[]
  meta_title: string[]
  meta_description: string[]
}

// SEO and metadata types
export interface BlogSEOData {
  title: string
  description: string
  canonical_url: string
  og_image?: string
  keywords: string[]
  author: string
  published_date?: string
  modified_date?: string
  article_section?: string
  article_tags: string[]
}

// Rich text editor types
export interface EditorContent {
  html: string
  text: string
  word_count: number
  reading_time: number
}

// Image upload types
export interface ImageUploadResult {
  url: string
  filename: string
  size: number
  alt_text?: string
}

export interface ImageUploadOptions {
  max_size?: number
  allowed_types?: string[]
  generate_thumbnails?: boolean
  optimize?: boolean
}
