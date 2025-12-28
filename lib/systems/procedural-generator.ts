/**
 * Procedural Content Generation System
 * Generates enemies, NPCs, quests, locations, and game modes randomly
 */

import { Enemy, EnemyPattern, MoveType, Location, NPC, Quest, Item, Alignment } from '@/lib/types/game'
import { randomInt, clamp } from '@/lib/utils/game-helpers'

// Name generators using common patterns
const ROCK_NAMES = [
  'Boulder', 'Granite', 'Stone', 'Iron', 'Steel', 'Titan', 'Crag', 'Ridge',
  'Mountain', 'Pebble', 'Slate', 'Basalt', 'Quartz', 'Onyx', 'Jade'
]

const PAPER_NAMES = [
  'Scroll', 'Parchment', 'Ink', 'Quill', 'Script', 'Tome', 'Codex', 'Manuscript',
  'Folio', 'Vellum', 'Papyrus', 'Document', 'Letter', 'Note', 'Page'
]

const SCISSOR_NAMES = [
  'Blade', 'Edge', 'Razor', 'Cut', 'Slice', 'Shear', 'Cleave', 'Sever',
  'Shard', 'Fragment', 'Splinter', 'Point', 'Tip', 'Strike', 'Lash'
]

const TITLES = [
  'Guardian', 'Warrior', 'Master', 'Keeper', 'Defender', 'Champion', 'Elite',
  'Adept', 'Novice', 'Veteran', 'Sentinel', 'Warden', 'Protector', 'Guard'
]

const LOCATION_PREFIXES = [
  'Ancient', 'Forgotten', 'Hidden', 'Lost', 'Sacred', 'Cursed', 'Mysterious',
  'Abandoned', 'Ruined', 'Eternal', 'Whispering', 'Silent', 'Thundering'
]

const LOCATION_SUFFIXES = [
  'Sanctuary', 'Temple', 'Shrine', 'Ruins', 'Fortress', 'Tower', 'Cavern',
  'Grove', 'Plains', 'Peak', 'Valley', 'Depths', 'Heights', 'Crossing'
]

// Digital Library API Integration
class DigitalLibraryAPI {
  private cache: Map<string, any> = new Map()
  private cacheExpiry = 24 * 60 * 60 * 1000 // 24 hours

  /**
   * Fetch random name from external API (fallback to local generator)
   */
  async fetchRandomName(type: 'character' | 'location' | 'item'): Promise<string> {
    const cacheKey = `name_${type}_${Date.now()}`
    
    try {
      // Try to fetch from a free API (example: randomuser.me for names)
      // In production, you might use: https://randomuser.me/api/ or similar
      const response = await fetch('https://randomuser.me/api/?inc=name')
      const data = await response.json()
      if (data?.results?.[0]?.name) {
        const name = data.results[0].name.first
        return this.capitalize(name)
      }
    } catch (error) {
      console.log('API unavailable, using local generator')
    }
    
    // Fallback to local generation
    return this.generateLocalName(type)
  }

  /**
   * Fetch lore/inspiration from external sources
   */
  async fetchLoreInspiration(topic: string): Promise<string> {
    const cacheKey = `lore_${topic}`
    const cached = this.cache.get(cacheKey)
    
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data
    }

