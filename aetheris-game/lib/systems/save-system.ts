import { PlayerState, StoryState, CombatState } from '@/lib/types/game'

export interface SaveMetadata {
  slotId: string
  characterName: string
  level: number
  location: string
  playtime: number
  timestamp: number
}

export interface SaveData {
  version: string
  timestamp: number
  playtime: number
  player: PlayerState
  story: StoryState
  combat: CombatState
  inventory: any[]
  relationships: { [npcId: string]: number }
  quests: any[]
  currentLocation: string
  unlockedLocations: string[]
  storyFlags: { [flag: string]: boolean }
  achievements: string[]
}

const GAME_VERSION = '1.0.0'

/**
 * Save System with version control and data validation
 * CRITICAL BUG FIX: Version numbers, corruption prevention, data validation
 */
class SaveSystem {
  private readonly VERSION = GAME_VERSION
  private readonly STORAGE_PREFIX = 'aetheris_save_'
  private readonly METADATA_PREFIX = 'aetheris_meta_'

  async initialize() {
    // Validate existing saves
    await this.validateAllSaves()
  }

  /**
   * Save game with version number and validation
   */
  async saveGame(slotId: string, gameState: any): Promise<void> {
    try {
      // Validate game state
      if (!this.validateGameState(gameState)) {
        throw new Error('Invalid game state data')
      }

      const saveData: SaveData = {
        version: this.VERSION,
        timestamp: Date.now(),
        playtime: gameState.playtime || 0,
        player: this.sanitizePlayerState(gameState.player),
        story: this.sanitizeStoryState(gameState.story),
        combat: this.sanitizeCombatState(gameState.combat),
        inventory: gameState.player?.inventory || [],
        relationships: gameState.story?.npcRelationships || {},
        quests: gameState.story?.completedQuests || [],
        currentLocation: gameState.player?.currentLocation || 'crosspoint',
        unlockedLocations: gameState.story?.unlockedLocations || ['crosspoint'],
        storyFlags: gameState.story?.storyFlags || {},
        achievements: gameState.achievements || [],
      }

      const metadata: SaveMetadata = {
        slotId,
        characterName: gameState.player?.character === 'kael' ? 'Kael' : 'Lyra',
        level: gameState.player?.level || 1,
        location: gameState.player?.currentLocation || 'crosspoint',
        playtime: saveData.playtime,
        timestamp: saveData.timestamp,
      }

      // Save with error handling
      const saveString = JSON.stringify(saveData)
      const metaString = JSON.stringify(metadata)

      localStorage.setItem(`${this.STORAGE_PREFIX}${slotId}`, saveString)
      localStorage.setItem(`${this.METADATA_PREFIX}${slotId}`, metaString)
    } catch (error) {
      console.error('Failed to save game:', error)
      throw new Error(`Save failed: ${error}`)
    }
  }

  /**
   * Load game with version checking and migration
   */
  async loadGame(slotId: string): Promise<SaveData | null> {
    try {
      const saveString = localStorage.getItem(`${this.STORAGE_PREFIX}${slotId}`)
      if (!saveString) return null

      const saveData: SaveData = JSON.parse(saveString)

      // Check version compatibility
      if (!this.isVersionCompatible(saveData.version)) {
        console.warn(`Save version ${saveData.version} may not be compatible with ${this.VERSION}`)
        // Attempt migration
        const migrated = await this.migrateSave(saveData)
        if (!migrated) {
          throw new Error('Save file version incompatible and migration failed')
        }
        return migrated
      }

      // Validate loaded data
      if (!this.validateSaveData(saveData)) {
        throw new Error('Save file corrupted or invalid')
      }

      return saveData
    } catch (error) {
      console.error('Failed to load game:', error)
      return null
    }
  }

  /**
   * Get all save metadata
   */
  async getAllSaves(): Promise<SaveMetadata[]> {
    const saves: SaveMetadata[] = []
    const keys = Object.keys(localStorage)

    for (const key of keys) {
      if (key.startsWith(this.METADATA_PREFIX)) {
        try {
          const metaString = localStorage.getItem(key)
          if (metaString) {
            const metadata = JSON.parse(metaString)
            saves.push(metadata)
          }
        } catch (error) {
          console.error(`Failed to parse metadata for ${key}:`, error)
        }
      }
    }

    return saves.sort((a, b) => b.timestamp - a.timestamp)
  }

