'use client'

import { useState } from 'react'
import { Header } from './Header'
import { PageType } from '@/types'

export function HeaderWrapper() {
  const [currentPage, setCurrentPage] = useState<PageType>('home')
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


