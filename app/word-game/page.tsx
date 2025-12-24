'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const WORDS = ['GAME', 'FUN', 'PLAY', 'WIN', 'HUB', 'CODE', 'WEB', 'APP']

export default function WordSearchGame() {
  const [grid, setGrid] = useState<string[][]>([])
  const [selected, setSelected] = useState<number[][]>([])
  const [foundWords, setFoundWords] = useState<string[]>([])
  const [gameWon, setGameWon] = useState(false)

  useEffect(() => {
    startGame()
  }, [])

  const startGame = () => {
    // Create 10x10 grid
    const newGrid: string[][] = []
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

    // Fill with random letters
    for (let i = 0; i < 10; i++) {
      newGrid[i] = []
      for (let j = 0; j < 10; j++) {
        newGrid[i][j] = letters[Math.floor(Math.random() * letters.length)]
      }
    }

    // Place words randomly
    WORDS.forEach(word => {
      const direction = Math.random() > 0.5 ? 'horizontal' : 'vertical'
      const row = Math.floor(Math.random() * (10 - (direction === 'horizontal' ? word.length : 0)))
      const col = Math.floor(Math.random() * (10 - (direction === 'vertical' ? word.length : 0)))

      for (let i = 0; i < word.length; i++) {
        if (direction === 'horizontal') {
          newGrid[row][col + i] = word[i]
        } else {
          newGrid[row + i][col] = word[i]
        }
      }
    })

    setGrid(newGrid)
    setSelected([])
    setFoundWords([])
    setGameWon(false)
  }

  const handleCellClick = (row: number, col: number) => {
    if (foundWords.length === WORDS.length) return

    const newSelected = [...selected, [row, col]]
    setSelected(newSelected)

    // Check if selected cells form a word
    if (newSelected.length >= 3) {
      const word = newSelected.map(([r, c]) => grid[r][c]).join('')
      const reversed = word.split('').reverse().join('')

      if (WORDS.includes(word) || WORDS.includes(reversed)) {
        if (!foundWords.includes(word) && !foundWords.includes(reversed)) {
          const found = WORDS.includes(word) ? word : reversed
          setFoundWords([...foundWords, found])
          setSelected([])

          if (foundWords.length + 1 === WORDS.length) {
            setGameWon(true)
          }
        }
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 to-rose-900 flex flex-col items-center justify-center p-8">
      <h1 className="text-5xl font-bold text-white mb-8">🔤 Word Hunter</h1>

      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8">
        <p className="text-2xl text-white mb-4">
          Found: {foundWords.length} / {WORDS.length}
        </p>
        <div className="flex flex-wrap gap-2">
          {WORDS.map(word => (
            <span
              key={word}
              className={`px-3 py-1 rounded ${
                foundWords.includes(word)
                  ? 'bg-green-500 text-white'
                  : 'bg-white/20 text-gray-300'
              }`}
            >
              {word}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 mb-8">
        <div className="grid grid-cols-10 gap-1">
          {grid.map((row, i) =>
            row.map((cell, j) => {
              const isSelected = selected.some(([r, c]) => r === i && c === j)
              return (
                <button
                  key={`${i}-${j}`}
                  onClick={() => handleCellClick(i, j)}
                  className={`w-10 h-10 text-xl font-bold rounded transition-all ${
                    isSelected
                      ? 'bg-blue-500 text-white scale-110'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {cell}
                </button>
              )
            })
          )}
        </div>
      </div>

      {gameWon && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-12 text-center">
            <h2 className="text-5xl font-bold mb-4">🎉 You Found All Words!</h2>
            <div className="flex gap-4 justify-center">
              <button
                onClick={startGame}
                className="px-8 py-4 bg-pink-500 text-white rounded-xl text-xl hover:bg-pink-600"
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

