"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { signIn, signOut, useSession } from "next-auth/react"

export default function NavbarMenuStrip() {
  const { data: session } = useSession()

  return (
    <div className="navbar h-[50px]">
      <div className="navbar-menu flex ml-10 mt-5 justify-between mr-5">
        <Image src="/logo.png" alt="logo" width={160} height={80} />

        {session?.user ? (
          <div className="flex gap-4 max-sm:hidden">
            <Link href="/">Home</Link>
            <Link href="/project/create">Create</Link>
            <Link href="/" onClick={() => signOut()}>Logout</Link>
            <Link href="/">
              {session.user.name}
            </Link>
            <Image
              src={session.user.image || '/progile.png'}
              alt={session.user.name || 'User Image'}
              width={40}
              height={40}
              className="rounded-full" />
          </div>
        ) : (
          <Link
            href='/'
            className="text-6 font-sans"
            onClick={() => signIn()}
          >
            Login
          </Link>
        )}
      </div>
    </div>
  )
}