  /**
   * Delete save file
   */
  async deleteSave(slotId: string): Promise<void> {
    localStorage.removeItem(`${this.STORAGE_PREFIX}${slotId}`)
    localStorage.removeItem(`${this.METADATA_PREFIX}${slotId}`)
  }

  /**
   * Validate game state before saving
   */
  private validateGameState(gameState: any): boolean {
    if (!gameState) return false
    if (!gameState.player) return false
    if (!gameState.story) return false
    if (!gameState.combat) return false

    // Validate player HP bounds
    if (gameState.player.hp < 0 || gameState.player.hp > gameState.player.maxHP) {
      console.error('Invalid player HP:', gameState.player.hp)
      return false
    }

    return true
  }

  /**
   * Sanitize player state (ensure HP bounds, etc.)
   */
  private sanitizePlayerState(player: any): PlayerState {
    return {
      ...player,
      hp: Math.max(0, Math.min(player.hp || 100, player.maxHP || 100)),
      maxHP: Math.max(100, player.maxHP || 100),
      resolve: Math.max(0, Math.min(player.resolve || 0, player.maxResolve || 100)),
      maxResolve: Math.max(100, player.maxResolve || 100),
      level: Math.max(1, player.level || 1),
      experience: Math.max(0, player.experience || 0),
    }
  }

  /**
   * Sanitize story state
   */
  private sanitizeStoryState(story: any): StoryState {
    return {
      act: story.act || 1,
      currentQuest: story.currentQuest,
      completedQuests: story.completedQuests || [],
      npcRelationships: story.npcRelationships || {},
      dialogueChoices: story.dialogueChoices || {},
      storyFlags: story.storyFlags || {},
      unlockedLocations: story.unlockedLocations || ['crosspoint'],
      visitedLocations: story.visitedLocations || ['crosspoint'],
    }
  }

  /**
   * Sanitize combat state
   */
  private sanitizeCombatState(combat: any): CombatState {
    return {
      ...combat,
      playerHP: Math.max(0, Math.min(combat.playerHP || 100, combat.playerMaxHP || 100)),
      playerMaxHP: Math.max(100, combat.playerMaxHP || 100),
      enemyHP: Math.max(0, combat.enemyHP || 0),
      enemyMaxHP: Math.max(0, combat.enemyMaxHP || 0),
      playerResolve: Math.max(0, Math.min(combat.playerResolve || 0, combat.maxResolve || 100)),
      maxResolve: Math.max(100, combat.maxResolve || 100),
    }
  }

  /**
   * Check if save version is compatible
   */
  private isVersionCompatible(version: string): boolean {
    // Same major version is compatible
    const currentMajor = parseInt(this.VERSION.split('.')[0])
    const saveMajor = parseInt(version.split('.')[0])
    return currentMajor === saveMajor
  }

  /**
   * Migrate save to current version
   */
  private async migrateSave(saveData: SaveData): Promise<SaveData | null> {
    try {
      // Add missing fields with defaults
      const migrated: SaveData = {
        ...saveData,
        version: this.VERSION,
        inventory: saveData.inventory || [],
        relationships: saveData.relationships || {},
        quests: saveData.quests || [],
        unlockedLocations: saveData.unlockedLocations || ['crosspoint'],
        storyFlags: saveData.storyFlags || {},
        achievements: saveData.achievements || [],
      }

      // Sanitize all state
      migrated.player = this.sanitizePlayerState(migrated.player)
      migrated.story = this.sanitizeStoryState(migrated.story)
      migrated.combat = this.sanitizeCombatState(migrated.combat)

      return migrated
    } catch (error) {
      console.error('Migration failed:', error)
      return null
    }
  }

  /**
   * Validate save data structure
   */
  private validateSaveData(saveData: SaveData): boolean {
    if (!saveData.version) return false
    if (!saveData.player) return false
    if (!saveData.story) return false
    if (!saveData.combat) return false

    // Validate HP bounds
    if (saveData.player.hp < 0 || saveData.player.hp > saveData.player.maxHP) {
      return false
    }

    return true
  }

  /**
   * Validate all existing saves
   */
  private async validateAllSaves(): Promise<void> {
    const saves = await this.getAllSaves()
    for (const save of saves) {
      const data = await this.loadGame(save.slotId)
      if (!data) {
        console.warn(`Invalid save detected: ${save.slotId}, removing...`)
        await this.deleteSave(save.slotId)
      }
    }
  }
}

let saveSystemInstance: SaveSystem | null = null

export function getSaveSystem() {
  if (!saveSystemInstance) {
    saveSystemInstance = new SaveSystem()
  }
  return saveSystemInstance
}

