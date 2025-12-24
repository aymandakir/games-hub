/**
 * Meta-Game Features
 * Daily challenges, achievements tracking, leaderboards, seasonal events
 */

import { Quest, Item } from '@/lib/types/game'
import { generateDailyChallenge, generateRandomEvent } from './encounters'
import { fetchGameContentBatch } from './digital-library'

export interface DailyChallenge {
  quest: Quest
  completed: boolean
  completedAt?: number
  expiresAt: number
}

export interface Achievement {
  id: string
  name: string
  description: string
  unlocked: boolean
  unlockedAt?: number
  progress?: number
  maxProgress?: number
}

export interface MetaGameState {
  dailyChallenge: DailyChallenge | null
  achievements: Achievement[]
  totalPlaytime: number
  totalBattles: number
  totalVictories: number
  totalDefeats: number
  lastDailyReset: number
}

/**
 * Initialize daily challenge
 */
export async function initializeDailyChallenge(): Promise<DailyChallenge> {
  const challenge = await generateDailyChallenge(1) // Player level would come from store
  
  const now = Date.now()
  const tomorrow = new Date(now)
  tomorrow.setHours(24, 0, 0, 0) // Reset at midnight
  
  return {
    quest: challenge,
    completed: false,
    expiresAt: tomorrow.getTime(),
  }
}

/**
 * Check if daily challenge should reset
 */
export function shouldResetDailyChallenge(lastReset: number): boolean {
  const now = Date.now()
  const lastResetDate = new Date(lastReset)
  const today = new Date(now)
  
  return (
    lastResetDate.getDate() !== today.getDate() ||
    lastResetDate.getMonth() !== today.getMonth() ||
    lastResetDate.getFullYear() !== today.getFullYear()
  )
}

/**
 * Get achievement definitions
 */
export function getAchievementDefinitions(): Achievement[] {
  return [
    {
      id: 'first_victory',
      name: 'First Steps',
      description: 'Win your first battle',
      unlocked: false,
      progress: 0,
      maxProgress: 1,
    },
    {
      id: 'victory_streak',
      name: 'Unstoppable',
      description: 'Win 10 battles in a row',
      unlocked: false,
      progress: 0,
      maxProgress: 10,
    },
    {
      id: 'master_rock',
      name: 'Rock Master',
      description: 'Achieve 80% Rock alignment',
      unlocked: false,
      progress: 0,
      maxProgress: 80,
    },
    {
      id: 'master_paper',
      name: 'Paper Master',
      description: 'Achieve 80% Paper alignment',
      unlocked: false,
      progress: 0,
      maxProgress: 80,
    },
    {
      id: 'master_scissors',
      name: 'Scissors Master',
      description: 'Achieve 80% Scissors alignment',
      unlocked: false,
      progress: 0,
      maxProgress: 80,
    },
    {
      id: 'balanced',
      name: 'Perfect Balance',
      description: 'Achieve 33/34/33 alignment split',
      unlocked: false,
      progress: 0,
      maxProgress: 100,
    },
    {
      id: 'symbol_breaker',
      name: 'Symbol Breaker',
      description: 'Use Symbol Break 50 times',
      unlocked: false,
      progress: 0,
      maxProgress: 50,
    },
    {
      id: 'quest_master',
      name: 'Quest Master',
      description: 'Complete 25 quests',
      unlocked: false,
      progress: 0,
      maxProgress: 25,
    },
    {
      id: 'explorer',
      name: 'World Explorer',
      description: 'Visit all locations',
      unlocked: false,
      progress: 0,
      maxProgress: 10,
    },
    {
      id: 'collector',
      name: 'Item Collector',
      description: 'Collect 100 items',
      unlocked: false,
      progress: 0,
      maxProgress: 100,
    },
    {
      id: 'daily_dedication',
      name: 'Daily Dedication',
      description: 'Complete 7 daily challenges',
      unlocked: false,
      progress: 0,
      maxProgress: 7,
    },
    {
      id: 'boss_slayer',
      name: 'Boss Slayer',
      description: 'Defeat 10 boss enemies',
      unlocked: false,
      progress: 0,
      maxProgress: 10,
    },
  ]
}

/**
 * Check and unlock achievements
 */
