'use client'

import { useState, useEffect } from 'react'
import { generateGameCollection, type GeneratedGame } from '@/lib/games/game-generator'
import { motion } from 'framer-motion'

export default function RandomGamesPage() {
  const [games, setGames] = useState<GeneratedGame[]>([])
  const [loading, setLoading] = useState(false)
  const [count, setCount] = useState(6)

  const generateGames = () => {
    setLoading(true)
    setTimeout(() => {
      const newGames = generateGameCollection(count)
      setGames(newGames)
      setLoading(false)
    }, 500)
  }

  useEffect(() => {
    generateGames()
  }, [])

  const openGame = (game: GeneratedGame) => {
    const blob = new Blob([game.html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-bg via-rock-dark to-neutral-bg p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-rock-highlight via-paper-accent to-scissors-highlight bg-clip-text text-transparent">
            Random Games
          </h1>
          <p className="text-xl text-neutral-text/80 mb-6">
            Procedurally generated games using design patterns and content libraries
          </p>
          
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <input
              type="number"
              min="1"
              max="20"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 6)}
              className="px-4 py-2 bg-neutral-bg/50 border border-neutral-border rounded-lg text-white"
            />
            <button
              onClick={generateGames}
              disabled={loading}
              className="px-6 py-2 bg-rock-accent text-white rounded-lg font-bold hover:bg-rock-secondary transition-colors disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate New Games'}
            </button>
          </div>
        </motion.div>

        {/* Games Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(count)].map((_, i) => (
              <div
                key={i}
                className="bg-neutral-bg/50 border border-neutral-border rounded-xl p-6 animate-pulse"
              >
                <div className="h-16 bg-neutral-bg/30 rounded-lg mb-4"></div>
                <div className="h-6 bg-neutral-bg/30 rounded mb-2"></div>
                <div className="h-4 bg-neutral-bg/30 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => openGame(game)}
                className="bg-neutral-bg/50 border-2 border-neutral-border rounded-xl p-6 cursor-pointer hover:border-rock-accent transition-all hover:scale-105"
                style={{ borderColor: game.color + '40' }}
              >
                <div className="text-6xl mb-4 text-center">{game.icon}</div>
                <h2 className="text-2xl font-bold mb-2" style={{ color: game.color }}>
                  {game.name}
                </h2>
                <p className="text-neutral-text/80 mb-4 text-sm">{game.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-neutral-bg/50 rounded-full text-xs">
                    {game.type}
                  </span>
                  <span className="px-3 py-1 bg-neutral-bg/50 rounded-full text-xs">
                    {game.theme}
                  </span>
                  <span className="px-3 py-1 bg-neutral-bg/50 rounded-full text-xs">
                    {game.difficulty}
                  </span>
                </div>
                
                <div className="text-xs text-neutral-text/60">
                  <div>⏱️ {game.estimatedTime} min</div>
                  <div className="mt-1">
                    {game.mechanics.slice(0, 2).map((m, i) => (
                      <span key={i}>
                        {m}
                        {i < game.mechanics.slice(0, 2).length - 1 ? ' • ' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

