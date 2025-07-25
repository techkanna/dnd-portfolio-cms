'use client'

import { useDrag } from 'react-dnd'
import { useLayoutStore } from '@/store/useLayoutStore'

interface BlockToolbarProps {
  onAddBlock: (type: 'text' | 'image' | 'button' | 'grid') => void
}

interface ToolbarItemProps {
  type: 'text' | 'image' | 'button' | 'grid'
  icon: React.ReactNode
  label: string
  onAdd: () => void
}

function ToolbarItem({ type, icon, label, onAdd }: ToolbarItemProps) {
  const [{ isDragging }, drag] = useDrag({
    type: 'toolbar-item',
    item: { blockType: type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  return (
    <div
      ref={drag as any}
      onClick={onAdd}
      className={`flex flex-col items-center p-4 bg-white border-2 border-gray-200 rounded-lg cursor-move hover:border-indigo-300 transition-colors ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <div className="text-indigo-600 mb-2">{icon}</div>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </div>
  )
}

export default function BlockToolbar({ onAddBlock }: BlockToolbarProps) {
  const { undo, redo, canUndo, canRedo, clearLayout } = useLayoutStore()

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Components</h2>
      
      {/* Block Templates */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <ToolbarItem
          type="text"
          onAdd={() => onAddBlock('text')}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
          label="Text"
        />
        
        <ToolbarItem
          type="image"
          onAdd={() => onAddBlock('image')}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
          label="Image"
        />
        
        <ToolbarItem
          type="button"
          onAdd={() => onAddBlock('button')}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
          }
          label="Button"
        />
        
        <ToolbarItem
          type="grid"
          onAdd={() => onAddBlock('grid')}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
            </svg>
          }
          label="Grid"
        />
      </div>

      {/* Actions */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Actions</h3>
        
        <div className="space-y-2">
          <div className="flex gap-2">
            <button
              onClick={undo}
              disabled={!canUndo()}
              className="flex-1 px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Undo
            </button>
            <button
              onClick={redo}
              disabled={!canRedo()}
              className="flex-1 px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Redo
            </button>
          </div>
          
          <button
            onClick={clearLayout}
            className="w-full px-3 py-2 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-6 p-3 bg-indigo-50 rounded-lg">
        <h4 className="text-sm font-semibold text-indigo-900 mb-2">Tips</h4>
        <ul className="text-xs text-indigo-700 space-y-1">
          <li>• Drag blocks to the canvas</li>
          <li>• Double-click to edit content</li>
          <li>• Click to select and move</li>
          <li>• Use Ctrl+Z for undo</li>
        </ul>
      </div>
    </div>
  )
} 