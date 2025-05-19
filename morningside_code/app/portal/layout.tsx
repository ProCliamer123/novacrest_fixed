"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import type { ReactNode } from "react"
import { Sidebar } from "@/components/portal/sidebar"
import { Header } from "@/components/portal/header"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"
import Link from "next/link"

export default function PortalLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [authState, setAuthState] = useState<{
    isAuthenticated: boolean | null
    clientEmail: string
    isLoading: boolean
  }>({
    isAuthenticated: null,
    clientEmail: "",
    isLoading: true,
  })

  // Check if user is authenticated
  useEffect(() => {
    // Define the auth check function
    const checkAuth = () => {
      try {
        // Check both authentication methods for compatibility
        const authStatus =
          localStorage.getItem("clientAuthenticated") === "true" ||
          (localStorage.getItem("user") && JSON.parse(localStorage.getItem("user") || "{}").isLoggedIn === true)

        const email =
          localStorage.getItem("clientEmail") ||
          (localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") || "{}").email : "")

        // Update state once with all values
        setAuthState({
          isAuthenticated: authStatus,
          clientEmail: email,
          isLoading: false,
        })

        // Return the auth status to use in the condition below
        return authStatus
      } catch (error) {
        console.error("Error checking authentication:", error)
        setAuthState({
          isAuthenticated: false,
          clientEmail: "",
          isLoading: false,
        })
        return false
      }
    }

    // Initial auth check
    const isAuth = checkAuth()

    // Only redirect if not authenticated and not already on login page
    if (!isAuth && !pathname.includes("/login")) {
      router.push("/login")
    }
  }, [pathname, router]) // Only re-run if pathname or router changes

  // Show loading state while checking authentication
  if (authState.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, show a message with a login button
  if (authState.isAuthenticated === false) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="mb-4 text-gray-500">You need to be logged in to access this page.</p>
          <Button asChild>
            <Link href="/login">Go to Login</Link>
          </Button>
        </div>
      </div>
    )
  }

  // If authenticated, render the layout
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top header */}
      <Header />

      <div className="flex">
        {/* Sidebar navigation */}
        <Sidebar />

        {/* Main content */}
        <main className="flex-1 p-4 md:p-8 pt-6 overflow-auto">{children}</main>
      </div>

      <footer className="bg-white border-t border-gray-200 p-4 text-center text-sm text-gray-500 mt-auto">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
          <p>© 2025 NovaCrest. All rights reserved.</p>
          <Link href="/" className="mt-2 sm:mt-0">
            <Button variant="ghost" size="sm" className="gap-1">
              <Home className="h-4 w-4" />
              Back to Website
            </Button>
          </Link>
        </div>
      </footer>
    </div>
  )
}
