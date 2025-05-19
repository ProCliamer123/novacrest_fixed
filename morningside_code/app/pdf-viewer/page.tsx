"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { ArrowLeft, Download, Printer } from "lucide-react"
import Link from "next/link"
import PdfTemplate from "@/components/pdf-template"

export default function PdfViewerPage() {
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)

  // Get parameters from the URL
  const title = searchParams.get("title") || "AI Implementation Plan"
  const summary = searchParams.get("summary") || "Customized AI implementation strategy for your business."
  const businessType = searchParams.get("businessType") || "business"
  const businessSize = searchParams.get("businessSize") || ""

  useEffect(() => {
    // Simulate PDF loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-black hover:text-black/70">
              <ArrowLeft size={16} />
              <span>Back to Website</span>
            </Link>
            <h1 className="text-xl font-semibold">{title}</h1>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50">
              <Printer size={16} />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-black text-white rounded-md hover:bg-black/90">
              <Download size={16} />
              <span className="hidden sm:inline">Download</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-lg p-8 min-h-[800px] flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-black border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-4 text-gray-600">Generating your PDF report...</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <PdfTemplate title={title} summary={summary} businessType={businessType} businessSize={businessSize} />
          </div>
        )}
      </div>
    </div>
  )
}
