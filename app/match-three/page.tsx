'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

type GemType = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange'

interface Gem {
  type: GemType
  id: number
}

const GRID_SIZE = 8
const GEM_TYPES: GemType[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange']
const GEM_EMOJIS: Record<GemType, string> = {
  red: '🔴',
  blue: '🔵',
  green: '🟢',
  yellow: '🟡',
  purple: '🟣',
  orange: '🟠',
}

export default function MatchThreeGame() {
  const [grid, setGrid] = useState<Gem[][]>([])
  const [score, setScore] = useState(0)
  const [moves, setMoves] = useState(30)
  const [selected, setSelected] = useState<{ row: number; col: number } | null>(null)
  const [gameOver, setGameOver] = useState(false)

  const initializeGrid = () => {
    const newGrid: Gem[][] = []
    for (let row = 0; row < GRID_SIZE; row++) {
      newGrid[row] = []
      for (let col = 0; col < GRID_SIZE; col++) {
        newGrid[row][col] = {
          type: GEM_TYPES[Math.floor(Math.random() * GEM_TYPES.length)],
          id: row * GRID_SIZE + col,
        }
      }
    }
    setGrid(newGrid)
  }

  useEffect(() => {
    initializeGrid()
  }, [])

  const findMatches = (grid: Gem[][]): Set<number> => {
    const matches = new Set<number>()

    // Check horizontal matches
    for (let row = 0; row < GRID_SIZE; row++) {
      let count = 1
      let currentType = grid[row][0].type
      for (let col = 1; col < GRID_SIZE; col++) {
        if (grid[row][col].type === currentType) {
          count++
        } else {
          if (count >= 3) {
            for (let i = col - count; i < col; i++) {
              matches.add(grid[row][i].id)
            }
          }
          count = 1
          currentType = grid[row][col].type
        }
      }
      if (count >= 3) {
        for (let i = GRID_SIZE - count; i < GRID_SIZE; i++) {
          matches.add(grid[row][i].id)
        }
      }
    }

    // Check vertical matches
    for (let col = 0; col < GRID_SIZE; col++) {
      let count = 1
      let currentType = grid[0][col].type
      for (let row = 1; row < GRID_SIZE; row++) {
        if (grid[row][col].type === currentType) {
          count++
        } else {
          if (count >= 3) {
            for (let i = row - count; i < row; i++) {
              matches.add(grid[i][col].id)
            }
          }
          count = 1
          currentType = grid[row][col].type
        }
      }
      if (count >= 3) {
        for (let i = GRID_SIZE - count; i < GRID_SIZE; i++) {
          matches.add(grid[i][col].id)
        }
      }
    }

    return matches
  }

  const removeMatches = (grid: Gem[][], matches: Set<number>) => {
    const newGrid = grid.map(row =>
      row.map(gem => (matches.has(gem.id) ? null : gem)).filter(Boolean) as Gem[]
    )

    // Fill empty spaces
    for (let col = 0; col < GRID_SIZE; col++) {
      const column = newGrid.map(row => row[col]).filter(Boolean)
      while (column.length < GRID_SIZE) {
        column.unshift({
          type: GEM_TYPES[Math.floor(Math.random() * GEM_TYPES.length)],
          id: Date.now() + Math.random(),
        })
      }
      for (let row = 0; row < GRID_SIZE; row++) {
        newGrid[row][col] = column[GRID_SIZE - 1 - row]
      }
    }

    return newGrid
  }

  const handleGemClick = (row: number, col: number) => {
    if (gameOver || moves <= 0) return

    if (!selected) {
      setSelected({ row, col })
      return
    }

    if (selected.row === row && selected.col === col) {
      setSelected(null)
      return
    }

    // Check if adjacent
    const isAdjacent =
      (Math.abs(selected.row - row) === 1 && selected.col === col) ||
      (Math.abs(selected.col - col) === 1 && selected.row === row)

    if (!isAdjacent) {
      setSelected({ row, col })
      return
    }

    // Swap gems
    const newGrid = grid.map(r => [...r])
    const temp = newGrid[selected.row][selected.col]
    newGrid[selected.row][selected.col] = newGrid[row][col]
    newGrid[row][col] = temp

    // Find and remove matches
    let matches = findMatches(newGrid)
    if (matches.size === 0) {
      // No match, swap back
      setSelected(null)
      return
    }

    let totalScore = 0
    while (matches.size > 0) {
      totalScore += matches.size * 10
      const newGridAfterRemove = removeMatches(newGrid, matches)
      matches = findMatches(newGridAfterRemove)
      setGrid(newGridAfterRemove)
    }

    setScore(prev => prev + totalScore)
    setMoves(prev => prev - 1)
    setSelected(null)

    if (moves - 1 <= 0) {
      setGameOver(true)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-pink-900 text-white p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link href="/home" className="text-blue-400 hover:text-blue-300">← Back to Home</Link>
          <h1 className="text-3xl font-bold">💎 Gem Match</h1>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <div className="text-sm text-gray-300">Score</div>
            <div className="text-2xl font-bold">{score}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <div className="text-sm text-gray-300">Moves</div>
            <div className="text-2xl font-bold">{moves}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <div className="text-sm text-gray-300">Target</div>
            <div className="text-2xl font-bold">1000</div>
          </div>
        </div>

        {gameOver ? (
          <div className="text-center py-20">
            <h2 className="text-4xl font-bold mb-4">
              {score >= 1000 ? '🎉 You Win!' : 'Game Over!'}
            </h2>
            <p className="text-xl mb-8">Final Score: {score}</p>
            <button
              onClick={() => {
                initializeGrid()
                setScore(0)
                setMoves(30)
                setGameOver(false)
              }}
              className="px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700"
            >
              Play Again
            </button>
          </div>
        ) : (
          <div className="bg-white/10 rounded-lg p-4">
            <div className="grid grid-cols-8 gap-2">
              {grid.map((row, rowIdx) =>
                row.map((gem, colIdx) => (
                  <motion.button
                    key={gem.id}
                    onClick={() => handleGemClick(rowIdx, colIdx)}
                    className={`aspect-square rounded-lg text-3xl flex items-center justify-center transition-all ${
                      selected?.row === rowIdx && selected?.col === colIdx
                        ? 'ring-4 ring-yellow-400 scale-110'
                        : 'hover:scale-105'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {GEM_EMOJIS[gem.type]}
                  </motion.button>
                ))
              )}
            </div>
          </div>
        )}

        <div className="mt-6 text-center text-sm text-gray-300">
          Match 3 or more gems of the same color to score points!
        </div>
      </div>
    </div>
  )
}



