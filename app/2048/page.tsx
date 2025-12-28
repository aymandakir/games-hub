'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

type Grid = number[][]

const GRID_SIZE = 4

export default function Game2048() {
  const [grid, setGrid] = useState<Grid>([])
  const [score, setScore] = useState(0)
  const [bestScore, setBestScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)

  const initializeGrid = useCallback(() => {
    const newGrid: Grid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0))
    addRandomTile(newGrid)
    addRandomTile(newGrid)
    setGrid(newGrid)
    setScore(0)
    setGameOver(false)
    setWon(false)
  }, [])

  useEffect(() => {
    initializeGrid()
    const saved = localStorage.getItem('2048-best')
    if (saved) setBestScore(parseInt(saved))
  }, [initializeGrid])

  const addRandomTile = (grid: Grid) => {
    const emptyCells: [number, number][] = []
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (grid[i][j] === 0) emptyCells.push([i, j])
      }
    }
    if (emptyCells.length > 0) {
      const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)]
      grid[row][col] = Math.random() < 0.9 ? 2 : 4
    }
  }

  const moveLeft = (grid: Grid): { grid: Grid; moved: boolean; score: number } => {
    const newGrid = grid.map(row => [...row])
    let moved = false
    let scoreGain = 0

    for (let i = 0; i < GRID_SIZE; i++) {
      const row = newGrid[i].filter(cell => cell !== 0)
      const newRow: number[] = []

      for (let j = 0; j < row.length; j++) {
        if (j < row.length - 1 && row[j] === row[j + 1]) {
          newRow.push(row[j] * 2)
          scoreGain += row[j] * 2
          j++
          moved = true
        } else {
          newRow.push(row[j])
        }
      }

      while (newRow.length < GRID_SIZE) newRow.push(0)
      if (JSON.stringify(newGrid[i]) !== JSON.stringify(newRow)) moved = true
      newGrid[i] = newRow
    }

    return { grid: newGrid, moved, score: scoreGain }
  }

  const rotateGrid = (grid: Grid, times: number): Grid => {
    let rotated = grid.map(row => [...row])
    for (let t = 0; t < times; t++) {
      rotated = rotated[0].map((_, i) => rotated.map(row => row[i]).reverse())
    }
    return rotated
  }

  const handleMove = useCallback((direction: 'left' | 'right' | 'up' | 'down') => {
    if (gameOver) return

    let rotated = grid
    let rotations = 0

    if (direction === 'right') {
      rotated = rotateGrid(grid, 2)
      rotations = 2
    } else if (direction === 'up') {
      rotated = rotateGrid(grid, 3)
      rotations = 3
    } else if (direction === 'down') {
      rotated = rotateGrid(grid, 1)
      rotations = 1
    }

    const { grid: newGrid, moved, score: scoreGain } = moveLeft(rotated)

    if (moved) {
      const finalGrid = rotateGrid(newGrid, (4 - rotations) % 4)
      addRandomTile(finalGrid)
      setGrid(finalGrid)
      setScore(prev => {
        const newScore = prev + scoreGain
        if (newScore > bestScore) {
          setBestScore(newScore)
          localStorage.setItem('2048-best', newScore.toString())
        }
        return newScore
      })

      // Check for win
      if (!won && finalGrid.some(row => row.some(cell => cell === 2048))) {
        setWon(true)
      }

      // Check for game over
      const hasEmpty = finalGrid.some(row => row.some(cell => cell === 0))
      const canMove = finalGrid.some((row, i) =>
        row.some((cell, j) => {
          if (cell === 0) return true
          return (
            (i > 0 && finalGrid[i - 1][j] === cell) ||
            (i < GRID_SIZE - 1 && finalGrid[i + 1][j] === cell) ||
            (j > 0 && finalGrid[i][j - 1] === cell) ||
            (j < GRID_SIZE - 1 && finalGrid[i][j + 1] === cell)
          )
        })
      )

      if (!hasEmpty && !canMove) {
        setGameOver(true)
      }
    }
  }, [grid, gameOver, won, bestScore])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault()
        const direction = e.key.replace('Arrow', '').toLowerCase() as 'left' | 'right' | 'up' | 'down'
        handleMove(direction)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleMove])

  const getTileColor = (value: number): string => {
    const colors: Record<number, string> = {
      2: 'bg-gray-100 text-gray-800',
      4: 'bg-gray-200 text-gray-800',
      8: 'bg-yellow-200 text-yellow-900',
      16: 'bg-yellow-300 text-yellow-900',
      32: 'bg-orange-200 text-orange-900',
      64: 'bg-orange-300 text-orange-900',
      128: 'bg-red-200 text-red-900',
      256: 'bg-red-300 text-red-900',
      512: 'bg-pink-200 text-pink-900',
      1024: 'bg-purple-200 text-purple-900',
      2048: 'bg-purple-300 text-purple-900',
    }
    return colors[value] || 'bg-gray-800 text-white'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-900 to-blue-900 text-white p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link href="/home" className="text-blue-200 hover:text-blue-100">← Back to Home</Link>
          <h1 className="text-4xl font-bold">🔢 2048</h1>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <div className="text-sm text-gray-300">Score</div>
            <div className="text-3xl font-bold">{score}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <div className="text-sm text-gray-300">Best</div>
            <div className="text-3xl font-bold">{bestScore}</div>
          </div>
        </div>

        <div className="bg-white/10 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-4 gap-3">
            {grid.map((row, i) =>
              row.map((cell, j) => (
                <motion.div
                  key={`${i}-${j}`}
                  className={`aspect-square rounded-lg flex items-center justify-center font-bold text-2xl ${getTileColor(cell)}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: (i * GRID_SIZE + j) * 0.01 }}
                >
                  {cell || ''}
                </motion.div>
              ))
            )}
          </div>
        </div>

        <div className="flex gap-2 justify-center mb-6">
          <button
            onClick={() => handleMove('up')}
            className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20"
          >
            ↑
          </button>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleMove('left')}
              className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20"
            >
              ←
            </button>
            <button
              onClick={() => handleMove('right')}
              className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20"
            >
              →
            </button>
          </div>
          <button
            onClick={() => handleMove('down')}
            className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20"
          >
            ↓
          </button>
        </div>

        {(gameOver || won) && (
          <div className="text-center py-8">
            <h2 className="text-4xl font-bold mb-4">
              {won ? '🎉 You Win!' : 'Game Over!'}
            </h2>
            <button
              onClick={initializeGrid}
              className="px-6 py-3 bg-cyan-600 rounded-lg hover:bg-cyan-700"
            >
              {won ? 'Continue' : 'Play Again'}
            </button>
          </div>
        )}

        <div className="text-center text-sm text-gray-300">
          Use arrow keys or buttons to move tiles. Combine tiles with the same number!
        </div>
      </div>
    </div>
  )
}



