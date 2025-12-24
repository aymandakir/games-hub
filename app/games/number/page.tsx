'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function NumberGamePage() {
  const [score, setScore] = useState(0)
  const [question, setQuestion] = useState({ num1: 0, num2: 0, operator: '+' as '+' | '-' | '×', answer: 0 })
  const [userAnswer, setUserAnswer] = useState('')
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [timeLeft, setTimeLeft] = useState(60)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy')

  const generateQuestion = () => {
    const operators = ['+', '-', '×'] as const
    const operator = operators[Math.floor(Math.random() * operators.length)]
    
    let num1: number, num2: number, answer: number
    
    if (difficulty === 'easy') {
      num1 = Math.floor(Math.random() * 20) + 1
      num2 = Math.floor(Math.random() * 20) + 1
    } else if (difficulty === 'medium') {
      num1 = Math.floor(Math.random() * 50) + 1
      num2 = Math.floor(Math.random() * 50) + 1
    } else {
      num1 = Math.floor(Math.random() * 100) + 1
      num2 = Math.floor(Math.random() * 100) + 1
    }

    if (operator === '+') {
      answer = num1 + num2
    } else if (operator === '-') {
      if (num1 < num2) [num1, num2] = [num2, num1]
      answer = num1 - num2
    } else {
      num1 = Math.floor(Math.random() * 12) + 1
      num2 = Math.floor(Math.random() * 12) + 1
      answer = num1 * num2
    }

    setQuestion({ num1, num2, operator, answer })
    setUserAnswer('')
    setFeedback(null)
  }

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
      generateQuestion()
    }
  }, [gameStarted, difficulty, gameOver])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const answer = parseInt(userAnswer)
    if (answer === question.answer) {
      setScore(score + 10)
      setFeedback('correct')
      setTimeout(() => {
        generateQuestion()
        setFeedback(null)
      }, 1000)
    } else {
      setFeedback('wrong')
      setTimeout(() => {
        setFeedback(null)
        setUserAnswer('')
      }, 1000)
    }
  }

  const startGame = () => {
    setGameStarted(true)
    setScore(0)
    setTimeLeft(60)
    setGameOver(false)
    generateQuestion()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-900 via-amber-900 to-orange-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Link
            href="/hub"
            className="inline-block mb-4 text-orange-300 hover:text-white transition-colors"
          >
            ← Back to Game Hub
          </Link>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent">
            🔢 Number Ninja
          </h1>
          <p className="text-xl text-orange-200">Solve math problems quickly!</p>
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
                      ? 'bg-orange-600 text-white scale-110'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
            <button
              onClick={startGame}
              className="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold text-xl transition-colors"
            >
              🎮 Start Game
            </button>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-white">{score}</div>
                <div className="text-orange-200 text-sm">Score</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-white">{timeLeft}s</div>
                <div className="text-orange-200 text-sm">Time</div>
              </div>
            </div>

            {!gameOver ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center mb-8"
              >
                <div className="mb-6">
                  <p className="text-orange-200 mb-4 text-lg">Solve this:</p>
                  <div className="text-7xl md:text-9xl font-bold text-white mb-6">
                    {question.num1} {question.operator === '×' ? '×' : question.operator} {question.num2}
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  <input
                    type="number"
                    value={userAnswer}
                    onChange={e => setUserAnswer(e.target.value)}
                    className="w-full max-w-md mx-auto px-6 py-4 text-3xl text-center bg-white/20 border-2 border-orange-400 rounded-xl text-white placeholder-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="?"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="mt-4 px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold transition-colors"
                  >
                    Submit
                  </button>
                </form>

                {feedback && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`mt-4 text-2xl font-bold ${
                      feedback === 'correct' ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {feedback === 'correct' ? '✓ Correct!' : '✗ Try Again'}
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center"
              >
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-3xl font-bold text-white mb-4">Time's Up!</h2>
                <p className="text-orange-200 text-xl mb-6">Final Score: {score}</p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={startGame}
                    className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold transition-colors"
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

