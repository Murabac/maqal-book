'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getCustomerData } from '@/utils/supabase/customers'
import { createCustomer } from '@/utils/supabase/customers'
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
  subscription_tier?: string
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

        // Use getCustomerData helper function to fetch from customers table
        const { data: customerData, error: fetchError } = await getCustomerData(supabase, user.id)

        // If customer doesn't exist, create it
        if (fetchError || !customerData) {
          // Create a new customer profile for this user
          const fullName = user.user_metadata?.full_name || user.user_metadata?.name || ''
          const { success, error: createError } = await createCustomer(
            supabase,
            user.id,
            user.email || '',
            fullName
          )

          if (!success) {
            console.error('Error creating customer:', createError)
            // Try fetching again in case it was created by a trigger
            const { data: retryData } = await getCustomerData(supabase, user.id)
            if (retryData) {
              setProfile(retryData as UserProfile)
            } else {
              throw createError || new Error('Failed to create customer profile')
            }
          } else {
            // Fetch the newly created customer
            const { data: newCustomerData } = await getCustomerData(supabase, user.id)
            if (newCustomerData) {
              setProfile(newCustomerData as UserProfile)
            }
          }
        } else {
          setProfile(customerData as UserProfile)
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

      // Check if customer exists first
      const { data: existingCustomer } = await getCustomerData(supabase, user.id)

      let result

      if (existingCustomer) {
        // Customer exists, update it directly (fallback if RPC not available)
        try {
          const { data: updatedData, error: updateError } = await supabase
            .from('customers')
            .update(updates)
            .eq('id', user.id)
            .select()
            .single()

          if (updateError) throw updateError
          result = updatedData
        } catch (updateErr) {
          console.error('Error updating customer:', updateErr)
          throw updateErr
        }
      } else {
        // Customer doesn't exist, create it with updates
        const fullName = updates.full_name || user.user_metadata?.full_name || user.user_metadata?.name || ''
        const { success, error: createError } = await createCustomer(
          supabase,
          user.id,
          user.email || '',
          fullName,
          updates.subscription_tier
        )

        if (!success) {
          throw createError || new Error('Failed to create customer')
        }

        // Fetch the newly created customer
        const { data: newCustomerData } = await getCustomerData(supabase, user.id)
        result = newCustomerData
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

