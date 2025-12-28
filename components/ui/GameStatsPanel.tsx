'use client'

import { motion } from 'framer-motion'
import { useGameStats } from '@/lib/hooks/useGameStats'

export default function GameStatsPanel() {
  const { stats } = useGameStats()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
    >
      <h3 className="text-xl font-bold text-white mb-4">📊 Your Stats</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-sm text-gray-400">Games Played</div>
          <div className="text-2xl font-bold text-white">{stats.gamesPlayed}</div>
        </div>
        <div>
          <div className="text-sm text-gray-400">Play Time</div>
          <div className="text-2xl font-bold text-white">
            {Math.floor(stats.totalPlayTime / 60)}m
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-400">Achievements</div>
          <div className="text-2xl font-bold text-white">{stats.achievements.length}</div>
        </div>
        <div>
          <div className="text-sm text-gray-400">High Scores</div>
          <div className="text-2xl font-bold text-white">
            {Object.keys(stats.highestScores).length}
          </div>
        </div>
      </div>
      {stats.lastPlayed && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="text-sm text-gray-400">Last Played</div>
          <div className="text-lg font-semibold text-white">{stats.lastPlayed}</div>
        </div>
      )}
    </motion.div>
  )
}



