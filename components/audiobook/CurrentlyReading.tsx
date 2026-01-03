'use client'

import Image from 'next/image'
import { Play } from 'lucide-react'
import { ProgressRing } from '@/components/ui/ProgressRing'

interface CurrentlyReadingProps {
  book: {
    title: string
    author: string
    cover: string
    progress: number
    timeLeft: string
    language?: 'English' | 'Arabic' | 'Somali'
  }
  onPlay: () => void
}

export function CurrentlyReading({ book, onPlay }: CurrentlyReadingProps) {
  const isArabic = book.language === 'Arabic'
  const textDirection = isArabic ? 'rtl' : 'ltr'

  return (
    <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-teal-500 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-xl">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
        <div className="hidden sm:block">
          <ProgressRing progress={book.progress} size={120} strokeWidth={8}>
            <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <Image
                src={book.cover}
                alt={book.title}
                fill
                className="object-cover"
              />
            </div>
          </ProgressRing>
        </div>
        <div className="sm:hidden">
          <ProgressRing progress={book.progress} size={100} strokeWidth={8}>
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <Image
                src={book.cover}
                alt={book.title}
                fill
                className="object-cover"
              />
            </div>
          </ProgressRing>
        </div>
        <div className="flex-1 text-center sm:text-left w-full" dir={textDirection}>
          <div className="text-xs sm:text-sm opacity-90 mb-1">Currently Reading</div>
          <h3 className={`text-lg sm:text-xl font-semibold mb-1 ${isArabic ? 'font-arabic' : ''}`}>
            {book.title}
          </h3>
          <p className={`text-xs sm:text-sm opacity-90 mb-3 ${isArabic ? 'font-arabic' : ''}`}>
            {book.author}
          </p>
          <div className="flex items-center justify-center sm:justify-start gap-3 sm:gap-4 mb-3">
            <div className="text-xl sm:text-2xl font-bold">{book.progress}%</div>
            <div className="text-xs sm:text-sm opacity-90">{book.timeLeft} left</div>
          </div>
          <button
            onClick={onPlay}
            className="bg-white text-purple-600 px-5 sm:px-6 py-2 rounded-full font-semibold hover:scale-105 transition-transform inline-flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto justify-center"
          >
            <Play className="w-4 h-4" />
            Continue Listening
          </button>
        </div>
      </div>
    </div>
  )
}

