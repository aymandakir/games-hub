/**
 * Hook for tracking game statistics
 */

import { useState, useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'

export interface GameStats {
  gamesPlayed: number
  totalPlayTime: number
  favoriteGame: string | null
  highestScores: Record<string, number>
  achievements: string[]
  lastPlayed: string | null
}

const defaultStats: GameStats = {
  gamesPlayed: 0,
  totalPlayTime: 0,
  favoriteGame: null,
  highestScores: {},
  achievements: [],
  lastPlayed: null,
}

export function useGameStats() {
  const [stats, setStats] = useLocalStorage<GameStats>('game-stats', defaultStats)

  const recordGamePlay = (gameId: string, score?: number, playTime?: number) => {
    setStats(prev => {
      const newStats = { ...prev }
      newStats.gamesPlayed += 1
      newStats.lastPlayed = gameId
      
      if (playTime) {
        newStats.totalPlayTime += playTime
      }
      
      if (score !== undefined) {
        const currentHigh = newStats.highestScores[gameId] || 0
        if (score > currentHigh) {
          newStats.highestScores[gameId] = score
        }
      }
      
      // Update favorite game (most played)
      const gameCounts: Record<string, number> = {}
      // This would need to track individual game plays
      
      return newStats
    })
  }

  const addAchievement = (achievementId: string) => {
    setStats(prev => {
      if (prev.achievements.includes(achievementId)) {
        return prev
      }
      return {
        ...prev,
        achievements: [...prev.achievements, achievementId],
      }
    })
  }

  const resetStats = () => {
    setStats(defaultStats)
  }

  return {
    stats,
    recordGamePlay,
    addAchievement,
    resetStats,
  }
}
