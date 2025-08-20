#!/usr/bin/env node

/**
 * Script to verify blog posts are working correctly
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function verifyBlogPosts() {
  try {
    console.log('🔍 Verifying blog posts...')

    // Get all blog posts
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select(`
        id,
        title,
        slug,
        status,
        featured_image_url,
        content,
        author:user_profiles(full_name, email)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch posts: ${error.message}`)
    }

    console.log(`📝 Found ${posts.length} blog posts`)
    console.log('')

    for (const post of posts) {
      console.log(`📖 ${post.title}`)
      console.log(`   🔗 Slug: ${post.slug}`)
      console.log(`   📊 Status: ${post.status}`)
      console.log(`   👤 Author: ${post.author?.full_name || post.author?.email || 'Unknown'}`)
      console.log(`   🖼️  Image: ${post.featured_image_url ? '✅ Yes' : '❌ No'}`)
      console.log(`   📄 Content: ${post.content ? `${post.content.length} characters` : '❌ Empty'}`)
      
      // Check if content has proper markdown
      if (post.content) {
        const hasHeaders = post.content.includes('#')
        const hasCodeBlocks = post.content.includes('```')
        const hasLinks = post.content.includes('[') && post.content.includes('](')
        
        console.log(`   📝 Markdown: ${hasHeaders ? '✅ Headers' : '❌ No headers'} | ${hasCodeBlocks ? '✅ Code blocks' : '❌ No code'} | ${hasLinks ? '✅ Links' : '❌ No links'}`)
      }
      
      console.log('')
    }

    // Check for any issues
    const issues = []
    
    posts.forEach(post => {
      if (!post.featured_image_url) {
        issues.push(`${post.title}: Missing featured image`)
      }
      if (!post.content || post.content.length < 100) {
        issues.push(`${post.title}: Content too short or missing`)
      }
      if (post.status !== 'published') {
        issues.push(`${post.title}: Not published (status: ${post.status})`)
      }
    })

    if (issues.length > 0) {
      console.log('⚠️  Issues found:')
      issues.forEach(issue => console.log(`   - ${issue}`))
    } else {
      console.log('✅ All blog posts look good!')
    }

    console.log('')
    console.log('🌐 Blog URLs:')
    posts.forEach(post => {
      if (post.status === 'published') {
        console.log(`   📖 http://localhost:3000/blog/${post.slug}`)
      }
    })

    console.log('')
    console.log('📊 Summary:')
    console.log(`   Total posts: ${posts.length}`)
    console.log(`   Published: ${posts.filter(p => p.status === 'published').length}`)
    console.log(`   With images: ${posts.filter(p => p.featured_image_url).length}`)
    console.log(`   Issues: ${issues.length}`)

  } catch (error) {
    console.error('❌ Error verifying blog posts:', error.message)
    process.exit(1)
  }
}

verifyBlogPosts()
