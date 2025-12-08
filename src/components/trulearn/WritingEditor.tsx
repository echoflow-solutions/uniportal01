'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'

interface WritingEditorProps {
  content?: string
  onChange?: (content: string) => void
  placeholder?: string
}

export function WritingEditor({
  content = '',
  onChange,
  placeholder = 'Start writing your assignment...'
}: WritingEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
  })

  return (
    <div className="rounded-lg border bg-white p-4">
      <EditorContent editor={editor} className="prose max-w-none min-h-[400px]" />
    </div>
  )
}
