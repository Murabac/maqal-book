'use client'

import { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface NavigationContextType {
  isNavigating: boolean
  setNavigating: (value: boolean) => void
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [isNavigating, setIsNavigating] = useState(false)
  const router = useRouter()
  const warmedUpRef = useRef(false)

  useEffect(() => {
    // Warm up the navigation system when page becomes visible (user returns to tab)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Prefetch common routes immediately when tab becomes visible
        const commonRoutes = ['/library', '/favorites', '/profile', '/login', '/signup']
        
        // Use requestIdleCallback if available, otherwise setTimeout
        const schedulePrefetch = (callback: () => void) => {
          if ('requestIdleCallback' in window) {
            requestIdleCallback(callback, { timeout: 500 })
          } else {
            setTimeout(callback, 50)
          }
        }

        // Prefetch routes in the background (non-blocking)
        schedulePrefetch(() => {
          commonRoutes.forEach(route => {
            try {
              router.prefetch(route)
            } catch (error) {
              // Ignore prefetch errors
            }
          })
        })
      }
    }

    // Warm up immediately if page is already visible
    if (document.visibilityState === 'visible') {
      handleVisibilityChange()
    }

    // Warm up every time tab becomes visible (not just once)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [router])

  return (
    <NavigationContext.Provider value={{ isNavigating, setNavigating: setIsNavigating }}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider')
  }
  return context
}

