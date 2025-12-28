'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export default function ReactionTestPage() {
  const [waiting, setWaiting] = useState(false)
  const [ready, setReady] = useState(false)
  const [reactionTime, setReactionTime] = useState<number | null>(null)
  const [times, setTimes] = useState<number[]>([])
  const [gameStarted, setGameStarted] = useState(false)
  const startTimeRef = useRef<number>(0)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const startTest = () => {
    setGameStarted(true)
    setReady(false)
    setWaiting(true)
    setReactionTime(null)

    // Random wait between 1-5 seconds
    const waitTime = Math.random() * 4000 + 1000
    timeoutRef.current = setTimeout(() => {
      setWaiting(false)
      setReady(true)
      startTimeRef.current = Date.now()
    }, waitTime)
  }

  const handleClick = () => {
    if (!ready) {
      // Clicked too early
      clearTimeout(timeoutRef.current)
      setWaiting(false)
      setReady(false)
      alert('Too early! Wait for the green light.')
      return
    }

    const time = Date.now() - startTimeRef.current
    setReactionTime(time)
    setTimes([...times, time])
    setReady(false)
  }

  const reset = () => {
    clearTimeout(timeoutRef.current)
    setWaiting(false)
    setReady(false)
    setReactionTime(null)
    setGameStarted(false)
  }

  const averageTime = times.length > 0
    ? Math.round(times.reduce((a, b) => a + b, 0) / times.length)
    : 0

  const bestTime = times.length > 0 ? Math.min(...times) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-900 via-orange-900 to-red-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-white mb-4">⚡ Reaction Master</h1>
            <p className="text-gray-300 mb-6">Click when the screen turns green!</p>

            {!gameStarted && (
              <button
                onClick={startTest}
                className="px-8 py-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold text-xl mb-6"
              >
                Start Test
              </button>
            )}

            {gameStarted && !ready && (
              <div className="mb-6">
                <p className="text-xl text-white mb-4">Wait for green...</p>
                <button
                  onClick={handleClick}
                  className="w-full h-64 bg-red-500 rounded-xl font-bold text-white text-4xl"
                >
                  WAIT
                </button>
              </div>
            )}

            {ready && (
              <div className="mb-6">
                <p className="text-xl text-white mb-4 animate-pulse">CLICK NOW!</p>
                <motion.button
                  onClick={handleClick}
                  className="w-full h-64 bg-green-500 rounded-xl font-bold text-white text-4xl"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                >
                  CLICK!
                </motion.button>
              </div>
            )}

            {reactionTime !== null && (
              <div className="mb-6">
                <div className="text-4xl font-bold text-white mb-2">
                  {reactionTime}ms
                </div>
                <div className="text-lg text-gray-300 mb-4">
                  {reactionTime < 200 ? '⚡ Lightning Fast!' :
                   reactionTime < 300 ? '🚀 Very Fast!' :
                   reactionTime < 400 ? '👍 Good!' :
                   reactionTime < 500 ? '👌 Average' :
                   '🐢 Slow'}
                </div>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={startTest}
                    className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={reset}
                    className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}

            {times.length > 0 && (
              <div className="bg-white/10 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold text-white mb-4">Statistics</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-sm text-gray-300">Average</div>
                    <div className="text-2xl font-bold text-white">{averageTime}ms</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-300">Best</div>
                    <div className="text-2xl font-bold text-white">{bestTime}ms</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-300">Tests</div>
                    <div className="text-2xl font-bold text-white">{times.length}</div>
                  </div>
                </div>
              </div>
            )}
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



