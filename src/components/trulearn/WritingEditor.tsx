'use client'

import { useCallback, useEffect, useState, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useAppStore } from '@/lib/store/appStore'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link2,
  Minus,
  RemoveFormatting
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface WritingEditorProps {
  content?: string
  onChange?: (content: string) => void
  onWordCountChange?: (wordCount: number) => void
  onPasteDetected?: (wordCount: number, text: string) => void
  placeholder?: string
  readOnly?: boolean
}

export function WritingEditor({
  content = '',
  onChange,
  onWordCountChange,
  onPasteDetected,
  placeholder = 'Start writing your assignment...',
  readOnly = false,
}: WritingEditorProps) {
  const { recordKeystroke, activeWritingSession, setIdleStatus } = useAppStore()
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const lastActivityRef = useRef<number>(Date.now())
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Idle detection - 30 seconds of inactivity
  const IDLE_TIMEOUT = 30000

  const resetIdleTimer = useCallback(() => {
    lastActivityRef.current = Date.now()
    if (activeWritingSession?.isIdle) {
      setIdleStatus(false)
    }
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current)
    }
    idleTimeoutRef.current = setTimeout(() => {
      setIdleStatus(true)
    }, IDLE_TIMEOUT)
  }, [activeWritingSession?.isIdle, setIdleStatus])

  useEffect(() => {
    return () => {
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current)
      }
    }
  }, [])

  const countWords = (text: string) => {
    const plainText = text.replace(/<[^>]*>/g, ' ').trim()
    if (!plainText) return 0
    return plainText.split(/\s+/).filter(word => word.length > 0).length
  }

  const countChars = (text: string) => {
    return text.replace(/<[^>]*>/g, '').length
  }

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer nofollow',
          class: 'text-blue-600 underline underline-offset-2',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content,
    editable: !readOnly,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      const words = countWords(html)
      const chars = countChars(html)

      setWordCount(words)
      setCharCount(chars)

      onChange?.(html)
      onWordCountChange?.(words)

      // Record keystroke activity
      if (activeWritingSession) {
        recordKeystroke()
        resetIdleTimer()
      }
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base lg:prose-lg max-w-none focus:outline-none min-h-full px-4 py-3',
      },
      handlePaste: (view, event) => {
        const text = event.clipboardData?.getData('text/plain') || ''
        const pastedWordCount = countWords(text)

        if (pastedWordCount > 0 && onPasteDetected) {
          // Trigger paste detection callback
          onPasteDetected(pastedWordCount, text)
        }

        resetIdleTimer()
        return false // Allow default paste behavior
      },
    },
  })

  // Initialize word count on mount
  useEffect(() => {
    if (editor && content) {
      const words = countWords(content)
      const chars = countChars(content)
      setWordCount(words)
      setCharCount(chars)
    }
  }, [editor, content])

  useEffect(() => {
    if (!editor) return

    const currentHtml = editor.getHTML()
    if (content !== currentHtml) {
      editor.commands.setContent(content || '', { emitUpdate: false })
      setWordCount(countWords(content || ''))
      setCharCount(countChars(content || ''))
    }
  }, [content, editor])

  const handleSetLink = useCallback(() => {
    if (!editor) return
    const previousUrl = editor.getAttributes('link').href as string | undefined
    const url = window.prompt('Enter URL', previousUrl ?? 'https://')
    if (url === null) {
      return
    }
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: url })
      .run()
  }, [editor])

  if (!editor) {
    return (
      <div className="rounded-lg border bg-white">
        <div className="h-[500px] flex items-center justify-center">
          <div className="animate-pulse text-gray-400">Loading editor...</div>
        </div>
      </div>
    )
  }

  const readingTime = Math.max(1, Math.ceil(wordCount / 220))

  const ToolbarButton = ({
    onClick,
    isActive,
    children,
    tooltip
  }: {
    onClick: () => void
    isActive?: boolean
    children: React.ReactNode
    tooltip: string
  }) => (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClick}
            className={cn(
              "h-8 w-8 p-0",
              isActive && "bg-blue-100 text-blue-600"
            )}
          >
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border bg-white">
      {/* Toolbar */}
      {!readOnly && (
        <div className="flex items-center gap-1 px-3 py-2 border-b bg-gray-50/80 flex-wrap">
          {/* Text Formatting */}
          <div className="flex items-center gap-0.5 pr-2 border-r">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive('bold')}
              tooltip="Bold (Ctrl+B)"
            >
              <Bold className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive('italic')}
              tooltip="Italic (Ctrl+I)"
            >
              <Italic className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              isActive={editor.isActive('underline')}
              tooltip="Underline (Ctrl+U)"
            >
              <UnderlineIcon className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              isActive={editor.isActive('strike')}
              tooltip="Strikethrough (Ctrl+Shift+S)"
            >
              <Strikethrough className="h-4 w-4" />
            </ToolbarButton>
          </div>

          {/* Headings */}
          <div className="flex items-center gap-0.5 px-2 border-r">
            <ToolbarButton
              onClick={() => editor.chain().focus().setParagraph().run()}
              isActive={editor.isActive('paragraph')}
              tooltip="Normal text"
            >
              <Type className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              isActive={editor.isActive('heading', { level: 1 })}
              tooltip="Heading 1"
            >
              <Heading1 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              isActive={editor.isActive('heading', { level: 2 })}
              tooltip="Heading 2"
            >
              <Heading2 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              isActive={editor.isActive('heading', { level: 3 })}
              tooltip="Heading 3"
            >
              <Heading3 className="h-4 w-4" />
            </ToolbarButton>
          </div>

          {/* Lists */}
          <div className="flex items-center gap-0.5 px-2 border-r">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive('bulletList')}
              tooltip="Bullet list"
            >
              <List className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive('orderedList')}
              tooltip="Numbered list"
            >
              <ListOrdered className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              isActive={editor.isActive('blockquote')}
              tooltip="Quote"
            >
              <Quote className="h-4 w-4" />
            </ToolbarButton>
          </div>

          {/* Alignment */}
          <div className="flex items-center gap-0.5 px-2 border-r">
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              isActive={editor.isActive({ textAlign: 'left' })}
              tooltip="Align left"
            >
              <AlignLeft className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              isActive={editor.isActive({ textAlign: 'center' })}
              tooltip="Align center"
            >
              <AlignCenter className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              isActive={editor.isActive({ textAlign: 'right' })}
              tooltip="Align right"
            >
              <AlignRight className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('justify').run()}
              isActive={editor.isActive({ textAlign: 'justify' })}
              tooltip="Justify"
            >
              <AlignJustify className="h-4 w-4" />
            </ToolbarButton>
          </div>

          {/* Insert */}
          <div className="flex items-center gap-0.5 px-2 border-r">
            <ToolbarButton
              onClick={handleSetLink}
              isActive={editor.isActive('link')}
              tooltip="Insert link"
            >
              <Link2 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              tooltip="Horizontal rule"
            >
              <Minus className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
              tooltip="Clear formatting"
            >
              <RemoveFormatting className="h-4 w-4" />
            </ToolbarButton>
          </div>

          {/* Undo/Redo */}
          <div className="flex items-center gap-0.5 pl-2">
            <ToolbarButton
              onClick={() => editor.chain().focus().undo().run()}
              tooltip="Undo (Ctrl+Z)"
            >
              <Undo className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().redo().run()}
              tooltip="Redo (Ctrl+Y)"
            >
              <Redo className="h-4 w-4" />
            </ToolbarButton>
          </div>

          {/* Word/Character Count */}
          <div className="flex items-center gap-3 ml-auto text-xs text-gray-500">
            <span>{wordCount} words</span>
            <span>{charCount} characters</span>
            {wordCount > 0 && <span>{readingTime} min read</span>}
          </div>
        </div>
      )}

      {/* Editor Content */}
      <EditorContent editor={editor} className="flex-1 overflow-y-auto" />
    </div>
  )
}
