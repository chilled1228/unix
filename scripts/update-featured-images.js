#!/usr/bin/env node

/**
 * Script to update featured images for blog posts
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

// Default featured image for timestamp-related posts
const DEFAULT_TIMESTAMP_IMAGE = 'https://pub-141831e61e69445289222976a15b6fb3.r2.dev/1755702481662-01s4t4e3yh9k-1755702477952_g4fyw3_chatgpt_image_aug_20.png'

async function updateFeaturedImages() {
  try {
    console.log('🖼️  Updating featured images for blog posts...')

    // Get all posts without featured images
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('id, title, slug, featured_image_url')
      .is('featured_image_url', null)

    if (error) {
      throw new Error(`Failed to fetch posts: ${error.message}`)
    }

    if (!posts || posts.length === 0) {
      console.log('✅ All posts already have featured images!')
      return
    }

    console.log(`📝 Found ${posts.length} posts without featured images`)

    // Update all posts to use the default timestamp image
    const { error: updateError } = await supabase
      .from('blog_posts')
      .update({ featured_image_url: DEFAULT_TIMESTAMP_IMAGE })
      .is('featured_image_url', null)

    if (updateError) {
      throw new Error(`Failed to update featured images: ${updateError.message}`)
    }

    console.log(`✅ Updated ${posts.length} posts with featured images`)
    
    // List updated posts
    posts.forEach(post => {
      console.log(`   📖 ${post.title}`)
      console.log(`      🔗 /blog/${post.slug}`)
    })

    console.log('\n🎉 Featured images update completed!')

  } catch (error) {
    console.error('❌ Error updating featured images:', error.message)
    process.exit(1)
  }
}

// Function to update a specific post's featured image
async function updateSpecificPost(slug, imageUrl) {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .update({ featured_image_url: imageUrl })
      .eq('slug', slug)
      .select('id, title, slug, featured_image_url')
      .single()

    if (error) {
      throw new Error(`Failed to update post: ${error.message}`)
    }

    console.log(`✅ Updated featured image for: ${data.title}`)
    console.log(`   🖼️  Image: ${data.featured_image_url}`)
    
    return data
  } catch (error) {
    console.error('❌ Error updating specific post:', error.message)
    throw error
  }
}

// Command line interface
const args = process.argv.slice(2)

if (args.length === 0) {
  // Update all posts without featured images
  updateFeaturedImages()
} else if (args.length === 2) {
  // Update specific post: node update-featured-images.js <slug> <image-url>
  const [slug, imageUrl] = args
  updateSpecificPost(slug, imageUrl)
    .then(() => console.log('🎉 Specific post update completed!'))
    .catch(() => process.exit(1))
} else {
  console.log('Usage:')
  console.log('  node update-featured-images.js                    # Update all posts without images')
  console.log('  node update-featured-images.js <slug> <image-url> # Update specific post')
  console.log('')
  console.log('Examples:')
  console.log('  node update-featured-images.js')
  console.log('  node update-featured-images.js my-post-slug https://example.com/image.jpg')
  process.exit(1)
}
