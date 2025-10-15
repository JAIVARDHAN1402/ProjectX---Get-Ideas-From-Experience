"use client"

import { X } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

const SearchFormReset = () => {
    const reset = () =>{
        const form = document.querySelector('search-query') as HTMLFormElement;
        if(form) form.reset();
    }
  return (
    <div>
      <button type='reset' onClick={reset}>
        <Link href='/' className='search-btn text-white'></Link>
        <X className='size-5'/>
      </button>
    </div>
  )
}

export default SearchFormReset
