/**
 * Procedural Content Generation System
 * Generates enemies, quests, locations, and other content dynamically
 * Integrates with digital libraries and external APIs for inspiration
 */

import { Enemy, EnemyPattern, MoveType, Quest, Location, Item, NPC, Alignment } from '@/lib/types/game'
import { randomInt, clamp } from '@/lib/utils/game-helpers'

// Digital Library Data Sources
// These would typically fetch from APIs, but we'll use curated datasets

// Fantasy name components (inspired by various fantasy name generators)
const NAME_PREFIXES = {
  rock: ['Stone', 'Granite', 'Iron', 'Rough', 'Solid', 'Mountain', 'Earth', 'Boulder'],
  paper: ['Scroll', 'Parchment', 'Quill', 'Wind', 'Light', 'Whisper', 'Cloud', 'Feather'],
  scissors: ['Blade', 'Sharp', 'Edge', 'Razor', 'Cut', 'Slice', 'Precise', 'Swift'],
}

const NAME_SUFFIXES = {
  rock: ['guard', 'warden', 'crusher', 'breaker', 'fortress', 'shield', 'keeper'],
  paper: ['scribe', 'scholar', 'keeper', 'weaver', 'calligrapher', 'sage', 'librarian'],
  scissors: ['blade', 'striker', 'cutter', 'warrior', 'assassin', 'rogue', 'dancer'],
}

// Fantasy descriptors from various RPG games and literature
const DESCRIPTORS = [
  'Ancient', 'Forgotten', 'Cursed', 'Blessed', 'Dark', 'Bright', 'Shadow', 'Crystal',
  'Frozen', 'Burning', 'Twisted', 'Pure', 'Corrupted', 'Sacred', 'Profane', 'Mystical',
]

// Quest templates inspired by various RPG databases
const QUEST_TEMPLATES = {
  defeat: {
    names: ['Defeat the {enemy}', 'Challenge of {enemy}', 'Battle with {enemy}', 'Confront {enemy}'],
    descriptions: [
      'A dangerous {type} has been terrorizing the area. Defeat them to restore peace.',
      'You must face {enemy} in combat to prove your worth.',
      '{enemy} challenges you to a duel. Accept the challenge.',
    ],
  },
  collect: {
    names: ['Gather {item}', 'Collect {item}', 'Retrieve {item}', 'Find {item}'],
    descriptions: [
      'Collect {count} {item} from the area. They are valuable resources.',
      'You need {count} {item} for an important purpose. Search the area.',
      'A merchant needs {count} {item}. Help them gather it.',
    ],
  },
  explore: {
    names: ['Explore {location}', 'Discover {location}', 'Journey to {location}'],
    descriptions: [
      'Travel to {location} and uncover its secrets.',
      'A mysterious {location} has been discovered. Investigate it.',
      'You must reach {location} to continue your quest.',
    ],
  },
  talk: {
    names: ['Speak with {npc}', 'Deliver message to {npc}', 'Meet {npc}'],
    descriptions: [
      'Find {npc} and learn what they know.',
      'Deliver an important message to {npc}.',
      '{npc} has requested your presence. Visit them.',
    ],
  },
}

// Item names from fantasy games
const ITEM_NAMES = {
  consumable: ['Healing Potion', 'Resolve Elixir', 'Energy Drink', 'Restorative Herbs', 'Spirit Berry'],
  equipment: ['Amulet of Power', 'Ring of Protection', 'Belt of Strength', 'Cloak of Shadows'],
  key: ['Ancient Key', 'Sealed Scroll', 'Crystal Shard', 'Mysterious Token'],
}

/**
 * Generate a random fantasy name based on faction
 */
export function generateName(faction: MoveType, isEnemy: boolean = true): string {
  const prefixes = NAME_PREFIXES[faction]
  const suffixes = isEnemy ? NAME_SUFFIXES[faction] : ['warrior', 'traveler', 'guardian', 'hero']

  const useDescriptor = Math.random() > 0.7
  const prefix = prefixes[randomInt(0, prefixes.length - 1)]
  const suffix = suffixes[randomInt(0, suffixes.length - 1)]

  if (useDescriptor) {
    const descriptor = DESCRIPTORS[randomInt(0, DESCRIPTORS.length - 1)]
    return `${descriptor} ${prefix}${suffix}`
  }

  return `${prefix}${suffix}`
}

