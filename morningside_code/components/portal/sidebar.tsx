"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  LifeBuoy,
  BookOpen,
  Compass,
  Home,
  Bell,
  Settings,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
    {
      name: "Dashboard",
      href: "/portal/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Onboarding",
      href: "/portal/onboarding",
      icon: Compass,
    },
    {
      name: "Project Status",
      href: "/portal/project-status",
      icon: FileText,
    },
    {
      name: "Resources",
      href: "/portal/resources",
      icon: BookOpen,
    },
    {
      name: "Notifications",
      href: "/portal/notifications",
      icon: Bell,
    },
    {
      name: "Feedback",
      href: "/portal/feedback",
      icon: MessageSquare,
    },
    {
      name: "Support",
      href: "/portal/support",
      icon: LifeBuoy,
    },
    {
      name: "Settings",
      href: "/portal/settings",
      icon: Settings,
    },
  ]

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("clientAuthenticated")
    localStorage.removeItem("clientEmail")
    localStorage.removeItem("user")
    router.push("/login")
  }

  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)]">
      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-4 mb-6">
          <Link href="/portal/dashboard" className="flex items-center">
            <h1 className="text-xl font-bold">NovaCrest</h1>
            <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Client</span>
          </Link>
        </div>
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
    </div>
  )
}
