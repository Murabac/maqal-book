'use client'

import { createClient } from '@/lib/supabase/client'
import type { Audiobook } from '@/types'
import { useEffect, useState } from 'react'

export function useAudiobooks() {
  const [audiobooks, setAudiobooks] = useState<Audiobook[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchAudiobooks() {
      try {
        const supabase = createClient()
        // Query from maqal-book.audiobooks with joins to authors and categories
        const { data, error } = await supabase
          .from('audiobooks')
          .select(`
            *,
            author:authors(id, name, bio),
            category:categories(id, name, description)
          `)
          .order('created_at', { ascending: false })

        if (error) throw error

        const books: Audiobook[] = (data || []).map((book: any) => ({
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

        setAudiobooks(books)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch audiobooks'))
        console.error('Error fetching audiobooks:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAudiobooks()
  }, [])

  return { audiobooks, loading, error }
}

export async function fetchAudiobooksClient(): Promise<Audiobook[]> {
  const supabase = createClient()
  
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





