import SearchForm from '@/components/SearchForm'
import { BackgroundRippleEffect } from '@/components/ui/background-ripple-effect'
import { ThreeDCardDemo } from '@/components/ThreeDCardDemo'
import React from 'react'
import { client } from '@/sanity/lib/client' // Direct client import karo
import { PROJECT_QUERY } from '@/sanity/lib/queries'

export default async function Home({searchParams}: {
  searchParams?: {query?: string}
}) {
  const query = searchParams?.query;
  
  console.log("🚀 Home Page Loaded");

  // Direct client.fetch use karo
  let posts = [];
  try {
    posts = await client.fetch(PROJECT_QUERY);
    console.log("✅ Sanity Data:", posts);
  } catch (error) {
    console.error("❌ Sanity Error:", error);
  }

  const filteredPosts = query 
    ? posts.filter((post: any) => {
        const searchTerm = query.toLowerCase();
        const matches = 
          post.user?.username?.toLowerCase().includes(searchTerm) ||
          post.category?.toLowerCase().includes(searchTerm) ||
          post.description?.toLowerCase().includes(searchTerm) ||
          post.title?.toLowerCase().includes(searchTerm);
        return matches;
      })
    : posts;

  console.log("🎯 Filtered Posts:", filteredPosts.length);

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
        
        <ul className='card_grid grid grid-cols-1 sm:grid-col-1 lg:grid-cols-3 justify-center'>
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post: any) => (
              <ThreeDCardDemo 
                key={post._id} 
                project={post}
              />
            ))
          ) : (
            <p className='np-results'>
              {query ? `No projects found for "${query}"` : 'No Projects Found'}
            </p>
          )}
        </ul>
      </section>
    </>
  )
}