'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function NumberPuzzlePage() {
  const [grid, setGrid] = useState<number[]>([])
  const [emptyIndex, setEmptyIndex] = useState(15)
  const [moves, setMoves] = useState(0)
  const [time, setTime] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [size, setSize] = useState<3 | 4>(4)

  useEffect(() => {
    startNewGame()
  }, [size])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (gameStarted && !gameWon) {
      interval = setInterval(() => setTime(t => t + 1), 1000)
    }
    return () => clearInterval(interval)
  }, [gameStarted, gameWon])

  const startNewGame = () => {
    const total = size * size
    const numbers = Array.from({ length: total - 1 }, (_, i) => i + 1)
    
    // Shuffle using Fisher-Yates
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]]
    }

    setGrid([...numbers, 0])
    setEmptyIndex(total - 1)
    setMoves(0)
    setTime(0)
    setGameStarted(false)
    setGameWon(false)
  }

  const isSolvable = (arr: number[]): boolean => {
    let inversions = 0
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[i] !== 0 && arr[j] !== 0 && arr[i] > arr[j]) {
          inversions++
        }
      }
    }
    const emptyRow = Math.floor(emptyIndex / size)
    if (size % 2 === 1) return inversions % 2 === 0
    return (inversions + emptyRow) % 2 === 1
  }

  const canMove = (index: number): boolean => {
    const row = Math.floor(index / size)
    const col = index % size
    const emptyRow = Math.floor(emptyIndex / size)
    const emptyCol = emptyIndex % size

    return (
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow)
    )
  }

  const handleClick = (index: number) => {
    if (!canMove(index) || gameWon) return

    if (!gameStarted) setGameStarted(true)

    const newGrid = [...grid]
    newGrid[emptyIndex] = newGrid[index]
    newGrid[index] = 0
    setGrid(newGrid)
    setEmptyIndex(index)
    setMoves(m => m + 1)

    // Check win
    const isWon = newGrid.every((val, idx) => {
      if (idx === newGrid.length - 1) return val === 0
      return val === idx + 1
    })

    if (isWon) {
      setGameWon(true)
      setGameStarted(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-900 via-orange-900 to-red-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-white mb-4">🔢 Number Puzzle</h1>
            <p className="text-gray-300 mb-6">Arrange numbers in order</p>

            <div className="flex justify-center gap-4 mb-6">
              <button
                onClick={() => {
                  setSize(3)
                  startNewGame()
                }}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  size === 3
                    ? 'bg-yellow-500 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                3x3
              </button>
              <button
                onClick={() => {
                  setSize(4)
                  startNewGame()
                }}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  size === 4
                    ? 'bg-yellow-500 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                4x4
              </button>
            </div>

            <div className="flex justify-center gap-8 text-white mb-6">
              <div className="bg-white/10 px-4 py-2 rounded-lg">
                <div className="text-sm text-gray-300">Moves</div>
                <div className="text-2xl font-bold">{moves}</div>
              </div>
              <div className="bg-white/10 px-4 py-2 rounded-lg">
                <div className="text-sm text-gray-300">Time</div>
                <div className="text-2xl font-bold">{formatTime(time)}</div>
              </div>
            </div>

            {gameWon && (
              <div className="mb-6">
                <div className="text-3xl font-bold text-white mb-4">🎉 You Won!</div>
                <button
                  onClick={startNewGame}
                  className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold"
                >
                  Play Again
                </button>
              </div>
            )}

            {!gameWon && (
              <button
                onClick={startNewGame}
                className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold mb-6"
              >
                New Game
              </button>
            )}
          </div>

          <div
            className="grid gap-2 max-w-md mx-auto"
            style={{
              gridTemplateColumns: `repeat(${size}, 1fr)`,
            }}
          >
            {grid.map((value, index) => (
              <motion.button
                key={index}
                onClick={() => handleClick(index)}
                disabled={value === 0 || gameWon}
                className={`aspect-square rounded-lg font-bold text-2xl transition-all ${
                  value === 0
                    ? 'bg-transparent'
                    : canMove(index) && !gameWon
                    ? 'bg-yellow-500 hover:bg-yellow-600 text-white cursor-pointer'
                    : 'bg-white/20 text-white cursor-not-allowed opacity-50'
                }`}
                whileHover={value !== 0 && canMove(index) && !gameWon ? { scale: 1.05 } : {}}
                whileTap={value !== 0 && canMove(index) && !gameWon ? { scale: 0.95 } : {}}
              >
                {value !== 0 && value}
              </motion.button>
            ))}
          </div>

          <div className="mt-8 text-center">
            <a
              href="/"
              className="text-white/70 hover:text-white transition-colors"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}



