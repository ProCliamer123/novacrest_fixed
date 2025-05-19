import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 text-center">
        <div>
          <AlertTriangle className="mx-auto h-16 w-16 text-yellow-500" />
          <h1 className="mt-6 text-3xl font-bold tracking-tight">Unauthorized Access</h1>
          <p className="mt-2 text-gray-600">
            You don&apos;t have permission to access this page. Please contact your administrator if you believe this is
            an error.
          </p>
        </div>
        <div className="flex flex-col space-y-4">
          <Button asChild>
            <Link href="/">Go to Home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/login">Login with a different account</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
