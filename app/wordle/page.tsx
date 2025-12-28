'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const WORDS = [
  'APPLE', 'BRAVE', 'CLOUD', 'DREAM', 'EARTH', 'FLAME', 'GLASS', 'HEART',
  'IMAGE', 'JOKER', 'KNIFE', 'LIGHT', 'MAGIC', 'NIGHT', 'OCEAN', 'PEACE',
  'QUICK', 'RIVER', 'STORM', 'TIGER', 'UNITY', 'VALUE', 'WATER', 'YOUTH',
  'ZEBRA', 'ALPHA', 'BETA', 'GAMMA', 'DELTA', 'OMEGA'
]

type LetterState = 'empty' | 'wrong' | 'wrong-position' | 'correct'

interface Letter {
  char: string
  state: LetterState
}

export default function WordlePage() {
  const [targetWord, setTargetWord] = useState('')
  const [guesses, setGuesses] = useState<Letter[][]>([])
  const [currentGuess, setCurrentGuess] = useState('')
  const [gameWon, setGameWon] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [usedLetters, setUsedLetters] = useState<Record<string, LetterState>>({})

  useEffect(() => {
    startNewGame()
  }, [])

  const startNewGame = () => {
    const word = WORDS[Math.floor(Math.random() * WORDS.length)]
    setTargetWord(word)
    setGuesses([])
    setCurrentGuess('')
    setGameWon(false)
    setGameOver(false)
    setUsedLetters({})
  }

  const handleKeyPress = (key: string) => {
    if (gameWon || gameOver) return

    if (key === 'ENTER') {
      if (currentGuess.length === 5) {
        submitGuess()
      }
    } else if (key === 'BACKSPACE') {
      setCurrentGuess(prev => prev.slice(0, -1))
    } else if (key.length === 1 && /[A-Z]/.test(key) && currentGuess.length < 5) {
      setCurrentGuess(prev => prev + key)
    }
  }

  const submitGuess = () => {
    if (currentGuess.length !== 5) return

    const guessArray: Letter[] = currentGuess.split('').map((char, idx) => {
      let state: LetterState = 'wrong'
      if (targetWord[idx] === char) {
        state = 'correct'
      } else if (targetWord.includes(char)) {
        state = 'wrong-position'
      }

      return { char, state }
    })

    const newUsedLetters = { ...usedLetters }
    guessArray.forEach(({ char, state }) => {
      if (!newUsedLetters[char] || state === 'correct') {
        newUsedLetters[char] = state
      } else if (state === 'wrong-position' && newUsedLetters[char] === 'wrong') {
        newUsedLetters[char] = state
      }
    })
    setUsedLetters(newUsedLetters)

    setGuesses([...guesses, guessArray])
    
    if (currentGuess === targetWord) {
      setGameWon(true)
    } else if (guesses.length >= 5) {
      setGameOver(true)
    }

    setCurrentGuess('')
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleKeyPress('ENTER')
      } else if (e.key === 'Backspace') {
        handleKeyPress('BACKSPACE')
      } else if (e.key.length === 1 && /[A-Za-z]/.test(e.key)) {
        handleKeyPress(e.key.toUpperCase())
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentGuess, gameWon, gameOver, guesses.length, targetWord])

  const getLetterColor = (state: LetterState) => {
    switch (state) {
      case 'correct': return 'bg-green-500'
      case 'wrong-position': return 'bg-yellow-500'
      case 'wrong': return 'bg-gray-600'
      default: return 'bg-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-white mb-4">📝 Wordle</h1>
            <p className="text-gray-300 mb-6">Guess the 5-letter word in 6 tries</p>

            {gameWon && (
              <div className="mb-6">
                <div className="text-3xl font-bold text-white mb-4">🎉 You Won!</div>
                <div className="text-lg text-gray-300 mb-4">The word was: <strong>{targetWord}</strong></div>
                <button
                  onClick={startNewGame}
                  className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold"
                >
                  Play Again
                </button>
              </div>
            )}

            {gameOver && !gameWon && (
              <div className="mb-6">
                <div className="text-3xl font-bold text-white mb-4">😢 Game Over</div>
                <div className="text-lg text-gray-300 mb-4">The word was: <strong>{targetWord}</strong></div>
                <button
                  onClick={startNewGame}
                  className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold"
                >
                  Try Again
                </button>
              </div>
            )}

            {!gameWon && !gameOver && (
              <div className="text-lg text-white mb-6">
                Guesses remaining: {6 - guesses.length}
              </div>
            )}
          </div>

          <div className="space-y-2 mb-8">
            {[...Array(6)].map((_, rowIdx) => {
              const guess = guesses[rowIdx] || []
              const isCurrent = rowIdx === guesses.length && !gameWon && !gameOver

              return (
                <div key={rowIdx} className="flex gap-2 justify-center">
                  {[...Array(5)].map((_, colIdx) => {
                    const letter = guess[colIdx] || { char: isCurrent ? currentGuess[colIdx] || '' : '', state: 'empty' as LetterState }
                    return (
                      <motion.div
                        key={colIdx}
                        className={`w-16 h-16 rounded-lg flex items-center justify-center text-2xl font-bold text-white border-2 ${
                          letter.state === 'empty'
                            ? 'bg-gray-800 border-gray-700'
                            : getLetterColor(letter.state) + ' border-transparent'
                        } ${isCurrent && colIdx === currentGuess.length ? 'ring-2 ring-white' : ''}`}
                        initial={{ scale: 0.8, rotateY: -90 }}
                        animate={{ scale: 1, rotateY: 0 }}
                        transition={{ duration: 0.3, delay: colIdx * 0.1 }}
                      >
                        {letter.char}
                      </motion.div>
                    )
                  })}
                </div>
              )
            })}
          </div>

          <div className="space-y-2">
            {['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'].map((row, rowIdx) => (
              <div key={rowIdx} className="flex gap-1 justify-center">
                {row.split('').map((char) => {
                  const state = usedLetters[char] || 'empty'
                  return (
                    <motion.button
                      key={char}
                      onClick={() => handleKeyPress(char)}
                      className={`px-3 py-2 rounded-lg font-bold text-sm ${
                        state === 'correct'
                          ? 'bg-green-500 text-white'
                          : state === 'wrong-position'
                          ? 'bg-yellow-500 text-white'
                          : state === 'wrong'
                          ? 'bg-gray-600 text-white'
                          : 'bg-gray-700 text-white hover:bg-gray-600'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      disabled={gameWon || gameOver}
                    >
                      {char}
                    </motion.button>
                  )
                })}
                {rowIdx === 2 && (
                  <>
                    <motion.button
                      onClick={() => handleKeyPress('ENTER')}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg font-bold text-sm"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      disabled={gameWon || gameOver || currentGuess.length !== 5}
                    >
                      ENTER
                    </motion.button>
                    <motion.button
                      onClick={() => handleKeyPress('BACKSPACE')}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg font-bold text-sm"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      disabled={gameWon || gameOver || currentGuess.length === 0}
                    >
                      ⌫
                    </motion.button>
                  </>
                )}
              </div>
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



