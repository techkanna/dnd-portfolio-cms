'use client'

import { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { LayoutBlock } from '@/lib/supabaseClient'
import { useLayoutStore } from '@/store/useLayoutStore'

interface DraggableBlockProps {
  block: LayoutBlock
  children: React.ReactNode
}

export default function DraggableBlock({ block, children }: DraggableBlockProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { moveBlock, selectBlock, selectedBlock } = useLayoutStore()

  const [{ isDragging }, drag] = useDrag({
    type: 'block',
    item: { id: block.id, type: block.type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop({
    accept: 'block',
    hover: (item: { id: string; type: string }, monitor) => {
      if (!ref.current) return
      if (item.id === block.id) return

      const hoverBoundingRect = ref.current.getBoundingClientRect()
      const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const clientOffset = monitor.getClientOffset()
      
      if (!clientOffset) return

      const hoverClientX = clientOffset.x - hoverBoundingRect.left
      const hoverClientY = clientOffset.y - hoverBoundingRect.top

      // Calculate new position
      const newPosition = {
        x: block.position.x + (hoverClientX - hoverMiddleX),
        y: block.position.y + (hoverClientY - hoverMiddleY),
      }

      moveBlock(item.id, newPosition)
    },
  })

  drag(drop(ref))

  const isSelected = selectedBlock === block.id

  return (
    <div
      ref={ref}
      onClick={() => selectBlock(block.id)}
      className={`absolute cursor-move transition-all duration-200 ${
        isDragging ? 'opacity-50 z-50' : 'opacity-100'
      } ${
        isSelected ? 'ring-2 ring-indigo-500 ring-offset-2' : ''
      }`}
      style={{
        left: block.position.x,
        top: block.position.y,
        width: block.size.width,
        height: block.size.height,
      }}
    >
      {children}
      
      {/* Resize handles */}
      {isSelected && (
        <>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full cursor-se-resize" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full cursor-ne-resize" />
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-indigo-500 rounded-full cursor-nw-resize" />
          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-indigo-500 rounded-full cursor-sw-resize" />
        </>
      )}
    </div>
  )
} 