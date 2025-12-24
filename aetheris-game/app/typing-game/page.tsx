'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const QUOTES = [
  'The quick brown fox jumps over the lazy dog',
  'Practice makes perfect in typing and gaming',
  'Speed and accuracy are both important skills',
  'Every keystroke brings you closer to mastery',
  'Typing is an essential skill in the digital age',
]

export default function TypingRacer() {
  const [quote, setQuote] = useState('')
  const [input, setInput] = useState('')
  const [startTime, setStartTime] = useState<number | null>(null)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    startNewGame()
  }, [])

  const startNewGame = () => {
    const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)]
    setQuote(randomQuote)
    setInput('')
    setStartTime(null)
    setWpm(0)
    setAccuracy(100)
    setGameStarted(false)
    setGameFinished(false)
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    if (!gameStarted) {
      setGameStarted(true)
      setStartTime(Date.now())
    }

    setInput(value)

    // Calculate accuracy
    let correct = 0
    for (let i = 0; i < value.length; i++) {
      if (value[i] === quote[i]) correct++
    }
    const acc = value.length > 0 ? (correct / value.length) * 100 : 100
    setAccuracy(Math.round(acc))

    // Calculate WPM
    if (startTime) {
      const timeElapsed = (Date.now() - startTime) / 1000 / 60 // minutes
      const wordsTyped = value.split(' ').filter(w => w.length > 0).length
      setWpm(Math.round(wordsTyped / timeElapsed) || 0)
    }

    // Check if finished
    if (value === quote) {
      setGameFinished(true)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-900 to-orange-900 flex flex-col items-center justify-center p-8">
      <h1 className="text-5xl font-bold text-white mb-8">⌨️ Type Racer</h1>

      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 flex gap-8">
        <div className="text-center">
          <p className="text-4xl font-bold text-white">{wpm}</p>
          <p className="text-gray-300">WPM</p>
        </div>
        <div className="text-center">
          <p className="text-4xl font-bold text-white">{accuracy}%</p>
          <p className="text-gray-300">Accuracy</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 mb-8 max-w-2xl w-full">
        <p className="text-2xl text-gray-800 mb-6 font-mono leading-relaxed">
          {quote.split('').map((char, i) => (
            <span
              key={i}
              className={
                i < input.length
                  ? input[i] === char
                    ? 'text-green-500'
                    : 'text-red-500 bg-red-100'
                  : 'text-gray-400'
              }
            >
              {char}
            </span>
          ))}
        </p>

        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInput}
          disabled={gameFinished}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-xl font-mono focus:outline-none focus:border-blue-500"
          placeholder="Start typing..."
        />
      </div>

      {gameFinished && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-12 text-center">
            <h2 className="text-5xl font-bold mb-4">🏁 Finished!</h2>
            <p className="text-2xl text-gray-600 mb-2">WPM: {wpm}</p>
            <p className="text-2xl text-gray-600 mb-8">Accuracy: {accuracy}%</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={startNewGame}
                className="px-8 py-4 bg-blue-500 text-white rounded-xl text-xl hover:bg-blue-600"
              >
                Race Again
              </button>
              <Link href="/">
                <button className="px-8 py-4 bg-gray-700 text-white rounded-xl text-xl hover:bg-gray-600">
                  Back to Hub
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}

      <Link href="/">
        <button className="px-6 py-3 bg-white/20 text-white rounded-xl hover:bg-white/30">
          ← Back to Hub
        </button>
      </Link>
    </div>
  )
}

