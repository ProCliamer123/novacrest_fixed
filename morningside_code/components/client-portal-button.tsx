"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UserCircle } from "lucide-react"

export default function ClientPortalButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Add a slight delay before showing the button for a nice effect
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className={`fixed top-24 right-6 z-40 transition-all duration-500 transform ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"
      }`}
    >
      <Link href="/client-portal">
        <Button
          size="lg"
          className="bg-white text-black border border-black/10 shadow-lg hover:bg-gray-100 transition-all duration-300"
        >
          <UserCircle className="mr-2 h-5 w-5" />
          Client Portal
        </Button>
      </Link>
    </div>
  )
}
