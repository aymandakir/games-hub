'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

const EMOJIS = ['🎮', '🎯', '🎨', '🎭', '🎪', '🎸', '🎺', '🎻']

export default function MemoryGame() {
  const [cards, setCards] = useState<string[]>([])
  const [flipped, setFlipped] = useState<number[]>([])
  const [matched, setMatched] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [gameWon, setGameWon] = useState(false)

  useEffect(() => {
    startGame()
  }, [])

  const startGame = () => {
    const shuffled = [...EMOJIS, ...EMOJIS].sort(() => Math.random() - 0.5)
    setCards(shuffled)
    setFlipped([])
    setMatched([])
    setMoves(0)
    setGameWon(false)
  }

  const handleCardClick = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) {
      return
    }

    const newFlipped = [...flipped, index]
    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      setMoves(moves + 1)
      const [first, second] = newFlipped

      if (cards[first] === cards[second]) {
        const newMatched = [...matched, first, second]
        setMatched(newMatched)
        setFlipped([])

        if (newMatched.length === cards.length) {
          setGameWon(true)
        }
      } else {
        setTimeout(() => setFlipped([]), 1000)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 to-teal-900 flex flex-col items-center justify-center p-8">
      <h1 className="text-5xl font-bold text-white mb-8">🧠 Memory Master</h1>

      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8">
        <p className="text-2xl text-white">Moves: {moves}</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCardClick(index)}
            className="relative w-24 h-24 cursor-pointer"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-4xl transition-all duration-300 ${
                flipped.includes(index) || matched.includes(index)
                  ? 'rotate-y-180 opacity-0'
                  : ''
              }`}
            >
              ❓
            </div>
            <div
              className={`absolute inset-0 bg-white rounded-xl flex items-center justify-center text-4xl transition-all duration-300 ${
                flipped.includes(index) || matched.includes(index)
                  ? ''
                  : 'rotate-y-180 opacity-0'
              }`}
            >
              {card}
            </div>
          </motion.div>
        ))}
      </div>

      {gameWon && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
        >
          <div className="bg-white rounded-3xl p-12 text-center">
            <h2 className="text-5xl font-bold mb-4">🎉 You Won!</h2>
            <p className="text-2xl text-gray-600 mb-8">Moves: {moves}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={startGame}
                className="px-8 py-4 bg-green-500 text-white rounded-xl text-xl hover:bg-green-600"
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
        </motion.div>
      )}

      <Link href="/">
        <button className="px-6 py-3 bg-white/20 text-white rounded-xl hover:bg-white/30">
          ← Back to Hub
        </button>
      </Link>
    </div>
  )
}

