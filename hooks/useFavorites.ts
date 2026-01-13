'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const supabase = createClient()

  // Fetch favorites from database
  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([])
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('audiobook_id')
        .eq('user_id', user.id)

      if (error) {
        console.error('Error fetching favorites:', error)
        setFavorites([])
      } else {
        setFavorites(data?.map((fav) => fav.audiobook_id) || [])
      }
    } catch (err) {
      console.error('Error fetching favorites:', err)
      setFavorites([])
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  // Load favorites when user changes
  useEffect(() => {
    fetchFavorites()
  }, [fetchFavorites])

  // Add favorite to database
  const addFavorite = useCallback(async (audiobookId: string) => {
    if (!user) {
      throw new Error('User must be authenticated to add favorites')
    }

    try {
      const { error } = await supabase
        .from('user_favorites')
        .insert({
          user_id: user.id,
          audiobook_id: audiobookId,
        })

      if (error) {
        // If it's a unique constraint violation, the favorite already exists
        if (error.code === '23505') {
          // Already favorited, just update local state
          setFavorites((prev) => (prev.includes(audiobookId) ? prev : [...prev, audiobookId]))
          return
        }
        throw error
      }

      // Update local state
      setFavorites((prev) => (prev.includes(audiobookId) ? prev : [...prev, audiobookId]))
    } catch (err) {
      console.error('Error adding favorite:', err)
      throw err
    }
  }, [user, supabase])

  // Remove favorite from database
  const removeFavorite = useCallback(async (audiobookId: string) => {
    if (!user) {
      throw new Error('User must be authenticated to remove favorites')
    }

    try {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('audiobook_id', audiobookId)

      if (error) {
        throw error
      }

      // Update local state
      setFavorites((prev) => prev.filter((id) => id !== audiobookId))
    } catch (err) {
      console.error('Error removing favorite:', err)
      throw err
    }
  }, [user, supabase])

  // Toggle favorite (add if not exists, remove if exists)
  const toggleFavorite = useCallback(async (audiobookId: string) => {
    if (!user) {
      throw new Error('User must be authenticated to toggle favorites')
    }

    const isFavorite = favorites.includes(audiobookId)
    if (isFavorite) {
      await removeFavorite(audiobookId)
    } else {
      await addFavorite(audiobookId)
    }
  }, [user, favorites, addFavorite, removeFavorite])

  return {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    refreshFavorites: fetchFavorites,
  }
}
