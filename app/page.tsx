'use client'

import { useState, useEffect } from 'react'
import { Book } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { BookCard } from '@/components/audiobook/BookCard'
import { CategoryCard } from '@/components/audiobook/CategoryCard'
import { AudioPlayerNew } from '@/components/audiobook/AudioPlayerNew'
import { Login } from '@/components/auth/Login'
import { Signup } from '@/components/auth/Signup'
import { UserProfile } from '@/components/user/UserProfile'
import { Favorites } from '@/components/favorites/Favorites'
import { BrowseLibrary } from '@/components/library/BrowseLibrary'
import { useAuth } from '@/hooks/useAuth'
import { useAudiobooks } from '@/lib/audiobooks-client'
import type { Audiobook } from '@/types'

type PageType = 'home' | 'profile' | 'login' | 'signup' | 'favorites' | 'library'

export default function Home() {
  const [currentBook, setCurrentBook] = useState<Audiobook | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState<PageType>('home')
  const [favorites, setFavorites] = useState<string[]>([])
  const { user, loading: authLoading } = useAuth()
  const { audiobooks, loading: audiobooksLoading } = useAudiobooks()
  const isAuthenticated = !!user

  // Update authentication state when user changes
  useEffect(() => {
    if (user && (currentPage === 'login' || currentPage === 'signup')) {
      setCurrentPage('home')
    }
    // Redirect to home if user logs out
    if (!user && isAuthenticated && currentPage !== 'home' && currentPage !== 'login' && currentPage !== 'signup') {
      setCurrentPage('home')
    }
  }, [user, currentPage, isAuthenticated])

  // Filter audiobooks based on search query
  const filteredAudiobooks = audiobooks.filter((book) => {
    if (!searchQuery) return true
    return (
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  // Get unique categories and calculate counts dynamically
  const categoryMap = new Map<string, number>()
  audiobooks.forEach((book) => {
    categoryMap.set(book.category, (categoryMap.get(book.category) || 0) + 1)
  })

  const categories = [
    { name: 'Mystery', count: categoryMap.get('Mystery') || 0, gradient: 'bg-gradient-to-br from-purple-500 to-indigo-600', icon: '🔍' },
    { name: 'Fantasy', count: categoryMap.get('Fantasy') || 0, gradient: 'bg-gradient-to-br from-blue-500 to-cyan-600', icon: '🧙' },
    { name: 'Romance', count: categoryMap.get('Romance') || 0, gradient: 'bg-gradient-to-br from-teal-500 to-cyan-600', icon: '💕' },
    { name: 'Sci-Fi', count: categoryMap.get('Sci-Fi') || 0, gradient: 'bg-gradient-to-br from-blue-500 to-indigo-600', icon: '🚀' },
    { name: 'Thriller', count: categoryMap.get('Thriller') || 0, gradient: 'bg-gradient-to-br from-indigo-500 to-purple-600', icon: '⚡' },
    { name: 'Non-Fiction', count: categoryMap.get('Non-Fiction') || 0, gradient: 'bg-gradient-to-br from-teal-500 to-blue-600', icon: '📚' },
  ]

  const handlePlayBook = (book: Audiobook) => {
    // Check if user is authenticated before playing
    if (!isAuthenticated) {
      setCurrentPage('login')
      return
    }
    setCurrentBook(book)
  }

  const handleLogin = () => {
    // Auth state will be updated by useAuth hook
    // Just navigate to home
    setCurrentPage('home')
  }

  const handleSignup = () => {
    // Auth state will be updated by useAuth hook
    // Just navigate to home
    setCurrentPage('home')
  }

  const toggleFavorite = (bookId: string) => {
    // Check if user is authenticated before toggling favorite
    if (!isAuthenticated) {
      setCurrentPage('login')
      return
    }
    setFavorites((prev) =>
      prev.includes(bookId) ? prev.filter((id) => id !== bookId) : [...prev, bookId]
    )
  }

  const favoriteBooks = audiobooks.filter((book) => favorites.includes(book.id))

  // Render authentication pages only when explicitly navigating to them
  if (currentPage === 'login') {
    return <Login onLogin={handleLogin} onSwitchToSignup={() => setCurrentPage('signup')} />
  }

  if (currentPage === 'signup') {
    return <Signup onSignup={handleSignup} onSwitchToLogin={() => setCurrentPage('login')} />
  }

  // Render pages based on current page
  if (currentPage === 'profile') {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      setCurrentPage('login')
      return null
    }
    return (
      <>
        <Header
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          isAuthenticated={isAuthenticated}
        />
        <UserProfile onPlayBook={handlePlayBook} />
        {isAuthenticated && <AudioPlayerNew currentBook={currentBook} />}
      </>
    )
  }

  if (currentPage === 'favorites') {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      setCurrentPage('login')
      return null
    }
    return (
      <>
        <Header
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          isAuthenticated={isAuthenticated}
        />
        <Favorites
          favorites={favoriteBooks}
          onPlayBook={handlePlayBook}
          onRemoveFavorite={toggleFavorite}
        />
        {isAuthenticated && <AudioPlayerNew currentBook={currentBook} />}
      </>
    )
  }

  if (currentPage === 'library') {
    return (
      <>
        <Header
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          isAuthenticated={isAuthenticated}
        />
        <BrowseLibrary
          audiobooks={audiobooks}
          onPlayBook={handlePlayBook}
          onToggleFavorite={toggleFavorite}
          favorites={favorites}
        />
        {isAuthenticated && <AudioPlayerNew currentBook={currentBook} />}
      </>
    )
  }

  // Show loading state
  if (audiobooksLoading || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Home page
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 pb-24 sm:pb-32">
      <Header
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isAuthenticated={isAuthenticated}
      />

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-20">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-purple-600 via-blue-600 to-teal-500 p-6 sm:p-8 md:p-12 text-white shadow-2xl">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4">
              <Book className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm">Over 10,000 audiobooks</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-3 sm:mb-4">
              Listen to Your Favorite Stories
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 opacity-95">
              Discover thousands of audiobooks across all genres. Start your journey today.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
              <button className="bg-white text-purple-600 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:scale-105 transition-transform shadow-lg text-sm sm:text-base">
                Start Free Trial
              </button>
              <button
                onClick={() => setCurrentPage('library')}
                className="bg-white/20 backdrop-blur-sm border-2 border-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:bg-white/30 transition-colors text-sm sm:text-base"
              >
                Browse Library
              </button>
            </div>
          </div>
          <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 hidden md:block">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:24px_24px]" />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 sm:px-6 mb-12 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-900">Browse by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((category) => (
            <CategoryCard key={category.name} {...category} />
          ))}
        </div>
      </section>

      {/* Featured Audiobooks */}
      <section className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Featured Audiobooks</h2>
          <button
            onClick={() => setCurrentPage('library')}
            className="text-sm sm:text-base text-purple-600 hover:text-purple-700 font-semibold"
          >
            View All →
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
          {filteredAudiobooks.slice(0, 12).map((book) => (
            <BookCard
              key={book.id}
              {...book}
              onPlay={() => handlePlayBook(book)}
              isFavorite={favorites.includes(book.id)}
              onToggleFavorite={() => toggleFavorite(book.id)}
            />
          ))}
        </div>
      </section>

      {/* Popular This Week */}
      <section className="container mx-auto px-4 sm:px-6 mt-12 sm:mt-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Popular This Week</h2>
          <button
            onClick={() => setCurrentPage('library')}
            className="text-sm sm:text-base text-purple-600 hover:text-purple-700 font-semibold"
          >
            View All →
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
          {[...filteredAudiobooks].reverse().slice(0, 12).map((book) => (
            <BookCard
              key={`popular-${book.id}`}
              {...book}
              onPlay={() => handlePlayBook(book)}
              isFavorite={favorites.includes(book.id)}
              onToggleFavorite={() => toggleFavorite(book.id)}
            />
          ))}
        </div>
      </section>

      {isAuthenticated && <AudioPlayerNew currentBook={currentBook} />}
    </div>
  )
}
