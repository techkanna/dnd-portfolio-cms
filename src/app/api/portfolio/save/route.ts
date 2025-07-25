import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, title, layout_json } = body

    if (!user_id || !title || !layout_json) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if portfolio exists for this user
    const { data: existing, error: checkError } = await supabase
      .from('portfolios')
      .select('id')
      .eq('user_id', user_id)
      .limit(1)

    if (checkError) {
      console.error('Error checking existing portfolio:', checkError)
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      )
    }

    const portfolioData = {
      user_id,
      title,
      layout_json,
      updated_at: new Date().toISOString()
    }

    let result

    if (existing && existing.length > 0) {
      // Update existing portfolio
      result = await supabase
        .from('portfolios')
        .update(portfolioData)
        .eq('id', existing[0].id)
        .select()
    } else {
      // Create new portfolio
      result = await supabase
        .from('portfolios')
        .insert([{ ...portfolioData, created_at: new Date().toISOString() }])
        .select()
    }

    if (result.error) {
      console.error('Error saving portfolio:', result.error)
      return NextResponse.json(
        { error: 'Failed to save portfolio' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      portfolio: result.data[0]
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get('user_id')

    if (!user_id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching portfolios:', error)
      return NextResponse.json(
        { error: 'Failed to fetch portfolios' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      portfolios: data
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 