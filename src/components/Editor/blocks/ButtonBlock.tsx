'use client'

import { useState } from 'react'
import { useLayoutStore } from '@/store/useLayoutStore'

interface ButtonBlockProps {
  id: string
  content: {
    text: string
    href: string
    backgroundColor: string
    textColor: string
    borderRadius: number
    padding: { x: number; y: number }
  }
}

export default function ButtonBlock({ id, content }: ButtonBlockProps) {
  const { updateBlock, selectedBlock } = useLayoutStore()
  const [isEditing, setIsEditing] = useState(false)
  const [buttonText, setButtonText] = useState(content.text)
  const [buttonHref, setButtonHref] = useState(content.href)
  const isSelected = selectedBlock === id

  const handleDoubleClick = () => {
    if (isSelected) {
      setIsEditing(true)
    }
  }

  const handleSave = () => {
    updateBlock(id, {
      content: { ...content, text: buttonText, href: buttonHref }
    })
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      setButtonText(content.text)
      setButtonHref(content.href)
      setIsEditing(false)
    }
  }

  if (isEditing) {
    return (
      <div className="w-full h-full p-2 bg-white border-2 border-dashed border-gray-300 flex flex-col gap-2">
        <input
          type="text"
          value={buttonText}
          onChange={(e) => setButtonText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Button text..."
          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
          autoFocus
        />
        <input
          type="text"
          value={buttonHref}
          onChange={(e) => setButtonHref(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Link URL (optional)..."
          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
        />
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  const ButtonComponent = content.href ? 'a' : 'button'

  return (
    <div
      onDoubleClick={handleDoubleClick}
      className="w-full h-full flex items-center justify-center cursor-pointer"
    >
      <ButtonComponent
        {...(content.href && { href: content.href, target: '_blank', rel: 'noopener noreferrer' })}
        className="transition-all duration-200 hover:scale-105 font-medium"
        style={{
          backgroundColor: content.backgroundColor,
          color: content.textColor,
          borderRadius: content.borderRadius,
          paddingLeft: content.padding.x,
          paddingRight: content.padding.x,
          paddingTop: content.padding.y,
          paddingBottom: content.padding.y,
        }}
        onClick={(e) => {
          if (!content.href) {
            e.preventDefault()
          }
        }}
      >
        {content.text || 'Button'}
      </ButtonComponent>
    </div>
  )
} 