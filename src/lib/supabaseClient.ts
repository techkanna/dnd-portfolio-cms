import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface Portfolio {
  id: string
  user_id: string
  title: string
  layout_json: any
  created_at: string
  updated_at: string
}

export interface LayoutBlock {
  id: string
  type: 'text' | 'image' | 'button' | 'grid'
  content: any
  position: { x: number; y: number }
  size: { width: number; height: number }
} 