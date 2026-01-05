'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export interface UserProfile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  listening_time_minutes?: number
  books_completed?: number
  current_streak?: number
  level?: string
  xp?: number
  created_at: string
  updated_at?: string
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchProfile() {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          setLoading(false)
          return
        }

        const { data, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .maybeSingle()

        // If profile doesn't exist, create it
        if (fetchError || !data) {
          // Create a new profile for this user
          const { data: newProfile, error: createError } = await supabase
            .from('users')
            .insert({
              id: user.id,
              email: user.email || '',
              full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
            })
            .select()
            .single()

          if (createError) {
            // If insert fails (might already exist), try fetching again
            const { data: existingProfile } = await supabase
              .from('users')
              .select('*')
              .eq('id', user.id)
              .single()
            
            if (existingProfile) {
              setProfile(existingProfile as UserProfile)
            } else {
              throw createError
            }
          } else if (newProfile) {
            setProfile(newProfile as UserProfile)
          }
        } else {
          setProfile(data as UserProfile)
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch profile'))
        console.error('Error fetching user profile:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const updateProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('User not authenticated')
      }

      // Check if profile exists first
      const { data: existingProfile } = await supabase
        .from('users')
        .select('id, email')
        .eq('id', user.id)
        .maybeSingle()

      let result

      if (existingProfile) {
        // Profile exists, update it
        const { data: updatedData, error: updateError } = await supabase
          .from('users')
          .update(updates)
          .eq('id', user.id)
          .select()
          .single()

        if (updateError) throw updateError
        result = updatedData
      } else {
        // Profile doesn't exist, create it with updates
        const { data: insertedData, error: insertError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email || '',
            ...updates,
          })
          .select()
          .single()

        if (insertError) throw insertError
        result = insertedData
      }

      if (result) {
        setProfile(result as UserProfile)
        return true
      }

      return false
    } catch (err) {
      console.error('Error updating profile:', err)
      setError(err instanceof Error ? err : new Error('Failed to update profile'))
      return false
    }
  }

  return {
    profile,
    loading,
    error,
    updateProfile,
    refresh: () => {
      setLoading(true)
      // Trigger refetch by updating a dependency
      setProfile(null)
    },
  }
}

