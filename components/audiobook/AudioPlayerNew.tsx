'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react'
import { Slider } from '@/components/ui/slider'
import type { Audiobook } from '@/types'

interface AudioPlayerProps {
  currentBook: Audiobook | null
}

export function AudioPlayerNew({ currentBook }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(100)
  const [volume, setVolume] = useState(70)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false)
            return 0
          }
          return prev + 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, duration])

  if (!currentBook) {
    return null
  }

  const isArabic = currentBook.language === 'Arabic'
  const textDirection = isArabic ? 'rtl' : 'ltr'

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-purple-600 via-blue-600 to-teal-500 text-white shadow-2xl z-50">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Book Info */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-shrink">
            <div className="relative w-10 h-10 sm:w-14 sm:h-14 rounded-lg overflow-hidden shadow-lg flex-shrink-0">
              <Image
                src={currentBook.cover}
                alt={currentBook.title}
                fill
                className="object-cover"
              />
            </div>
            <div className={`hidden xs:block min-w-0 ${isArabic ? 'font-arabic' : ''}`} dir={textDirection}>
              <div className="font-semibold text-xs sm:text-sm truncate">{currentBook.title}</div>
              <div className="text-xs opacity-90 truncate">{currentBook.author_name || currentBook.author}</div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex-1 flex flex-col items-center gap-1.5 sm:gap-2 min-w-0">
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => setCurrentTime(Math.max(0, currentTime - 15))}
                className="hover:scale-110 transition-transform p-1 sm:p-0"
                aria-label="Skip back 15 seconds"
              >
                <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="bg-white text-purple-600 rounded-full p-2 sm:p-3 hover:scale-110 transition-transform shadow-lg"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 sm:w-6 sm:h-6" />
                ) : (
                  <Play className="w-4 h-4 sm:w-6 sm:h-6 ml-0.5" />
                )}
              </button>
              <button
                onClick={() => setCurrentTime(Math.min(duration, currentTime + 15))}
                className="hover:scale-110 transition-transform p-1 sm:p-0"
                aria-label="Skip forward 15 seconds"
              >
                <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-xl flex items-center gap-1 sm:gap-2">
              <span className="text-xs min-w-[35px] sm:min-w-[40px] text-right">{formatTime(currentTime)}</span>
              <Slider
                value={[currentTime]}
                max={duration}
                step={1}
                onValueChange={(value) => setCurrentTime(value[0])}
                className="flex-1 [&_[data-slot=slider-track]]:bg-white/30 [&_[data-slot=slider-range]]:bg-white [&_[data-slot=slider-thumb]]:bg-white [&_[data-slot=slider-thumb]]:border-white"
              />
              <span className="text-xs min-w-[35px] sm:min-w-[40px]">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume */}
          <div className="hidden md:flex items-center gap-2 min-w-[150px]">
            <Volume2 className="w-5 h-5" />
            <Slider
              value={[volume]}
              max={100}
              step={1}
              onValueChange={(value) => setVolume(value[0])}
              className="w-24 [&_[data-slot=slider-track]]:bg-white/30 [&_[data-slot=slider-range]]:bg-white [&_[data-slot=slider-thumb]]:bg-white [&_[data-slot=slider-thumb]]:border-white"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

