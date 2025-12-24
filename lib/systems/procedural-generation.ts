/**
 * Procedural Generation System
 * Generates random enemies, quests, locations, and items inspired by various RPGs
 */

import { Enemy, EnemyPattern, MoveType, Location, Item, Quest, QuestObjective } from '@/lib/types/game'

// Enemy name pools inspired by various games
const ENEMY_NAME_PREFIXES = {
  rock: ['Stone', 'Granite', 'Iron', 'Mountain', 'Crystal', 'Boulder', 'Ore', 'Basalt', 'Quartz', 'Marble'],
  paper: ['Scroll', 'Parchment', 'Ink', 'Script', 'Tome', 'Codex', 'Manuscript', 'Document', 'Letter', 'Page'],
  scissors: ['Blade', 'Edge', 'Razor', 'Cut', 'Slice', 'Shear', 'Knife', 'Sword', 'Dagger', 'Scythe'],
}

const ENEMY_NAME_SUFFIXES = [
  'Guardian', 'Warrior', 'Sentinel', 'Defender', 'Keeper', 'Warden', 'Champion', 'Elite', 'Master', 'Lord',
  'Beast', 'Creature', 'Entity', 'Spirit', 'Wraith', 'Phantom', 'Shadow', 'Fiend', 'Demon', 'Titan',
]

// Quest templates inspired by RPGs
const QUEST_TEMPLATES = [
  {
    type: 'defeat',
    templates: [
      'Defeat {count} {enemy} in {location}',
      'Eliminate {count} {enemy} threatening {location}',
      'Clear out {count} {enemy} from {location}',
      'Hunt down {count} {enemy} in {location}',
    ],
  },
  {
    type: 'collect',
    templates: [
      'Collect {count} {item} from {location}',
      'Gather {count} {item} for {npc}',
      'Retrieve {count} {item} scattered in {location}',
      'Find {count} {item} hidden in {location}',
    ],
  },
  {
    type: 'explore',
    templates: [
      'Explore {location} and discover its secrets',
      'Investigate strange occurrences in {location}',
      'Map out the {location} region',
      'Uncover the mysteries of {location}',
    ],
  },
  {
    type: 'talk',
    templates: [
      'Speak with {npc} about {topic}',
      'Deliver a message to {npc} in {location}',
      'Gather information from {npc}',
      'Negotiate with {npc} on behalf of {faction}',
    ],
  },
]

// Location name generators
const LOCATION_PREFIXES = [
  'Ancient', 'Forgotten', 'Hidden', 'Lost', 'Mysterious', 'Sacred', 'Cursed', 'Abandoned', 'Ruined', 'Eternal',
  'Whispering', 'Silent', 'Dark', 'Bright', 'Golden', 'Silver', 'Crystal', 'Shadow', 'Light', 'Void',
]

const LOCATION_SUFFIXES = [
  'Ruins', 'Temple', 'Sanctuary', 'Catacombs', 'Tower', 'Fortress', 'Cavern', 'Grove', 'Shrine', 'Monument',
  'Library', 'Archive', 'Vault', 'Chamber', 'Hall', 'Court', 'Plaza', 'Square', 'Market', 'Bazaar',
]

// Item name generators
const ITEM_PREFIXES = [
  'Ancient', 'Enchanted', 'Blessed', 'Cursed', 'Mystic', 'Rare', 'Legendary', 'Forged', 'Polished', 'Refined',
  'Glimmering', 'Shimmering', 'Radiant', 'Dark', 'Crystal', 'Iron', 'Steel', 'Gold', 'Silver', 'Platinum',
]

const ITEM_SUFFIXES = [
  'Blade', 'Shield', 'Armor', 'Ring', 'Amulet', 'Crystal', 'Gem', 'Orb', 'Scroll', 'Tome',
  'Potion', 'Elixir', 'Essence', 'Fragment', 'Shard', 'Core', 'Heart', 'Soul', 'Spirit', 'Power',
]

/**
 * Generate a random enemy with procedural stats
 */
