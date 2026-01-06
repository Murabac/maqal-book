'use client'

import { useRouter } from 'next/navigation'
import { Signup } from '@/components/auth/Signup'
import { Header } from '@/components/layout/Header'

export default function SignupPage() {
  const router = useRouter()

  const handleSignup = () => {
    router.push('/')
    router.refresh()
  }

  const handleSwitchToLogin = () => {
    router.push('/login')
  }

  return (
    <>
      <Header currentPage="signup" isAuthenticated={false} />
      <Signup onSignup={handleSignup} onSwitchToLogin={handleSwitchToLogin} />
    </>
  )
}




