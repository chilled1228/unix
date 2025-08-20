'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { 
  Bold, 
  Italic, 
  Link, 
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  Image,
  Eye,
  EyeOff,
  Type,
  Heading1,
  Heading2,
  Heading3
} from 'lucide-react'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  onImageUpload?: (file: File) => Promise<string>
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Start writing your post...',
  className = '',
  onImageUpload
}: RichTextEditorProps) {
  const [showPreview, setShowPreview] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [previewContent, setPreviewContent] = useState<string>('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const insertText = useCallback((before: string, after: string = '', placeholder: string = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    const textToInsert = selectedText || placeholder
    const newText = value.substring(0, start) + before + textToInsert + after + value.substring(end)
    
    onChange(newText)
    
    // Set cursor position
    setTimeout(() => {
      const newCursorPos = start + before.length + textToInsert.length + after.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
      textarea.focus()
    }, 0)
  }, [value, onChange])

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !onImageUpload) return

    try {
      setUploading(true)
      const imageUrl = await onImageUpload(file)
      insertText(`![${file.name}](${imageUrl})`)
    } catch (error) {
      alert('Failed to upload image')
    } finally {
      setUploading(false)
      event.target.value = '' // Reset file input
    }
  }

  // Render preview content when value changes
  useEffect(() => {
    const renderPreview = async () => {
      try {
        const html = await marked(value)
        setPreviewContent(DOMPurify.sanitize(html))
      } catch (error) {
        setPreviewContent('<p>Error rendering preview</p>')
      }
    }

    if (showPreview) {
      renderPreview()
    }
  }, [value, showPreview])

  const toolbarButtons = [
    {
      icon: Heading1,
      title: 'Heading 1',
      action: () => insertText('# ', '', 'Heading 1')
    },
    {
      icon: Heading2,
      title: 'Heading 2',
      action: () => insertText('## ', '', 'Heading 2')
    },
    {
      icon: Heading3,
      title: 'Heading 3',
      action: () => insertText('### ', '', 'Heading 3')
    },
    {
      icon: Bold,
      title: 'Bold',
      action: () => insertText('**', '**', 'bold text')
    },
    {
      icon: Italic,
      title: 'Italic',
      action: () => insertText('*', '*', 'italic text')
    },
    {
      icon: Link,
      title: 'Link',
      action: () => insertText('[', '](url)', 'link text')
    },
    {
      icon: List,
      title: 'Bullet List',
      action: () => insertText('- ', '', 'list item')
    },
    {
      icon: ListOrdered,
      title: 'Numbered List',
      action: () => insertText('1. ', '', 'list item')
    },
    {
      icon: Quote,
      title: 'Quote',
      action: () => insertText('> ', '', 'quote')
    },
    {
      icon: Code,
      title: 'Code',
      action: () => insertText('`', '`', 'code')
    }
  ]

  return (
    <div className={`border border-brand-secondary-300 rounded-lg overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="bg-brand-secondary-50 border-b border-brand-secondary-300 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {toolbarButtons.map((button, index) => (
              <button
                key={index}
                type="button"
                onClick={button.action}
                title={button.title}
                className="p-2 text-brand-secondary-600 hover:text-brand-secondary-900 hover:bg-brand-secondary-200 rounded transition-colors"
              >
                <button.icon className="w-4 h-4" />
              </button>
            ))}
            
            {onImageUpload && (
              <>
                <div className="w-px h-6 bg-brand-secondary-300 mx-2" />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  title="Upload Image"
                  className="p-2 text-brand-secondary-600 hover:text-brand-secondary-900 hover:bg-brand-secondary-200 rounded transition-colors disabled:opacity-50"
                >
                  <Image className="w-4 h-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </>
            )}
          </div>
          
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center space-x-2 px-3 py-1 text-sm text-brand-secondary-600 hover:text-brand-secondary-900 hover:bg-brand-secondary-200 rounded transition-colors"
          >
            {showPreview ? (
              <>
                <EyeOff className="w-4 h-4" />
                <span>Edit</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor/Preview */}
      <div className="relative">
        {showPreview ? (
          <div
            className="p-4 min-h-[400px] prose prose-brand max-w-none"
            dangerouslySetInnerHTML={{ __html: previewContent }}
          />
        ) : (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full p-4 min-h-[400px] resize-none border-0 focus:ring-0 focus:outline-none font-mono text-sm"
            style={{ fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace' }}
          />
        )}
        
        {uploading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
            <div className="text-brand-secondary-600">Uploading image...</div>
          </div>
        )}
      </div>

      {/* Help text */}
      <div className="bg-brand-secondary-50 border-t border-brand-secondary-300 px-4 py-2">
        <p className="text-xs text-brand-secondary-500">
          Supports Markdown formatting. Use the toolbar buttons or type Markdown syntax directly.
        </p>
      </div>
    </div>
  )
}

// Markdown cheat sheet component
export function MarkdownCheatSheet() {
  const examples = [
    { syntax: '# Heading 1', description: 'Large heading' },
    { syntax: '## Heading 2', description: 'Medium heading' },
    { syntax: '**bold text**', description: 'Bold text' },
    { syntax: '*italic text*', description: 'Italic text' },
    { syntax: '[link text](url)', description: 'Link' },
    { syntax: '![alt text](image-url)', description: 'Image' },
    { syntax: '- List item', description: 'Bullet list' },
    { syntax: '1. List item', description: 'Numbered list' },
    { syntax: '> Quote', description: 'Blockquote' },
    { syntax: '`code`', description: 'Inline code' },
    { syntax: '```\ncode block\n```', description: 'Code block' }
  ]

  return (
    <div className="bg-white rounded-lg shadow border border-brand-secondary-200 p-6">
      <h3 className="text-lg font-semibold text-brand-secondary-900 mb-4">Markdown Cheat Sheet</h3>
      <div className="space-y-3">
        {examples.map((example, index) => (
          <div key={index} className="flex items-start space-x-4">
            <code className="flex-1 text-sm bg-brand-secondary-100 px-2 py-1 rounded font-mono">
              {example.syntax}
            </code>
            <span className="flex-1 text-sm text-brand-secondary-600">
              {example.description}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
