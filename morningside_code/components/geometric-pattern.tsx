"use client"

import { useEffect, useRef } from "react"

export default function GeometricPattern() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Draw pattern
    const drawPattern = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const size = 30
      const gap = 70
      const opacity = 0.03

      for (let x = 0; x < canvas.width + gap; x += gap) {
        for (let y = 0; y < canvas.height + gap; y += gap) {
          const shape = Math.floor(Math.random() * 3)

          ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`
          ctx.strokeStyle = `rgba(0, 0, 0, ${opacity})`
          ctx.lineWidth = 1

          switch (shape) {
            case 0: // Circle
              ctx.beginPath()
              ctx.arc(x, y, size / 2, 0, Math.PI * 2)
              ctx.fill()
              break
            case 1: // Square
              ctx.fillRect(x - size / 2, y - size / 2, size, size)
              break
            case 2: // Triangle
              ctx.beginPath()
              ctx.moveTo(x, y - size / 2)
              ctx.lineTo(x + size / 2, y + size / 2)
              ctx.lineTo(x - size / 2, y + size / 2)
              ctx.closePath()
              ctx.fill()
              break
          }
        }
      }
    }

    drawPattern()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-20" />
}