/**
 * Generate a random enemy with procedural stats and patterns
 */
export function generateEnemy(
  region: MoveType,
  level: number = 1,
  isBoss: boolean = false
): Enemy {
  const baseHP = isBoss ? 150 + level * 30 : 50 + level * 10
  const hp = clamp(baseHP + randomInt(-10, 10), 30, 500)
  
  const enemyType = region
  const name = generateName(enemyType, true)
  
  // Generate random pattern based on level and type
  const patternType = isBoss 
    ? generateBossPattern() 
    : generateNormalPattern(level)
  
  const description = generateEnemyDescription(name, enemyType, patternType)

  return {
    id: `generated_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    type: enemyType,
    maxHP: hp,
    currentHP: hp,
    pattern: patternType,
    description,
    isBoss,
    phases: isBoss ? generateBossPhases(enemyType, hp) : undefined,
  }
}

/**
 * Generate enemy patterns with variety
 */
function generateNormalPattern(level: number): EnemyPattern {
  const patterns: Array<() => EnemyPattern> = [
    () => ({
      type: 'predictable',
      move: ['rock', 'paper', 'scissors'][randomInt(0, 2)] as MoveType,
    }),
    () => ({
      type: 'reactive',
      counters: Math.random() > 0.5,
    }),
    () => ({
      type: 'random',
    }),
    () => {
      const moves: MoveType[] = []
      const sequenceLength = randomInt(2, 4)
      for (let i = 0; i < sequenceLength; i++) {
        moves.push(['rock', 'paper', 'scissors'][randomInt(0, 2)] as MoveType)
      }
      return {
        type: 'sequence',
        moves,
        index: 0,
      }
    },
  ]

  // Higher level enemies use more complex patterns
  if (level > 3 && Math.random() > 0.6) {
    return generateAdvancedPattern()
  }

  return patterns[randomInt(0, patterns.length - 1)]()
}

function generateAdvancedPattern(): EnemyPattern {
  // Create a weighted pattern that prefers certain moves
  const preferredMove = ['rock', 'paper', 'scissors'][randomInt(0, 2)] as MoveType
  const sequence: MoveType[] = []
  
  // 60% chance to use preferred move, 40% chance for others
  for (let i = 0; i < 4; i++) {
    if (Math.random() < 0.6) {
      sequence.push(preferredMove)
    } else {
      const others = (['rock', 'paper', 'scissors'] as MoveType[]).filter(m => m !== preferredMove)
      sequence.push(others[randomInt(0, others.length - 1)])
    }
  }
  
  return {
    type: 'sequence',
    moves: sequence,
    index: 0,
  }
}

function generateBossPattern(): EnemyPattern {
  return {
    type: 'phase',
    phases: [
      {
        hpThreshold: 66,
        preferredMove: 'rock',
        pattern: {
          type: 'reactive',
          counters: true,
        },
      },
      {
        hpThreshold: 33,
        preferredMove: 'paper',
        pattern: {
          type: 'sequence',
          moves: ['rock', 'paper', 'scissors'],
          index: 0,
        },
      },
      {
        hpThreshold: 0,
        preferredMove: 'scissors',
        pattern: {
          type: 'random',
        },
      },
    ],
    currentPhase: 0,
  }
}

function generateBossPhases(faction: MoveType, maxHP: number) {
  return [
    {
      hpThreshold: Math.floor(maxHP * 0.66),
      preferredMove: faction,
      pattern: {
        type: 'reactive',
        counters: true,
      },
    },
    {
      hpThreshold: Math.floor(maxHP * 0.33),
      preferredMove: (['rock', 'paper', 'scissors'].filter(m => m !== faction)[0] as MoveType),
      pattern: {
        type: 'sequence',
        moves: ['rock', 'paper', 'scissors'],
        index: 0,
      },
    },
  ]
}

function generateEnemyDescription(name: string, type: MoveType, pattern: EnemyPattern): string {
  const typeDescriptors = {
    rock: ['sturdy', 'defensive', 'unyielding', 'strong', 'enduring'],
    paper: ['strategic', 'mysterious', 'knowledgeable', 'cunning', 'wise'],
    scissors: ['swift', 'precise', 'agile', 'sharp', 'deadly'],
  }

  const patternDescriptors = {
    predictable: 'follows a predictable pattern',
    reactive: 'adapts to your moves',
    random: 'is completely unpredictable',
    sequence: 'follows a complex sequence',
    phase: 'changes tactics as the battle progresses',
  }

  const typeDesc = typeDescriptors[type][randomInt(0, typeDescriptors[type].length - 1)]
  const patternDesc = patternDescriptors[pattern.type] || 'is challenging'

  return `A ${typeDesc} ${type}-aligned warrior. ${name} ${patternDesc} in combat.`
}

/**
 * Generate a random quest
 */
export function generateQuest(
  region: MoveType | 'neutral',
  act: number = 1,
  questType?: 'defeat' | 'collect' | 'explore' | 'talk'
): Quest {
  const types: Array<'defeat' | 'collect' | 'explore' | 'talk'> = 
    questType ? [questType] : ['defeat', 'collect', 'explore', 'talk']
  
  const type = types[randomInt(0, types.length - 1)]
  const template = QUEST_TEMPLATES[type]
  const nameTemplate = template.names[randomInt(0, template.names.length - 1)]
  const descTemplate = template.descriptions[randomInt(0, template.descriptions.length - 1)]

  let name = nameTemplate
  let description = descTemplate
  let objectives = []

  switch (type) {
    case 'defeat':
      const enemyName = generateName(region === 'neutral' ? 'rock' : region)
      name = name.replace('{enemy}', enemyName)
      description = description.replace('{enemy}', enemyName).replace('{type}', region)
      objectives = [
        {
          id: `obj_${Date.now()}_1`,
          description: `Defeat ${enemyName}`,
          type: 'defeat' as const,
          target: enemyName,
          completed: false,
        },
      ]
      break

    case 'collect':
      const itemName = ITEM_NAMES.consumable[randomInt(0, ITEM_NAMES.consumable.length - 1)]
      const count = randomInt(3, 10)
      name = name.replace('{item}', itemName)
      description = description.replace('{item}', itemName).replace('{count}', count.toString())
      objectives = [
        {
          id: `obj_${Date.now()}_1`,
          description: `Collect ${count} ${itemName}`,
          type: 'collect' as const,
          target: itemName,
          current: 0,
          required: count,
          completed: false,
        },
      ]
      break

    case 'explore':
      const locationName = generateName(region === 'neutral' ? 'rock' : region, false) + ' ' + 
        ['Ruins', 'Temple', 'Sanctuary', 'Outpost', 'Shrine'][randomInt(0, 4)]
      name = name.replace('{location}', locationName)
      description = description.replace('{location}', locationName)
      objectives = [
        {
          id: `obj_${Date.now()}_1`,
          description: `Reach ${locationName}`,
          type: 'explore' as const,
          target: locationName,
          completed: false,
        },
      ]
      break

    case 'talk':
      const npcName = generateName(region === 'neutral' ? 'rock' : region, false)
      name = name.replace('{npc}', npcName)
      description = description.replace('{npc}', npcName)
      objectives = [
        {
          id: `obj_${Date.now()}_1`,
          description: `Speak with ${npcName}`,
          type: 'talk' as const,
          target: npcName,
          completed: false,
        },
      ]
      break
  }

  return {
    id: `quest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    description,
    objectives,
    rewards: {
      experience: randomInt(50, 200) * act,
      gold: randomInt(10, 50) * act,
      alignment: generateAlignmentReward(region),
    },
    act: act as 1 | 2 | 3,
    region: region as 'rock' | 'paper' | 'scissors' | 'neutral',
    status: 'locked',
  }
}

