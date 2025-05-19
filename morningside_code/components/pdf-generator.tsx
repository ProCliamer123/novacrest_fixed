"use client"

import { useState } from "react"
import { Download } from "lucide-react"

interface PdfGeneratorProps {
  advice: any
  businessType: string
  businessSize: string
  businessDescription: string
  aiExperience: string
  budget: string
  goals: string
}

export default function PdfGenerator({
  advice,
  businessType,
  businessSize,
  businessDescription,
  aiExperience,
  budget,
  goals,
}: PdfGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGeneratePdf = () => {
    setIsGenerating(true)

    // In a real implementation, this would generate a PDF using a library like jsPDF
    // For this demo, we'll simulate a delay and then open a new tab with a PDF viewer
    setTimeout(() => {
      setIsGenerating(false)

      // Create a query string with all the parameters
      const params = new URLSearchParams()
      params.append("title", advice.title)
      params.append("summary", advice.summary)
      params.append("businessType", businessType)
      params.append("businessSize", businessSize)

      // Open the PDF viewer in a new tab
      window.open(`/pdf-viewer?${params.toString()}`, "_blank")
    }, 1500)
  }

  return (
    <button
      onClick={handleGeneratePdf}
      disabled={isGenerating}
      className="px-4 py-2 bg-black text-[#f5f2e8] rounded-md hover:bg-black/90 transition-colors flex items-center gap-2"
    >
      <Download size={16} />
      {isGenerating ? "Generating PDF..." : "Download PDF Report"}
    </button>
  )
}