export function generateRandomEnemy(
  region: 'rock' | 'paper' | 'scissors',
  level: number = 1,
  isBoss: boolean = false
): Enemy {
  const prefixes = ENEMY_NAME_PREFIXES[region]
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
  const suffix = ENEMY_NAME_SUFFIXES[Math.floor(Math.random() * ENEMY_NAME_SUFFIXES.length)]
  const name = `${prefix} ${suffix}`

  // Base HP scales with level and boss status
  const baseHP = isBoss ? 150 + level * 30 : 50 + level * 15
  const maxHP = baseHP + Math.floor(Math.random() * (baseHP * 0.3))

  // Random pattern generation
  const patternTypes: Array<EnemyPattern['type']> = ['predictable', 'reactive', 'random', 'sequence']
  const patternType = patternTypes[Math.floor(Math.random() * patternTypes.length)]

  let pattern: EnemyPattern

  switch (patternType) {
    case 'predictable':
      pattern = {
        type: 'predictable',
        move: region,
      }
      break
    case 'reactive':
      pattern = {
        type: 'reactive',
        counters: true,
      }
      break
    case 'random':
      pattern = {
        type: 'random',
      }
      break
    case 'sequence':
      const sequenceLength = 3 + Math.floor(Math.random() * 3)
      const moves: MoveType[] = []
      for (let i = 0; i < sequenceLength; i++) {
        const moveTypes: MoveType[] = ['rock', 'paper', 'scissors']
        moves.push(moveTypes[Math.floor(Math.random() * moveTypes.length)])
      }
      pattern = {
        type: 'sequence',
        moves,
        index: 0,
      }
      break
    default:
      pattern = {
        type: 'predictable',
        move: region,
      }
  }

  const id = `proc_${region}_${name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`

  return {
    id,
    name,
    type: region,
    maxHP,
    currentHP: maxHP,
    pattern,
    description: `A ${region}-aligned ${isBoss ? 'powerful boss' : 'creature'} with unpredictable patterns.`,
    isBoss,
  }
}

/**
 * Generate a random quest
 */
export function generateRandomQuest(
  region: 'rock' | 'paper' | 'scissors' | 'neutral',
  level: number = 1
): Quest {
  const templateGroup = QUEST_TEMPLATES[Math.floor(Math.random() * QUEST_TEMPLATES.length)]
  const template = templateGroup.templates[Math.floor(Math.random() * templateGroup.templates.length)]

  // Generate quest details
  const count = level + Math.floor(Math.random() * 3) + 1
  const enemy = generateRandomEnemy(region as 'rock' | 'paper' | 'scissors', level, false)
  const location = generateRandomLocation(region)
  const item = generateRandomItem(region)
  const npc = `NPC_${Math.floor(Math.random() * 1000)}`
  const topic = ['the balance', 'the forces', 'the Tearing', 'ancient secrets', 'hidden knowledge'][
    Math.floor(Math.random() * 5)
  ]
  const faction = ['Rock Order', 'Paper Scholars', 'Scissor Blades'][Math.floor(Math.random() * 3)]

  let description = template
    .replace('{count}', count.toString())
    .replace('{enemy}', enemy.name)
    .replace('{location}', location.name)
    .replace('{item}', item.name)
    .replace('{npc}', npc)
    .replace('{topic}', topic)
    .replace('{faction}', faction)

  // Generate objectives
  const objectives: QuestObjective[] = []
  if (templateGroup.type === 'defeat') {
    objectives.push({
      id: 'defeat_enemies',
      description: `Defeat ${count} ${enemy.name}`,
      type: 'defeat',
      target: enemy.id,
      current: 0,
      required: count,
      completed: false,
    })
  } else if (templateGroup.type === 'collect') {
    objectives.push({
      id: 'collect_items',
      description: `Collect ${count} ${item.name}`,
      type: 'collect',
      target: item.id,
      current: 0,
      required: count,
      completed: false,
    })
  } else if (templateGroup.type === 'explore') {
    objectives.push({
      id: 'explore_location',
      description: `Explore ${location.name}`,
      type: 'explore',
      target: location.id,
      completed: false,
    })
  } else if (templateGroup.type === 'talk') {
    objectives.push({
      id: 'talk_npc',
      description: `Speak with ${npc}`,
      type: 'talk',
      target: npc,
      completed: false,
    })
  }

  const questId = `proc_quest_${Date.now()}`

  return {
    id: questId,
    name: `${description.substring(0, 40)}...`,
    description,
    objectives,
    rewards: {
      experience: level * 50 + Math.floor(Math.random() * 100),
      gold: level * 20 + Math.floor(Math.random() * 50),
      items: [item],
    },
    act: (level <= 5 ? 1 : level <= 10 ? 2 : 3) as 1 | 2 | 3,
    region,
    status: 'active',
  }
}

/**
 * Generate a random location
 */
