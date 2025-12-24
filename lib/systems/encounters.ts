/**
 * Enhanced Encounter System
 * Handles random encounters, dynamic quest generation, and procedural content
 */

import { Enemy, Quest, Location, Item } from '@/lib/types/game'
import { generateEnemy, generateQuest, getRandomEncounter, generateItem, generateLocation } from './random-generation'
import { fetchMonsterInspiration, fetchLoreInspiration } from './digital-library'
// Helper function for random integers
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export interface Encounter {
  id: string
  type: 'combat' | 'puzzle' | 'social' | 'treasure' | 'rest'
  data?: {
    enemy?: Enemy
    quest?: Quest
    item?: Item
    location?: Location
    lore?: string
  }
  rewards?: {
    experience?: number
    gold?: number
    items?: Item[]
    alignment?: { rock?: number; paper?: number; scissors?: number }
  }
}

/**
 * Generate a random wilderness encounter
 */
export async function generateWildernessEncounter(
  region: 'rock' | 'paper' | 'scissors' | 'neutral',
  playerLevel: number = 1
): Promise<Encounter | null> {
  // 70% chance for encounter
  if (Math.random() > 0.7) {
    return null
  }

  const encounterChance = Math.random()
  
  // 50% combat, 20% puzzle, 15% social, 10% treasure, 5% rest
  if (encounterChance < 0.5) {
    // Combat encounter
    const isBoss = Math.random() > 0.85 // 15% chance for boss
    const enemy = generateEnemy(
      region === 'neutral' ? 'rock' : region,
      playerLevel,
      isBoss
    )
    
    // Try to enhance with API data
    try {
      const monsterData = await fetchMonsterInspiration()
      if (monsterData) {
        // Merge inspiration into enemy
        enemy.description = `${enemy.description} Inspired by: ${monsterData.name}.`
      }
    } catch (error) {
      // Ignore API errors, use generated enemy
    }

    return {
      id: `encounter_${Date.now()}`,
      type: 'combat',
      data: { enemy },
      rewards: {
        experience: enemy.isBoss ? playerLevel * 100 : playerLevel * 25,
        gold: enemy.isBoss ? randomInt(50, 150) : randomInt(10, 40),
        items: Math.random() > 0.7 ? [generateItem('consumable', playerLevel)] : undefined,
      },
    }
  } else if (encounterChance < 0.7) {
    // Puzzle encounter
    return {
      id: `encounter_${Date.now()}`,
      type: 'puzzle',
      data: {},
      rewards: {
        experience: playerLevel * 15,
        gold: randomInt(5, 20),
      },
    }
  } else if (encounterChance < 0.85) {
    // Social encounter (quest)
    const quest = generateQuest(
      region === 'neutral' ? 'rock' : region,
      Math.ceil(playerLevel / 3) as 1 | 2 | 3
    )
    
    return {
      id: `encounter_${Date.now()}`,
      type: 'social',
      data: { quest },
      rewards: {
        experience: quest.rewards?.experience || 0,
        gold: quest.rewards?.gold || 0,
        alignment: quest.rewards?.alignment,
      },
    }
  } else if (encounterChance < 0.95) {
    // Treasure encounter
    const itemCount = randomInt(1, 3)
    const items: Item[] = []
    for (let i = 0; i < itemCount; i++) {
      items.push(generateItem(
        ['consumable', 'equipment', 'key'][randomInt(0, 2)] as 'consumable' | 'equipment' | 'key',
        playerLevel
      ))
    }

    // Try to fetch lore for treasure description
    let lore = ''
    try {
      lore = await fetchLoreInspiration('Treasure')
    } catch (error) {
      lore = 'You discover a hidden cache of items!'
    }

    return {
      id: `encounter_${Date.now()}`,
      type: 'treasure',
      data: { items, lore },
      rewards: {
        items,
        experience: playerLevel * 10,
      },
    }
  } else {
    // Rest encounter (safe spot)
    return {
      id: `encounter_${Date.now()}`,
      type: 'rest',
      data: {
        lore: 'You find a peaceful spot to rest and recover.',
      },
      rewards: {
        // Rest would restore HP/resolve (handled in gameStore)
      },
    }
  }
}

