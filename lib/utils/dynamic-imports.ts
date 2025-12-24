/**
 * Dynamic Import Helpers
 * Provides lazy-loaded access to game modules to avoid circular dependencies
 */

// Cache for loaded modules
const moduleCache: Record<string, any> = {}

/**
 * Dynamically import CHARACTERS
 */
export async function getCHARACTERS() {
  if (moduleCache.CHARACTERS) return moduleCache.CHARACTERS
  
  try {
    const module = await import('@/lib/constants/characters')
    moduleCache.CHARACTERS = module.CHARACTERS
    return module.CHARACTERS
  } catch (error) {
    console.error('Failed to load CHARACTERS:', error)
    return {}
  }
}

/**
 * Dynamically import getEnemy
 */
export async function getEnemyFunction() {
  if (moduleCache.getEnemy) return moduleCache.getEnemy
  
  try {
    const module = await import('@/lib/constants/enemies')
    moduleCache.getEnemy = module.getEnemy
    return module.getEnemy
  } catch (error) {
    console.error('Failed to load getEnemy:', error)
    return () => null
  }
}

/**
 * Dynamically import getLocation
 */
export async function getLocationFunction() {
  if (moduleCache.getLocation) return moduleCache.getLocation
  
  try {
    const module = await import('@/lib/constants/locations')
    moduleCache.getLocation = module.getLocation
    return module.getLocation
  } catch (error) {
    console.error('Failed to load getLocation:', error)
    return () => null
  }
}

/**
 * Dynamically import combat functions
 */
export async function getCombatFunctions() {
  if (moduleCache.combat) return moduleCache.combat
  
  try {
    const module = await import('@/lib/systems/combat')
    moduleCache.combat = {
      resolveRound: module.resolveRound,
      getEnemyMove: module.getEnemyMove,
      checkBattleEnd: module.checkBattleEnd,
      canUseSymbolBreak: module.canUseSymbolBreak,
      calculateResolveGain: module.calculateResolveGain,
    }
    return moduleCache.combat
  } catch (error) {
    console.error('Failed to load combat functions:', error)
    return {
      resolveRound: () => ({} as any),
      getEnemyMove: () => 'rock' as const,
      checkBattleEnd: () => 'ongoing' as const,
      canUseSymbolBreak: () => false,
      calculateResolveGain: () => 0,
    }
  }
}

/**
 * Dynamically import save system
 */
export async function getSaveSystemFunction() {
  if (moduleCache.saveSystem) return moduleCache.saveSystem
  
  try {
    const module = await import('@/lib/systems/save-system')
    moduleCache.saveSystem = module.getSaveSystem
    return module.getSaveSystem
  } catch (error) {
    console.error('Failed to load save system:', error)
    return async () => ({
      saveGame: async () => {},
      loadGame: async () => null,
      getAllSaves: async () => [],
      deleteSave: async () => {},
    })
  }
}

/**
 * Dynamically import random generation functions
 */
export async function getRandomGenerationFunctions() {
  if (moduleCache.randomGen) return moduleCache.randomGen
  
  try {
    const module = await import('@/lib/systems/random-generation')
    moduleCache.randomGen = {
      generateEnemy: module.generateEnemy,
      generateQuest: module.generateQuest,
      generateLocation: module.generateLocation,
    }
    return moduleCache.randomGen
  } catch (error) {
    console.error('Failed to load random generation:', error)
    return {
      generateEnemy: () => ({} as any),
      generateQuest: () => ({} as any),
      generateLocation: () => ({} as any),
    }
  }
}

/**
 * Dynamically import encounter functions
 */
export async function getEncounterFunctions() {
  if (moduleCache.encounters) return moduleCache.encounters
  
  try {
    const module = await import('@/lib/systems/encounters')
    moduleCache.encounters = {
      generateWildernessEncounter: module.generateWildernessEncounter,
      generateDailyChallenge: module.generateDailyChallenge,
      generateRandomEvent: module.generateRandomEvent,
    }
    return moduleCache.encounters
  } catch (error) {
    console.error('Failed to load encounter functions:', error)
    return {
      generateWildernessEncounter: async () => null,
      generateDailyChallenge: async () => ({} as any),
      generateRandomEvent: async () => ({ title: '', description: '' }),
    }
  }
}

/**
 * Sync version - loads immediately (use sparingly)
 */
let syncCache: any = null

export function initSyncImports() {
  if (syncCache) return syncCache
  
  // Try to load synchronously if possible
  try {
    syncCache = {
      CHARACTERS: require('@/lib/constants/characters').CHARACTERS,
      getEnemy: require('@/lib/constants/enemies').getEnemy,
      getLocation: require('@/lib/constants/locations').getLocation,
      getDialogueNode: require('@/lib/constants/dialogue')?.getDialogueNode || (() => null),
    }
    return syncCache
  } catch (error) {
    // Return placeholders if sync loading fails
    return {
      CHARACTERS: {},
      getEnemy: () => null,
      getLocation: () => null,
      getDialogueNode: () => null,
    }
  }
}

