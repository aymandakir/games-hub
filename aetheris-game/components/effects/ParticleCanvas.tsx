'use client'

import { useEffect, useRef } from 'react'
import { ParticleSystem } from '@/lib/systems/particles'

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const systemRef = useRef<ParticleSystem | null>(null)

  useEffect(() => {
    if (canvasRef.current && !systemRef.current) {
      // Set canvas size
      const resizeCanvas = () => {
        if (canvasRef.current) {
          canvasRef.current.width = window.innerWidth
          canvasRef.current.height = window.innerHeight
        }
      }

      resizeCanvas()
      window.addEventListener('resize', resizeCanvas)

      // Create particle system
      systemRef.current = new ParticleSystem(canvasRef.current)

      // Expose to window for easy access (dev only)
      if (typeof window !== 'undefined') {
        ;(window as any).particleSystem = systemRef.current
      }

      return () => {
        window.removeEventListener('resize', resizeCanvas)
        systemRef.current?.destroy()
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ imageRendering: 'pixelated' }}
    />
  )
}

