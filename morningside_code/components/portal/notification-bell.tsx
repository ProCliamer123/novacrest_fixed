"use client"

import { useEffect, useState } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { getClientNotifications, markNotificationAsRead } from "@/app/actions/notification-actions"

export function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Get client ID from localStorage
        const userJson = localStorage.getItem("user")
        const clientId = userJson ? JSON.parse(userJson).clientId : null

        if (!clientId) {
          setLoading(false)
          return
        }

        const data = await getClientNotifications(clientId, 5)
        setNotifications(data)
        setUnreadCount(data.filter((n: any) => !n.is_read).length)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching notifications:", err)
        setLoading(false)
      }
    }

    fetchNotifications()

    // Set up polling for real-time updates
    const interval = setInterval(fetchNotifications, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const handleNotificationClick = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId)

      // Update local state
      setNotifications(notifications.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n)))
      setUnreadCount(Math.max(0, unreadCount - 1))
    } catch (err) {
      console.error("Error marking notification as read:", err)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[380px]">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {loading ? (
          <div className="p-4 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-muted-foreground mt-2">Loading notifications...</p>
          </div>
        ) : notifications.length > 0 ? (
          <div className="max-h-[300px] overflow-auto">
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex flex-col items-start p-0"
                onClick={() => handleNotificationClick(notification.id)}
              >
                <div
                  className={`w-full p-3 hover:bg-muted cursor-pointer ${!notification.is_read ? "bg-primary/5" : ""}`}
                >
                  <div className="font-medium">{notification.title}</div>
                  <div className="text-sm text-muted-foreground">{notification.message}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(notification.created_at).toLocaleString()}
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center">
            <p className="text-sm text-muted-foreground">No notifications</p>
          </div>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer justify-center">
          <Link href="/portal/notifications">View all notifications</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
