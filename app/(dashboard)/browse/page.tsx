'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { BrowseLibrary } from '@/components/library/BrowseLibrary'
import { AudioPlayerNew } from '@/components/audiobook/AudioPlayerNew'
import { useAuth } from '@/hooks/useAuth'
import { useFavorites } from '@/hooks/useFavorites'
import { useAudiobooks } from '@/lib/audiobooks-client'
import type { Audiobook } from '@/types'

export default function BrowsePage() {
  const { user } = useAuth()
  const { audiobooks, loading: audiobooksLoading } = useAudiobooks()
  const { favorites, toggleFavorite: toggleFavoriteDb } = useFavorites()
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState('browse')
  const [currentBook, setCurrentBook] = useState<Audiobook | null>(null)

  const handlePlayBook = (book: Audiobook) => {
    if (!user) {
      router.push('/login')
      return
    }
    setCurrentBook(book)
  }

  const toggleFavorite = async (bookId: string) => {
    if (!user) {
      router.push('/login')
      return
    }
    try {
      await toggleFavoriteDb(bookId)
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
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

  if (audiobooksLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Header
        currentPage={currentPage as any}
        setCurrentPage={handlePageChange as any}
        isAuthenticated={!!user}
      />
      <BrowseLibrary
        audiobooks={audiobooks}
        onPlayBook={handlePlayBook}
        onToggleFavorite={toggleFavorite}
        favorites={favorites}
      />
      {user && <AudioPlayerNew currentBook={currentBook} />}
    </>
  )
}
