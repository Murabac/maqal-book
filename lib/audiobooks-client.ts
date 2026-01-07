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
        const { data, error } = await supabase
          .from('audiobooks')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error

        const books: Audiobook[] = (data || []).map((book) => ({
          id: book.id,
          title: book.title,
          author: book.author,
          cover: book.cover,
          duration: book.duration,
          category: book.category,
          language: book.language as 'English' | 'Arabic' | 'Somali',
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



