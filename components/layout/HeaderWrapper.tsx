'use client'

import { useState } from 'react'
import { Header } from './Header'

export function HeaderWrapper() {
  const [currentPage, setCurrentPage] = useState('home')
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <Header
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
    />
  )
}

