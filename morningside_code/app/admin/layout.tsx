"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Users, FileText, Settings, LogOut, Menu, X, FolderOpen, BarChart3, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [adminEmail, setAdminEmail] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is authenticated
  useEffect(() => {
    console.log("Layout: Checking authentication")
    const checkAuth = () => {
      const authStatus = localStorage.getItem("adminAuthenticated") === "true"
      const email = localStorage.getItem("adminEmail") || ""

      console.log("Layout: Auth status:", authStatus)
      console.log("Layout: Current path:", pathname)

      setIsAuthenticated(authStatus)
      setAdminEmail(email)
      setIsLoading(false)

      // If not authenticated and not on login page, redirect to login
      if (!authStatus && pathname !== "/admin/login") {
        console.log("Layout: Not authenticated, redirecting to login")
        router.push("/admin/login")
      }
    }

    // Check immediately and after a short delay to ensure localStorage is read
    checkAuth()
    const timer = setTimeout(checkAuth, 500)

    return () => clearTimeout(timer)
  }, [pathname, router])

  // If on login page, don't show the admin layout
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, don't render the layout (redirect will happen in useEffect)
  if (!isAuthenticated) {
    return null
  }

  // Handle logout
  const handleLogout = () => {
    console.log("Logging out")
    localStorage.removeItem("adminAuthenticated")
    localStorage.removeItem("adminEmail")
    router.push("/admin/login")
  }

  // Navigation items
  const navItems = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Clients",
      href: "/admin/clients",
      icon: Users,
    },
    {
      name: "Projects",
      href: "/admin/projects",
      icon: FileText,
    },
    {
      name: "Resources",
      href: "/admin/resources",
      icon: FolderOpen,
    },
    {
      name: "Analytics",
      href: "/admin/analytics",
      icon: BarChart3,
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ]

  // Get initials for avatar
  const getInitials = (email: string) => {
    if (!email) return "A"
    const parts = email.split("@")[0].split(".")
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return email.substring(0, 2).toUpperCase()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <div className="flex items-center">
            <button className="md:hidden mr-4" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            <Link href="/admin/dashboard" className="flex items-center">
              <h1 className="text-xl font-bold">NovaCrest</h1>
              <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Admin</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {/* Added Back to Website button */}
            <Link href="/">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Back to Website
              </Button>
            </Link>

            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{getInitials(adminEmail)}</AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <div className="text-sm font-medium">{adminEmail}</div>
                <Button
                  variant="link"
                  size="sm"
                  className="h-auto p-0 text-xs text-muted-foreground"
                  onClick={handleLogout}
                >
                  Sign out
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar navigation */}
        <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)]">
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-2 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md group transition-colors ${
                      isActive ? "bg-primary/10 text-primary" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon
                      className={`mr-3 h-5 w-5 ${isActive ? "text-primary" : "text-gray-400 group-hover:text-gray-500"}`}
                    />
                    <span>{item.name}</span>
                  </Link>
                )
              })}

              {/* Added Back to Website link in sidebar */}
              <Link
                href="/"
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md group transition-colors text-gray-700 hover:bg-gray-50 hover:text-gray-900 mt-8"
              >
                <Home className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                <span>Back to Website</span>
              </Link>
            </nav>
          </div>

          <div className="p-4 border-t border-gray-200">
            <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </aside>

        {/* Mobile navigation */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsMobileMenuOpen(false)}></div>
            <div className="relative flex flex-col max-w-xs w-full h-full bg-white">
              <div className="flex-1 overflow-y-auto pt-5 pb-4">
                <div className="flex items-center px-4">
                  <h1 className="text-xl font-bold">NovaCrest Admin</h1>
                </div>
                <nav className="mt-5 px-2 space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href

                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center px-3 py-2 text-base font-medium rounded-md ${
                          isActive ? "bg-primary/10 text-primary" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Icon className={`mr-3 h-5 w-5 ${isActive ? "text-primary" : "text-gray-400"}`} />
                        <span>{item.name}</span>
                      </Link>
                    )
                  })}

                  {/* Added Back to Website link in mobile menu */}
                  <Link
                    href="/"
                    className="flex items-center px-3 py-2 text-base font-medium rounded-md text-gray-700 hover:bg-gray-50 hover:text-gray-900 mt-4"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Home className="mr-3 h-5 w-5 text-gray-400" />
                    <span>Back to Website</span>
                  </Link>
                </nav>
              </div>
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{getInitials(adminEmail)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-700">{adminEmail}</div>
                    <Button variant="link" className="p-0 h-auto text-sm text-gray-500" onClick={handleLogout}>
                      Sign out
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
