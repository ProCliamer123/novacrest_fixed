"use client"

import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { Bell, CheckCircle2, AlertCircle, Info, FileText, Calendar, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Notification } from "@/lib/db"

interface NotificationListProps {
  notifications: Notification[]
  loading?: boolean
  onNotificationClick?: (notification: Notification) => void
  className?: string
}

export function NotificationList({
  notifications,
  loading = false,
  onNotificationClick,
  className,
}: NotificationListProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-6">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        <p className="mt-2 text-sm text-muted-foreground">Loading notifications...</p>
      </div>
    )
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-6">
        <Bell className="h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">No notifications yet</p>
      </div>
    )
  }

  return (
    <div className={cn("divide-y", className)}>
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClick={() => onNotificationClick?.(notification)}
        />
      ))}
    </div>
  )
}

function NotificationItem({
  notification,
  onClick,
}: {
  notification: Notification
  onClick?: () => void
}) {
  const NotificationIcon = getNotificationIcon(notification.type)

  const content = (
    <div
      className={cn(
        "flex items-start gap-3 p-4 hover:bg-muted/50 transition-colors",
        !notification.read && "bg-muted/30",
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          getIconBackground(notification.type),
        )}
      >
        <NotificationIcon className={cn("h-4 w-4", getIconColor(notification.type))} />
      </div>
      <div className="flex-1 space-y-1">
        <p className={cn("text-sm font-medium leading-none", !notification.read && "font-semibold")}>
          {notification.title}
        </p>
        <p className="text-sm text-muted-foreground">{notification.message}</p>
        <p className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
        </p>
      </div>
      {!notification.read && <div className="h-2 w-2 rounded-full bg-primary"></div>}
    </div>
  )

  if (notification.link) {
    return (
      <Link href={notification.link} onClick={onClick}>
        {content}
      </Link>
    )
  }

  return (
    <div onClick={onClick} className="cursor-pointer">
      {content}
    </div>
  )
}

function getNotificationIcon(type: string) {
  switch (type) {
    case "success":
      return CheckCircle2
    case "error":
      return AlertCircle
    case "resource":
      return FileText
    case "milestone":
      return Calendar
    case "message":
      return MessageSquare
    default:
      return Info
  }
}

function getIconBackground(type: string) {
  switch (type) {
    case "success":
      return "bg-green-100"
    case "error":
      return "bg-red-100"
    case "resource":
      return "bg-blue-100"
    case "milestone":
      return "bg-yellow-100"
    case "message":
      return "bg-purple-100"
    default:
      return "bg-gray-100"
  }
}

function getIconColor(type: string) {
  switch (type) {
    case "success":
      return "text-green-600"
    case "error":
      return "text-red-600"
    case "resource":
      return "text-blue-600"
    case "milestone":
      return "text-yellow-600"
    case "message":
      return "text-purple-600"
    default:
      return "text-gray-600"
  }
}
