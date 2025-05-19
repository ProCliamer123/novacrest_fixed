"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Menu, Search, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Sidebar } from "@/components/portal/sidebar"
import { UserNav } from "@/components/portal/user-nav"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const pathname = usePathname()
  const [user, setUser] = useState({ name: "", email: "" })

  useEffect(() => {
    // Get user info from localStorage
    const userJson = localStorage.getItem("user")
    const clientEmail = localStorage.getItem("clientEmail")

    if (userJson) {
      try {
        const userData = JSON.parse(userJson)
        setUser(userData)
      } catch (e) {
        console.error("Error parsing user data:", e)
      }
    } else if (clientEmail) {
      // Create user from clientEmail if no user object exists
      const userName = clientEmail.split("@")[0].replace(/[^a-zA-Z0-9]/g, "")
      const displayName = userName.charAt(0).toUpperCase() + userName.slice(1)

      setUser({
        name: displayName || "Client User",
        email: clientEmail,
      })
    }
  }, [])

  // Get page title based on pathname
  const getPageTitle = () => {
    if (pathname === "/portal/dashboard") return "Dashboard"
    if (pathname?.startsWith("/portal/project-status")) return "Project Status"
    if (pathname?.startsWith("/portal/resources")) return "Resources"
    if (pathname?.startsWith("/portal/onboarding")) return "Onboarding"
    if (pathname?.startsWith("/portal/feedback")) return "Feedback"
    if (pathname?.startsWith("/portal/support")) return "Support"
    if (pathname?.startsWith("/portal/notifications")) return "Notifications"
    if (pathname?.startsWith("/portal/settings")) return "Settings"
    return "Client Portal"
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <Sidebar />
        </SheetContent>
      </Sheet>

      <div className="hidden md:block">
        <h1 className="text-lg font-semibold">{getPageTitle()}</h1>
      </div>

      <div className="flex-1 md:grow-0 md:w-[200px]">
        <form>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
            />
          </div>
        </form>
      </div>

      <div className="flex items-center gap-4 md:gap-2 md:ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[380px]">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-[300px] overflow-auto">
              <DropdownMenuItem className="flex flex-col items-start p-0">
                <div className="w-full p-3 hover:bg-muted cursor-pointer">
                  <div className="font-medium">Project milestone reached</div>
                  <div className="text-sm text-muted-foreground">
                    Website Redesign project has completed the design phase
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">1 hour ago</div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start p-0">
                <div className="w-full p-3 hover:bg-muted cursor-pointer">
                  <div className="font-medium">New resource available</div>
                  <div className="text-sm text-muted-foreground">
                    Brand guidelines document has been shared with you
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">1 day ago</div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start p-0">
                <div className="w-full p-3 hover:bg-muted cursor-pointer">
                  <div className="font-medium">Feedback requested</div>
                  <div className="text-sm text-muted-foreground">
                    Your feedback is requested on the latest project update
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">2 days ago</div>
                </div>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer justify-center">
              <Link href="/portal/notifications">View all notifications</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Link href="/">
          <Button variant="outline" size="sm" className="hidden md:flex items-center gap-2">
            <Home className="h-4 w-4" />
            Back to Website
          </Button>
        </Link>

        <UserNav user={user} />
      </div>
    </header>
  )
}
