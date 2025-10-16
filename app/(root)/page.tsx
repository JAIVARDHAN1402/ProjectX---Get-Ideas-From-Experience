import SearchForm from '@/components/SearchForm'
import { BackgroundRippleEffect } from '@/components/ui/background-ripple-effect'
import { ThreeDCardDemo } from '@/components/ThreeDCardDemo'
import React from 'react'
import { client } from '@/sanity/lib/client'

// ✅ Force dynamic rendering
export const dynamic = 'force-dynamic'

export default async function Home({searchParams}: {
  searchParams?: {query?: string}
}) {
  const query = searchParams?.query;
  
  // ✅ Direct client use karo with no caching
  const posts = await client.fetch(
    `*[_type == "project"]{
      _id,
      title,
      description,
      category,
      imageUrl,
      user->{
        _id,
        username,
        email,
        image,
        Bio
      }
    }`,
    {},
    {
      cache: 'no-store', // ✅ Important: No caching
      next: { tags: ['projects'] }
    }
  )

  const filteredPosts = query 
    ? posts?.filter((post: any) => {
        const matches = post.user?.username?.toLowerCase().includes(query.toLowerCase()) ||
                       post.category?.toLowerCase().includes(query.toLowerCase()) ||
                       post.description?.toLowerCase().includes(query.toLowerCase());
        return matches;
      }) || []
    : posts || [];

  return(
    <>
      <div className="relative flex h-[567px] w-full flex-col items-center justify-center overflow-hidden">
        <BackgroundRippleEffect />

        <div className="relative z-10 text-center flex items-center flex-col">
          <h2 className="mx-auto max-w-4xl text-2xl font-bold text-neutral-300 md:text-4xl lg:text-7xl dark:text-neutral-100">
            WELCOME TO PROJECTX
          </h2>
          <p className="mt-10 max-w-xl text-neutral-400 dark:text-neutral-500">
            Create Bold. Share Loud. Inspire Many.
          </p>
        </div>

        <div className="relative z-10 mt-8 w-full max-w-md text-center text-neutral-400">
          <SearchForm query={query}/>
        </div>
      </div>

      <section className='ml-15 section_container'>
        <p className='text-30 mt-7'>
          {query ? `Search results for "${query}"` : 'Projects'}
        </p>
        
        {query && (
          <div className="text-sm text-gray-500 mb-4">
            Found {filteredPosts.length} results for "{query}"
          </div>
        )}
        
        <ul className='card_grid grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 justify-center gap-6'>
          {
            filteredPosts.length > 0 ? (
              filteredPosts.map((post: any) => (
                <ThreeDCardDemo 
                  key={post._id} 
                  project={post}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className='text-gray-500 text-lg'>
                  {query ? `No projects found for "${query}"` : 'No Projects Found'}
                </p>
              </div>
            )
          }
        </ul>
      </section>
    </>
  )
}