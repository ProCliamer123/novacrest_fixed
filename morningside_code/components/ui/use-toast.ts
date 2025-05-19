"use client"

import type React from "react"

// Simplified version of the use-toast hook
import { useState } from "react"

type ToastProps = {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
}

// Export the toast function directly for components that import it
export const toast = ({ title, description, action, variant }: Omit<ToastProps, "id">) => {
  // This is a simplified version that will be used by direct imports
  console.log('Toast:', { title, description, variant });
  // In a real implementation, this would use a global toast state
  return Math.random().toString(36).substring(2, 9);
};

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const toast = ({ title, description, action, variant }: Omit<ToastProps, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prevToasts) => [...prevToasts, { id, title, description, action, variant }])

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
    }, 5000)

    return id
  }

  const dismiss = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }

  return {
    toast,
    dismiss,
    toasts,
  }
}
