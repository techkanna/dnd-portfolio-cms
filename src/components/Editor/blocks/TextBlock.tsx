'use client'

import { useState, useRef, useEffect } from 'react'
import { useLayoutStore } from '@/store/useLayoutStore'

interface TextBlockProps {
  id: string
  content: {
    text: string
    fontSize: number
    fontWeight: string
    color: string
    textAlign: string
  }
}

export default function TextBlock({ id, content }: TextBlockProps) {
  const { updateBlock, selectedBlock } = useLayoutStore()
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(content.text)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const isSelected = selectedBlock === id

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.select()
    }
  }, [isEditing])

  const handleDoubleClick = () => {
    if (isSelected) {
      setIsEditing(true)
    }
  }

  const handleSave = () => {
    updateBlock(id, {
      content: { ...content, text: editText }
    })
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      setEditText(content.text)
      setIsEditing(false)
    }
  }

  if (isEditing) {
    return (
      <textarea
        ref={textareaRef}
        value={editText}
        onChange={(e) => setEditText(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className="w-full h-full resize-none border-none outline-none bg-transparent"
        style={{
          fontSize: content.fontSize,
          fontWeight: content.fontWeight,
          color: content.color,
          textAlign: content.textAlign as any,
        }}
      />
    )
  }

  return (
    <div
      onDoubleClick={handleDoubleClick}
      className="w-full h-full p-2 cursor-text"
      style={{
        fontSize: content.fontSize,
        fontWeight: content.fontWeight,
        color: content.color,
        textAlign: content.textAlign as any,
      }}
    >
      {content.text || 'Double-click to edit text...'}
    </div>
  )
} 