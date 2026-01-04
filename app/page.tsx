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
import type { Audiobook } from '@/types'

type PageType = 'home' | 'profile' | 'login' | 'signup' | 'favorites' | 'library'

export default function Home() {
  const [currentBook, setCurrentBook] = useState<Audiobook | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState<PageType>('home')
  const [favorites, setFavorites] = useState<string[]>([])
  const { user, loading: authLoading } = useAuth()
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

  const audiobooks: Audiobook[] = [
    {
      id: '1',
      title: 'The Midnight Library',
      author: 'Matt Haig',
      cover: 'https://images.unsplash.com/photo-1604435062356-a880b007922c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
      duration: '8h 30m',
      category: 'Mystery',
      language: 'English',
    },
    {
      id: '2',
      title: 'The Starless Sea',
      author: 'Erin Morgenstern',
      cover: 'https://images.unsplash.com/photo-1730451309552-44e5690629dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
      duration: '12h 15m',
      category: 'Fantasy',
      language: 'English',
    },
    {
      id: '3',
      title: 'Beach Read',
      author: 'Emily Henry',
      cover: 'https://images.unsplash.com/photo-1711185896459-063a3ccdeced?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
      duration: '6h 45m',
      category: 'Romance',
      language: 'English',
    },
    {
      id: '4',
      title: 'Project Hail Mary',
      author: 'Andy Weir',
      cover: 'https://images.unsplash.com/photo-1759234008322-70456fcf6aec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
      duration: '10h 20m',
      category: 'Sci-Fi',
      language: 'English',
    },
    {
      id: '5',
      title: 'The Silent Patient',
      author: 'Alex Michaelides',
      cover: 'https://images.unsplash.com/photo-1760696473709-a7da66ee87a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
      duration: '7h 10m',
      category: 'Thriller',
      language: 'English',
    },
    {
      id: '6',
      title: 'Where the Crawdads Sing',
      author: 'Delia Owens',
      cover: 'https://images.unsplash.com/photo-1758796629109-4f38e9374f45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
      duration: '11h 5m',
      category: 'Fiction',
      language: 'English',
    },
    {
      id: '7',
      title: 'ألف ليلة وليلة',
      author: 'مجهول',
      cover: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
      duration: '15h 20m',
      category: 'Fantasy',
      language: 'Arabic',
    },
    {
      id: '8',
      title: 'الأيام',
      author: 'طه حسين',
      cover: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
      duration: '5h 45m',
      category: 'Non-Fiction',
      language: 'Arabic',
    },
    {
      id: '9',
      title: 'رجال في الشمس',
      author: 'غسان كنفاني',
      cover: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
      duration: '3h 30m',
      category: 'Fiction',
      language: 'Arabic',
    },
    {
      id: '10',
      title: 'عزازيل',
      author: 'يوسف زيدان',
      cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
      duration: '9h 15m',
      category: 'Mystery',
      language: 'Arabic',
    },
    {
      id: '11',
      title: 'موسم الهجرة إلى الشمال',
      author: 'الطيب صالح',
      cover: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
      duration: '6h 20m',
      category: 'Fiction',
      language: 'Arabic',
    },
    {
      id: '12',
      title: 'قواعد العشق الأربعون',
      author: 'إليف شافاق',
      cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
      duration: '11h 40m',
      category: 'Romance',
      language: 'Arabic',
    },
    {
      id: '13',
      title: 'Aqoondarro waa Iftiin la\'aan',
      author: 'Maxamed Daahir Afrax',
      cover: 'https://images.unsplash.com/photo-1519682577862-22b62b24e493?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
      duration: '7h 50m',
      category: 'Non-Fiction',
      language: 'Somali',
    },
    {
      id: '14',
      title: 'Hal aan tebayey',
      author: 'Maxamed Ibrahim Warsame',
      cover: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
      duration: '4h 30m',
      category: 'Fiction',
      language: 'Somali',
    },
    {
      id: '15',
      title: 'Gardarro iyo Geesinnimo',
      author: 'Faarax M.J. Cawl',
      cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
      duration: '6h 10m',
      category: 'Thriller',
      language: 'Somali',
    },
    {
      id: '16',
      title: 'Sheekooyin Soomaaliyeed',
      author: 'Muuse Cumar',
      cover: 'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
      duration: '8h 25m',
      category: 'Fantasy',
      language: 'Somali',
    },
    {
      id: '17',
      title: 'Taariikh Soomaaliya',
      author: 'Cali Sugulle',
      cover: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
      duration: '10h 5m',
      category: 'Non-Fiction',
      language: 'Somali',
    },
    {
      id: '18',
      title: 'Jacayl iyo Cadar',
      author: 'Maryan Mursal',
      cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
      duration: '5h 35m',
      category: 'Romance',
      language: 'Somali',
    },
  ]

  const categories = [
    { name: 'Mystery', count: 124, gradient: 'bg-gradient-to-br from-purple-500 to-indigo-600', icon: '🔍' },
    { name: 'Fantasy', count: 98, gradient: 'bg-gradient-to-br from-blue-500 to-cyan-600', icon: '🧙' },
    { name: 'Romance', count: 156, gradient: 'bg-gradient-to-br from-teal-500 to-cyan-600', icon: '💕' },
    { name: 'Sci-Fi', count: 87, gradient: 'bg-gradient-to-br from-blue-500 to-indigo-600', icon: '🚀' },
    { name: 'Thriller', count: 112, gradient: 'bg-gradient-to-br from-indigo-500 to-purple-600', icon: '⚡' },
    { name: 'Non-Fiction', count: 203, gradient: 'bg-gradient-to-br from-teal-500 to-blue-600', icon: '📚' },
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
          {audiobooks.map((book) => (
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
          {[...audiobooks].reverse().map((book) => (
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
