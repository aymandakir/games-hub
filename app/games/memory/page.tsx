'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface Card {
  id: number
  emoji: string
  flipped: boolean
  matched: boolean
}

const EMOJI_SETS = [
  ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊'],
  ['🍎', '🍌', '🍇', '🍊', '🍓', '🍉'],
  ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐'],
  ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️'],
  ['⭐', '🌟', '💫', '✨', '🌙', '☀️'],
]

export default function MemoryGamePage() {
  const [cards, setCards] = useState<Card[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [matches, setMatches] = useState(0)
  const [gameWon, setGameWon] = useState(false)
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy')
  const [gameStarted, setGameStarted] = useState(false)

  const cardCounts = { easy: 6, medium: 8, hard: 12 }

  const initializeGame = useCallback(() => {
    const count = cardCounts[difficulty]
    const emojiSet = EMOJI_SETS[Math.floor(Math.random() * EMOJI_SETS.length)]
    const selectedEmojis = emojiSet.slice(0, count)
    const cardPairs = [...selectedEmojis, ...selectedEmojis]
    
    const shuffled = cardPairs
      .map((emoji, index) => ({ id: index, emoji, flipped: false, matched: false }))
      .sort(() => Math.random() - 0.5)

    setCards(shuffled)
    setFlippedCards([])
    setMoves(0)
    setMatches(0)
    setGameWon(false)
    setGameStarted(true)
  }, [difficulty])

  useEffect(() => {
    if (gameStarted) {
      initializeGame()
    }
  }, [difficulty, gameStarted, initializeGame])

  const handleCardClick = (index: number) => {
    if (
      flippedCards.length >= 2 ||
      cards[index].flipped ||
      cards[index].matched ||
      gameWon
    ) {
      return
    }

    const newFlipped = [...flippedCards, index]
    const newCards = cards.map((card, i) =>
      i === index ? { ...card, flipped: true } : card
    )

    setCards(newCards)
    setFlippedCards(newFlipped)

    if (newFlipped.length === 2) {
      setMoves(moves + 1)
      const [first, second] = newFlipped
      
      if (newCards[first].emoji === newCards[second].emoji) {
        setTimeout(() => {
          setCards(prev =>
            prev.map((card, i) =>
              i === first || i === second
                ? { ...card, matched: true, flipped: true }
                : card
            )
          )
          setMatches(matches + 1)
          setFlippedCards([])
          
          if (matches + 1 === cardCounts[difficulty]) {
            setTimeout(() => setGameWon(true), 500)
          }
        }, 500)
      } else {
        setTimeout(() => {
          setCards(prev =>
            prev.map((card, i) =>
              i === first || i === second ? { ...card, flipped: false } : card
            )
          )
          setFlippedCards([])
        }, 1000)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-purple-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/hub"
            className="inline-block mb-4 text-purple-300 hover:text-white transition-colors"
          >
            ← Back to Game Hub
          </Link>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            🧠 Memory Master
          </h1>
          <p className="text-xl text-purple-200">Match pairs to win!</p>
        </div>

        {/* Game Controls */}
        {!gameStarted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Choose Difficulty</h2>
            <div className="flex gap-4 justify-center flex-wrap">
              {(['easy', 'medium', 'hard'] as const).map(level => (
                <button
                  key={level}
                  onClick={() => {
                    setDifficulty(level)
                    setGameStarted(true)
                  }}
                  className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${
                    difficulty === level
                      ? 'bg-purple-600 text-white scale-110'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)} ({cardCounts[level]} pairs)
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-white">{moves}</div>
                <div className="text-purple-200 text-sm">Moves</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-white">{matches}</div>
                <div className="text-purple-200 text-sm">Matches</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-white">
                  {cardCounts[difficulty] - matches}
                </div>
                <div className="text-purple-200 text-sm">Remaining</div>
              </div>
            </div>

            {/* Game Board */}
            <div
              className={`grid gap-4 mb-8 ${
                difficulty === 'easy'
                  ? 'grid-cols-3'
                  : difficulty === 'medium'
                  ? 'grid-cols-4'
                  : 'grid-cols-4'
              }`}
            >
              <AnimatePresence>
                {cards.map((card, index) => (
                  <motion.button
                    key={card.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleCardClick(index)}
                    disabled={card.matched || card.flipped}
                    className={`aspect-square rounded-xl text-4xl md:text-6xl font-bold transition-all ${
                      card.matched
                        ? 'bg-green-500/50 border-2 border-green-400'
                        : card.flipped
                        ? 'bg-purple-600 border-2 border-purple-400'
                        : 'bg-white/20 hover:bg-white/30 border-2 border-white/30'
                    } ${card.matched ? 'cursor-default' : 'cursor-pointer hover:scale-105'}`}
                  >
                    {card.flipped || card.matched ? card.emoji : '?'}
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>

            {/* Actions */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={initializeGame}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-colors"
              >
                🔄 New Game
              </button>
              <button
                onClick={() => {
                  setGameStarted(false)
                  setCards([])
                }}
                className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl font-bold transition-colors"
              >
                ⚙️ Change Difficulty
              </button>
            </div>
          </>
        )}

        {/* Win Modal */}
        <AnimatePresence>
          {gameWon && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
              onClick={() => setGameWon(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-8 text-center max-w-md mx-4"
                onClick={e => e.stopPropagation()}
              >
                <div className="text-8xl mb-4">🎉</div>
                <h2 className="text-4xl font-bold text-white mb-4">You Won!</h2>
                <p className="text-purple-100 mb-6">
                  You completed the game in {moves} moves!
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={initializeGame}
                    className="px-6 py-3 bg-white text-purple-600 rounded-xl font-bold hover:bg-purple-100 transition-colors"
                  >
                    Play Again
                  </button>
                  <Link
                    href="/hub"
                    className="px-6 py-3 bg-white/20 text-white rounded-xl font-bold hover:bg-white/30 transition-colors"
                  >
                    Back to Hub
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

