'use client'

import { useEffect, useState, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useNavigation } from '@/context/NavigationContext'

export function NavigationProgress() {
  const pathname = usePathname()
  const { isNavigating, setNavigating } = useNavigation()
  const [progress, setProgress] = useState(0)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const isReadyRef = useRef(false)

  // Ensure component is ready and event listeners are active
  useEffect(() => {
    // Force initialization to ensure listeners are registered
    if (!isReadyRef.current) {
      isReadyRef.current = true
      // Pre-allocate progress bar visibility
      setNavigating(false)
    }
  }, [setNavigating])

  // Re-initialize listeners when page becomes visible (after being idle)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Ensure listeners are still active after tab becomes visible
        // This helps with the first click after returning to the tab
        isReadyRef.current = true
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  useEffect(() => {
    // High-priority click handler for immediate response
    const handleClick = (e: MouseEvent) => {
      // Check if this is likely a navigation action
      const target = e.target as HTMLElement
      const link = target.closest('a[href]')
      
      if (link) {
        const href = link.getAttribute('href')
        // Only handle internal navigation links
        if (href && href.startsWith('/') && !href.startsWith('#') && !link.hasAttribute('download')) {
          // CRITICAL: Use synchronous state update for immediate visual feedback
          // This must happen synchronously, before any async operations
          setNavigating(true)
          setProgress(10)
          
          // Clear any existing interval
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current)
          }
          
          // Start progress animation
          let currentProgress = 10
          progressIntervalRef.current = setInterval(() => {
            currentProgress += Math.random() * 12 + 3
            if (currentProgress < 85) {
              setProgress(currentProgress)
            }
          }, 40)
        }
      }
    }

    // Use capture phase AND make it non-passive for immediate execution
    // This ensures we catch the event as early as possible
    const options = { capture: true, passive: false } as AddEventListenerOptions
    document.addEventListener('click', handleClick, options)

    // Also listen for pointerdown (even earlier than click)
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a[href]')
      
      if (link) {
        const href = link.getAttribute('href')
        if (href && href.startsWith('/') && !href.startsWith('#') && !link.hasAttribute('download')) {
          // Start showing progress on pointerdown for even faster feedback
          setNavigating(true)
          setProgress(5)
        }
      }
    }
    
    document.addEventListener('pointerdown', handlePointerDown, { capture: true, passive: true })

    return () => {
      document.removeEventListener('click', handleClick, options)
      document.removeEventListener('pointerdown', handlePointerDown, { capture: true })
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
        progressIntervalRef.current = null
      }
    }
  }, [setNavigating])

  useEffect(() => {
    if (pathname) {
      // Route changed, complete the progress
      setProgress(100)
      
      const timer = setTimeout(() => {
        setNavigating(false)
        setProgress(0)
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current)
          progressIntervalRef.current = null
        }
      }, 150)

      return () => clearTimeout(timer)
    }
  }, [pathname, setNavigating])

  // Always render to ensure it's ready, just control visibility
  // Use inline styles for critical path to avoid CSS parsing delay
  return (
    <div 
      className="fixed top-0 left-0 right-0 z-[100] h-1 bg-gray-200/50 pointer-events-none"
      style={{
        opacity: isNavigating ? 1 : 0,
        transition: 'opacity 50ms ease-out',
        willChange: 'opacity',
      }}
    >
      <div 
        className="h-full bg-gradient-to-r from-purple-600 via-blue-600 to-teal-500"
        style={{ 
          width: `${Math.min(progress, 100)}%`,
          transition: 'width 75ms ease-out',
          willChange: 'width',
        }}
      />
    </div>
  )
}

