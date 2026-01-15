import { createClient } from '@/lib/supabase/server'
import type { Audiobook } from '@/types'

export async function getAllAudiobooks(): Promise<Audiobook[]> {
  const supabase = await createClient()
  
  // Query from maqal-book.audiobooks with joins to authors and categories
  const { data, error } = await supabase
    .from('audiobooks')
    .select(`
      *,
      author:authors(id, name, bio),
      category:categories(id, name, description)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching audiobooks:', error)
    return []
  }

  return (data || []).map((book: any) => ({
    id: book.id,
    title: book.title,
    author_id: book.author_id,
    author_name: book.author?.name || '',
    author_bio: book.author?.bio || null,
    category_id: book.category_id,
    category_name: book.category?.name || '',
    category_description: book.category?.description || null,
    cover: book.cover,
    duration: book.duration,
    language: book.language as 'English' | 'Arabic' | 'Somali',
    created_at: book.created_at,
    updated_at: book.updated_at,
    // Legacy fields for backward compatibility
    author: book.author?.name || '',
    category: book.category?.name || '',
  }))
}

export async function getAudiobookById(id: string): Promise<Audiobook | null> {
  const supabase = await createClient()
  
  // Query from maqal-book.audiobooks with joins to authors and categories
  const { data, error } = await supabase
    .from('audiobooks')
    .select(`
      *,
      author:authors(id, name, bio),
      category:categories(id, name, description)
    `)
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
    author_name: (data as any).author?.name || '',
    author_bio: (data as any).author?.bio || null,
    category_id: data.category_id,
    category_name: (data as any).category?.name || '',
    category_description: (data as any).category?.description || null,
    cover: data.cover,
    duration: data.duration,
    language: data.language as 'English' | 'Arabic' | 'Somali',
    created_at: data.created_at,
    updated_at: data.updated_at,
    // Legacy fields for backward compatibility
    author: (data as any).author?.name || '',
    category: (data as any).category?.name || '',
  }
}

export async function getAudiobooksByCategory(categoryId: string): Promise<Audiobook[]> {
  const supabase = await createClient()
  
  // Query from maqal-book.audiobooks with joins to authors and categories
  const { data, error } = await supabase
    .from('audiobooks')
    .select(`
      *,
      author:authors(id, name, bio),
      category:categories(id, name, description)
    `)
    .eq('category_id', categoryId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching audiobooks by category:', error)
    return []
  }

  return (data || []).map((book: any) => ({
    id: book.id,
    title: book.title,
    author_id: book.author_id,
    author_name: book.author?.name || '',
    author_bio: book.author?.bio || null,
    category_id: book.category_id,
    category_name: book.category?.name || '',
    category_description: book.category?.description || null,
    cover: book.cover,
    duration: book.duration,
    language: book.language as 'English' | 'Arabic' | 'Somali',
    created_at: book.created_at,
    updated_at: book.updated_at,
    // Legacy fields for backward compatibility
    author: book.author?.name || '',
    category: book.category?.name || '',
  }))
}

export async function getAudiobooksByLanguage(language: string): Promise<Audiobook[]> {
  const supabase = await createClient()
  
  // Query from maqal-book.audiobooks with joins to authors and categories
  const { data, error } = await supabase
    .from('audiobooks')
    .select(`
      *,
      author:authors(id, name, bio),
      category:categories(id, name, description)
    `)
    .eq('language', language)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching audiobooks by language:', error)
    return []
  }

  return (data || []).map((book: any) => ({
    id: book.id,
    title: book.title,
    author_id: book.author_id,
    author_name: book.author?.name || '',
    author_bio: book.author?.bio || null,
    category_id: book.category_id,
    category_name: book.category?.name || '',
    category_description: book.category?.description || null,
    cover: book.cover,
    duration: book.duration,
    language: book.language as 'English' | 'Arabic' | 'Somali',
    created_at: book.created_at,
    updated_at: book.updated_at,
    // Legacy fields for backward compatibility
    author: book.author?.name || '',
    category: book.category?.name || '',
  }))
}

export async function searchAudiobooks(query: string): Promise<Audiobook[]> {
  const supabase = await createClient()
  
  // Query from maqal-book.audiobooks with joins to authors and categories
  // Note: For searching author names, we need to search in the joined authors table
  const { data, error } = await supabase
    .from('audiobooks')
    .select(`
      *,
      author:authors(id, name, bio),
      category:categories(id, name, description)
    `)
    .or(`title.ilike.%${query}%`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error searching audiobooks:', error)
    return []
  }

  return (data || []).map((book: any) => ({
    id: book.id,
    title: book.title,
    author_id: book.author_id,
    author_name: book.author?.name || '',
    author_bio: book.author?.bio || null,
    category_id: book.category_id,
    category_name: book.category?.name || '',
    category_description: book.category?.description || null,
    cover: book.cover,
    duration: book.duration,
    language: book.language as 'English' | 'Arabic' | 'Somali',
    created_at: book.created_at,
    updated_at: book.updated_at,
    // Legacy fields for backward compatibility
    author: book.author?.name || '',
    category: book.category?.name || '',
  }))
}

export async function getAllCategories() {
  const supabase = await createClient()
  
  // Query from maqal-book.categories table
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
  
  // Query from maqal-book.authors table
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





