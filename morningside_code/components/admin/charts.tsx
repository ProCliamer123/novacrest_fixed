"use client"

import { useEffect, useRef } from "react"

// Simple Line Chart Component
export function LineChart({ data, xKey, yKey, height = 300 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    const dpr = window.devicePixelRatio || 1

    // Set canvas dimensions accounting for device pixel ratio
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    // Set canvas CSS dimensions
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${height}px`

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw chart
    const padding = 40
    const chartWidth = rect.width - padding * 2
    const chartHeight = height - padding * 2

    // Find min and max values
    const maxValue = Math.max(...data.map((d) => d[yKey])) * 1.1

    // Draw axes
    ctx.beginPath()
    ctx.strokeStyle = "#e5e7eb"
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(rect.width - padding, height - padding)
    ctx.stroke()

    // Draw data points and lines
    ctx.beginPath()
    ctx.strokeStyle = "#3b82f6"
    ctx.lineWidth = 2

    data.forEach((d, i) => {
      const x = padding + i * (chartWidth / (data.length - 1))
      const y = height - padding - (d[yKey] / maxValue) * chartHeight

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()

    // Draw data points
    data.forEach((d, i) => {
      const x = padding + i * (chartWidth / (data.length - 1))
      const y = height - padding - (d[yKey] / maxValue) * chartHeight

      ctx.beginPath()
      ctx.fillStyle = "#3b82f6"
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fill()
    })

    // Draw x-axis labels
    ctx.fillStyle = "#6b7280"
    ctx.font = "10px sans-serif"
    ctx.textAlign = "center"

    data.forEach((d, i) => {
      if (i % Math.ceil(data.length / 7) === 0 || i === data.length - 1) {
        const x = padding + i * (chartWidth / (data.length - 1))
        ctx.fillText(d[xKey], x, height - padding + 15)
      }
    })

    // Draw y-axis labels
    ctx.textAlign = "right"

    for (let i = 0; i <= 5; i++) {
      const value = Math.round((maxValue / 5) * i)
      const y = height - padding - (value / maxValue) * chartHeight
      ctx.fillText(value.toString(), padding - 5, y + 3)
    }
  }, [data, xKey, yKey, height])

  return <canvas ref={canvasRef} className="w-full" />
}

// Simple Bar Chart Component
export function BarChart({ data, xKey, yKey, height = 300 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    const dpr = window.devicePixelRatio || 1

    // Set canvas dimensions accounting for device pixel ratio
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    // Set canvas CSS dimensions
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${height}px`

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw chart
    const padding = 40
    const chartWidth = rect.width - padding * 2
    const chartHeight = height - padding * 2

    // Find max value
    const maxValue = Math.max(...data.map((d) => d[yKey])) * 1.1

    // Draw axes
    ctx.beginPath()
    ctx.strokeStyle = "#e5e7eb"
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(rect.width - padding, height - padding)
    ctx.stroke()

    // Draw bars
    const barWidth = (chartWidth / data.length) * 0.8
    const barSpacing = (chartWidth / data.length) * 0.2

    data.forEach((d, i) => {
      const x = padding + i * (chartWidth / data.length) + barSpacing / 2
      const barHeight = (d[yKey] / maxValue) * chartHeight
      const y = height - padding - barHeight

      ctx.fillStyle = "#3b82f6"
      ctx.fillRect(x, y, barWidth, barHeight)
    })

    // Draw x-axis labels
    ctx.fillStyle = "#6b7280"
    ctx.font = "10px sans-serif"
    ctx.textAlign = "center"

    data.forEach((d, i) => {
      const x = padding + i * (chartWidth / data.length) + barWidth / 2 + barSpacing / 2
      const label = d[xKey].length > 10 ? d[xKey].substring(0, 10) + "..." : d[xKey]
      ctx.fillText(label, x, height - padding + 15)
    })

    // Draw y-axis labels
    ctx.textAlign = "right"

    for (let i = 0; i <= 5; i++) {
      const value = Math.round((maxValue / 5) * i)
      const y = height - padding - (value / maxValue) * chartHeight
      ctx.fillText(value.toString(), padding - 5, y + 3)
    }
  }, [data, xKey, yKey, height])

  return <canvas ref={canvasRef} className="w-full" />
}