    try {
      // Use a free API like Wikipedia or similar for inspiration
      // This is a placeholder - in production you'd use a real API
      const response = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`
      )
      const data = await response.json()
      
      if (data?.extract) {
        const lore = data.extract.substring(0, 200) // First 200 chars
        this.cache.set(cacheKey, { data: lore, timestamp: Date.now() })
        return lore
      }
    } catch (error) {
      console.log('Lore API unavailable, using generated description')
    }

    // Fallback
    return this.generateLoreDescription(topic)
  }

  private generateLocalName(type: 'character' | 'location' | 'item'): string {
    const prefixes = type === 'location' ? LOCATION_PREFIXES : []
    const suffixes = type === 'location' ? LOCATION_SUFFIXES : TITLES
    const baseNames = [...ROCK_NAMES, ...PAPER_NAMES, ...SCISSOR_NAMES]
    
    if (type === 'location') {
      return `${prefixes[randomInt(0, prefixes.length - 1)]} ${suffixes[randomInt(0, suffixes.length - 1)]}`
    }
    
    return `${baseNames[randomInt(0, baseNames.length - 1)]} ${suffixes[randomInt(0, suffixes.length - 1)]}`
  }

  private generateLoreDescription(topic: string): string {
    const templates = [
      `The ${topic} holds ancient secrets that few dare to explore.`,
      `Legends speak of the ${topic} and its mysterious power.`,
      `Many have sought the ${topic}, but few have returned unchanged.`,
      `The ${topic} stands as a testament to the old ways.`,
    ]
    return templates[randomInt(0, templates.length - 1)]
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }
}

const libraryAPI = new DigitalLibraryAPI()

// Procedural Enemy Generator
export class ProceduralEnemyGenerator {
  /**
   * Generate a random enemy based on region and difficulty
   */
  static async generateEnemy(
    region: 'rock' | 'paper' | 'scissors',
    difficulty: number = 1,
    isBoss: boolean = false
  ): Promise<Enemy> {
    const type: MoveType = region
    const baseHP = isBoss ? 150 + (difficulty * 50) : 50 + (difficulty * 20)
    
    // Generate name
    const name = await libraryAPI.fetchRandomName('character')
    const fullName = isBoss ? `The ${name}` : name

    // Generate pattern based on difficulty
    const pattern = this.generatePattern(type, difficulty, isBoss)

    // Generate description
    const description = await this.generateDescription(type, isBoss, difficulty)

    return {
      id: `proc_${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: fullName,
      type,
      maxHP: baseHP,
      currentHP: baseHP,
      pattern,
      description,
      isBoss,
    }
  }

  private static generatePattern(
    type: MoveType,
    difficulty: number,
    isBoss: boolean
  ): EnemyPattern {
    const patterns: EnemyPattern[] = []

    // Basic patterns
    if (difficulty <= 1) {
      patterns.push({ type: 'predictable', move: type })
    }

    if (difficulty >= 2) {
      patterns.push({ type: 'reactive', counters: true })
    }

    if (difficulty >= 3) {
      const sequences: MoveType[][] = [
        [type, type, this.getWeakness(type)],
        [type, this.getWeakness(type), this.getStrength(type)],
        [type, 'rock', 'paper', 'scissors'],
      ]
      const seq = sequences[randomInt(0, sequences.length - 1)]
      patterns.push({ type: 'sequence', moves: seq, index: 0 })
    }

    if (difficulty >= 4 || isBoss) {
      patterns.push({ type: 'random' })
    }

    // Boss patterns with phases
    if (isBoss) {
      return {
        type: 'phase',
        phases: [
          {
            hpThreshold: 100,
            preferredMove: type,
            pattern: { type: 'reactive', counters: true },
          },
          {
            hpThreshold: 50,
            preferredMove: this.getWeakness(type),
            pattern: { type: 'random' },
          },
          {
            hpThreshold: 0,
            preferredMove: this.getStrength(type),
            pattern: { type: 'sequence', moves: [type, this.getWeakness(type), this.getStrength(type)], index: 0 },
          },
        ],
        currentPhase: 0,
      }
    }

    // Return random pattern from available
    return patterns[randomInt(0, patterns.length - 1)]
  }

  private static async generateDescription(
    type: MoveType,
    isBoss: boolean,
    difficulty: number
  ): Promise<string> {
    const typeNames = {
      rock: 'Rock-aligned',
      paper: 'Paper-aligned',
      scissors: 'Scissor-aligned',
    }

    const difficultyText = difficulty >= 4 ? 'powerful' : difficulty >= 2 ? 'experienced' : 'novice'
    const bossText = isBoss ? 'A formidable opponent' : 'A warrior'

    try {
      const lore = await libraryAPI.fetchLoreInspiration(typeNames[type])
      return `${bossText} of the ${typeNames[type]} faction. ${lore}`
    } catch {
      return `${bossText} of the ${typeNames[type]} faction. ${difficultyText} in combat.`
    }
  }

