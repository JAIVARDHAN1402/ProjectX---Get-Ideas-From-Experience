"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { signIn, signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function NavbarMenuStrip() {
  const { data: session } = useSession()
  const router = useRouter()

  const handleProfileClick = () => {
    // Session name se username banate hain
    if (session?.user?.name) {
      const username = session.user.name.toLowerCase().replace(/\s+/g, '')
      router.push(`/user/${username}`)
    }
  }

  return (
    <div className="navbar h-[50px]">
      <div className="navbar-menu flex ml-10 mt-5 justify-between mr-5">
        <Image src="/logo.png" alt="logo" width={160} height={80} />

        {session?.user ? (
          <div className="flex gap-4 max-sm:hidden items-center">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <Link href="/project/create" className="hover:text-blue-600 transition-colors">Create</Link>
            <button onClick={() => signOut()} className="hover:text-blue-600 transition-colors">Logout</button>
            
            <button 
              onClick={handleProfileClick}
              className="hover:text-blue-600 transition-colors flex items-center gap-2"
            >
              {session.user.name}
              <Image
                src={session.user.image || '/profile.png'}
                alt={session.user.name || 'User Image'}
                width={40}
                height={40}
                className="rounded-full border-2 border-gray-300 hover:border-blue-500 transition-colors" 
              />
            </button>
          </div>
        ) : (
          <button
            className="text-6 font-sans hover:text-blue-600 transition-colors"
            onClick={() => signIn()}
          >
            Login
          </button>
        )}
      </div>
    </div>
  )
}