export function generateRandomLocation(region: 'rock' | 'paper' | 'scissors' | 'neutral'): Location {
  const prefix = LOCATION_PREFIXES[Math.floor(Math.random() * LOCATION_PREFIXES.length)]
  const suffix = LOCATION_SUFFIXES[Math.floor(Math.random() * LOCATION_SUFFIXES.length)]
  const name = `${prefix} ${suffix}`

  const descriptions = {
    rock: [
      'A deep underground cavern filled with glowing crystals.',
      'An ancient stone fortress carved into the mountainside.',
      'A mining complex where precious ores are extracted.',
      'A sacred grotto where Rock energy flows freely.',
    ],
    paper: [
      'A floating library where knowledge drifts on the wind.',
      'An archive of ancient scrolls and manuscripts.',
      'A scholar\'s retreat where Paper magic is studied.',
      'A temple where words have power.',
    ],
    scissors: [
      'A training ground where blades are honed to perfection.',
      'A forge where the finest weapons are crafted.',
      'A arena where warriors test their precision.',
      'A metal market where sharp tools are traded.',
    ],
    neutral: [
      'A crossroads where all three forces meet in balance.',
      'A neutral ground where diplomacy happens.',
      'A trading post where all factions gather.',
      'A sanctuary where the balance is preserved.',
    ],
  }

  const regionDescriptions = descriptions[region]
  const description = regionDescriptions[Math.floor(Math.random() * regionDescriptions.length)]

  const id = `proc_location_${name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`

  // Generate random interactive points
  const pointTypes: Array<'shop' | 'npc' | 'training' | 'lore' | 'quest'> = ['shop', 'npc', 'training', 'lore', 'quest']
  const numPoints = 2 + Math.floor(Math.random() * 3)
  const interactivePoints = []

  for (let i = 0; i < numPoints; i++) {
    const pointType = pointTypes[Math.floor(Math.random() * pointTypes.length)]
    interactivePoints.push({
      id: `${id}_point_${i}`,
      name: `${pointType.charAt(0).toUpperCase() + pointType.slice(1)} Point ${i + 1}`,
      type: pointType,
      description: `A ${pointType} location in ${name}.`,
    })
  }

  return {
    id,
    name,
    description,
    region,
    connections: [],
    interactivePoints,
    encounterChance: 0.2 + Math.random() * 0.3,
  }
}

/**
 * Generate a random item
 */
export function generateRandomItem(region: 'rock' | 'paper' | 'scissors' | 'neutral'): Item {
  const prefix = ITEM_PREFIXES[Math.floor(Math.random() * ITEM_PREFIXES.length)]
  const suffix = ITEM_SUFFIXES[Math.floor(Math.random() * ITEM_SUFFIXES.length)]
  const name = `${prefix} ${suffix}`

  const itemTypes: Array<'consumable' | 'equipment' | 'key'> = ['consumable', 'equipment', 'key']
  const type = itemTypes[Math.floor(Math.random() * itemTypes.length)]

  const descriptions = {
    consumable: 'A consumable item that can restore your strength.',
    equipment: 'A piece of equipment that enhances your abilities.',
    key: 'A key that unlocks hidden paths.',
  }

  const effect = {
    hp: type === 'consumable' ? 20 + Math.floor(Math.random() * 30) : undefined,
    resolve: type === 'consumable' ? 10 + Math.floor(Math.random() * 20) : undefined,
    alignment:
      type === 'equipment'
        ? {
            [region]: Math.floor(Math.random() * 10) + 5,
          }
        : undefined,
  }

  const id = `proc_item_${name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`

  return {
    id,
    name,
    description: descriptions[type],
    type,
    effect,
  }
}

/**
 * Generate a procedural dungeon with multiple rooms
 */
export function generateProceduralDungeon(
  region: 'rock' | 'paper' | 'scissors',
  depth: number = 3
): Location[] {
  const rooms: Location[] = []
  const entrance = generateRandomLocation(region)
  entrance.name = `Entrance to ${entrance.name}`
  rooms.push(entrance)

  for (let i = 1; i < depth; i++) {
    const room = generateRandomLocation(region)
    room.name = `${room.name} (Level ${i + 1})`
    room.connections = i > 0 ? [rooms[i - 1].id] : []
    rooms[i - 1].connections.push(room.id)
    rooms.push(room)
  }

  return rooms
}

/**
 * Get random enemy pool for a region (mix of static and procedural)
 */
export function getRandomEnemyPool(
  region: 'rock' | 'paper' | 'scissors',
  level: number = 1,
  count: number = 5
): Enemy[] {
  const enemies: Enemy[] = []
  for (let i = 0; i < count; i++) {
    enemies.push(generateRandomEnemy(region, level, i === count - 1)) // Last one is boss
  }
  return enemies
}

