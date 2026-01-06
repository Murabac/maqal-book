'use client'

import { useRouter } from 'next/navigation'
import { Login } from '@/components/auth/Login'
import { Header } from '@/components/layout/Header'

export default function LoginPage() {
  const router = useRouter()

  const handleLogin = () => {
    router.push('/')
    router.refresh()
  }

  const handleSwitchToSignup = () => {
    router.push('/signup')
  }

  return (
    <>
      <Header currentPage="login" isAuthenticated={false} />
      <Login onLogin={handleLogin} onSwitchToSignup={handleSwitchToSignup} />
    </>
  )
}




