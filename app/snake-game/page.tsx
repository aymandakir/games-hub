'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !gameStarted) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const gridSize = 20
    const tileCount = canvas.width / gridSize

    let snake = [{ x: 10, y: 10 }]
    let food = { x: 15, y: 15 }
    let dx = 0
    let dy = 0
    let gameLoop: number

    const drawGame = () => {
      clearCanvas()
      drawSnake()
      drawFood()
      moveSnake()
    }

    const clearCanvas = () => {
      ctx.fillStyle = '#1a1a2e'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    const drawSnake = () => {
      ctx.fillStyle = '#4ade80'
      snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2)
      })
    }

    const drawFood = () => {
      ctx.fillStyle = '#ef4444'
      ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2)
    }

    const moveSnake = () => {
      const head = { x: snake[0].x + dx, y: snake[0].y + dy }

      // Check wall collision
      if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        setGameOver(true)
        return
      }

      // Check self collision
      if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true)
        return
      }

      snake.unshift(head)

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(score + 10)
        generateFood()
      } else {
        snake.pop()
      }
    }

    const generateFood = () => {
      food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount),
      }
      // Make sure food doesn't spawn on snake
      if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        generateFood()
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' && dy !== 1) {
        dx = 0
        dy = -1
      } else if (e.key === 'ArrowDown' && dy !== -1) {
        dx = 0
        dy = 1
      } else if (e.key === 'ArrowLeft' && dx !== 1) {
        dx = -1
        dy = 0
      } else if (e.key === 'ArrowRight' && dx !== -1) {
        dx = 1
        dy = 0
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    gameLoop = setInterval(() => {
      if (!gameOver) {
        drawGame()
      }
    }, 100)

    return () => {
      clearInterval(gameLoop)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [gameStarted, gameOver, score])

  const startGame = () => {
    setGameStarted(true)
    setGameOver(false)
    setScore(0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 to-cyan-900 flex flex-col items-center justify-center p-8">
      <h1 className="text-5xl font-bold text-white mb-8">🐍 Snake Redux</h1>

      {!gameStarted && !gameOver && (
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 text-center">
          <p className="text-2xl text-white mb-4">Use Arrow Keys to Play</p>
          <button
            onClick={startGame}
            className="px-8 py-4 bg-emerald-500 text-white rounded-xl text-xl hover:bg-emerald-600"
          >
            Start Game
          </button>
        </div>
      )}

      {gameStarted && (
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8">
          <p className="text-2xl text-white">Score: {score}</p>
        </div>
      )}

      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="border-4 border-gray-700 rounded-xl bg-gray-900"
      />

      {gameOver && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-12 text-center">
            <h2 className="text-5xl font-bold mb-4">💀 Game Over!</h2>
            <p className="text-2xl text-gray-600 mb-8">Final Score: {score}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={startGame}
                className="px-8 py-4 bg-emerald-500 text-white rounded-xl text-xl hover:bg-emerald-600"
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
        </div>
      )}

      <Link href="/">
        <button className="mt-8 px-6 py-3 bg-white/20 text-white rounded-xl hover:bg-white/30">
          ← Back to Hub
        </button>
      </Link>
    </div>
  )
}