  private static getWeakness(type: MoveType): MoveType {
    if (type === 'rock') return 'paper'
    if (type === 'paper') return 'scissors'
    return 'rock'
  }

  private static getStrength(type: MoveType): MoveType {
    if (type === 'rock') return 'scissors'
    if (type === 'paper') return 'rock'
    return 'paper'
  }
}

// Procedural Location Generator
export class ProceduralLocationGenerator {
  static async generateLocation(
    region: 'rock' | 'paper' | 'scissors' | 'neutral',
    difficulty: number = 1
  ): Promise<Location> {
    const name = await libraryAPI.fetchRandomName('location')
    const description = await this.generateLocationDescription(region, name)

    const encounterChance = 0.2 + (difficulty * 0.1)
    const numPoints = 2 + randomInt(0, 2)

    const interactivePoints = []
    const pointTypes: Array<'shop' | 'npc' | 'training' | 'quest' | 'lore'> = 
      ['shop', 'npc', 'training', 'quest', 'lore']
    
    for (let i = 0; i < numPoints; i++) {
      const pointType = pointTypes[randomInt(0, pointTypes.length - 1)]
      interactivePoints.push({
        id: `point_${i}`,
        name: `${pointType.charAt(0).toUpperCase() + pointType.slice(1)} Point`,
        type: pointType,
        description: `A ${pointType} location in ${name}.`,
      })
    }

    return {
      id: `proc_loc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      region,
      connections: [],
      interactivePoints,
      encounterChance: clamp(encounterChance, 0, 0.8),
    }
  }

  private static async generateLocationDescription(
    region: 'rock' | 'paper' | 'scissors' | 'neutral',
    name: string
  ): Promise<string> {
    const regionDescriptions = {
      rock: 'A place of stone and earth, where the ground itself seems alive.',
      paper: 'A realm of knowledge and wind, where thoughts take physical form.',
      scissors: 'A domain of precision and metal, where every edge is sharp.',
      neutral: 'A balanced place where all forces meet in harmony.',
    }

    try {
      const lore = await libraryAPI.fetchLoreInspiration(region)
      return `${regionDescriptions[region]} ${lore}`
    } catch {
      return regionDescriptions[region]
    }
  }
}

// Procedural Quest Generator
export class ProceduralQuestGenerator {
  static async generateQuest(
    region: 'rock' | 'paper' | 'scissors' | 'neutral',
    difficulty: number = 1
  ): Promise<Quest> {
    const questTypes = ['defeat', 'collect', 'explore', 'talk']
    const questType = questTypes[randomInt(0, questTypes.length - 1)]
    
    const name = await this.generateQuestName(questType, region)
    const description = await this.generateQuestDescription(questType, region)

    const objectives = this.generateObjectives(questType, difficulty)

    return {
      id: `proc_quest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      objectives,
      rewards: {
        experience: difficulty * 50,
        gold: difficulty * 20,
      },
      act: difficulty <= 2 ? 1 : difficulty <= 4 ? 2 : 3,
      region,
      status: 'active',
    }
  }

  private static async generateQuestName(
    type: string,
    region: string
  ): Promise<string> {
    const prefixes = ['The', 'A', 'Seeking', 'Finding', 'Defending']
    const suffixes = ['Challenge', 'Mystery', 'Quest', 'Mission', 'Task']
    
    return `${prefixes[randomInt(0, prefixes.length - 1)]} ${region} ${suffixes[randomInt(0, suffixes.length - 1)]}`
  }

  private static async generateQuestDescription(
    type: string,
    region: string
  ): Promise<string> {
    const templates = {
      defeat: `Defeat the enemies threatening the ${region} region.`,
      collect: `Gather resources needed to restore balance in ${region}.`,
      explore: `Explore the mysterious locations of the ${region} region.`,
      talk: `Speak with key figures in the ${region} region to gather information.`,
    }

    try {
      const lore = await libraryAPI.fetchLoreInspiration(`${type} quest`)
      return `${templates[type as keyof typeof templates]} ${lore}`
    } catch {
      return templates[type as keyof typeof templates]
    }
  }

