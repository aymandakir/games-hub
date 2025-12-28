'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

type Player = 'X' | 'O' | null
type Board = Player[]

export default function TicTacToePage() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null))
  const [isXNext, setIsXNext] = useState(true)
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [gameOver, setGameOver] = useState(false)
  const [winner, setWinner] = useState<Player | 'tie' | null>(null)

  const calculateWinner = (squares: Board): Player | null => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6], // diagonals
    ]

    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a]
      }
    }
    return null
  }

  const minimax = (squares: Board, isMaximizing: boolean, depth: number): number => {
    const winner = calculateWinner(squares)
    
    if (winner === 'O') return 10 - depth
    if (winner === 'X') return depth - 10
    if (squares.every(s => s !== null)) return 0

    if (isMaximizing) {
      let bestScore = -Infinity
      for (let i = 0; i < 9; i++) {
        if (squares[i] === null) {
          squares[i] = 'O'
          const score = minimax(squares, false, depth + 1)
          squares[i] = null
          bestScore = Math.max(score, bestScore)
        }
      }
      return bestScore
    } else {
      let bestScore = Infinity
      for (let i = 0; i < 9; i++) {
        if (squares[i] === null) {
          squares[i] = 'X'
          const score = minimax(squares, true, depth + 1)
          squares[i] = null
          bestScore = Math.min(score, bestScore)
        }
      }
      return bestScore
    }
  }

  const getAIMove = (squares: Board): number => {
    if (difficulty === 'easy') {
      // Random move
      const available = squares.map((s, i) => s === null ? i : -1).filter(i => i !== -1)
      return available[Math.floor(Math.random() * available.length)]
    } else if (difficulty === 'medium') {
      // 70% best move, 30% random
      if (Math.random() < 0.7) {
        return getBestMove(squares)
      } else {
        const available = squares.map((s, i) => s === null ? i : -1).filter(i => i !== -1)
        return available[Math.floor(Math.random() * available.length)]
      }
    } else {
      // Always best move
      return getBestMove(squares)
    }
  }

  const getBestMove = (squares: Board): number => {
    let bestScore = -Infinity
    let bestMove = -1

    for (let i = 0; i < 9; i++) {
      if (squares[i] === null) {
        squares[i] = 'O'
        const score = minimax(squares, false, 0)
        squares[i] = null
        if (score > bestScore) {
          bestScore = score
          bestMove = i
        }
      }
    }

    return bestMove
  }

  const handleClick = (index: number) => {
    if (board[index] || gameOver || !isXNext) return

    const newBoard = [...board]
    newBoard[index] = 'X'
    setBoard(newBoard)
    setIsXNext(false)

    const winner = calculateWinner(newBoard)
    if (winner) {
      setWinner(winner)
      setGameOver(true)
      return
    }

    if (newBoard.every(s => s !== null)) {
      setWinner('tie')
      setGameOver(true)
      return
    }

    // AI move
    setTimeout(() => {
      const aiMove = getAIMove(newBoard)
      if (aiMove !== -1) {
        const aiBoard = [...newBoard]
        aiBoard[aiMove] = 'O'
        setBoard(aiBoard)
        setIsXNext(true)

        const aiWinner = calculateWinner(aiBoard)
        if (aiWinner) {
          setWinner(aiWinner)
          setGameOver(true)
        } else if (aiBoard.every(s => s !== null)) {
          setWinner('tie')
          setGameOver(true)
        }
      }
    }, 500)
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setIsXNext(true)
    setGameOver(false)
    setWinner(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-white mb-4">⭕ Tic-Tac-Toe Pro</h1>
            <p className="text-gray-300 mb-6">Play against AI</p>

            <div className="flex justify-center gap-4 mb-6">
              {(['easy', 'medium', 'hard'] as const).map((diff) => (
                <button
                  key={diff}
                  onClick={() => {
                    setDifficulty(diff)
                    resetGame()
                  }}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all capitalize ${
                    difficulty === diff
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>

            {gameOver && (
              <div className="mb-6">
                <div className="text-3xl font-bold text-white mb-4">
                  {winner === 'tie' ? "It's a Tie! 🤝" : winner === 'X' ? 'You Win! 🎉' : 'AI Wins! 🤖'}
                </div>
                <button
                  onClick={resetGame}
                  className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold"
                >
                  Play Again
                </button>
              </div>
            )}

            {!gameOver && (
              <div className="text-xl text-white mb-6">
                {isXNext ? 'Your turn (X)' : 'AI thinking...'}
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            {board.map((square, index) => (
              <motion.button
                key={index}
                onClick={() => handleClick(index)}
                disabled={square !== null || gameOver || !isXNext}
                className="aspect-square bg-white/20 hover:bg-white/30 rounded-xl text-6xl font-bold text-white disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                whileHover={{ scale: square === null && isXNext ? 1.05 : 1 }}
                whileTap={{ scale: square === null && isXNext ? 0.95 : 1 }}
              >
                {square}
              </motion.button>
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