function generateAlignmentReward(region: MoveType | 'neutral'): Partial<Alignment> {
  if (region === 'neutral') {
    const types: MoveType[] = ['rock', 'paper', 'scissors']
    const type = types[randomInt(0, 2)]
    return { [type]: randomInt(1, 3) }
  }
  return { [region]: randomInt(2, 5) }
}

/**
 * Generate a random item
 */
export function generateItem(
  type: 'consumable' | 'equipment' | 'key' = 'consumable',
  level: number = 1
): Item {
  const names = ITEM_NAMES[type]
  const name = names[randomInt(0, names.length - 1)]
  
  const effects: any = {}
  if (type === 'consumable') {
    effects.hp = randomInt(20, 50) + level * 10
    effects.resolve = randomInt(10, 30)
  } else if (type === 'equipment') {
    // Equipment would have stat boosts (simplified here)
    effects.hp = randomInt(10, 30) * level
  }

  return {
    id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: `${name} ${level > 1 ? `+${level}` : ''}`,
    description: `A ${name.toLowerCase()} with ${type === 'consumable' ? 'healing' : 'protective'} properties.`,
    type,
    effect: effects,
  }
}

/**
 * Generate a random location
 */
export function generateLocation(
  region: MoveType | 'neutral',
  connectedTo?: string[]
): Location {
  const namePrefix = generateName(region === 'neutral' ? 'rock' : region, false)
  const locationTypes = ['Village', 'Ruins', 'Temple', 'Outpost', 'Sanctuary', 'Crossroads']
  const locationType = locationTypes[randomInt(0, locationTypes.length - 1)]
  const name = `${namePrefix} ${locationType}`

  return {
    id: `loc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    description: `A ${locationType.toLowerCase()} in the ${region === 'neutral' ? 'neutral zone' : `${region} dominion`}.`,
    region: region as 'rock' | 'paper' | 'scissors' | 'neutral',
    connections: connectedTo || [],
    interactivePoints: generateInteractivePoints(region),
    encounterChance: clamp(Math.random(), 0.2, 0.6),
  }
}

function generateInteractivePoints(region: MoveType | 'neutral') {
  const points = []
  
  // Always add a shop
  points.push({
    id: `point_${Date.now()}_shop`,
    name: 'Merchant',
    type: 'shop' as const,
    description: 'A traveling merchant selling goods.',
  })

  // Random chance for other points
  if (Math.random() > 0.5) {
    points.push({
      id: `point_${Date.now()}_npc`,
      name: generateName(region === 'neutral' ? 'rock' : region, false),
      type: 'npc' as const,
      npcId: `npc_${Date.now()}`,
      description: 'A local resident who might have information.',
    })
  }

  if (Math.random() > 0.7) {
    points.push({
      id: `point_${Date.now()}_training`,
      name: 'Training Ground',
      type: 'training' as const,
      description: 'Practice your combat skills here.',
    })
  }

  return points
}

/**
 * Get a random encounter based on region and level
 */
export function getRandomEncounter(
  region: MoveType,
  level: number = 1
): { type: 'combat' | 'puzzle' | 'social'; enemy?: Enemy; quest?: Quest } {
  const encounterTypes = ['combat', 'combat', 'combat', 'puzzle', 'social'] // Weighted toward combat
  const type = encounterTypes[randomInt(0, encounterTypes.length - 1)] as 'combat' | 'puzzle' | 'social'

  switch (type) {
    case 'combat':
      const isBoss = Math.random() > 0.9 // 10% chance for boss
      return {
        type: 'combat',
        enemy: generateEnemy(region, level, isBoss),
      }
    case 'puzzle':
      // Puzzle encounters would be generated separately
      return { type: 'puzzle' }
    case 'social':
      return {
        type: 'social',
        quest: generateQuest(region, Math.ceil(level / 3)),
      }
    default:
      return { type: 'combat', enemy: generateEnemy(region, level, false) }
  }
}

/**
 * Fetch fantasy content from external APIs (fallback to local data)
 */
export async function fetchFantasyContent(contentType: 'name' | 'lore' | 'description'): Promise<string> {
  try {
    // Try to fetch from public APIs (examples)
    // Note: These are placeholder URLs - actual implementation would use real APIs
    
    // For names: could use https://api.namefake.com/ or similar
    // For lore: could use Wikipedia API or D&D databases
    
    // For now, return local generated content
    switch (contentType) {
      case 'name':
        const factions: MoveType[] = ['rock', 'paper', 'scissors']
        return generateName(factions[randomInt(0, 2)])
      case 'lore':
        const loreTemplates = [
          'Long ago, the three forces were in perfect harmony...',
          'Legend tells of an ancient power that binds all things...',
          'The old texts speak of a time before The Tearing...',
        ]
        return loreTemplates[randomInt(0, loreTemplates.length - 1)]
      case 'description':
        return 'A mysterious location shrouded in legend.'
      default:
        return 'Unknown'
    }
  } catch (error) {
    console.warn('Failed to fetch external content, using local generation:', error)
    // Fallback to local generation
    return generateName('rock')
  }
}

