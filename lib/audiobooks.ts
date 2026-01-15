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
    author_id: book.author_id,
    author_name: book.author_name || '',
    author_bio: book.author_bio || null,
    category_id: book.category_id,
    category_name: book.category_name || '',
    category_description: book.category_description || null,
    cover: book.cover,
    duration: book.duration,
    language: book.language as 'English' | 'Arabic' | 'Somali',
    created_at: book.created_at,
    updated_at: book.updated_at,
    // Legacy fields for backward compatibility
    author: book.author_name || '',
    category: book.category_name || '',
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
    author_id: data.author_id,
    author_name: data.author_name || '',
    author_bio: data.author_bio || null,
    category_id: data.category_id,
    category_name: data.category_name || '',
    category_description: data.category_description || null,
    cover: data.cover,
    duration: data.duration,
    language: data.language as 'English' | 'Arabic' | 'Somali',
    created_at: data.created_at,
    updated_at: data.updated_at,
    // Legacy fields for backward compatibility
    author: data.author_name || '',
    category: data.category_name || '',
  }
}

export async function getAudiobooksByCategory(categoryId: string): Promise<Audiobook[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('audiobooks')
    .select('*')
    .eq('category_id', categoryId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching audiobooks by category:', error)
    return []
  }

  return (data || []).map((book) => ({
    id: book.id,
    title: book.title,
    author_id: book.author_id,
    author_name: book.author_name || '',
    author_bio: book.author_bio || null,
    category_id: book.category_id,
    category_name: book.category_name || '',
    category_description: book.category_description || null,
    cover: book.cover,
    duration: book.duration,
    language: book.language as 'English' | 'Arabic' | 'Somali',
    created_at: book.created_at,
    updated_at: book.updated_at,
    // Legacy fields for backward compatibility
    author: book.author_name || '',
    category: book.category_name || '',
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
    author_id: book.author_id,
    author_name: book.author_name || '',
    author_bio: book.author_bio || null,
    category_id: book.category_id,
    category_name: book.category_name || '',
    category_description: book.category_description || null,
    cover: book.cover,
    duration: book.duration,
    language: book.language as 'English' | 'Arabic' | 'Somali',
    created_at: book.created_at,
    updated_at: book.updated_at,
    // Legacy fields for backward compatibility
    author: book.author_name || '',
    category: book.category_name || '',
  }))
}

export async function searchAudiobooks(query: string): Promise<Audiobook[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('audiobooks')
    .select('*')
    .or(`title.ilike.%${query}%,author_name.ilike.%${query}%`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error searching audiobooks:', error)
    return []
  }

  return (data || []).map((book) => ({
    id: book.id,
    title: book.title,
    author_id: book.author_id,
    author_name: book.author_name || '',
    author_bio: book.author_bio || null,
    category_id: book.category_id,
    category_name: book.category_name || '',
    category_description: book.category_description || null,
    cover: book.cover,
    duration: book.duration,
    language: book.language as 'English' | 'Arabic' | 'Somali',
    created_at: book.created_at,
    updated_at: book.updated_at,
    // Legacy fields for backward compatibility
    author: book.author_name || '',
    category: book.category_name || '',
  }))
}

export async function getAllCategories() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return data || []
}

export async function getAllAuthors() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('authors')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching authors:', error)
    return []
  }

  return data || []
}





