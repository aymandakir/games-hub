// Save/Load system using IndexedDB

import { openDB, DBSchema, IDBPDatabase } from 'idb'
import { PlayerState, StoryState, CombatState } from '@/lib/types/game'

interface SaveGameDB extends DBSchema {
  saves: {
    key: string
    value: SaveData
  }
  settings: {
    key: string
    value: any
  }
  metadata: {
    key: string
    value: SaveMetadata
  }
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

export interface SaveMetadata {
  slotId: string
  characterName: string
  characterGender: 'male' | 'female'
  level: number
  location: string
  playtime: number
  timestamp: number
  screenshot?: string
}

export class SaveSystem {
  private db: IDBPDatabase<SaveGameDB> | null = null
  private autoSaveInterval: NodeJS.Timeout | null = null
  private readonly GAME_VERSION = '1.0.0'

  async initialize(): Promise<void> {
    try {
      this.db = await openDB<SaveGameDB>('aetheris-game', 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('saves')) {
            db.createObjectStore('saves')
          }
          if (!db.objectStoreNames.contains('settings')) {
            db.createObjectStore('settings')
          }
          if (!db.objectStoreNames.contains('metadata')) {
            db.createObjectStore('metadata')
          }
        },
      })
    } catch (error) {
      console.error('Failed to initialize save system:', error)
    }
  }

  async saveGame(slotId: string, gameState: any): Promise<void> {
    if (!this.db) return

    const saveData: SaveData = {
      version: this.GAME_VERSION,
      timestamp: Date.now(),
      playtime: gameState.playtime || 0,
      player: gameState.player,
      story: gameState.story,
      combat: gameState.combat,
      inventory: gameState.player?.inventory || [],
      relationships: gameState.story?.npcRelationships || {},
      quests: gameState.story?.completedQuests || [],
      currentLocation: gameState.player?.currentLocation || 'crosspoint',
      unlockedLocations: gameState.story?.unlockedLocations || [],
      storyFlags: gameState.story?.storyFlags || {},
      achievements: gameState.achievements || [],
    }

    const metadata: SaveMetadata = {
      slotId,
      characterName: gameState.player?.character === 'kael' ? 'Kael' : 'Lyra',
      characterGender: gameState.player?.character === 'kael' ? 'male' : 'female',
      level: gameState.player?.level || 1,
      location: gameState.player?.currentLocation || 'crosspoint',
      playtime: saveData.playtime,
      timestamp: saveData.timestamp,
    }

    try {
      await this.db.put('saves', saveData, slotId)
      await this.db.put('metadata', metadata, slotId)
    } catch (error) {
      console.error('Failed to save game:', error)
      throw error
    }
  }

  async quickSave(): Promise<void> {
    const gameState = useGameStore.getState()
    await this.saveGame('quick', gameState)
  }

  async autoSave(): Promise<void> {
    await this.quickSave()
  }

  async loadGame(slotId: string): Promise<SaveData | null> {
    if (!this.db) return null

    try {
      const saveData = await this.db.get('saves', slotId)
      return saveData || null
    } catch (error) {
      console.error('Failed to load game:', error)
      return null
    }
  }

  async getAllSaves(): Promise<SaveMetadata[]> {
    if (!this.db) return []

    try {
      const saves = await this.db.getAll('metadata')
      return saves
    } catch (error) {
      console.error('Failed to get saves:', error)
      return []
    }
  }

  async deleteSave(slotId: string): Promise<void> {
    if (!this.db) return

    try {
      await this.db.delete('saves', slotId)
      await this.db.delete('metadata', slotId)
    } catch (error) {
      console.error('Failed to delete save:', error)
    }
  }

  async saveSetting(key: string, value: any): Promise<void> {
    if (!this.db) return

    try {
      await this.db.put('settings', value, key)
    } catch (error) {
      console.error('Failed to save setting:', error)
    }
  }

  async loadSettings(): Promise<Record<string, any>> {
    if (!this.db) return {}

    try {
      const settings: Record<string, any> = {}
      const keys = await this.db.getAllKeys('settings')
      for (const key of keys) {
        settings[key] = await this.db.get('settings', key)
      }
      return settings
    } catch (error) {
      console.error('Failed to load settings:', error)
      return {}
    }
  }

  async generateScreenshot(): Promise<string> {
    // Capture canvas or screen as base64
    // This would use html2canvas or similar
    return ''
  }

  startAutoSave(intervalMs: number): void {
    this.stopAutoSave()
    this.autoSaveInterval = setInterval(() => {
      this.autoSave()
    }, intervalMs)
  }

  stopAutoSave(): void {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval)
      this.autoSaveInterval = null
    }
  }

  async exportSave(slotId: string): Promise<Blob> {
    const saveData = await this.loadGame(slotId)
    if (!saveData) throw new Error('Save not found')

    const json = JSON.stringify(saveData, null, 2)
    return new Blob([json], { type: 'application/json' })
  }

  async importSave(file: File): Promise<void> {
    const text = await file.text()
    const saveData: SaveData = JSON.parse(text)

    // Validate version
    if (saveData.version !== this.GAME_VERSION) {
      console.warn('Save version mismatch')
    }

    // Import to a new slot
    const slotId = `imported-${Date.now()}`
    await this.saveGame(slotId, saveData)
  }
}

// Import useGameStore
import { useGameStore } from '@/lib/store/gameStore'

// Singleton instance
let saveSystemInstance: SaveSystem | null = null

export function getSaveSystem(): SaveSystem {
  if (!saveSystemInstance) {
    saveSystemInstance = new SaveSystem()
  }
  return saveSystemInstance
}

