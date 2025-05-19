import Link from "next/link"
import { ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Unauthorized",
  description: "You don't have permission to access this page",
}

export default function UnauthorizedPage() {
  return (
    <div className="flex h-[80vh] flex-col items-center justify-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
        <ShieldAlert className="h-12 w-12 text-red-600" />
      </div>
      <h1 className="mt-6 text-3xl font-bold tracking-tight">Access Denied</h1>
      <p className="mt-2 text-center text-lg text-gray-500">You don't have permission to access this page.</p>
      <div className="mt-6 flex space-x-4">
        <Link href="/admin/dashboard">
          <Button>Go to Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}
