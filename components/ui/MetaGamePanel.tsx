'use client'

import { useState, useEffect } from 'react'
import { Card } from './Card'
import { Button } from './Button'
import { useGameStore } from '@/lib/store/gameStore'
import { initializeMetaGame, getAchievementDefinitions, checkAchievements, shouldResetDailyChallenge } from '@/lib/systems/meta-game'

export default function MetaGamePanel() {
  const [metaGame, setMetaGame] = useState<any>(null)
  const [showAchievements, setShowAchievements] = useState(false)
  const { player, story, generateDailyChallenge } = useGameStore()

  useEffect(() => {
    // Initialize meta-game state
    initializeMetaGame().then(state => {
      setMetaGame(state)
      
      // Check if daily challenge should reset
      if (state.lastDailyReset && shouldResetDailyChallenge(state.lastDailyReset)) {
        generateDailyChallenge()
      }
    })
  }, [])

  useEffect(() => {
    if (metaGame) {
      // Check achievements periodically
      const updatedAchievements = checkAchievements(metaGame.achievements, {
        totalVictories: metaGame.totalVictories || 0,
        totalBattles: metaGame.totalBattles || 0,
        alignment: player.alignment,
        completedQuests: story.completedQuests.length,
        visitedLocations: story.visitedLocations.length,
        inventorySize: player.inventory.length,
        symbolBreakUses: metaGame.symbolBreakUses || 0,
        bossDefeats: metaGame.bossDefeats || 0,
        dailyChallengesCompleted: metaGame.dailyChallengesCompleted || 0,
        victoryStreak: metaGame.victoryStreak || 0,
      })
      
      // Check for newly unlocked achievements
      const newUnlocks = updatedAchievements.filter(
        (ach, i) => ach.unlocked && !metaGame.achievements[i]?.unlocked
      )
      
      if (newUnlocks.length > 0) {
        setMetaGame({ ...metaGame, achievements: updatedAchievements })
        // Could show notification here
      }
    }
  }, [player, story, metaGame])

  if (!metaGame) {
    return (
      <Card className="p-4">
        <p className="text-sm text-gray-400">Loading meta-game features...</p>
      </Card>
    )
  }

  const dailyChallenge = metaGame.dailyChallenge
  const unlockedAchievements = metaGame.achievements.filter((a: any) => a.unlocked)

  return (
    <div className="space-y-4">
      {/* Daily Challenge */}
      {dailyChallenge && !dailyChallenge.completed && (
        <Card className="p-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-purple-500">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-lg">⭐ Daily Challenge</h4>
            <span className="text-xs text-gray-400">
              {new Date(dailyChallenge.expiresAt).toLocaleDateString()}
            </span>
          </div>
          <p className="text-sm mb-3">{dailyChallenge.quest.name}</p>
          <p className="text-xs text-gray-400 mb-3">{dailyChallenge.quest.description}</p>
          <Button
            onClick={() => generateDailyChallenge()}
            variant="primary"
            className="w-full text-sm"
          >
            Start Challenge
          </Button>
        </Card>
      )}

      {/* Achievements Summary */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-bold text-lg">🏆 Achievements</h4>
          <Button
            onClick={() => setShowAchievements(!showAchievements)}
            variant="secondary"
            className="text-xs"
          >
            {showAchievements ? 'Hide' : 'Show All'}
          </Button>
        </div>
        <div className="text-center mb-2">
          <p className="text-2xl font-bold">{unlockedAchievements.length}</p>
          <p className="text-xs text-gray-400">/{metaGame.achievements.length} Unlocked</p>
        </div>
        
        {showAchievements && (
          <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
            {metaGame.achievements.map((ach: any) => (
              <div
                key={ach.id}
                className={`p-2 rounded text-sm ${
                  ach.unlocked
                    ? 'bg-green-600/20 border border-green-500'
                    : 'bg-gray-700/50 border border-gray-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={ach.unlocked ? 'text-green-400' : 'text-gray-400'}>
                    {ach.unlocked ? '✓' : '○'} {ach.name}
                  </span>
                  {ach.progress !== undefined && (
                    <span className="text-xs text-gray-400">
                      {ach.progress}/{ach.maxProgress}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">{ach.description}</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Statistics */}
      <Card className="p-4">
        <h4 className="font-bold text-lg mb-3">📊 Statistics</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Total Battles:</span>
            <span className="font-bold">{metaGame.totalBattles || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Victories:</span>
            <span className="font-bold text-green-400">{metaGame.totalVictories || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Defeats:</span>
            <span className="font-bold text-red-400">{metaGame.totalDefeats || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Win Rate:</span>
            <span className="font-bold">
              {metaGame.totalBattles > 0
                ? Math.round((metaGame.totalVictories / metaGame.totalBattles) * 100)
                : 0}%
            </span>
          </div>
        </div>
      </Card>
    </div>
  )
}

