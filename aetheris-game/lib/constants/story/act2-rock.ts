// Act II - Rock Dominion Content
// This is a structure file - full content would be expanded here

import { Location, Enemy, Quest } from '@/lib/types/game'

export const ROCK_LOCATIONS: Location[] = [
  {
    id: 'granitehold',
    name: 'Granitehold',
    description: 'The massive capital city carved into the mountain. Stone architecture stretches as far as the eye can see.',
    region: 'rock',
    connections: ['ironforge', 'mining_passages'],
    interactivePoints: [
      {
        id: 'elder_hall',
        name: 'Elder Hall',
        type: 'npc',
        description: 'Meet with Rock Order elders.',
      },
      {
        id: 'rock_shop',
        name: 'Stone Merchant',
        type: 'shop',
        description: 'Buy Rock-aligned equipment.',
      },
      {
        id: 'training_grounds',
        name: 'Training Grounds',
        type: 'training',
        description: 'Practice Rock moves.',
      },
    ],
    background: '/assets/locations/granitehold.png',
    encounterChance: 0.3,
  },
  {
    id: 'ironforge',
    name: 'Ironforge',
    description: 'Mining town where the best weapons are crafted. The forges never stop burning.',
    region: 'rock',
    connections: ['granitehold'],
    interactivePoints: [
      {
        id: 'blacksmith',
        name: 'Blacksmith',
        type: 'shop',
        description: 'Upgrade your equipment.',
      },
    ],
    background: '/assets/locations/ironforge.png',
    encounterChance: 0.4,
  },
  {
    id: 'mining_passages',
    name: 'Mining Passages',
    description: 'Deep underground tunnels. The ground shakes with unstable energy.',
    region: 'rock',
    connections: ['granitehold'],
    interactivePoints: [
      {
        id: 'mining_camp',
        name: 'Mining Camp',
        type: 'quest',
        description: 'Help evacuate trapped miners.',
      },
    ],
    background: '/assets/locations/mining.png',
    encounterChance: 0.5,
  },
]

export const ROCK_QUEST: Quest = {
  id: 'cracking_earth',
  name: 'The Cracking Earth',
  description: 'The mines are collapsing due to unstable Rock energy. Investigate the source.',
  type: 'main',
  act: 2,
  giver: 'petra',
  location: 'granitehold',
  objectives: [
    {
      id: 'evacuate_miners',
      description: 'Help evacuate trapped miners',
      type: 'talk',
      target: 'trapped_miners',
      current: 0,
      required: 5,
      completed: false,
    },
    {
      id: 'defeat_saboteur',
      description: 'Defeat the Shattered saboteur',
      type: 'defeat',
      target: 'shattered_saboteur',
      current: 0,
      required: 1,
      completed: false,
    },
  ],
  rewards: {
    gold: 500,
    items: ['rock_gauntlets'],
    relationship: { petra: 20 },
    unlocks: ['deep_mines'],
  },
  status: 'locked',
}

export const ROCK_ENEMIES: Enemy[] = [
  {
    id: 'rock_guard_elite',
    name: 'Rock Guard Elite',
    type: 'rock',
    maxHP: 120,
    currentHP: 120,
    pattern: {
      type: 'reactive',
      counters: true,
    },
    description: 'An elite warrior from the Rock Order. Counters your moves.',
    isBoss: false,
  },
]

export const ROCK_MINIBOSS: Enemy = {
  id: 'earth_shaker',
  name: 'The Earth Shaker',
  type: 'rock',
  maxHP: 300,
  currentHP: 300,
  pattern: {
    type: 'sequence',
    moves: ['rock', 'rock', 'paper'],
    index: 0,
  },
  description: 'A mini-boss from the Rock Dominion. Shows moves 2 rounds in advance.',
  isBoss: true,
  phases: [
    {
      hpThreshold: 200,
      preferredMove: 'rock',
      pattern: {
        type: 'sequence',
        moves: ['rock', 'rock', 'paper'],
        index: 0,
      },
    },
    {
      hpThreshold: 100,
      preferredMove: 'paper',
      pattern: {
        type: 'reactive',
        counters: true,
      },
    },
  ],
}

