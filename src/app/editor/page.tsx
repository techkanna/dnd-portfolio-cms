'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { supabase } from '@/lib/supabaseClient'
import { useLayoutStore } from '@/store/useLayoutStore'
import BlockToolbar from '@/components/Editor/BlockToolbar'
import DraggableBlock from '@/components/Editor/DraggableBlock'
import TextBlock from '@/components/Editor/blocks/TextBlock'
import ImageBlock from '@/components/Editor/blocks/ImageBlock'
import ButtonBlock from '@/components/Editor/blocks/ButtonBlock'

export default function EditorPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [portfolioTitle, setPortfolioTitle] = useState('Untitled Portfolio')
  const router = useRouter()
  
  const { blocks, addBlock, loadLayout } = useLayoutStore()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)
      setLoading(false)
      
      // Load existing portfolio if any
      await loadExistingPortfolio(user.id)
    }

    getUser()
  }, [router])

  const loadExistingPortfolio = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)

      if (error) throw error

      if (data && data.length > 0) {
        const portfolio = data[0]
        setPortfolioTitle(portfolio.title)
        loadLayout(portfolio.layout_json.blocks || [])
      }
    } catch (error) {
      console.error('Error loading portfolio:', error)
    }
  }

  const handleAddBlock = (type: 'text' | 'image' | 'button' | 'grid') => {
    const blockId = `${type}-${Date.now()}`
    
    let defaultContent
    switch (type) {
      case 'text':
        defaultContent = {
          text: 'Your text here',
          fontSize: 16,
          fontWeight: 'normal',
          color: '#000000',
          textAlign: 'left'
        }
        break
      case 'image':
        defaultContent = {
          src: '',
          alt: '',
          objectFit: 'cover',
          borderRadius: 0
        }
        break
      case 'button':
        defaultContent = {
          text: 'Click me',
          href: '',
          backgroundColor: '#3B82F6',
          textColor: '#FFFFFF',
          borderRadius: 6,
          padding: { x: 16, y: 8 }
        }
        break
      case 'grid':
        defaultContent = {
          columns: 2,
          gap: 16,
          items: []
        }
        break
    }

    const newBlock = {
      id: blockId,
      type,
      content: defaultContent,
      position: { x: 100, y: 100 },
      size: { width: 200, height: 100 }
    }

    addBlock(newBlock)
  }

  const handleSave = async () => {
    if (!user) return

    setSaving(true)
    try {
      const portfolioData = {
        user_id: user.id,
        title: portfolioTitle,
        layout_json: { blocks },
        updated_at: new Date().toISOString()
      }

      // Check if portfolio exists
      const { data: existing } = await supabase
        .from('portfolios')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)

      if (existing && existing.length > 0) {
        // Update existing
        const { error } = await supabase
          .from('portfolios')
          .update(portfolioData)
          .eq('id', existing[0].id)

        if (error) throw error
      } else {
        // Create new
        const { error } = await supabase
          .from('portfolios')
          .insert([{ ...portfolioData, created_at: new Date().toISOString() }])

        if (error) throw error
      }

      alert('Portfolio saved successfully!')
    } catch (error) {
      console.error('Error saving portfolio:', error)
      alert('Error saving portfolio. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const renderBlock = (block: any) => {
    switch (block.type) {
      case 'text':
        return <TextBlock id={block.id} content={block.content} />
      case 'image':
        return <ImageBlock id={block.id} content={block.content} />
      case 'button':
        return <ButtonBlock id={block.id} content={block.content} />
      default:
        return <div className="w-full h-full bg-gray-200 flex items-center justify-center">Unknown block type</div>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-100 flex">
        <BlockToolbar onAddBlock={handleAddBlock} />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  value={portfolioTitle}
                  onChange={(e) => setPortfolioTitle(e.target.value)}
                  className="text-xl font-semibold bg-transparent border-none outline-none focus:bg-gray-50 rounded px-2 py-1"
                />
                <span className="text-gray-500">•</span>
                <span className="text-gray-600">{user?.email}</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push('/')}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  Home
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </header>

          {/* Canvas */}
          <div className="flex-1 p-6 overflow-auto">
            <div className="relative bg-white rounded-lg shadow-sm border border-gray-200 min-h-[800px]">
              {blocks.map((block) => (
                <DraggableBlock key={block.id} block={block}>
                  {renderBlock(block)}
                </DraggableBlock>
              ))}
              
              {blocks.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <h3 className="text-lg font-medium mb-2">Start building your portfolio</h3>
                    <p className="text-gray-400">Drag components from the sidebar to get started</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  )
} 