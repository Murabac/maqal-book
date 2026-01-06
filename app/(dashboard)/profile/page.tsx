'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { UserProfile } from '@/components/user/UserProfile'
import { AudioPlayerNew } from '@/components/audiobook/AudioPlayerNew'
import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'
import type { Audiobook } from '@/types'

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState<'profile'>('profile')
  const [currentBook, setCurrentBook] = useState<Audiobook | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
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

  const handlePlayBook = (book: Audiobook) => {
    setCurrentBook(book)
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

  return (
    <>
      <Header
        currentPage={currentPage}
        setCurrentPage={handlePageChange as any}
        isAuthenticated={!!user}
      />
      <UserProfile onPlayBook={handlePlayBook} />
      {user && <AudioPlayerNew currentBook={currentBook} />}
    </>
  )
}


