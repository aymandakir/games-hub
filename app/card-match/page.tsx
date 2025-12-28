'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Card {
  id: number
  value: number
  flipped: boolean
  matched: boolean
}

export default function CardMatchPage() {
  const [cards, setCards] = useState<Card[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [matches, setMatches] = useState(0)
  const [gameWon, setGameWon] = useState(false)
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy')

  const gridSizes = {
    easy: 4,
    medium: 6,
    hard: 8,
  }

  const gridSize = gridSizes[difficulty]
  const totalPairs = (gridSize * gridSize) / 2

  useEffect(() => {
    startNewGame()
  }, [difficulty])

  const startNewGame = () => {
    const values: number[] = []
    for (let i = 1; i <= totalPairs; i++) {
      values.push(i, i)
    }
    
    // Shuffle
    for (let i = values.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [values[i], values[j]] = [values[j], values[i]]
    }

    const newCards: Card[] = values.map((value, index) => ({
      id: index,
      value,
      flipped: false,
      matched: false,
    }))

    setCards(newCards)
    setFlippedCards([])
    setMoves(0)
    setMatches(0)
    setGameWon(false)
  }

  const handleCardClick = (cardId: number) => {
    const card = cards[cardId]
    
    if (card.flipped || card.matched || flippedCards.length >= 2) return

    const newCards = [...cards]
    newCards[cardId].flipped = true
    setCards(newCards)
    setFlippedCards([...flippedCards, cardId])

    if (flippedCards.length === 1) {
      const firstCard = cards[flippedCards[0]]
      setMoves(moves + 1)

      if (firstCard.value === card.value) {
        // Match!
        setTimeout(() => {
          const updatedCards = [...newCards]
          updatedCards[flippedCards[0]].matched = true
          updatedCards[cardId].matched = true
          setCards(updatedCards)
          setFlippedCards([])
          setMatches(matches + 1)
          
          if (matches + 1 === totalPairs) {
            setGameWon(true)
          }
        }, 500)
      } else {
        // No match
        setTimeout(() => {
          const updatedCards = [...newCards]
          updatedCards[flippedCards[0]].flipped = false
          updatedCards[cardId].flipped = false
          setCards(updatedCards)
          setFlippedCards([])
        }, 1000)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-white mb-4">🃏 Card Match Challenge</h1>
            <p className="text-gray-300 mb-6">Match pairs of cards to win!</p>
            
            <div className="flex justify-center gap-4 mb-6">
              <button
                onClick={() => setDifficulty('easy')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  difficulty === 'easy'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                Easy (4x4)
              </button>
              <button
                onClick={() => setDifficulty('medium')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  difficulty === 'medium'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                Medium (6x6)
              </button>
              <button
                onClick={() => setDifficulty('hard')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  difficulty === 'hard'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                Hard (8x8)
              </button>
            </div>

            <div className="flex justify-center gap-8 text-white mb-6">
              <div className="bg-white/10 px-4 py-2 rounded-lg">
                <div className="text-sm text-gray-300">Moves</div>
                <div className="text-2xl font-bold">{moves}</div>
              </div>
              <div className="bg-white/10 px-4 py-2 rounded-lg">
                <div className="text-sm text-gray-300">Matches</div>
                <div className="text-2xl font-bold">{matches} / {totalPairs}</div>
              </div>
            </div>

            <button
              onClick={startNewGame}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all"
            >
              New Game
            </button>
          </div>

          <AnimatePresence>
            {gameWon && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              >
                <motion.div
                  initial={{ y: -50 }}
                  animate={{ y: 0 }}
                  className="bg-white rounded-2xl p-8 text-center max-w-md"
                >
                  <div className="text-6xl mb-4">🎉</div>
                  <h2 className="text-3xl font-bold mb-4">You Won!</h2>
                  <p className="text-gray-600 mb-6">Completed in {moves} moves!</p>
                  <button
                    onClick={() => {
                      setGameWon(false)
                      startNewGame()
                    }}
                    className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold"
                  >
                    Play Again
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            }}
          >
            {cards.map((card) => (
              <motion.button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                className={`aspect-square rounded-xl font-bold text-2xl transition-all ${
                  card.matched
                    ? 'bg-green-500 text-white'
                    : card.flipped
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/20 hover:bg-white/30 text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={card.matched}
              >
                {card.flipped || card.matched ? card.value : '?'}
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



