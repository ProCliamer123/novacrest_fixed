import type React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { LayoutDashboard, BarChart2, ListChecks, MessageSquare, LifeBuoy, Menu, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { AiAssistant } from "@/components/ai-assistant"
import { PortalLogo } from "@/components/portal-logo"

export const metadata: Metadata = {
  title: "Novacrest Client Portal",
  description: "Client portal for Novacrest AI automation agency",
}

interface PortalLayoutProps {
  children: React.ReactNode
}

export default function PortalLayout({ children }: PortalLayoutProps) {
  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Project Status",
      href: "/project-status",
      icon: <BarChart2 className="h-5 w-5" />,
    },
    {
      name: "Automation Steps",
      href: "/automation-steps",
      icon: <ListChecks className="h-5 w-5" />,
    },
    {
      name: "Resources",
      href: "/resources",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      name: "Client Feedback",
      href: "/feedback",
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      name: "Support",
      href: "/support",
      icon: <LifeBuoy className="h-5 w-5" />,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex h-16 items-center border-b px-6">
              <PortalLogo />
            </div>
            <nav className="grid gap-2 p-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2">
          <PortalLogo />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm text-muted-foreground hidden md:inline-block">Welcome, Client Name</span>
          <Button variant="ghost" size="icon">
            <span className="sr-only">User account</span>
            <div className="rounded-full bg-primary h-8 w-8 flex items-center justify-center text-primary-foreground font-medium">
              CN
            </div>
          </Button>
        </div>
      </header>

      {/* Sidebar and Main Content */}
      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="hidden border-r bg-gray-100/40 md:block md:w-64 lg:w-72">
          <nav className="grid gap-2 p-4">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
                  index === 0
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>

      {/* AI Assistant */}
      <AiAssistant />
    </div>
  )
}
