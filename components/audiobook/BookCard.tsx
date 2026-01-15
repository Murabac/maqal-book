'use client'

import Image from 'next/image'
import { Play, Heart } from 'lucide-react'
import { useState } from 'react'
import type { Audiobook } from '@/types'

interface BookCardProps extends Audiobook {
  onPlay: () => void
  isFavorite?: boolean
  onToggleFavorite?: () => void
}

export function BookCard({
  id,
  title,
  author,
  author_name,
  cover,
  duration,
  category,
  category_name,
  language,
  onPlay,
  isFavorite: externalIsFavorite,
  onToggleFavorite,
}: BookCardProps) {
  const [internalIsFavorite, setInternalIsFavorite] = useState(false)
  const isFavorite = externalIsFavorite !== undefined ? externalIsFavorite : internalIsFavorite
  const isArabic = language === 'Arabic'
  const textDirection = isArabic ? 'rtl' : 'ltr'

  const languageEmoji: Record<'English' | 'Arabic' | 'Somali', string> = {
    English: '🇬🇧',
    Arabic: '🇸🇦',
    Somali: '🇸🇴',
  }

  const languageColor: Record<'English' | 'Arabic' | 'Somali', string> = {
    English: 'bg-blue-500',
    Arabic: 'bg-teal-500',
    Somali: 'bg-purple-500',
  }

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onToggleFavorite) {
      onToggleFavorite()
    } else {
      setInternalIsFavorite(!internalIsFavorite)
    }
  }

  return (
    <div className="group relative bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      {/* Cover Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100">
        <Image
          src={cover}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={onPlay}
            className="bg-white text-purple-600 rounded-full p-3 sm:p-4 hover:scale-110 transition-transform shadow-lg"
            aria-label="Play audiobook"
          >
            <Play className="w-6 h-6 sm:w-8 sm:h-8 ml-0.5" />
          </button>
        </div>

        {/* Category Badge */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
          <span className="bg-white/90 backdrop-blur-sm text-purple-600 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium">
            {category_name || category}
          </span>
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white/90 backdrop-blur-sm rounded-full p-1.5 sm:p-2 hover:scale-110 transition-transform"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            className={`w-4 h-4 sm:w-5 sm:h-5 ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`}
          />
        </button>
      </div>

      {/* Book Info */}
      <div className="p-3 sm:p-4" dir={textDirection}>
        <h3 className={`font-semibold text-sm sm:text-base text-gray-900 mb-1 line-clamp-1 ${isArabic ? 'font-arabic' : ''}`}>
          {title}
        </h3>
        <p className={`text-xs sm:text-sm text-gray-600 mb-2 line-clamp-1 ${isArabic ? 'font-arabic' : ''}`}>
          {author_name || author}
        </p>
        <div className="flex items-center justify-between mb-2 gap-1">
          <span className="text-xs text-gray-500 truncate">{duration}</span>
          <span className={`${languageColor[language]} text-white px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 flex-shrink-0`}>
            <span>{languageEmoji[language]}</span>
            <span className="hidden xs:inline">{language}</span>
          </span>
        </div>
        <button
          onClick={onPlay}
          className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-teal-500 text-white py-1.5 sm:py-2 rounded-lg font-semibold hover:scale-105 transition-transform text-xs sm:text-sm"
        >
          Play Now
        </button>
      </div>
    </div>
  )
}

