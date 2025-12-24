'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

const WORD_LISTS = {
  easy: ['CAT', 'DOG', 'SUN', 'MOON', 'STAR', 'TREE', 'BOOK', 'FISH'],
  medium: ['BRAVE', 'CLOUD', 'DREAM', 'EARTH', 'FLAME', 'GLASS', 'HEART', 'LIGHT'],
  hard: ['ADVENTURE', 'BEAUTIFUL', 'CHALLENGE', 'DISCOVER', 'ELEGANT', 'FANTASTIC', 'GENEROUS', 'HARMONY'],
}

const WORDS = [
  'CAT', 'DOG', 'SUN', 'MOON', 'STAR', 'TREE', 'BOOK', 'FISH',
  'BRAVE', 'CLOUD', 'DREAM', 'EARTH', 'FLAME', 'GLASS', 'HEART', 'LIGHT',
  'ADVENTURE', 'BEAUTIFUL', 'CHALLENGE', 'DISCOVER', 'ELEGANT', 'FANTASTIC',
]

export default function WordGamePage() {
  const [currentWord, setCurrentWord] = useState('')
  const [scrambledWord, setScrambledWord] = useState('')
  const [userInput, setUserInput] = useState('')
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [hint, setHint] = useState('')
  const [gameOver, setGameOver] = useState(false)
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy')
  const [timeLeft, setTimeLeft] = useState(60)
  const [gameStarted, setGameStarted] = useState(false)

  const scrambleWord = (word: string): string => {
    return word
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('')
  }

  const getRandomWord = useCallback(() => {
    const words = WORD_LISTS[difficulty]
    const word = words[Math.floor(Math.random() * words.length)]
    setCurrentWord(word)
    setScrambledWord(scrambleWord(word))
    setUserInput('')
    setHint(`Hint: ${word.length} letters, starts with ${word[0]}`)
  }, [difficulty])

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !gameOver) {
      setGameOver(true)
    }
  }, [timeLeft, gameStarted, gameOver])

  useEffect(() => {
    if (gameStarted && !gameOver) {
      getRandomWord()
    }
  }, [gameStarted, difficulty, getRandomWord, gameOver])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (userInput.toUpperCase() === currentWord) {
      setScore(score + 10)
      getRandomWord()
    } else {
      setLives(lives - 1)
      if (lives - 1 === 0) {
        setGameOver(true)
      } else {
        setUserInput('')
      }
    }
  }

  const startGame = () => {
    setGameStarted(true)
    setScore(0)
    setLives(3)
    setTimeLeft(60)
    setGameOver(false)
    getRandomWord()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900 via-emerald-900 to-green-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/hub"
            className="inline-block mb-4 text-green-300 hover:text-white transition-colors"
          >
            ← Back to Game Hub
          </Link>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            📝 Word Wizard
          </h1>
          <p className="text-xl text-green-200">Unscramble the words!</p>
        </div>

        {!gameStarted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Choose Difficulty</h2>
            <div className="flex gap-4 justify-center flex-wrap mb-6">
              {(['easy', 'medium', 'hard'] as const).map(level => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${
                    difficulty === level
                      ? 'bg-green-600 text-white scale-110'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
            <button
              onClick={startGame}
              className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-xl transition-colors"
            >
              🎮 Start Game
            </button>
          </motion.div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-white">{score}</div>
                <div className="text-green-200 text-sm">Score</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-white">{lives}</div>
                <div className="text-green-200 text-sm">Lives</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-white">{timeLeft}s</div>
                <div className="text-green-200 text-sm">Time</div>
              </div>
            </div>

            {/* Game Area */}
            {!gameOver ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center mb-8"
              >
                <div className="mb-6">
                  <p className="text-green-200 mb-2">Unscramble this word:</p>
                  <div className="text-6xl md:text-8xl font-bold text-white mb-4 tracking-wider">
                    {scrambledWord}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="mb-4">
                  <input
                    type="text"
                    value={userInput}
                    onChange={e => setUserInput(e.target.value.toUpperCase())}
                    className="w-full max-w-md mx-auto px-6 py-4 text-2xl text-center bg-white/20 border-2 border-green-400 rounded-xl text-white placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Type your answer..."
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="mt-4 px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-colors"
                  >
                    Submit
                  </button>
                </form>

                <p className="text-green-300 text-sm">{hint}</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center"
              >
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-3xl font-bold text-white mb-4">Game Over!</h2>
                <p className="text-green-200 text-xl mb-6">Final Score: {score}</p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={startGame}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-colors"
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
            )}
          </>
        )}
      </div>
    </div>
  )
}

