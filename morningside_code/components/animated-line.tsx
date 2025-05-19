"use client"

import { useEffect, useRef } from "react"

export default function AnimatedLine() {
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

    // Line properties
    const lineSegments = 5
    const linePoints: { x: number; y: number; vx: number; vy: number }[] = []

    // Initialize line points
    for (let i = 0; i < lineSegments + 1; i++) {
      linePoints.push({
        x: (canvas.width / lineSegments) * i,
        y: canvas.height / 2 + Math.sin(i / 2) * 50,
        vx: 0,
        vy: Math.random() * 0.5 - 0.25,
      })
    }

    // Animation
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update points
      linePoints.forEach((point, i) => {
        if (i === 0 || i === linePoints.length - 1) return // Keep first and last points fixed horizontally

        point.y += point.vy

        // Reverse direction if reaching bounds
        if (point.y > canvas.height / 2 + 100 || point.y < canvas.height / 2 - 100) {
          point.vy *= -1
        }
      })

      // Draw line
      ctx.beginPath()
      ctx.moveTo(linePoints[0].x, linePoints[0].y)

      for (let i = 1; i < linePoints.length; i++) {
        const xc = (linePoints[i].x + linePoints[i - 1].x) / 2
        const yc = (linePoints[i].y + linePoints[i - 1].y) / 2
        ctx.quadraticCurveTo(linePoints[i - 1].x, linePoints[i - 1].y, xc, yc)
      }

      ctx.strokeStyle = "rgba(0, 0, 0, 0.05)"
      ctx.lineWidth = 1
      ctx.stroke()

      requestAnimationFrame(animate)
    }

    const animationId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-30" />
}
