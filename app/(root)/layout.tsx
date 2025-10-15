import NavbarMenuStrip from '@/components/NavbarMenuStrip'
import EndPageFooter from '@/components/EndPageFooter'
import { SessionProvider } from "next-auth/react"

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <SessionProvider>
        <div className="flex flex-col min-h-screen text-2xl">
            {/* Navbar */}
            <NavbarMenuStrip />

            {/* Content */}
            <main className="flex-1 mt-5">
                {children}
            </main>

            {/* Footer */}
            <EndPageFooter />
        </div>
        </SessionProvider>
    )
}


