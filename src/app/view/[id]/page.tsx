'use client'

import { useEffect, useState } from 'react'
import { supabase, Portfolio, LayoutBlock } from '@/lib/supabaseClient'

interface ViewPageProps {
  params: {
    id: string
  }
}

export default function ViewPage({ params }: ViewPageProps) {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPortfolio()
  }, [params.id])

  const fetchPortfolio = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          setError('Portfolio not found')
        } else {
          setError('Failed to load portfolio')
        }
        return
      }

      setPortfolio(data)
    } catch (err) {
      console.error('Error fetching portfolio:', err)
      setError('Failed to load portfolio')
    } finally {
      setLoading(false)
    }
  }

  const renderBlock = (block: LayoutBlock) => {
    const blockStyle = {
      position: 'absolute' as const,
      left: block.position.x,
      top: block.position.y,
      width: block.size.width,
      height: block.size.height,
    }

    switch (block.type) {
      case 'text':
        return (
          <div
            key={block.id}
            style={{
              ...blockStyle,
              fontSize: block.content.fontSize,
              fontWeight: block.content.fontWeight,
              color: block.content.color,
              textAlign: block.content.textAlign,
            }}
            className="p-2"
          >
            {block.content.text}
          </div>
        )

      case 'image':
        return (
          <div
            key={block.id}
            style={blockStyle}
            className="overflow-hidden"
          >
            {block.content.src && (
              <img
                src={block.content.src}
                alt={block.content.alt}
                className="w-full h-full"
                style={{
                  objectFit: block.content.objectFit,
                  borderRadius: block.content.borderRadius,
                }}
              />
            )}
          </div>
        )

      case 'button':
        const ButtonComponent = block.content.href ? 'a' : 'div'
        return (
          <div
            key={block.id}
            style={blockStyle}
            className="flex items-center justify-center"
          >
            <ButtonComponent
              {...(block.content.href && { 
                href: block.content.href, 
                target: '_blank', 
                rel: 'noopener noreferrer' 
              })}
              className="transition-all duration-200 hover:scale-105 font-medium cursor-pointer"
              style={{
                backgroundColor: block.content.backgroundColor,
                color: block.content.textColor,
                borderRadius: block.content.borderRadius,
                paddingLeft: block.content.padding.x,
                paddingRight: block.content.padding.x,
                paddingTop: block.content.padding.y,
                paddingBottom: block.content.padding.y,
              }}
            >
              {block.content.text}
            </ButtonComponent>
          </div>
        )

      case 'grid':
        return (
          <div
            key={block.id}
            style={{
              ...blockStyle,
              display: 'grid',
              gridTemplateColumns: `repeat(${block.content.columns}, 1fr)`,
              gap: block.content.gap,
            }}
          >
            {block.content.items?.map((item: any, index: number) => (
              <div key={index} className="bg-gray-100 p-4 rounded">
                {item.content || `Grid item ${index + 1}`}
              </div>
            ))}
          </div>
        )

      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Oops!</h1>
          <p className="text-xl text-gray-600 mb-8">{error}</p>
          <a
            href="/"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    )
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Portfolio Not Found</h1>
          <p className="text-xl text-gray-600 mb-8">The portfolio you're looking for doesn't exist.</p>
          <a
            href="/"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    )
  }

  const blocks = portfolio.layout_json?.blocks || []

  return (
    <div className="min-h-screen bg-white">
      {/* Optional: Add a subtle header */}
      <div className="fixed top-4 right-4 z-50">
        <div className="bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
          {portfolio.title}
        </div>
      </div>

      {/* Portfolio Canvas */}
      <div className="relative w-full min-h-screen">
        {blocks.map(renderBlock)}
        
        {blocks.length === 0 && (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center text-gray-500">
              <h2 className="text-2xl font-semibold mb-2">Empty Portfolio</h2>
              <p>This portfolio hasn't been set up yet.</p>
            </div>
          </div>
        )}
      </div>

      {/* Powered by footer */}
      <div className="fixed bottom-4 left-4 z-50">
        <div className="bg-white bg-opacity-90 text-gray-600 px-3 py-1 rounded-full text-xs border">
          Built with Portfolio CMS
        </div>
      </div>
    </div>
  )
} 