  private static generateObjectives(
    type: string,
    difficulty: number
  ): any[] {
    const count = 1 + Math.floor(difficulty / 2)
    
    return Array.from({ length: count }, (_, i) => ({
      id: `obj_${i}`,
      description: `Complete objective ${i + 1}`,
      type,
      current: 0,
      required: difficulty,
      completed: false,
    }))
  }
}

// Random Game Mode Generator
export class RandomGameModeGenerator {
  /**
   * Generate a completely random game mode with procedural content
   */
  static async generateRandomGameMode(): Promise<{
    name: string
    description: string
    enemies: Enemy[]
    locations: Location[]
    quests: Quest[]
    difficulty: number
  }> {
    const modeTypes = [
      'Endless Arena',
      'Random Adventure',
      'Procedural Dungeon',
      'Chaos Mode',
      'Balanced Challenge',
    ]

    const modeType = modeTypes[randomInt(0, modeTypes.length - 1)]
    const difficulty = randomInt(1, 5)

    // Generate content
    const region = ['rock', 'paper', 'scissors'][randomInt(0, 2)] as 'rock' | 'paper' | 'scissors'
    
    const enemies: Enemy[] = []
    const locations: Location[] = []
    const quests: Quest[] = []

    // Generate 5-10 enemies
    const numEnemies = randomInt(5, 10)
    for (let i = 0; i < numEnemies; i++) {
      const isBoss = i === numEnemies - 1
      const enemy = await ProceduralEnemyGenerator.generateEnemy(region, difficulty, isBoss)
      enemies.push(enemy)
    }

    // Generate 3-5 locations
    const numLocations = randomInt(3, 5)
    for (let i = 0; i < numLocations; i++) {
      const location = await ProceduralLocationGenerator.generateLocation(region, difficulty)
      locations.push(location)
    }

    // Generate 2-4 quests
    const numQuests = randomInt(2, 4)
    for (let i = 0; i < numQuests; i++) {
      const quest = await ProceduralQuestGenerator.generateQuest(region, difficulty)
      quests.push(quest)
    }

    return {
      name: `${modeType} - ${region.charAt(0).toUpperCase() + region.slice(1)}`,
      description: `A procedurally generated ${modeType.toLowerCase()} experience in the ${region} region.`,
      enemies,
      locations,
      quests,
      difficulty,
    }
  }

  /**
   * Generate infinite/endless mode with scaling difficulty
   */
  static async generateEndlessMode(level: number = 1): Promise<{
    enemy: Enemy
    location: Location
    difficulty: number
  }> {
    const difficulty = Math.floor(level / 3) + 1
    const regions: Array<'rock' | 'paper' | 'scissors'> = ['rock', 'paper', 'scissors']
    const region = regions[randomInt(0, regions.length - 1)]
    
    const isBoss = level % 5 === 0
    const enemy = await ProceduralEnemyGenerator.generateEnemy(region, difficulty, isBoss)
    const location = await ProceduralLocationGenerator.generateLocation(region, difficulty)

    return {
      enemy,
      location,
      difficulty,
    }
  }
}

// Export convenience functions
export async function generateRandomEnemy(
  region: 'rock' | 'paper' | 'scissors',
  difficulty: number = 1
): Promise<Enemy> {
  return ProceduralEnemyGenerator.generateEnemy(region, difficulty, false)
}

export async function generateRandomLocation(
  region: 'rock' | 'paper' | 'scissors' | 'neutral',
  difficulty: number = 1
): Promise<Location> {
  return ProceduralLocationGenerator.generateLocation(region, difficulty)
}

export async function generateRandomQuest(
  region: 'rock' | 'paper' | 'scissors' | 'neutral',
  difficulty: number = 1
): Promise<Quest> {
  return ProceduralQuestGenerator.generateQuest(region, difficulty)
}

export async function generateRandomGameMode() {
  return RandomGameModeGenerator.generateRandomGameMode()
}

export async function generateEndlessMode(level: number = 1) {
  return RandomGameModeGenerator.generateEndlessMode(level)
}



