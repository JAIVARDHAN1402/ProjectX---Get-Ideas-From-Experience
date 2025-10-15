"use client";

import { Cross, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import SearchFormReset from './SearchFormReset'

const SearchForm = ({ query }: { query?: string }) => {
  const [searchQuery, setSearchQuery] = useState(query || '')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Update the URL with the search query
      router.push(`/?query=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      // If search query is empty, redirect to home without query params
      router.push('/')
    }
  }

  const handleReset = () => {
    setSearchQuery('')
    router.push('/')
  }

  return (
    <div>
      <form className='relative' onSubmit={handleSubmit}>
        <div className='flex relative search-form border-2 py-2 px-2 gap-10 bg-gray-900 rounded-3xl'>
          <input 
            type="text" 
            name='search-query' 
            className='search-input outline-none bg-transparent text-white w-full' 
            placeholder='Search Projects' 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className='flex gap-3'>
            {query && (
              <button 
                type="button" 
                onClick={handleReset}
                className='text-white rounded-full p-2 hover:bg-gray-700'
              >
                <Cross className='size-5'/>
              </button>
            )}
            <button type='submit' className='text-black bg-amber-50 rounded-full p-2 hover:bg-amber-100'>
              <Search className='size-5'/>
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default SearchForm