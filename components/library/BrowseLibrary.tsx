'use client'

import { useState, useRef } from 'react'
import { Library, SlidersHorizontal, Search, Heart } from 'lucide-react'
import { BookCard } from '@/components/audiobook/BookCard'
import { CategoryCard } from '@/components/audiobook/CategoryCard'
import type { Audiobook } from '@/types'

interface BrowseLibraryProps {
  audiobooks: Audiobook[]
  onPlayBook: (book: Audiobook) => void
  onToggleFavorite: (bookId: string) => void
  favorites: string[]
}

export function BrowseLibrary({
  audiobooks,
  onPlayBook,
  onToggleFavorite,
  favorites,
}: BrowseLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedLanguage, setSelectedLanguage] = useState('All')
  const [sortBy, setSortBy] = useState('popular')
  const [showFilters, setShowFilters] = useState(false)
  const audiobooksSectionRef = useRef<HTMLDivElement>(null)

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    // Scroll to audiobooks section after a short delay
    setTimeout(() => {
      audiobooksSectionRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      })
    }, 100)
  }

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language)
    // Scroll to audiobooks section after a short delay
    setTimeout(() => {
      audiobooksSectionRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      })
    }, 100)
  }

  // Get unique categories dynamically from audiobooks
  const categoryMap = new Map<string, { name: string; count: number; gradient: string; icon: string }>()
  
  // Predefined category styles
  const categoryStyles: Record<string, { gradient: string; icon: string }> = {
    'Mystery': { gradient: 'bg-gradient-to-br from-purple-500 to-indigo-600', icon: '🔍' },
    'Fantasy': { gradient: 'bg-gradient-to-br from-blue-500 to-cyan-600', icon: '🧙' },
    'Romance': { gradient: 'bg-gradient-to-br from-red-500 to-rose-600', icon: '💕' },
    'Sci-Fi': { gradient: 'bg-gradient-to-br from-teal-500 to-blue-600', icon: '🚀' },
    'Thriller': { gradient: 'bg-gradient-to-br from-orange-500 to-red-600', icon: '⚡' },
    'Non-Fiction': { gradient: 'bg-gradient-to-br from-green-500 to-emerald-600', icon: '🎓' },
    'Fiction': { gradient: 'bg-gradient-to-br from-indigo-500 to-purple-600', icon: '📖' },
  }
  
  // Count books per category
  audiobooks.forEach((book) => {
    const categoryName = book.category_name || book.category || 'Uncategorized'
    const current = categoryMap.get(categoryName) || { 
      name: categoryName, 
      count: 0, 
      gradient: 'bg-gradient-to-br from-gray-500 to-gray-600', 
      icon: '📚' 
    }
    current.count++
    categoryMap.set(categoryName, current)
  })
  
  // Apply predefined styles if available
  categoryMap.forEach((cat, name) => {
    if (categoryStyles[name]) {
      cat.gradient = categoryStyles[name].gradient
      cat.icon = categoryStyles[name].icon
    }
  })
  
  const categories = [
    { name: 'All', count: audiobooks.length, gradient: 'bg-gradient-to-br from-gray-500 to-gray-600', icon: '📚' },
    ...Array.from(categoryMap.values()).sort((a, b) => a.name.localeCompare(b.name))
  ]

  const languageCount = {
    All: audiobooks.length,
    English: audiobooks.filter((b) => b.language === 'English').length,
    Arabic: audiobooks.filter((b) => b.language === 'Arabic').length,
    Somali: audiobooks.filter((b) => b.language === 'Somali').length,
  }

  const languages = [
    { name: 'All', count: languageCount.All, gradient: 'bg-gradient-to-br from-gray-500 to-gray-600', icon: '🌍' },
    { name: 'English', count: languageCount.English, gradient: 'bg-gradient-to-br from-blue-500 to-indigo-600', icon: '🇬🇧' },
    { name: 'Arabic', count: languageCount.Arabic, gradient: 'bg-gradient-to-br from-teal-500 to-cyan-600', icon: '🇸🇦' },
    { name: 'Somali', count: languageCount.Somali, gradient: 'bg-gradient-to-br from-purple-500 to-indigo-600', icon: '🇸🇴' },
  ]

  const filteredBooks = audiobooks.filter((book) => {
    const authorName = book.author_name || book.author || ''
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      authorName.toLowerCase().includes(searchQuery.toLowerCase())
    const categoryName = book.category_name || book.category || 'Uncategorized'
    const matchesCategory = selectedCategory === 'All' || categoryName === selectedCategory
    const matchesLanguage = selectedLanguage === 'All' || book.language === selectedLanguage
    return matchesSearch && matchesCategory && matchesLanguage
  })

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (sortBy === 'title') return a.title.localeCompare(b.title)
    if (sortBy === 'author') {
      const aAuthor = a.author_name || a.author || ''
      const bAuthor = b.author_name || b.author || ''
      return aAuthor.localeCompare(bAuthor)
    }
    if (sortBy === 'duration') return a.duration.localeCompare(b.duration)
    return 0 // popular (default order)
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 pb-24 sm:pb-32">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-teal-500 p-2 sm:p-3 rounded-xl sm:rounded-2xl">
              <Library className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Browse Library</h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600">
            Discover over {audiobooks.length} audiobooks across all genres
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors bg-white text-sm sm:text-base text-gray-900"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm sm:text-base text-gray-700"
          >
            <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-semibold">Filters</span>
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-6 sm:mb-8 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-sm sm:text-base text-gray-900 bg-white"
                >
                  <option value="popular">Most Popular</option>
                  <option value="title">Title (A-Z)</option>
                  <option value="author">Author (A-Z)</option>
                  <option value="duration">Duration</option>
                </select>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-sm sm:text-base text-gray-900 bg-white"
                >
                  {categories.map((cat) => (
                    <option key={cat.name} value={cat.name}>
                      {cat.icon} {cat.name} ({cat.count})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  Language
                </label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-sm sm:text-base text-gray-900 bg-white"
                >
                  {languages.map((lang) => (
                    <option key={lang.name} value={lang.name}>
                      {lang.icon} {lang.name} ({lang.count})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Languages Grid */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Browse by Language</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {languages.map((language) => (
              <CategoryCard
                key={language.name}
                {...language}
                onClick={() => handleLanguageChange(language.name)}
              />
            ))}
          </div>
        </div>

        {/* Categories Grid */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Categories</h2>
            {selectedCategory !== 'All' && (
              <button
                onClick={() => setSelectedCategory('All')}
                className="text-sm sm:text-base text-purple-600 hover:text-purple-700 font-semibold"
              >
                Clear Filter
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
            {categories.map((category) => (
              <CategoryCard
                key={category.name}
                {...category}
                onClick={() => handleCategoryChange(category.name)}
              />
            ))}
          </div>
        </div>

        {/* Results */}
        <div ref={audiobooksSectionRef} className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            {selectedCategory === 'All' ? 'All Audiobooks' : selectedCategory}
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            {sortedBooks.length} {sortedBooks.length === 1 ? 'result' : 'results'}
          </p>
        </div>

        {/* No Results */}
        {sortedBooks.length === 0 && (
          <div className="text-center py-12 sm:py-20">
            <div className="bg-white rounded-full w-16 h-16 sm:w-24 sm:h-24 flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
              <Search className="w-8 h-8 sm:w-12 sm:h-12 text-gray-300" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">No results found</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('All')
                setSelectedLanguage('All')
              }}
              className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-500 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold hover:scale-105 transition-transform text-sm sm:text-base"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Books Grid */}
        {sortedBooks.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
            {sortedBooks.map((book) => (
              <BookCard
                key={book.id}
                {...book}
                onPlay={() => onPlayBook(book)}
                isFavorite={favorites.includes(book.id)}
                onToggleFavorite={() => onToggleFavorite(book.id)}
              />
            ))}
          </div>
        )}

        {/* Load More Button */}
        {sortedBooks.length > 0 && sortedBooks.length >= 12 && (
          <div className="text-center mt-8 sm:mt-12">
            <button className="bg-white text-gray-700 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors border-2 border-gray-200 text-sm sm:text-base">
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

