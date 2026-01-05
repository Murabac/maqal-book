'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Favorites } from '@/components/favorites/Favorites'
import { AudioPlayerNew } from '@/components/audiobook/AudioPlayerNew'
import { useAuth } from '@/hooks/useAuth'
import { useAudiobooks } from '@/lib/audiobooks-client'
import type { Audiobook } from '@/types'

export default function FavoritesPage() {
  const { user, loading: authLoading } = useAuth()
  const { audiobooks, loading: audiobooksLoading } = useAudiobooks()
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState<'favorites'>('favorites')
  const [currentBook, setCurrentBook] = useState<Audiobook | null>(null)
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  const handlePlayBook = (book: Audiobook) => {
    if (!user) {
      router.push('/login')
      return
    }
    setCurrentBook(book)
  }

  const toggleFavorite = (bookId: string) => {
    if (!user) {
      router.push('/login')
      return
    }
    setFavorites((prev) =>
      prev.includes(bookId) ? prev.filter((id) => id !== bookId) : [...prev, bookId]
    )
  }

  const handlePageChange = (page: string) => {
    if (page === 'home') {
      router.push('/')
    } else if (page === 'library') {
      router.push('/library')
    } else if (page === 'favorites') {
      router.push('/favorites')
    } else if (page === 'profile') {
      router.push('/profile')
    } else if (page === 'login') {
      router.push('/login')
    } else if (page === 'signup') {
      router.push('/signup')
    }
  }

  if (authLoading || audiobooksLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const favoriteBooks = audiobooks.filter((book) => favorites.includes(book.id))

  return (
    <>
      <Header
        currentPage={currentPage}
        setCurrentPage={handlePageChange as any}
        isAuthenticated={!!user}
      />
      <Favorites
        favorites={favoriteBooks}
        onPlayBook={handlePlayBook}
        onRemoveFavorite={toggleFavorite}
      />
      {user && <AudioPlayerNew currentBook={currentBook} />}
    </>
  )
}

