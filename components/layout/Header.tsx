'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'

export function Header() {
  const { user, loading, signOut } = useAuth()

  return (
    <header className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold">
            🎧📚 Maqal
          </Link>
          
          <nav className="flex items-center gap-4">
            <Link href="/browse" className="text-sm hover:underline">
              Browse
            </Link>
            {user ? (
              <>
                <Link href="/library" className="text-sm hover:underline">
                  My Library
                </Link>
                <Button variant="ghost" size="sm" onClick={signOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

