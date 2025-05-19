"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  BarChart3,
  Users,
  FileText,
  FolderOpen,
  Settings,
  LogOut,
  Home,
  Bell,
  UserPlus,
  FileTextIcon,
} from "lucide-react"

export function AdminSidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname?.startsWith(path)
  }

  return (
    <div className="hidden md:flex flex-col h-screen w-64 border-r bg-background">
      <div className="p-6">
        <Link href="/admin/dashboard" className="flex items-center gap-2 font-bold text-xl">
          <span className="text-primary">NovaCrest</span>
          <span className="text-sm font-normal text-muted-foreground">Admin</span>
        </Link>
      </div>
      <div className="flex-1 px-4 space-y-1">
        <Link
          href="/admin/dashboard"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
            isActive("/admin/dashboard") ? "bg-muted text-primary font-medium" : "text-muted-foreground",
          )}
        >
          <Home className="h-4 w-4" />
          Dashboard
        </Link>
        <Link
          href="/admin/clients"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
            isActive("/admin/clients") ? "bg-muted text-primary font-medium" : "text-muted-foreground",
          )}
        >
          <Users className="h-4 w-4" />
          Clients
        </Link>
        <Link
          href="/admin/projects"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
            isActive("/admin/projects") ? "bg-muted text-primary font-medium" : "text-muted-foreground",
          )}
        >
          <FileText className="h-4 w-4" />
          Projects
        </Link>
        <Link
          href="/admin/resources"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
            isActive("/admin/resources") ? "bg-muted text-primary font-medium" : "text-muted-foreground",
          )}
        >
          <FolderOpen className="h-4 w-4" />
          Resources
        </Link>
        <Link
          href="/admin/analytics"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
            isActive("/admin/analytics") ? "bg-muted text-primary font-medium" : "text-muted-foreground",
          )}
        >
          <BarChart3 className="h-4 w-4" />
          Analytics
        </Link>
        <Link
          href="/admin/reports"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
            isActive("/admin/reports") ? "bg-muted text-primary font-medium" : "text-muted-foreground",
          )}
        >
          <FileTextIcon className="h-4 w-4" />
          Reports
        </Link>
        <Link
          href="/admin/users"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
            isActive("/admin/users") ? "bg-muted text-primary font-medium" : "text-muted-foreground",
          )}
        >
          <UserPlus className="h-4 w-4" />
          Users
        </Link>
        <Link
          href="/admin/notifications"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
            isActive("/admin/notifications") ? "bg-muted text-primary font-medium" : "text-muted-foreground",
          )}
        >
          <Bell className="h-4 w-4" />
          Notifications
        </Link>
        <Link
          href="/admin/settings"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
            isActive("/admin/settings") ? "bg-muted text-primary font-medium" : "text-muted-foreground",
          )}
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
      </div>
      <div className="p-4 mt-auto border-t">
        <button
          onClick={() => {
            localStorage.removeItem("adminAuthenticated")
            window.location.href = "/admin/login"
          }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all hover:text-primary"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  )
}
