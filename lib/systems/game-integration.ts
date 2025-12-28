/**
 * Game Integration System
 * Integrates procedural generation and digital libraries into the game
 */

import { Enemy, Location, Quest, Item } from '@/lib/types/game'
import {
  generateRandomEnemy,
  generateRandomLocation,
  generateRandomItem,
  generateProceduralDungeon,
  getRandomEnemyPool,
} from './procedural-generation'
import {
  fetchLibraryDataBatch,
  generateLoreText,
  generateDialogue,
  getGameInspiredContent,
} from './digital-libraries'
import { generateEnhancedQuest, generateBossQuest, generateQuestChain, generateDailyQuests } from './quest-generator'

/**
 * Initialize procedural content for a region
 */
export async function initializeProceduralRegion(
  region: 'rock' | 'paper' | 'scissors' | 'neutral',
  level: number = 1
): Promise<{
  enemies: Enemy[]
  locations: Location[]
  quests: Quest[]
  items: Item[]
  lore: string
}> {
  // Generate enemies
  const enemies = getRandomEnemyPool(region as 'rock' | 'paper' | 'scissors', level, 5)

  // Generate locations
  const locations: Location[] = []
  for (let i = 0; i < 3; i++) {
    locations.push(generateRandomLocation(region))
  }

  // Generate quests
  const quests: Quest[] = []
  for (let i = 0; i < 3; i++) {
    const quest = await generateEnhancedQuest(region, level + i)
    quests.push(quest)
  }

  // Generate items
  const items: Item[] = []
  for (let i = 0; i < 5; i++) {
    items.push(generateRandomItem(region))
  }

  // Generate lore
  const lore = await generateLoreText(`${region} region`)

  return {
    enemies,
    locations,
    quests,
    items,
    lore,
  }
}

/**
 * Generate a random encounter
 */
export function generateRandomEncounter(
  region: 'rock' | 'paper' | 'scissors',
  playerLevel: number = 1
): Enemy {
  const isBoss = Math.random() < 0.1 // 10% chance for boss
  return generateRandomEnemy(region, playerLevel, isBoss)
}

/**
 * Generate a procedural dungeon
 */
export function generateRandomDungeon(
  region: 'rock' | 'paper' | 'scissors',
  depth: number = 3
): Location[] {
  return generateProceduralDungeon(region, depth)
}

/**
 * Get daily content (refreshes each day)
 */
export function getDailyContent(): {
  quests: Quest[]
  specialEnemy: Enemy | null
  specialItem: Item | null
} {
  const quests = generateDailyQuests()
  const specialEnemy = Math.random() < 0.3 ? generateRandomEnemy('rock', 5, true) : null
  const specialItem = Math.random() < 0.3 ? generateRandomItem('neutral') : null

  return {
    quests,
    specialEnemy,
    specialItem,
  }
}

/**
 * Generate boss encounter with enhanced rewards
 */
export function generateBossEncounter(
  region: 'rock' | 'paper' | 'scissors',
  level: number = 5
): { enemy: Enemy; quest: Quest; rewards: Item[] } {
  const enemy = generateRandomEnemy(region, level, true)
  const quest = generateBossQuest(region, level)
  const rewards: Item[] = []
  for (let i = 0; i < 3; i++) {
    rewards.push(generateRandomItem(region))
  }

  return {
    enemy,
    quest,
    rewards,
  }
}

/**
 * Generate quest chain for story progression
 */
export async function generateStoryQuestChain(
  region: 'rock' | 'paper' | 'scissors' | 'neutral',
  startingLevel: number = 1
): Promise<Quest[]> {
  return generateQuestChain(region, 3, startingLevel)
}

/**
 * Preload library data for better performance
 */
let cachedLibraryData: {
  fact: string | null
  quote: { text: string; author: string } | null
  wikipedia: { title: string; extract: string; url: string } | null
} | null = null

export async function preloadLibraryData(): Promise<void> {
  if (!cachedLibraryData) {
    cachedLibraryData = await fetchLibraryDataBatch()
  }
}

export function getCachedLibraryData() {
  return cachedLibraryData
}

/**
 * Generate NPC dialogue with library inspiration
 */
export async function generateNPCDialogue(
  npcName: string,
  context: string
): Promise<string> {
  return generateDialogue(npcName, context)
}

/**
 * Get game-inspired name for content
 */
export function getInspiredName(type: 'name' | 'quest' | 'location' | 'enemy' | 'item'): string {
  return getGameInspiredContent(type)
}

/**
 * Check if procedural content should be used
 */
export function shouldUseProceduralContent(
  locationId: string,
  playerLevel: number
): boolean {
  // Use procedural content for:
  // 1. High level players (more variety needed)
  // 2. Certain location types
  // 3. Random chance (30%)
  return playerLevel > 5 || locationId.includes('proc_') || Math.random() < 0.3
}

/**
 * Merge procedural content with static content
 */
export function mergeProceduralContent<T extends { id: string }>(
  staticContent: T[],
  proceduralContent: T[],
  maxItems: number = 10
): T[] {
  // Combine and deduplicate
  const combined = [...staticContent, ...proceduralContent]
  const seen = new Set<string>()
  const unique: T[] = []

  for (const item of combined) {
    if (!seen.has(item.id) && unique.length < maxItems) {
      seen.add(item.id)
      unique.push(item)
    }
  }

  return unique
}



