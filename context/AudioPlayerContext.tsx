'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import type { Chapter, Audiobook } from '@/types'

interface AudioPlayerContextType {
  currentBook: Audiobook | null
  currentChapter: Chapter | null
  isPlaying: boolean
  currentTime: number
  setCurrentBook: (book: Audiobook | null) => void
  setCurrentChapter: (chapter: Chapter | null) => void
  setIsPlaying: (playing: boolean) => void
  setCurrentTime: (time: number) => void
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined)

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
  const [currentBook, setCurrentBook] = useState<Audiobook | null>(null)
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)

  return (
    <AudioPlayerContext.Provider
      value={{
        currentBook,
        currentChapter,
        isPlaying,
        currentTime,
        setCurrentBook,
        setCurrentChapter,
        setIsPlaying,
        setCurrentTime,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  )
}

export function useAudioPlayerContext() {
  const context = useContext(AudioPlayerContext)
  if (context === undefined) {
    throw new Error('useAudioPlayerContext must be used within an AudioPlayerProvider')
  }
  return context
}






