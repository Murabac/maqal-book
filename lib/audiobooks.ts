import { createClient } from '@/lib/supabase/server'
import type { Audiobook } from '@/types'

export async function getAllAudiobooks(): Promise<Audiobook[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('audiobooks')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching audiobooks:', error)
    return []
  }

  return (data || []).map((book) => ({
    id: book.id,
    title: book.title,
    author: book.author,
    cover: book.cover,
    duration: book.duration,
    category: book.category,
    language: book.language as 'English' | 'Arabic' | 'Somali',
  }))
}

export async function getAudiobookById(id: string): Promise<Audiobook | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('audiobooks')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching audiobook:', error)
    return null
  }

  if (!data) return null

  return {
    id: data.id,
    title: data.title,
    author: data.author,
    cover: data.cover,
    duration: data.duration,
    category: data.category,
    language: data.language as 'English' | 'Arabic' | 'Somali',
  }
}

export async function getAudiobooksByCategory(category: string): Promise<Audiobook[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('audiobooks')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching audiobooks by category:', error)
    return []
  }

  return (data || []).map((book) => ({
    id: book.id,
    title: book.title,
    author: book.author,
    cover: book.cover,
    duration: book.duration,
    category: book.category,
    language: book.language as 'English' | 'Arabic' | 'Somali',
  }))
}

export async function getAudiobooksByLanguage(language: string): Promise<Audiobook[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('audiobooks')
    .select('*')
    .eq('language', language)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching audiobooks by language:', error)
    return []
  }

  return (data || []).map((book) => ({
    id: book.id,
    title: book.title,
    author: book.author,
    cover: book.cover,
    duration: book.duration,
    category: book.category,
    language: book.language as 'English' | 'Arabic' | 'Somali',
  }))
}

export async function searchAudiobooks(query: string): Promise<Audiobook[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('audiobooks')
    .select('*')
    .or(`title.ilike.%${query}%,author.ilike.%${query}%`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error searching audiobooks:', error)
    return []
  }

  return (data || []).map((book) => ({
    id: book.id,
    title: book.title,
    author: book.author,
    cover: book.cover,
    duration: book.duration,
    category: book.category,
    language: book.language as 'English' | 'Arabic' | 'Somali',
  }))
}

