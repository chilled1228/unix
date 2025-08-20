#!/usr/bin/env node

/**
 * Script to set up the blog database schema in Supabase
 * This script reads the SQL files and executes them in the correct order
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: '.env.local' })

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// SQL files to execute in order
const sqlFiles = [
  'supabase/schema.sql',
  'supabase/rls-policies.sql',
  'supabase/storage-policies.sql'
]

async function executeSQLFile(filePath) {
  try {
    console.log(`📄 Reading ${filePath}...`)
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`)
    }

    const sql = fs.readFileSync(filePath, 'utf8')
    
    if (!sql.trim()) {
      console.log(`   ⚠️  File is empty, skipping...`)
      return
    }

    console.log(`🔄 Executing ${filePath}...`)
    
    // Split SQL into individual statements (basic splitting by semicolon)
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))

    console.log(`   📝 Found ${statements.length} SQL statements`)

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      
      if (statement.trim()) {
        try {
          const { error } = await supabase.rpc('exec_sql', { sql_query: statement })
          
          if (error) {
            // Some errors are expected (like "already exists" errors)
            if (error.message.includes('already exists') || 
                error.message.includes('does not exist') ||
                error.message.includes('duplicate key')) {
              console.log(`   ⚠️  Statement ${i + 1}: ${error.message} (continuing...)`)
            } else {
              console.error(`   ❌ Statement ${i + 1} failed: ${error.message}`)
              // Don't throw here, continue with other statements
            }
          } else {
            if (i % 10 === 0 || i === statements.length - 1) {
              console.log(`   ✅ Executed ${i + 1}/${statements.length} statements`)
            }
          }
        } catch (err) {
          console.error(`   ❌ Statement ${i + 1} error: ${err.message}`)
        }
      }
    }

    console.log(`✅ Completed ${filePath}`)
    
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message)
    throw error
  }
}

async function setupDatabase() {
  try {
    console.log('🚀 Starting database setup...')
    console.log('📊 This will create tables, policies, and storage configuration')
    console.log('')

    // Test connection first
    console.log('🔍 Testing Supabase connection...')
    const { data, error } = await supabase.from('information_schema.tables').select('table_name').limit(1)
    
    if (error) {
      throw new Error(`Failed to connect to Supabase: ${error.message}`)
    }
    
    console.log('✅ Connected to Supabase successfully')
    console.log('')

    // Execute each SQL file
    for (const sqlFile of sqlFiles) {
      await executeSQLFile(sqlFile)
      console.log('')
    }

    // Verify setup by checking if key tables exist
    console.log('🔍 Verifying database setup...')
    
    const requiredTables = ['user_profiles', 'blog_posts', 'blog_categories', 'blog_tags', 'blog_media']
    
    for (const tableName of requiredTables) {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1)

      if (error) {
        console.log(`   ❌ Table '${tableName}' not accessible: ${error.message}`)
      } else {
        console.log(`   ✅ Table '${tableName}' is ready`)
      }
    }

    console.log('')
    console.log('🎉 Database setup completed!')
    console.log('')
    console.log('📋 Next steps:')
    console.log('1. Sign up for an account at: http://localhost:3000/auth/signup')
    console.log('2. Promote your user to admin with this SQL:')
    console.log('   UPDATE user_profiles SET role = \'admin\' WHERE email = \'your-email@example.com\';')
    console.log('3. Run: npm run create-blog-post')
    console.log('4. Visit your blog at: http://localhost:3000/blog')

  } catch (error) {
    console.error('❌ Database setup failed:', error.message)
    console.log('')
    console.log('🔧 Manual setup instructions:')
    console.log('1. Go to your Supabase dashboard')
    console.log('2. Open the SQL Editor')
    console.log('3. Copy and paste the content of each file:')
    sqlFiles.forEach(file => console.log(`   - ${file}`))
    console.log('4. Execute each file in order')
    process.exit(1)
  }
}

// Create a simple SQL execution function for Supabase
async function createExecSQLFunction() {
  try {
    const { error } = await supabase.rpc('exec_sql', { sql_query: 'SELECT 1' })
    
    if (error && error.message.includes('function exec_sql does not exist')) {
      console.log('📝 Creating SQL execution helper function...')
      
      // This is a workaround since we can't directly execute arbitrary SQL
      // We'll need to use the REST API instead
      console.log('⚠️  Direct SQL execution not available. Please run the SQL files manually in Supabase dashboard.')
      return false
    }
    
    return true
  } catch (err) {
    return false
  }
}

// Alternative approach using direct SQL execution
async function setupDatabaseAlternative() {
  console.log('🚀 Starting database setup...')
  console.log('')
  console.log('📋 Manual Setup Required:')
  console.log('')
  console.log('Since direct SQL execution is limited, please follow these steps:')
  console.log('')
  console.log('1. 🌐 Go to your Supabase Dashboard: https://app.supabase.com')
  console.log('2. 📊 Select your project')
  console.log('3. 🔧 Navigate to SQL Editor')
  console.log('4. 📄 Copy and paste the content of each file in this order:')
  console.log('')
  
  sqlFiles.forEach((file, index) => {
    console.log(`   ${index + 1}. ${file}`)
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8')
      const lines = content.split('\n').length
      console.log(`      (${lines} lines)`)
    }
  })
  
  console.log('')
  console.log('5. ▶️  Execute each file by clicking "Run"')
  console.log('6. ✅ Verify no errors occurred')
  console.log('')
  console.log('After completing the manual setup:')
  console.log('1. Sign up at: http://localhost:3000/auth/signup')
  console.log('2. Promote to admin: UPDATE user_profiles SET role = \'admin\' WHERE email = \'your-email\';')
  console.log('3. Run: npm run create-blog-post')
}

// Run the setup
setupDatabaseAlternative()
