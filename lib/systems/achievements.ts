import { ACHIEVEMENTS, Achievement, GameState } from '@/lib/constants/achievements'
import { getSaveSystem } from '@/lib/systems/save-system'
import { useGameStore } from '@/lib/store/gameStore'

export class AchievementSystem {
  private unlockedAchievements: Set<string> = new Set()

  checkAchievements(gameState: GameState): Achievement[] {
    const newlyUnlocked: Achievement[] = []

    ACHIEVEMENTS.forEach(achievement => {
      // Skip if already unlocked
      if (this.unlockedAchievements.has(achievement.id)) return

      // Check condition
      if (achievement.condition(gameState)) {
        this.unlockAchievement(achievement)
        newlyUnlocked.push(achievement)
      }
    })

    return newlyUnlocked
  }

  private unlockAchievement(achievement: Achievement): void {
    this.unlockedAchievements.add(achievement.id)

    // Show notification
    this.showAchievementNotification(achievement)

    // Apply rewards
    if (achievement.reward) {
      // const gameStore = useGameStore.getState() // Reserved for future use

      if (achievement.reward.title) {
        // Would unlock title
        console.log(`[Achievement] Unlocked title: ${achievement.reward.title}`)
      }
      if (achievement.reward.item) {
        // Would add item
        console.log(`[Achievement] Reward item: ${achievement.reward.item}`)
      }
      if (achievement.reward.alignment) {
        // Would shift alignment
        console.log(`[Achievement] Alignment reward:`, achievement.reward.alignment)
      }
    }

    // Save progress
    this.saveAchievements()
  }

  private showAchievementNotification(achievement: Achievement): void {
    // Dispatch custom event for UI to handle
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('achievement-unlocked', {
        detail: achievement,
      }))
    }
  }

  getUnlockedAchievements(): Achievement[] {
    return ACHIEVEMENTS.filter(a => this.unlockedAchievements.has(a.id))
  }

  getProgress(): { unlocked: number; total: number; percentage: number } {
    const unlocked = this.unlockedAchievements.size
    const total = ACHIEVEMENTS.length
    return {
      unlocked,
      total,
      percentage: Math.round((unlocked / total) * 100),
    }
  }

  private async saveAchievements(): Promise<void> {
    try {
      const saveSystem = await getSaveSystem()
      await saveSystem.saveSetting('achievements', Array.from(this.unlockedAchievements))
    } catch (error) {
      console.error('[Achievements] Failed to save:', error)
    }
  }

  async loadAchievements(): Promise<void> {
    try {
      const saveSystem = await getSaveSystem()
      const saved = await saveSystem.loadSettings()
      if (saved.achievements) {
        this.unlockedAchievements = new Set(saved.achievements)
      }
    } catch (error) {
      console.error('[Achievements] Failed to load:', error)
    }
  }

  isUnlocked(achievementId: string): boolean {
    return this.unlockedAchievements.has(achievementId)
  }
}

// Global instance
let achievementSystem: AchievementSystem | null = null

export function getAchievementSystem(): AchievementSystem {
  if (!achievementSystem) {
    achievementSystem = new AchievementSystem()
    achievementSystem.loadAchievements()
  }
  return achievementSystem
}

