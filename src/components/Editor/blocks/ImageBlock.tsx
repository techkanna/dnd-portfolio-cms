'use client'

import { useState } from 'react'
import { useLayoutStore } from '@/store/useLayoutStore'

interface ImageBlockProps {
  id: string
  content: {
    src: string
    alt: string
    objectFit: string
    borderRadius: number
  }
}

export default function ImageBlock({ id, content }: ImageBlockProps) {
  const { updateBlock, selectedBlock } = useLayoutStore()
  const [isEditing, setIsEditing] = useState(false)
  const [imageSrc, setImageSrc] = useState(content.src)
  const [imageAlt, setImageAlt] = useState(content.alt)
  const isSelected = selectedBlock === id

  const handleDoubleClick = () => {
    if (isSelected) {
      setIsEditing(true)
    }
  }

  const handleSave = () => {
    updateBlock(id, {
      content: { ...content, src: imageSrc, alt: imageAlt }
    })
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      setImageSrc(content.src)
      setImageAlt(content.alt)
      setIsEditing(false)
    }
  }

  if (isEditing) {
    return (
      <div className="w-full h-full p-2 bg-white border-2 border-dashed border-gray-300 flex flex-col gap-2">
        <input
          type="text"
          value={imageSrc}
          onChange={(e) => setImageSrc(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter image URL..."
          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
          autoFocus
        />
        <input
          type="text"
          value={imageAlt}
          onChange={(e) => setImageAlt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Alt text..."
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

  return (
    <div
      onDoubleClick={handleDoubleClick}
      className="w-full h-full cursor-pointer relative overflow-hidden"
      style={{ borderRadius: content.borderRadius }}
    >
      {content.src ? (
        <img
          src={content.src}
          alt={content.alt}
          className="w-full h-full"
          style={{ objectFit: content.objectFit as any }}
        />
      ) : (
        <div className="w-full h-full bg-gray-200 border-2 border-dashed border-gray-400 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Double-click to add image
          </div>
        </div>
      )}
    </div>
  )
} 