"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminUserNav } from "@/components/admin/user-nav"
import { Bell, Menu, Search } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export function AdminHeader() {
  const pathname = usePathname()

  // Get page title based on pathname
  const getPageTitle = () => {
    if (pathname === "/admin" || pathname === "/admin/dashboard") return "Dashboard"
    if (pathname?.startsWith("/admin/clients")) return "Clients"
    if (pathname?.startsWith("/admin/projects")) return "Projects"
    if (pathname?.startsWith("/admin/resources")) return "Resources"
    if (pathname?.startsWith("/admin/analytics")) return "Analytics"
    if (pathname?.startsWith("/admin/users")) return "Users"
    if (pathname?.startsWith("/admin/notifications")) return "Notifications"
    if (pathname?.startsWith("/admin/settings")) return "Settings"
    return "Admin Portal"
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
          <AdminSidebar />
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
                2
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[380px]">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-[300px] overflow-auto">
              <DropdownMenuItem className="flex flex-col items-start p-0">
                <div className="w-full p-3 hover:bg-muted cursor-pointer">
                  <div className="font-medium">New client registration</div>
                  <div className="text-sm text-muted-foreground">TechSolutions Inc. has registered on the portal</div>
                  <div className="text-xs text-muted-foreground mt-1">10 minutes ago</div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start p-0">
                <div className="w-full p-3 hover:bg-muted cursor-pointer">
                  <div className="font-medium">Project milestone reached</div>
                  <div className="text-sm text-muted-foreground">
                    AI Content Strategy project has completed the data collection phase
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">1 hour ago</div>
                </div>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer justify-center">
              <Link href="/admin/notifications">View all notifications</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <AdminUserNav />
      </div>
    </header>
  )
}
