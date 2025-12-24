'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

export default function HippoPumpkinGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Game state
    const hippo = {
      x: 400,
      y: 500,
      width: 60,
      height: 50,
      speed: 5,
    }

    const pumpkins: Array<{ x: number; y: number; collected: boolean }> = []
    const totalPumpkins = 15

    // Generate pumpkins
    for (let i = 0; i < totalPumpkins; i++) {
      pumpkins.push({
        x: Math.random() * 750 + 25,
        y: Math.random() * 550 + 25,
        collected: false,
      })
    }

    const keys: Record<string, boolean> = {}

    // Input handling
    const handleKeyDown = (e: KeyboardEvent) => {
      keys[e.key] = true
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.key] = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    // Game loop
    let animationId: number
    const gameLoop = () => {
      // Clear canvas
      ctx.fillStyle = '#1a1a2e'
      ctx.fillRect(0, 0, 800, 600)

      // Move hippo
      if (keys['ArrowLeft'] || keys['a'] || keys['A']) hippo.x -= hippo.speed
      if (keys['ArrowRight'] || keys['d'] || keys['D']) hippo.x += hippo.speed
      if (keys['ArrowUp'] || keys['w'] || keys['W']) hippo.y -= hippo.speed
      if (keys['ArrowDown'] || keys['s'] || keys['S']) hippo.y += hippo.speed

      // Boundaries
      hippo.x = Math.max(0, Math.min(800 - hippo.width, hippo.x))
      hippo.y = Math.max(0, Math.min(600 - hippo.height, hippo.y))

      // Draw hippo
      ctx.fillStyle = '#888'
      ctx.fillRect(hippo.x, hippo.y, hippo.width, hippo.height)
      ctx.fillStyle = '#666'
      ctx.fillRect(hippo.x + 10, hippo.y + 10, 10, 10) // Eye
      ctx.fillRect(hippo.x + 40, hippo.y + 10, 10, 10) // Eye

      // Draw and check pumpkins
      let collectedCount = 0
      pumpkins.forEach(pumpkin => {
        if (pumpkin.collected) {
          collectedCount++
          return
        }

        // Draw pumpkin
        ctx.fillStyle = '#ff6b35'
        ctx.beginPath()
        ctx.arc(pumpkin.x, pumpkin.y, 20, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#4a7c59'
        ctx.fillRect(pumpkin.x - 5, pumpkin.y - 25, 10, 10)

        // Collision detection
        if (
          hippo.x < pumpkin.x + 20 &&
          hippo.x + hippo.width > pumpkin.x - 20 &&
          hippo.y < pumpkin.y + 20 &&
          hippo.y + hippo.height > pumpkin.y - 20
        ) {
          pumpkin.collected = true
          setScore(prev => prev + 10)
        }
      })

      // Check win condition
      if (collectedCount === totalPumpkins) {
        setGameOver(true)
        return
      }

      // Draw score
      ctx.fillStyle = '#fff'
      ctx.font = '24px Arial'
      ctx.fillText(`Score: ${score}`, 20, 40)
      ctx.fillText(`Pumpkins: ${collectedCount}/${totalPumpkins}`, 20, 70)

      animationId = requestAnimationFrame(gameLoop)
    }

    gameLoop()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [score])

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold text-white mb-4">🦛 Hippo Pumpkin Feast</h1>
      <p className="text-gray-400 mb-8">Use WASD or Arrow Keys to move</p>

      {gameOver && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-12 rounded-2xl text-center">
            <h2 className="text-5xl font-bold text-green-400 mb-4">🎉 Victory!</h2>
            <p className="text-2xl text-white mb-8">Score: {score}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-4 bg-blue-500 text-white rounded-xl text-xl hover:bg-blue-600 mr-4"
            >
              Play Again
            </button>
            <Link href="/">
              <button className="px-8 py-4 bg-gray-700 text-white rounded-xl text-xl hover:bg-gray-600">
                Back to Hub
              </button>
            </Link>
          </div>
        </div>
      )}

      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="border-4 border-gray-700 rounded-xl"
      />

      <Link href="/">
        <button className="mt-8 px-6 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600">
          ← Back to Hub
        </button>
      </Link>
    </div>
  )
}