// Simple Pie Chart Component
export function PieChart({ data, height = 300 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    const dpr = window.devicePixelRatio || 1

    // Set canvas dimensions accounting for device pixel ratio
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    // Set canvas CSS dimensions
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${height}px`

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Calculate total value
    const total = data.reduce((sum, d) => sum + d.value, 0)

    // Draw pie chart
    const centerX = rect.width / 2
    const centerY = height / 2
    const radius = Math.min(centerX, centerY) - 40

    let startAngle = 0

    // Colors for pie slices
    const colors = [
      "#3b82f6",
      "#10b981",
      "#f59e0b",
      "#ef4444",
      "#8b5cf6",
      "#ec4899",
      "#06b6d4",
      "#84cc16",
      "#f97316",
      "#6366f1",
    ]

    // Draw pie slices
    data.forEach((d, i) => {
      const sliceAngle = (d.value / total) * 2 * Math.PI
      const endAngle = startAngle + sliceAngle

      ctx.beginPath()
      ctx.fillStyle = colors[i % colors.length]
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, endAngle)
      ctx.closePath()
      ctx.fill()

      startAngle = endAngle
    })

    // Draw legend
    const legendX = rect.width - 120
    const legendY = 40

    data.forEach((d, i) => {
      const y = legendY + i * 20

      // Draw color box
      ctx.fillStyle = colors[i % colors.length]
      ctx.fillRect(legendX, y, 12, 12)

      // Draw label
      ctx.fillStyle = "#374151"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText(d.name, legendX + 20, y + 10)
    })
  }, [data, height])

  return <canvas ref={canvasRef} className="w-full" />
}

// Simple Donut Chart Component
export function DonutChart({ data, height = 300 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    const dpr = window.devicePixelRatio || 1

    // Set canvas dimensions accounting for device pixel ratio
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    // Set canvas CSS dimensions
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${height}px`

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Calculate total value
    const total = data.reduce((sum, d) => sum + d.value, 0)

    // Draw donut chart
    const centerX = rect.width / 2
    const centerY = height / 2
    const outerRadius = Math.min(centerX, centerY) - 40
    const innerRadius = outerRadius * 0.6

    let startAngle = 0

    // Colors for donut slices
    const colors = [
      "#3b82f6",
      "#10b981",
      "#f59e0b",
      "#ef4444",
      "#8b5cf6",
      "#ec4899",
      "#06b6d4",
      "#84cc16",
      "#f97316",
      "#6366f1",
    ]

    // Draw donut slices
    data.forEach((d, i) => {
      const sliceAngle = (d.value / total) * 2 * Math.PI
      const endAngle = startAngle + sliceAngle

      ctx.beginPath()
      ctx.fillStyle = colors[i % colors.length]
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle)
      ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true)
      ctx.closePath()
      ctx.fill()

      startAngle = endAngle
    })

    // Draw center circle (white)
    ctx.beginPath()
    ctx.fillStyle = "#ffffff"
    ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI)
    ctx.fill()

    // Draw total in center
    ctx.fillStyle = "#374151"
    ctx.font = "bold 16px sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("Total", centerX, centerY - 10)
    ctx.fillText(total.toString(), centerX, centerY + 10)

    // Draw legend
    const legendX = rect.width - 120
    const legendY = 40

    data.forEach((d, i) => {
      const y = legendY + i * 20

      // Draw color box
      ctx.fillStyle = colors[i % colors.length]
      ctx.fillRect(legendX, y, 12, 12)

      // Draw label
      ctx.fillStyle = "#374151"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText(d.name, legendX + 20, y + 10)
    })
  }, [data, height])

  return <canvas ref={canvasRef} className="w-full" />
}
