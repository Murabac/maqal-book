'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Heart, Clock, Play, X } from 'lucide-react'
import { BookCard } from '@/components/audiobook/BookCard'
import type { Audiobook } from '@/types'

interface FavoritesProps {
  favorites: Audiobook[]
  onPlayBook: (book: Audiobook) => void
  onRemoveFavorite: (bookId: string) => void
}

export function Favorites({ favorites, onPlayBook, onRemoveFavorite }: FavoritesProps) {
  // Get unique categories from favorites
  const categorySet = new Set<string>()
  favorites.forEach((book) => {
    const categoryName = book.category_name || book.category
    if (categoryName) categorySet.add(categoryName)
  })
  const categories = ['All', ...Array.from(categorySet).sort()]
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredFavorites =
    selectedCategory === 'All'
      ? favorites
      : favorites.filter((book) => {
          const categoryName = book.category_name || book.category
          return categoryName === selectedCategory
        })

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 pb-24 sm:pb-32">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-teal-500 p-2 sm:p-3 rounded-xl sm:rounded-2xl">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Your Favorites</h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600">
            {favorites.length} {favorites.length === 1 ? 'audiobook' : 'audiobooks'} saved
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-6 sm:mb-8 flex flex-wrap gap-2 sm:gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-full font-semibold transition-all text-xs sm:text-sm ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-purple-600 via-blue-600 to-teal-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Empty State */}
        {filteredFavorites.length === 0 && (
          <div className="text-center py-12 sm:py-20">
            <div className="bg-white rounded-full w-16 h-16 sm:w-24 sm:h-24 flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
              <Heart className="w-8 h-8 sm:w-12 sm:h-12 text-gray-300" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">No favorites yet</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
              {selectedCategory === 'All'
                ? 'Start adding audiobooks to your favorites!'
                : `No ${selectedCategory} books in your favorites`}
            </p>
            <button
              onClick={() => setSelectedCategory('All')}
              className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-500 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold hover:scale-105 transition-transform text-sm sm:text-base"
            >
              Browse Library
            </button>
          </div>
        )}

        {/* Favorites Grid */}
        {filteredFavorites.length > 0 && (
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
              {filteredFavorites.map((book) => (
                <div key={book.id} className="relative group">
                  <BookCard
                    {...book}
                    onPlay={() => onPlayBook(book)}
                    isFavorite={true}
                    onToggleFavorite={() => onRemoveFavorite(book.id)}
                  />
                  <button
                    onClick={() => onRemoveFavorite(book.id)}
                    className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-red-500 text-white p-1.5 sm:p-2 rounded-full opacity-0 group-hover:opacity-100 sm:group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600 z-10"
                    title="Remove from favorites"
                    aria-label="Remove from favorites"
                  >
                    <X className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Recently Added */}
            <div className="mt-8 sm:mt-12">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Recently Added</h2>
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-md divide-y divide-gray-100">
                {filteredFavorites.slice(0, 5).map((book) => {
                  const isArabic = book.language === 'Arabic'
                  const textDirection = isArabic ? 'rtl' : 'ltr'
                  return (
                    <div
                      key={`recent-${book.id}`}
                      className="p-3 sm:p-4 hover:bg-gray-50 transition-colors cursor-pointer flex items-center gap-3 sm:gap-4"
                      onClick={() => onPlayBook(book)}
                    >
                      <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={book.cover}
                          alt={book.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0" dir={textDirection}>
                        <h4 className={`font-semibold text-sm sm:text-base text-gray-900 truncate ${isArabic ? 'font-arabic' : ''}`}>
                          {book.title}
                        </h4>
                        <p className={`text-xs sm:text-sm text-gray-600 truncate ${isArabic ? 'font-arabic' : ''}`}>
                          {book.author_name || book.author}
                        </p>
                        <div className="flex items-center gap-2 sm:gap-3 mt-1">
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {book.duration}
                          </span>
                          <span className="text-xs text-purple-600 font-semibold">
                            {book.category_name || book.category}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onPlayBook(book)
                          }}
                          className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-500 text-white p-2 sm:p-3 rounded-full hover:scale-110 transition-transform shadow-lg"
                          aria-label="Play audiobook"
                        >
                          <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onRemoveFavorite(book.id)
                          }}
                          className="text-red-500 hover:text-red-600 p-1.5 sm:p-2"
                          aria-label="Remove from favorites"
                        >
                          <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
