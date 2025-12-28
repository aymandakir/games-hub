'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { analytics, type GameStats, type PlatformStats } from '@/lib/utils/analytics'
import { ALL_GAMES, getGameById } from '@/lib/data/games'

export default function StatsPage() {
  const [platformStats, setPlatformStats] = useState<PlatformStats | null>(null)
  const [gameStats, setGameStats] = useState<GameStats[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = () => {
      const platform = analytics.getPlatformStats()
      const games = analytics.getAllStats()
      setPlatformStats(platform)
      setGameStats(games.sort((a, b) => b.plays - a.plays))
      setLoading(false)
    }

    loadStats()
  }, [])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    if (hours > 0) return `${hours}h ${mins}m`
    return `${mins}m`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading stats...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4">
      <div className="max-w-6xl mx-auto py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-white mb-4">📊 Game Statistics</h1>
          <p className="text-gray-400 text-lg">Track your gaming activity and achievements</p>
        </motion.div>

        {/* Platform Stats */}
        {platformStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center">
              <div className="text-3xl mb-2">🎮</div>
              <div className="text-2xl font-bold text-white">{platformStats.totalGames}</div>
              <div className="text-gray-400">Total Games</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center">
              <div className="text-3xl mb-2">▶️</div>
              <div className="text-2xl font-bold text-white">{platformStats.totalPlays}</div>
              <div className="text-gray-400">Total Plays</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center">
              <div className="text-3xl mb-2">⏱️</div>
              <div className="text-2xl font-bold text-white">{formatTime(platformStats.totalPlayTime)}</div>
              <div className="text-gray-400">Total Play Time</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center">
              <div className="text-3xl mb-2">👥</div>
              <div className="text-2xl font-bold text-white">{platformStats.activeUsers}</div>
              <div className="text-gray-400">Active Users</div>
            </div>
          </motion.div>
        )}

        {/* Most Played Games */}
        {platformStats && platformStats.mostPlayed.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-4">🔥 Most Played Games</h2>
            <div className="space-y-3">
              {platformStats.mostPlayed.map((gameId, index) => {
                const game = getGameById(gameId)
                const stats = analytics.getGameStats(gameId)
                if (!game || !stats) return null
                return (
                  <div key={gameId} className="flex items-center gap-4 bg-white/5 rounded-lg p-4">
                    <div className="text-2xl font-bold text-gray-400 w-8">#{index + 1}</div>
                    <div className="text-3xl">{game.icon}</div>
                    <div className="flex-1">
                      <div className="text-lg font-semibold text-white">{game.title}</div>
                      <div className="text-sm text-gray-400">{stats.plays} plays</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">Avg. Time</div>
                      <div className="text-white font-semibold">{formatTime(stats.averagePlayTime)}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* All Game Stats */}
        {gameStats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6"
          >
            <h2 className="text-2xl font-bold text-white mb-4">📈 All Games</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-3 text-gray-400">Game</th>
                    <th className="text-right p-3 text-gray-400">Plays</th>
                    <th className="text-right p-3 text-gray-400">Total Time</th>
                    <th className="text-right p-3 text-gray-400">Avg. Time</th>
                    <th className="text-right p-3 text-gray-400">Last Played</th>
                  </tr>
                </thead>
                <tbody>
                  {gameStats.map((stat) => {
                    const game = getGameById(stat.gameId)
                    if (!game) return null
                    return (
                      <tr key={stat.gameId} className="border-b border-white/5 hover:bg-white/5">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{game.icon}</span>
                            <div>
                              <div className="text-white font-semibold">{game.title}</div>
                              <div className="text-sm text-gray-400">{game.category}</div>
                            </div>
                          </div>
                        </td>
                        <td className="text-right p-3 text-white">{stat.plays}</td>
                        <td className="text-right p-3 text-white">{formatTime(stat.totalPlayTime)}</td>
                        <td className="text-right p-3 text-white">{formatTime(stat.averagePlayTime)}</td>
                        <td className="text-right p-3 text-gray-400">
                          {new Date(stat.lastPlayed).toLocaleDateString()}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {gameStats.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <div className="text-xl text-gray-400 mb-4">No statistics yet</div>
            <p className="text-gray-500">Start playing games to see your stats here!</p>
          </div>
        )}

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
  )
}



