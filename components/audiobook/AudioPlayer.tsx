'use client'

import { useRef, useEffect } from 'react'
import { useAudioPlayer } from '@/hooks/useAudioPlayer'
import { useAudioPlayerContext } from '@/context/AudioPlayerContext'
import { Button } from '@/components/ui/Button'
import { formatDuration } from '@/lib/utils'

export function AudioPlayer() {
  const { currentChapter, isPlaying, currentTime, setIsPlaying, setCurrentTime } = useAudioPlayerContext()
  const { audioRef, duration, togglePlayPause, seek } = useAudioPlayer({
    src: currentChapter?.audio_url,
    onTimeUpdate: (time) => setCurrentTime(time),
    onEnded: () => setIsPlaying(false),
  })

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play()
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying, audioRef])

  if (!currentChapter) {
    return null
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={togglePlayPause}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? '⏸' : '▶'}
          </Button>
          
          <div className="flex-1">
            <div className="text-sm font-medium mb-1">{currentChapter.title}</div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={(e) => seek(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-xs text-muted-foreground min-w-[80px] text-right">
                {formatDuration(currentTime)} / {formatDuration(duration)}
              </span>
            </div>
          </div>
        </div>
      </div>
      <audio ref={audioRef} />
    </div>
  )
}




