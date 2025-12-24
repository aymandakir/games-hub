'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2']

export default function ColorMemoryPage() {
  const [sequence, setSequence] = useState<number[]>([])
  const [playerSequence, setPlayerSequence] = useState<number[]>([])
  const [level, setLevel] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPlayerTurn, setIsPlayerTurn] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    startNewGame()
  }, [])

  const startNewGame = () => {
    setLevel(1)
    setSequence([])
    setPlayerSequence([])
    setGameOver(false)
    setIsPlaying(false)
    setIsPlayerTurn(false)
    generateNextSequence()
  }

  const generateNextSequence = () => {
    const newColor = Math.floor(Math.random() * COLORS.length)
    setSequence([...sequence, newColor])
    setIsPlaying(true)
    setIsPlayerTurn(false)
    setPlayerSequence([])
    setCurrentIndex(0)

    // Show sequence
    setTimeout(() => {
      playSequence([...sequence, newColor])
    }, 500)
  }

  const playSequence = (seq: number[]) => {
    seq.forEach((colorIndex, index) => {
      setTimeout(() => {
        setCurrentIndex(colorIndex)
        setTimeout(() => {
          setCurrentIndex(-1)
          if (index === seq.length - 1) {
            setIsPlayerTurn(true)
            setIsPlaying(false)
          }
        }, 500)
      }, index * 600)
    })
  }

  const handleColorClick = (colorIndex: number) => {
    if (!isPlayerTurn || isPlaying) return

    const newPlayerSequence = [...playerSequence, colorIndex]
    setPlayerSequence(newPlayerSequence)

    // Check if correct
    if (newPlayerSequence[newPlayerSequence.length - 1] !== sequence[newPlayerSequence.length - 1]) {
      // Wrong!
      setGameOver(true)
      setIsPlayerTurn(false)
      return
    }

    // Check if sequence complete
    if (newPlayerSequence.length === sequence.length) {
      // Level complete!
      setTimeout(() => {
        setLevel(level + 1)
        generateNextSequence()
      }, 1000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-white mb-4">🌈 Color Memory</h1>
            <p className="text-gray-300 mb-6">Remember and repeat the color sequence!</p>

            <div className="flex justify-center gap-8 text-white mb-6">
              <div className="bg-white/10 px-4 py-2 rounded-lg">
                <div className="text-sm text-gray-300">Level</div>
                <div className="text-2xl font-bold">{level}</div>
              </div>
              <div className="bg-white/10 px-4 py-2 rounded-lg">
                <div className="text-sm text-gray-300">Sequence Length</div>
                <div className="text-2xl font-bold">{sequence.length}</div>
              </div>
            </div>

            {gameOver && (
              <div className="mb-6">
                <div className="text-3xl font-bold text-white mb-4">Game Over! 😢</div>
                <div className="text-xl text-gray-300 mb-4">You reached level {level}</div>
                <button
                  onClick={startNewGame}
                  className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold"
                >
                  Play Again
                </button>
              </div>
            )}

            {!gameOver && (
              <div className="mb-6">
                {isPlaying && (
                  <div className="text-xl text-white mb-4">Watch the sequence...</div>
                )}
                {isPlayerTurn && !isPlaying && (
                  <div className="text-xl text-white mb-4 animate-pulse">Your turn! Repeat the sequence</div>
                )}
                {!isPlayerTurn && !isPlaying && (
                  <button
                    onClick={generateNextSequence}
                    className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold"
                  >
                    Start Game
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
            {COLORS.map((color, index) => (
              <motion.button
                key={index}
                onClick={() => handleColorClick(index)}
                disabled={!isPlayerTurn || isPlaying || gameOver}
                className={`aspect-square rounded-xl transition-all ${
                  currentIndex === index
                    ? 'ring-4 ring-white scale-110'
                    : 'opacity-70 hover:opacity-100'
                } ${!isPlayerTurn || isPlaying || gameOver ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                style={{ backgroundColor: color }}
                whileHover={isPlayerTurn && !isPlaying && !gameOver ? { scale: 1.1 } : {}}
                whileTap={isPlayerTurn && !isPlaying && !gameOver ? { scale: 0.9 } : {}}
              />
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

