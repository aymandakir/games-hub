'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface Brick {
  x: number
  y: number
  width: number
  height: number
  color: string
  destroyed: boolean
}

interface Ball {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
}

interface Paddle {
  x: number
  width: number
  height: number
}

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 600
const BRICK_ROWS = 5
const BRICK_COLS = 10
const BRICK_WIDTH = 70
const BRICK_HEIGHT = 20
const BRICK_PADDING = 5
const BRICK_OFFSET_TOP = 50
const BRICK_OFFSET_LEFT = 35

export default function BreakoutGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [gameOver, setGameOver] = useState(false)
  const [paused, setPaused] = useState(false)
  const [paddle, setPaddle] = useState<Paddle>({ x: CANVAS_WIDTH / 2 - 50, width: 100, height: 10 })
  const [ball, setBall] = useState<Ball>({
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT - 50,
    vx: 4,
    vy: -4,
    radius: 8,
  })
  const [bricks, setBricks] = useState<Brick[]>([])

  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8']

  const initializeBricks = useCallback(() => {
    const newBricks: Brick[] = []
    for (let row = 0; row < BRICK_ROWS; row++) {
      for (let col = 0; col < BRICK_COLS; col++) {
        newBricks.push({
          x: col * (BRICK_WIDTH + BRICK_PADDING) + BRICK_OFFSET_LEFT,
          y: row * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_TOP,
          width: BRICK_WIDTH,
          height: BRICK_HEIGHT,
          color: colors[row % colors.length],
          destroyed: false,
        })
      }
    }
    setBricks(newBricks)
  }, [])

  useEffect(() => {
    initializeBricks()
  }, [initializeBricks])

  useEffect(() => {
    if (gameOver || paused) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      setPaddle(prev => ({ ...prev, x: Math.max(0, Math.min(x - prev.width / 2, CANVAS_WIDTH - prev.width)) }))
    }

    canvas.addEventListener('mousemove', handleMouseMove)

    const gameLoop = setInterval(() => {
      // Clear canvas
      ctx.fillStyle = '#1a1a2e'
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      // Draw bricks
      bricks.forEach(brick => {
        if (!brick.destroyed) {
          ctx.fillStyle = brick.color
          ctx.fillRect(brick.x, brick.y, brick.width, brick.height)
          ctx.strokeStyle = '#fff'
          ctx.strokeRect(brick.x, brick.y, brick.width, brick.height)
        }
      })

      // Update ball
      setBall(prev => {
        let newBall = { ...prev, x: prev.x + prev.vx, y: prev.y + prev.vy }

        // Wall collisions
        if (newBall.x - newBall.radius <= 0 || newBall.x + newBall.radius >= CANVAS_WIDTH) {
          newBall.vx = -newBall.vx
        }
        if (newBall.y - newBall.radius <= 0) {
          newBall.vy = -newBall.vy
        }

        // Paddle collision
        if (
          newBall.y + newBall.radius >= CANVAS_HEIGHT - paddle.height - 20 &&
          newBall.x >= paddle.x &&
          newBall.x <= paddle.x + paddle.width
        ) {
          const hitPos = (newBall.x - paddle.x) / paddle.width
          newBall.vx = (hitPos - 0.5) * 8
          newBall.vy = -Math.abs(newBall.vy)
        }

        // Brick collisions
        setBricks(prevBricks => {
          const newBricks = prevBricks.map(brick => {
            if (brick.destroyed) return brick

            if (
              newBall.x + newBall.radius >= brick.x &&
              newBall.x - newBall.radius <= brick.x + brick.width &&
              newBall.y + newBall.radius >= brick.y &&
              newBall.y - newBall.radius <= brick.y + brick.height
            ) {
              setScore(s => s + 10)
              newBall.vy = -newBall.vy
              return { ...brick, destroyed: true }
            }
            return brick
          })
          return newBricks
        })

        // Ball lost
        if (newBall.y - newBall.radius >= CANVAS_HEIGHT) {
          setLives(prev => {
            const newLives = prev - 1
            if (newLives <= 0) {
              setGameOver(true)
            } else {
              newBall = {
                x: CANVAS_WIDTH / 2,
                y: CANVAS_HEIGHT - 50,
                vx: 4,
                vy: -4,
                radius: 8,
              }
            }
            return newLives
          })
        }

        return newBall
      })

      // Draw paddle
      ctx.fillStyle = '#fff'
      ctx.fillRect(paddle.x, CANVAS_HEIGHT - 20, paddle.width, paddle.height)

      // Draw ball
      ctx.beginPath()
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2)
      ctx.fillStyle = '#fff'
      ctx.fill()

      // Check win condition
      if (bricks.every(b => b.destroyed)) {
        setGameOver(true)
      }
    }, 16)

    return () => {
      clearInterval(gameLoop)
      canvas.removeEventListener('mousemove', handleMouseMove)
    }
  }, [ball, paddle, bricks, gameOver, paused])

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 to-orange-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <Link href="/home" className="text-blue-200 hover:text-blue-100">← Back to Home</Link>
          <h1 className="text-3xl font-bold">🎾 Breakout</h1>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <div className="text-sm text-gray-300">Score</div>
            <div className="text-2xl font-bold">{score}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <div className="text-sm text-gray-300">Lives</div>
            <div className="text-2xl font-bold">{lives}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <div className="text-sm text-gray-300">Bricks</div>
            <div className="text-2xl font-bold">{bricks.filter(b => !b.destroyed).length}</div>
          </div>
        </div>

        {gameOver ? (
          <div className="text-center py-20">
            <h2 className="text-4xl font-bold mb-4">
              {bricks.every(b => b.destroyed) ? '🎉 You Win!' : 'Game Over!'}
            </h2>
            <p className="text-xl mb-8">Final Score: {score}</p>
            <button
              onClick={() => {
                initializeBricks()
                setScore(0)
                setLives(3)
                setGameOver(false)
                setBall({
                  x: CANVAS_WIDTH / 2,
                  y: CANVAS_HEIGHT - 50,
                  vx: 4,
                  vy: -4,
                  radius: 8,
                })
              }}
              className="px-6 py-3 bg-red-600 rounded-lg hover:bg-red-700"
            >
              Play Again
            </button>
          </div>
        ) : (
          <>
            <div className="bg-white/10 rounded-lg p-4 mb-4">
              <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className="w-full max-w-full h-auto border-2 border-white/20 rounded-lg cursor-none"
              />
            </div>
            <div className="text-center text-sm text-gray-300">
              Move your mouse to control the paddle. Break all bricks to win!
            </div>
          </>
        )}
      </div>
    </div>
  )
}