/**
 * Generate a random dungeon encounter sequence
 */
export async function generateDungeonEncounters(
  region: 'rock' | 'paper' | 'scissors',
  playerLevel: number,
  dungeonLength: number = 5
): Promise<Encounter[]> {
  const encounters: Encounter[] = []
  
  for (let i = 0; i < dungeonLength; i++) {
    const isLast = i === dungeonLength - 1
    const isBoss = isLast && Math.random() > 0.3 // 70% chance for boss on last encounter
    
    if (isLast) {
      // Final encounter - usually a boss
      const boss = generateEnemy(region, playerLevel, true)
      encounters.push({
        id: `dungeon_boss_${Date.now()}`,
        type: 'combat',
        data: { enemy: boss },
        rewards: {
          experience: playerLevel * 200,
          gold: randomInt(100, 300),
          items: [generateItem('equipment', playerLevel + 1)],
        },
      })
    } else {
      // Regular encounter
      const encounter = await generateWildernessEncounter(region, playerLevel)
      if (encounter) {
        encounter.id = `dungeon_${i}_${Date.now()}`
        encounters.push(encounter)
      }
    }
  }
  
  return encounters
}

/**
 * Generate a daily challenge (meta-game feature)
 */
export async function generateDailyChallenge(
  playerLevel: number
): Promise<Quest> {
  const regions: Array<'rock' | 'paper' | 'scissors' | 'neutral'> = 
    ['rock', 'paper', 'scissors', 'neutral']
  const region = regions[randomInt(0, regions.length - 1)]
  
  const questTypes: Array<'defeat' | 'collect' | 'explore'> = ['defeat', 'collect', 'explore']
  const questType = questTypes[randomInt(0, questTypes.length - 1)]
  
  const quest = generateQuest(region, Math.ceil(playerLevel / 3) as 1 | 2 | 3, questType)
  quest.name = `Daily Challenge: ${quest.name}`
  quest.description = `Today's special challenge! ${quest.description}`
  
  // Boost rewards for daily challenge
  if (quest.rewards) {
    quest.rewards.experience = (quest.rewards.experience || 0) * 2
    quest.rewards.gold = (quest.rewards.gold || 0) * 2
  }
  
  return quest
}

/**
 * Generate a random event (story flavor)
 */
export async function generateRandomEvent(): Promise<{
  title: string
  description: string
  effects?: {
    alignment?: { rock?: number; paper?: number; scissors?: number }
    hp?: number
    resolve?: number
  }
}> {
  const events = [
    {
      title: 'Mysterious Stranger',
      description: 'A hooded figure approaches you in the shadows...',
      effects: { resolve: 10 },
    },
    {
      title: 'Ancient Discovery',
      description: 'You uncover an ancient artifact that resonates with one of the three forces.',
      effects: { alignment: { rock: 2 } },
    },
    {
      title: 'Wind Carried Message',
      description: 'A message on enchanted paper drifts to you, carried by the wind.',
      effects: { alignment: { paper: 2 } },
    },
    {
      title: 'Blade\'s Blessing',
      description: 'You find a perfectly crafted blade that hums with precision.',
      effects: { alignment: { scissors: 2 } },
    },
    {
      title: 'Peaceful Meditation',
      description: 'You take a moment to reflect, finding inner balance.',
      effects: { hp: 20, resolve: 15 },
    },
  ]

  const event = events[randomInt(0, events.length - 1)]
  
  // Try to enhance with API lore
  try {
    const lore = await fetchLoreInspiration('Mystery')
    event.description = `${event.description} ${lore}`
  } catch (error) {
    // Ignore API errors
  }
  
  return event
}

/**
 * Generate a procedurally generated location
 */
export async function generateProceduralLocation(
  region: 'rock' | 'paper' | 'scissors' | 'neutral',
  connectedTo?: string[]
): Promise<Location> {
  const location = generateLocation(region, connectedTo)
  
  // Try to enhance description with API lore
  try {
    const lore = await fetchLoreInspiration(region === 'neutral' ? 'Crossroads' : region)
    location.description = `${location.description} ${lore}`
  } catch (error) {
    // Ignore API errors
  }
  
  return location
}

