'use client'

import { EditProfile } from '@/components/user/EditProfile'
import { Header } from '@/components/layout/Header'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function EditProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState<'profile' | 'edit-profile'>('edit-profile')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <>
      <Header
        currentPage={currentPage}
        setCurrentPage={(page) => {
          if (page === 'profile') {
            router.push('/profile')
          } else {
            setCurrentPage(page as any)
          }
        }}
        isAuthenticated={!!user}
      />
      <EditProfile />
    </>
  )
}




