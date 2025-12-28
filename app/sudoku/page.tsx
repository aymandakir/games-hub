'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

type Cell = { value: number | null; fixed: boolean; error: boolean }

export default function SudokuPage() {
  const [grid, setGrid] = useState<Cell[][]>([])
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null)
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy')
  const [time, setTime] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [errors, setErrors] = useState(0)

  useEffect(() => {
    generatePuzzle()
  }, [difficulty])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (gameStarted && !gameWon) {
      interval = setInterval(() => setTime(t => t + 1), 1000)
    }
    return () => clearInterval(interval)
  }, [gameStarted, gameWon])

  const generatePuzzle = () => {
    const solved = generateSolvedGrid()
    const puzzle = removeCells(solved, difficulty)
    setGrid(puzzle)
    setTime(0)
    setGameStarted(false)
    setGameWon(false)
    setErrors(0)
    setSelectedCell(null)
  }

  const generateSolvedGrid = (): number[][] => {
    const grid: number[][] = Array(9).fill(null).map(() => Array(9).fill(0))
    
    const isValid = (row: number, col: number, num: number): boolean => {
      for (let i = 0; i < 9; i++) {
        if (grid[row][i] === num || grid[i][col] === num) return false
      }
      const startRow = Math.floor(row / 3) * 3
      const startCol = Math.floor(col / 3) * 3
      for (let i = startRow; i < startRow + 3; i++) {
        for (let j = startCol; j < startCol + 3; j++) {
          if (grid[i][j] === num) return false
        }
      }
      return true
    }

    const solve = (row: number, col: number): boolean => {
      if (row === 9) return true
      if (col === 9) return solve(row + 1, 0)
      if (grid[row][col] !== 0) return solve(row, col + 1)

      const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5)
      for (const num of nums) {
        if (isValid(row, col, num)) {
          grid[row][col] = num
          if (solve(row, col + 1)) return true
          grid[row][col] = 0
        }
      }
      return false
    }

    solve(0, 0)
    return grid
  }

  const removeCells = (solved: number[][], diff: string): Cell[][] => {
    const cellsToRemove = diff === 'easy' ? 40 : diff === 'medium' ? 50 : 60
    const puzzle = solved.map(row => row.map(val => ({ value: val, fixed: true, error: false })))
    
    let removed = 0
    while (removed < cellsToRemove) {
      const row = Math.floor(Math.random() * 9)
      const col = Math.floor(Math.random() * 9)
      if (puzzle[row][col].value !== null) {
        puzzle[row][col] = { value: null, fixed: false, error: false }
        removed++
      }
    }
    
    return puzzle
  }

  const handleCellClick = (row: number, col: number) => {
    if (grid[row][col].fixed || gameWon) return
    setSelectedCell([row, col])
  }

  const handleNumberInput = (num: number) => {
    if (!selectedCell || gameWon) return
    const [row, col] = selectedCell
    if (grid[row][col].fixed) return

    const newGrid = grid.map(r => r.map(c => ({ ...c })))
    newGrid[row][col].value = num

    // Check for errors
    const isValid = checkValid(newGrid, row, col, num)
    newGrid[row][col].error = !isValid
    if (!isValid) setErrors(e => e + 1)

    setGrid(newGrid)
    setGameStarted(true)

    // Check if won
    if (isGridComplete(newGrid) && isGridValid(newGrid)) {
      setGameWon(true)
      setGameStarted(false)
    }
  }

  const checkValid = (g: Cell[][], row: number, col: number, num: number): boolean => {
    for (let i = 0; i < 9; i++) {
      if (i !== col && g[row][i].value === num) return false
      if (i !== row && g[i][col].value === num) return false
    }
    const startRow = Math.floor(row / 3) * 3
    const startCol = Math.floor(col / 3) * 3
    for (let i = startRow; i < startRow + 3; i++) {
      for (let j = startCol; j < startCol + 3; j++) {
        if (i !== row && j !== col && g[i][j].value === num) return false
      }
    }
    return true
  }

  const isGridValid = (g: Cell[][]): boolean => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (g[row][col].value && !checkValid(g, row, col, g[row][col].value!)) {
          return false
        }
      }
    }
    return true
  }

  const isGridComplete = (g: Cell[][]): boolean => {
    return g.every(row => row.every(cell => cell.value !== null))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-white mb-4">🔢 Sudoku</h1>
            <p className="text-gray-300 mb-6">Fill the grid so every row, column, and 3x3 box contains digits 1-9</p>

            <div className="flex justify-center gap-4 mb-6">
              {(['easy', 'medium', 'hard'] as const).map((diff) => (
                <button
                  key={diff}
                  onClick={() => {
                    setDifficulty(diff)
                    generatePuzzle()
                  }}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all capitalize ${
                    difficulty === diff
                      ? 'bg-green-500 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>

            <div className="flex justify-center gap-8 text-white mb-6">
              <div className="bg-white/10 px-4 py-2 rounded-lg">
                <div className="text-sm text-gray-300">Time</div>
                <div className="text-2xl font-bold">{formatTime(time)}</div>
              </div>
              <div className="bg-white/10 px-4 py-2 rounded-lg">
                <div className="text-sm text-gray-300">Errors</div>
                <div className="text-2xl font-bold">{errors}</div>
              </div>
            </div>

            {gameWon && (
              <div className="mb-6">
                <div className="text-3xl font-bold text-white mb-4">🎉 You Won!</div>
                <button
                  onClick={generatePuzzle}
                  className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold"
                >
                  New Game
                </button>
              </div>
            )}

            {!gameWon && (
              <button
                onClick={generatePuzzle}
                className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold mb-6"
              >
                New Game
              </button>
            )}
          </div>

          <div className="grid grid-cols-9 gap-1 max-w-lg mx-auto mb-6 bg-black/20 p-2 rounded-lg">
            {grid.map((row, rowIdx) =>
              row.map((cell, colIdx) => {
                const isSelected = selectedCell?.[0] === rowIdx && selectedCell?.[1] === colIdx
                const sameRow = selectedCell?.[0] === rowIdx
                const sameCol = selectedCell?.[1] === colIdx
                const sameBox =
                  selectedCell &&
                  Math.floor(rowIdx / 3) === Math.floor(selectedCell[0] / 3) &&
                  Math.floor(colIdx / 3) === Math.floor(selectedCell[1] / 3)

                return (
                  <motion.button
                    key={`${rowIdx}-${colIdx}`}
                    onClick={() => handleCellClick(rowIdx, colIdx)}
                    className={`aspect-square rounded text-xl font-bold transition-all ${
                      cell.fixed
                        ? 'bg-blue-500/30 text-blue-200 font-bold'
                        : cell.error
                        ? 'bg-red-500/50 text-white'
                        : isSelected
                        ? 'bg-green-500 text-white ring-2 ring-white'
                        : sameRow || sameCol || sameBox
                        ? 'bg-white/10 text-white'
                        : 'bg-white/5 text-white hover:bg-white/10'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={cell.fixed || gameWon}
                  >
                    {cell.value || ''}
                  </motion.button>
                )
              })
            )}
          </div>

          <div className="grid grid-cols-9 gap-2 max-w-lg mx-auto">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <motion.button
                key={num}
                onClick={() => handleNumberInput(num)}
                className="aspect-square bg-white/20 hover:bg-white/30 rounded-lg text-2xl font-bold text-white transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                disabled={!selectedCell || gameWon}
              >
                {num}
              </motion.button>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => {
                if (selectedCell) {
                  const [row, col] = selectedCell
                  const newGrid = grid.map(r => r.map(c => ({ ...c })))
                  newGrid[row][col] = { value: null, fixed: false, error: false }
                  setGrid(newGrid)
                }
              }}
              className="px-6 py-2 bg-red-500/50 hover:bg-red-500/70 text-white rounded-lg font-semibold mr-4"
              disabled={!selectedCell || gameWon}
            >
              Clear
            </button>
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