export function checkAchievements(
  achievements: Achievement[],
  gameState: {
    totalVictories: number
    totalBattles: number
    alignment: { rock: number; paper: number; scissors: number }
    completedQuests: number
    visitedLocations: number
    inventorySize: number
    symbolBreakUses: number
    bossDefeats: number
    dailyChallengesCompleted: number
    victoryStreak: number
  }
): Achievement[] {
  const updated = [...achievements]
  
  // First victory
  if (gameState.totalVictories >= 1) {
    unlockAchievement(updated, 'first_victory')
  }
  
  // Victory streak
  const streakAch = updated.find(a => a.id === 'victory_streak')
  if (streakAch && !streakAch.unlocked) {
    streakAch.progress = gameState.victoryStreak
    if (gameState.victoryStreak >= 10) {
      unlockAchievement(updated, 'victory_streak')
    }
  }
  
  // Alignment achievements
  const { rock, paper, scissors } = gameState.alignment
  if (rock >= 80) unlockAchievement(updated, 'master_rock')
  if (paper >= 80) unlockAchievement(updated, 'master_paper')
  if (scissors >= 80) unlockAchievement(updated, 'master_scissors')
  
  // Balanced alignment (within 5% of 33.33 each)
  if (
    Math.abs(rock - 33) <= 5 &&
    Math.abs(paper - 34) <= 5 &&
    Math.abs(scissors - 33) <= 5
  ) {
    unlockAchievement(updated, 'balanced')
  }
  
  // Symbol break uses
  const symbolAch = updated.find(a => a.id === 'symbol_breaker')
  if (symbolAch && !symbolAch.unlocked) {
    symbolAch.progress = gameState.symbolBreakUses
    if (gameState.symbolBreakUses >= 50) {
      unlockAchievement(updated, 'symbol_breaker')
    }
  }
  
  // Quest completion
  const questAch = updated.find(a => a.id === 'quest_master')
  if (questAch && !questAch.unlocked) {
    questAch.progress = gameState.completedQuests
    if (gameState.completedQuests >= 25) {
      unlockAchievement(updated, 'quest_master')
    }
  }
  
  // Location visits
  const exploreAch = updated.find(a => a.id === 'explorer')
  if (exploreAch && !exploreAch.unlocked) {
    exploreAch.progress = gameState.visitedLocations
    if (gameState.visitedLocations >= 10) {
      unlockAchievement(updated, 'explorer')
    }
  }
  
  // Item collection
  const collectAch = updated.find(a => a.id === 'collector')
  if (collectAch && !collectAch.unlocked) {
    collectAch.progress = gameState.inventorySize
    if (gameState.inventorySize >= 100) {
      unlockAchievement(updated, 'collector')
    }
  }
  
  // Daily challenges
  const dailyAch = updated.find(a => a.id === 'daily_dedication')
  if (dailyAch && !dailyAch.unlocked) {
    dailyAch.progress = gameState.dailyChallengesCompleted
    if (gameState.dailyChallengesCompleted >= 7) {
      unlockAchievement(updated, 'daily_dedication')
    }
  }
  
  // Boss defeats
  const bossAch = updated.find(a => a.id === 'boss_slayer')
  if (bossAch && !bossAch.unlocked) {
    bossAch.progress = gameState.bossDefeats
    if (gameState.bossDefeats >= 10) {
      unlockAchievement(updated, 'boss_slayer')
    }
  }
  
  return updated
}

function unlockAchievement(achievements: Achievement[], id: string) {
  const ach = achievements.find(a => a.id === id)
  if (ach && !ach.unlocked) {
    ach.unlocked = true
    ach.unlockedAt = Date.now()
    ach.progress = ach.maxProgress || 100
  }
}

/**
 * Generate seasonal event quest
 */
export async function generateSeasonalEvent(): Promise<Quest | null> {
  // Check if there's a seasonal event active
  const now = new Date()
  const month = now.getMonth()
  
  // Example: Halloween event in October
  if (month === 9) { // October (0-indexed)
    const challenge = await generateDailyChallenge(1)
    challenge.name = `Halloween Special: ${challenge.name}`
    challenge.description = `A spooky seasonal challenge! ${challenge.description}`
    if (challenge.rewards) {
      challenge.rewards.experience = (challenge.rewards.experience || 0) * 3
      challenge.rewards.gold = (challenge.rewards.gold || 0) * 3
    }
    return challenge
  }
  
  // Add more seasonal events here
  return null
}

/**
 * Initialize meta-game state
 */
export async function initializeMetaGame(): Promise<MetaGameState> {
  // Try to fetch content for enhanced experience
  try {
    await fetchGameContentBatch()
  } catch (error) {
    console.warn('Failed to fetch initial content batch:', error)
  }
  
  const dailyChallenge = await initializeDailyChallenge()
  
  return {
    dailyChallenge,
    achievements: getAchievementDefinitions(),
    totalPlaytime: 0,
    totalBattles: 0,
    totalVictories: 0,
    totalDefeats: 0,
    lastDailyReset: Date.now(),
  }
}

