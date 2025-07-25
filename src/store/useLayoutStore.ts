import { create } from 'zustand'
import { LayoutBlock } from '@/lib/supabaseClient'

interface LayoutState {
  blocks: LayoutBlock[]
  selectedBlock: string | null
  isDragging: boolean
  history: LayoutBlock[][]
  historyIndex: number
  
  // Actions
  addBlock: (block: LayoutBlock) => void
  updateBlock: (id: string, updates: Partial<LayoutBlock>) => void
  removeBlock: (id: string) => void
  selectBlock: (id: string | null) => void
  setDragging: (isDragging: boolean) => void
  moveBlock: (id: string, position: { x: number; y: number }) => void
  loadLayout: (blocks: LayoutBlock[]) => void
  clearLayout: () => void
  
  // History management
  pushToHistory: () => void
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean
}

export const useLayoutStore = create<LayoutState>((set, get) => ({
  blocks: [],
  selectedBlock: null,
  isDragging: false,
  history: [[]],
  historyIndex: 0,

  addBlock: (block) => {
    set((state) => {
      const newBlocks = [...state.blocks, block]
      return {
        blocks: newBlocks,
        selectedBlock: block.id,
      }
    })
    get().pushToHistory()
  },

  updateBlock: (id, updates) => {
    set((state) => ({
      blocks: state.blocks.map((block) =>
        block.id === id ? { ...block, ...updates } : block
      ),
    }))
    get().pushToHistory()
  },

  removeBlock: (id) => {
    set((state) => ({
      blocks: state.blocks.filter((block) => block.id !== id),
      selectedBlock: state.selectedBlock === id ? null : state.selectedBlock,
    }))
    get().pushToHistory()
  },

  selectBlock: (id) => {
    set({ selectedBlock: id })
  },

  setDragging: (isDragging) => {
    set({ isDragging })
  },

  moveBlock: (id, position) => {
    set((state) => ({
      blocks: state.blocks.map((block) =>
        block.id === id ? { ...block, position } : block
      ),
    }))
  },

  loadLayout: (blocks) => {
    set({ blocks, selectedBlock: null })
    get().pushToHistory()
  },

  clearLayout: () => {
    set({ blocks: [], selectedBlock: null })
    get().pushToHistory()
  },

  pushToHistory: () => {
    set((state) => {
      const newHistory = state.history.slice(0, state.historyIndex + 1)
      newHistory.push([...state.blocks])
      return {
        history: newHistory.slice(-50), // Keep last 50 states
        historyIndex: Math.min(newHistory.length - 1, 49),
      }
    })
  },

  undo: () => {
    const state = get()
    if (state.canUndo()) {
      const newIndex = state.historyIndex - 1
      set({
        blocks: [...state.history[newIndex]],
        historyIndex: newIndex,
        selectedBlock: null,
      })
    }
  },

  redo: () => {
    const state = get()
    if (state.canRedo()) {
      const newIndex = state.historyIndex + 1
      set({
        blocks: [...state.history[newIndex]],
        historyIndex: newIndex,
        selectedBlock: null,
      })
    }
  },

  canUndo: () => {
    const state = get()
    return state.historyIndex > 0
  },

  canRedo: () => {
    const state = get()
    return state.historyIndex < state.history.length - 1
  },
})) 