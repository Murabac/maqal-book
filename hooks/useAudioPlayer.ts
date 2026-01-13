'use client'

import { useState, useRef, useEffect } from 'react'

interface UseAudioPlayerProps {
  src?: string
  onTimeUpdate?: (currentTime: number) => void
  onEnded?: () => void
}

export function useAudioPlayer({ src, onTimeUpdate, onEnded }: UseAudioPlayerProps = {}) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => {
      setCurrentTime(audio.currentTime)
      onTimeUpdate?.(audio.currentTime)
    }

    const updateDuration = () => {
      setDuration(audio.duration)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      onEnded?.()
    }

    const handleLoadStart = () => setIsLoading(true)
    const handleCanPlay = () => setIsLoading(false)

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('loadstart', handleLoadStart)
    audio.addEventListener('canplay', handleCanPlay)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('loadstart', handleLoadStart)
      audio.removeEventListener('canplay', handleCanPlay)
    }
  }, [onTimeUpdate, onEnded])

  useEffect(() => {
    if (src && audioRef.current) {
      audioRef.current.src = src
    }
  }, [src])

  const play = () => {
    audioRef.current?.play()
    setIsPlaying(true)
  }

  const pause = () => {
    audioRef.current?.pause()
    setIsPlaying(false)
  }

  const togglePlayPause = () => {
    if (isPlaying) {
      pause()
    } else {
      play()
    }
  }

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  return {
    audioRef,
    isPlaying,
    currentTime,
    duration,
    isLoading,
    play,
    pause,
    togglePlayPause,
    seek,
  }
}







