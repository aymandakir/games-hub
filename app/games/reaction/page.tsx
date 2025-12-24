'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function ReactionGamePage() {
  const [score, setScore] = useState(0)
  const [reactionTime, setReactionTime] = useState<number | null>(null)
  const [waiting, setWaiting] = useState(false)
  const [showTarget, setShowTarget] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [rounds, setRounds] = useState(0)
  const [averageTime, setAverageTime] = useState<number | null>(null)
  const [times, setTimes] = useState<number[]>([])
  const startTimeRef = useRef<number>(0)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const startRound = () => {
    setWaiting(true)
    setShowTarget(false)
    setReactionTime(null)
    
    const waitTime = Math.random() * 3000 + 1000 // 1-4 seconds
    timeoutRef.current = setTimeout(() => {
      setWaiting(false)
      setShowTarget(true)
      startTimeRef.current = Date.now()
    }, waitTime)
  }

  const handleClick = () => {
    if (!showTarget) {
      // Clicked too early
      setScore(Math.max(0, score - 5))
      setReactionTime(null)
      setShowTarget(false)
      setWaiting(false)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      setTimeout(startRound, 1000)
      return
    }

    const time = Date.now() - startTimeRef.current
    setReactionTime(time)
    setTimes([...times, time])
    setScore(score + Math.max(0, 100 - time))
    setRounds(rounds + 1)
    setShowTarget(false)

    if (rounds < 9) {
      setTimeout(startRound, 1500)
    } else {
      setGameStarted(false)
      const avg = times.reduce((a, b) => a + b, time) / (times.length + 1)
      setAverageTime(Math.round(avg))
    }
  }

  const startGame = () => {
    setGameStarted(true)
    setScore(0)
    setRounds(0)
    setTimes([])
    setAverageTime(null)
    startRound()
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-900 via-pink-900 to-red-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Link
            href="/hub"
            className="inline-block mb-4 text-red-300 hover:text-white transition-colors"
          >
            ← Back to Game Hub
          </Link>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent">
            ⚡ Reaction Rush
          </h1>
          <p className="text-xl text-red-200">Click when the target appears!</p>
        </div>

        {!gameStarted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center"
          >
            <p className="text-white mb-6 text-lg">
              Wait for the target to appear, then click as fast as you can!
            </p>
            <button
              onClick={startGame}
              className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xl transition-colors"
            >
              🎮 Start Game
            </button>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-white">{score}</div>
                <div className="text-red-200 text-sm">Score</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-white">{rounds}/10</div>
                <div className="text-red-200 text-sm">Round</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-white">
                  {reactionTime ? `${reactionTime}ms` : '—'}
                </div>
                <div className="text-red-200 text-sm">Time</div>
              </div>
            </div>

            <div
              onClick={handleClick}
              className={`h-96 rounded-2xl cursor-pointer transition-all flex items-center justify-center ${
                waiting
                  ? 'bg-red-800/50'
                  : showTarget
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-white/10'
              }`}
            >
              {waiting && (
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="text-6xl text-white"
                >
                  Wait...
                </motion.div>
              )}
              {showTarget && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-8xl"
                >
                  🎯
                </motion.div>
              )}
              {reactionTime !== null && !showTarget && !waiting && (
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">
                    {reactionTime}ms
                  </div>
                  <div className="text-xl text-red-200">
                    {reactionTime < 200 ? '⚡ Lightning Fast!' : reactionTime < 300 ? '🔥 Great!' : '👍 Good!'}
                  </div>
                </div>
              )}
            </div>

            {rounds === 10 && averageTime !== null && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center"
              >
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-3xl font-bold text-white mb-4">Game Complete!</h2>
                <p className="text-red-200 text-xl mb-2">Final Score: {score}</p>
                <p className="text-red-200 text-lg mb-6">Average Reaction Time: {averageTime}ms</p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={startGame}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-colors"
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

