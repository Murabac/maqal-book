'use client'

import { useState } from 'react'
import { Search, Menu, X, Headphones, User, Heart, Library, LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter, usePathname } from 'next/navigation'
import { PageType } from '@/types'

interface HeaderProps {
  currentPage?: PageType
  setCurrentPage?: (page: PageType) => void
  searchQuery?: string
  setSearchQuery?: (query: string) => void
  isAuthenticated?: boolean
}

export function Header({
  currentPage,
  setCurrentPage,
  searchQuery,
  setSearchQuery,
  isAuthenticated = false,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // Determine current page from pathname if not provided
  const getCurrentPage = (): PageType => {
    if (currentPage) return currentPage
    if (pathname === '/') return 'home'
    if (pathname === '/library' || pathname === '/browse') return 'library'
    if (pathname === '/favorites') return 'favorites'
    if (pathname === '/profile' || pathname.startsWith('/profile')) return 'profile'
    if (pathname === '/login') return 'login'
    if (pathname === '/signup') return 'signup'
    return 'home'
  }

  const activePage = getCurrentPage()
  const isHomePage = activePage === 'home'

  const handleNavigation = (path: string) => {
    setMobileMenuOpen(false)
    router.push(path)
  }

  const handleLogout = async () => {
    await signOut()
    router.push('/')
    router.refresh()
  }
  
  return (
    <header className={`sticky top-0 z-40 border-b border-gray-200 ${
      isHomePage ? 'bg-white/80 backdrop-blur-lg' : 'bg-white'
    }`}>
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2">
          {/* Logo */}
          <button
            onClick={() => handleNavigation('/')}
            className="flex items-center gap-1.5 sm:gap-2 hover:opacity-80 transition-opacity flex-shrink-0"
          >
            <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-teal-500 p-1.5 sm:p-2 rounded-xl">
              <Headphones className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-500 bg-clip-text text-transparent">
              <span className="hidden sm:inline">Maqal Book</span>
              <span className="sm:hidden">Maqal</span>
            </h1>
          </button>

          {/* Search Bar - Desktop */}
          {searchQuery !== undefined && setSearchQuery && (
            <div className="hidden md:flex items-center flex-1 max-w-xl mx-4 lg:mx-8">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search audiobooks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 sm:py-3 rounded-full border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors text-sm sm:text-base text-gray-900 bg-white"
                />
              </div>
            </div>
          )}

          {/* Navigation - Desktop */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => handleNavigation('/library')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                activePage === 'library'
                  ? 'bg-gradient-to-r from-purple-600 via-blue-600 to-teal-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Library className="w-4 h-4" />
              <span>Library</span>
            </button>
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => handleNavigation('/favorites')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                    activePage === 'favorites'
                      ? 'bg-gradient-to-r from-purple-600 via-blue-600 to-teal-500 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Heart className="w-4 h-4" />
                  <span>Favorites</span>
                </button>
                <div className="relative">
                  <button
                    onClick={() => handleNavigation('/profile')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                      activePage === 'profile'
                        ? 'bg-gradient-to-r from-purple-600 via-blue-600 to-teal-500 text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </button>
                  
                  {/* User Dropdown Menu */}
                  {showUserMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowUserMenu(false)}
                      />
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-20">
                        <button
                          onClick={() => {
                            setShowUserMenu(false)
                            handleNavigation('/profile')
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        >
                          <User className="w-4 h-4" />
                          <span>My Profile</span>
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleNavigation('/login')}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-full transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => handleNavigation('/signup')}
                  className="px-4 py-2 text-sm bg-gradient-to-r from-purple-600 via-blue-600 to-teal-500 text-white rounded-full hover:opacity-90 transition-opacity"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Search */}
        {searchQuery !== undefined && setSearchQuery && (
          <div className="md:hidden mt-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search audiobooks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 rounded-full border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors text-sm text-gray-900 bg-white"
              />
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleNavigation('/library')}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all text-left ${
                  activePage === 'library'
                    ? 'bg-gradient-to-r from-purple-600 via-blue-600 to-teal-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Library className="w-5 h-5" />
                <span>Library</span>
              </button>
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => handleNavigation('/favorites')}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all text-left ${
                      activePage === 'favorites'
                        ? 'bg-gradient-to-r from-purple-600 via-blue-600 to-teal-500 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Heart className="w-5 h-5" />
                    <span>Favorites</span>
                  </button>
                  <button
                    onClick={() => handleNavigation('/profile')}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all text-left ${
                      activePage === 'profile'
                        ? 'bg-gradient-to-r from-purple-600 via-blue-600 to-teal-500 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <User className="w-5 h-5" />
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      handleLogout()
                      setMobileMenuOpen(false)
                    }}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl transition-all text-left text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleNavigation('/login')}
                    className="flex items-center justify-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => handleNavigation('/signup')}
                    className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-purple-600 via-blue-600 to-teal-500 text-white rounded-xl hover:opacity-90 transition-opacity"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

