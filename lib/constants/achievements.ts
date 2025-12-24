import { Alignment } from '@/lib/types/game'

export interface GameState {
  player: {
    alignment: Alignment
    stats: {
      battlesWon: number
      flawlessVictories: number
      symbolBreaksUsed: number
    }
  }
  story: {
    currentAct: number
    gameComplete: boolean
    storyFlags: Set<string>
  }
  inventory: {
    uniqueItems: number
    goldEarned: number
  }
  relationships: Record<string, {
    status: string
    romance?: boolean
  }>
  playtime: number
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: 'story' | 'combat' | 'collection' | 'social' | 'alignment' | 'secret'
  hidden: boolean
  condition: (gameState: GameState) => boolean
  reward?: {
    title?: string
    item?: string
    alignment?: Partial<Alignment>
  }
}

export const ACHIEVEMENTS: Achievement[] = [
  // Story achievements
  {
    id: 'act1_complete',
    name: 'The Journey Begins',
    description: 'Complete Act I: The Cracked Balance',
    icon: '🎭',
    category: 'story',
    hidden: false,
    condition: (state) => state.story.currentAct > 1,
  },
  {
    id: 'act2_complete',
    name: 'Dominion Walker',
    description: 'Complete Act II: Crossing the Dominions',
    icon: '🗺️',
    category: 'story',
    hidden: false,
    condition: (state) => state.story.currentAct > 2,
  },
  {
    id: 'game_complete',
    name: 'Balance Restored',
    description: 'Complete the game',
    icon: '⚖️',
    category: 'story',
    hidden: false,
    condition: (state) => state.story.gameComplete === true,
  },

  // Combat achievements
  {
    id: 'first_victory',
    name: 'First Blood',
    description: 'Win your first battle',
    icon: '⚔️',
    category: 'combat',
    hidden: false,
    condition: (state) => state.player.stats.battlesWon >= 1,
  },
  {
    id: 'flawless_victory',
    name: 'Untouchable',
    description: 'Win a battle without taking damage',
    icon: '🛡️',
    category: 'combat',
    hidden: false,
    condition: (state) => state.player.stats.flawlessVictories >= 1,
  },
  {
    id: 'symbol_break_master',
    name: 'Symbol Breaker',
    description: 'Use Symbol Break 10 times',
    icon: '💥',
    category: 'combat',
    hidden: false,
    condition: (state) => state.player.stats.symbolBreaksUsed >= 10,
  },

  // Alignment achievements
  {
    id: 'pure_rock',
    name: 'Mountain Soul',
    description: 'Reach 80% Rock alignment',
    icon: '🗿',
    category: 'alignment',
    hidden: false,
    condition: (state) => state.player.alignment.rock >= 80,
    reward: { title: 'The Unyielding' },
  },
  {
    id: 'pure_paper',
    name: 'Wind Sage',
    description: 'Reach 80% Paper alignment',
    icon: '📜',
    category: 'alignment',
    hidden: false,
    condition: (state) => state.player.alignment.paper >= 80,
    reward: { title: 'The Strategic' },
  },
  {
    id: 'pure_scissors',
    name: 'Blade Master',
    description: 'Reach 80% Scissors alignment',
    icon: '✂️',
    category: 'alignment',
    hidden: false,
    condition: (state) => state.player.alignment.scissors >= 80,
    reward: { title: 'The Precise' },
  },
  {
    id: 'perfect_balance',
    name: 'True Balance',
    description: 'Maintain 33/33/34% alignment',
    icon: '☯️',
    category: 'alignment',
    hidden: false,
    condition: (state) => {
      const a = state.player.alignment
      return Math.abs(a.rock - 33) <= 2 && Math.abs(a.paper - 33) <= 2
    },
    reward: { title: 'The Balanced' },
  },

  // Collection achievements
  {
    id: 'item_collector',
    name: 'Treasure Hunter',
    description: 'Collect 50 unique items',
    icon: '💎',
    category: 'collection',
    hidden: false,
    condition: (state) => state.inventory.uniqueItems >= 50,
  },
  {
    id: 'wealthy',
    name: 'Gold Hoarder',
    description: 'Accumulate 10,000 gold',
    icon: '💰',
    category: 'collection',
    hidden: false,
    condition: (state) => state.inventory.goldEarned >= 10000,
  },

  // Social achievements
  {
    id: 'friend_of_all',
    name: 'Diplomat',
    description: 'Reach friendly status with all factions',
    icon: '🤝',
    category: 'social',
    hidden: false,
    condition: (state) => {
      const relationships = Object.values(state.relationships)
      return relationships.every(r => r.status === 'friendly' || r.status === 'trusted')
    },
  },
  {
    id: 'romance_elara',
    name: 'Kindred Spirits',
    description: 'Complete Sage Elara\'s romance path',
    icon: '❤️',
    category: 'social',
    hidden: true,
    condition: (state) => state.relationships.sage_elara?.romance === true,
  },

  // Secret achievements
  {
    id: 'speed_runner',
    name: 'Swift as Scissors',
    description: 'Complete the game in under 3 hours',
    icon: '⚡',
    category: 'secret',
    hidden: true,
    condition: (state) => state.playtime < 3 * 60 * 60 && state.story.gameComplete,
    reward: { item: 'speed_amulet' },
  },
  {
    id: 'hidden_symbol',
    name: 'Symbol Seeker',
    description: 'Discover the true nature of the Hidden Symbol',
    icon: '🔺',
    category: 'secret',
    hidden: true,
    condition: (state) => state.story.storyFlags.has('hidden_symbol_revealed'),
  },
]

