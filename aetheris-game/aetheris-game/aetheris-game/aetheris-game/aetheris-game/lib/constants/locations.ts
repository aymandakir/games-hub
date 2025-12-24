import { Location } from '@/lib/types/game'

export const LOCATIONS: Record<string, Location> = {
  crosspoint: {
    id: 'crosspoint',
    name: 'Crosspoint Village',
    description: 'A neutral trading hub where all three factions meet. Built in three concentric rings representing each force.',
    region: 'neutral',
    connections: ['rock_dominion', 'paper_dominion', 'scissor_dominion'],
    interactivePoints: [
      {
        id: 'grand_plaza',
        name: 'Grand Plaza',
        type: 'lore',
        description: 'The central meeting point where the three-sided monument stands.',
      },
      {
        id: 'trading_post',
        name: 'Trading Post',
        type: 'shop',
        description: 'Buy items and equipment from all three factions.',
      },
      {
        id: 'thorne_workshop',
        name: "Master Thorne's Workshop",
        type: 'npc',
        npcId: 'thorne',
        description: 'Meet with your mentor to learn about the forces.',
      },
    ],
    background: '/assets/locations/crosspoint.png',
    encounterChance: 0.1,
  },
  rock_dominion: {
    id: 'rock_dominion',
    name: 'Rock Dominion',
    description: 'Mountainous region with deep mines and stone fortresses. The ground shakes with unstable Rock energy.',
    region: 'rock',
    connections: ['crosspoint', 'granitehold'],
    interactivePoints: [
      {
        id: 'ironforge',
        name: 'Ironforge',
        type: 'shop',
        description: 'Mining town where the best weapons are crafted.',
      },
      {
        id: 'mining_camp',
        name: 'Mining Camp',
        type: 'quest',
        description: 'Help the miners evacuate from collapsing mines.',
      },
    ],
    background: '/assets/locations/rock.png',
    encounterChance: 0.4,
  },
  granitehold: {
    id: 'granitehold',
    name: 'Granitehold',
    description: 'The capital city of the Rock Dominion, built into a massive mountain.',
    region: 'rock',
    connections: ['rock_dominion'],
    interactivePoints: [
      {
        id: 'rock_order_hall',
        name: 'Rock Order Hall',
        type: 'npc',
        description: 'Meet with Rock Order representatives.',
      },
      {
        id: 'training_grounds',
        name: 'Training Grounds',
        type: 'training',
        description: 'Practice your Rock-aligned moves.',
      },
    ],
    background: '/assets/locations/granitehold.png',
    encounterChance: 0.3,
  },
  paper_dominion: {
    id: 'paper_dominion',
    name: 'Paper Dominion',
    description: 'Wind-swept plains with floating scroll cities. Papers and scrolls are losing their magic.',
    region: 'paper',
    connections: ['crosspoint', 'scriptoria'],
    interactivePoints: [
      {
        id: 'aeropolis',
        name: 'Aeropolis',
        type: 'lore',
        description: 'A floating city that drifts with the winds.',
      },
      {
        id: 'wind_plains',
        name: 'Wind Plains',
        type: 'quest',
        description: 'Investigate why Paper magic is weakening.',
      },
    ],
    background: '/assets/locations/paper.png',
    encounterChance: 0.4,
  },
  scriptoria: {
    id: 'scriptoria',
    name: 'Scriptoria',
    description: 'The great library city where knowledge is currency. The library is losing its enchantment.',
    region: 'paper',
    connections: ['paper_dominion'],
    interactivePoints: [
      {
        id: 'great_library',
        name: 'Great Library',
        type: 'npc',
        npcId: 'elara',
        description: 'Meet with Sage Elara and access restricted texts.',
      },
      {
        id: 'scholar_quarters',
        name: 'Scholar Quarters',
        type: 'npc',
        npcId: 'marcus',
        description: 'Speak with Elder Marcus.',
      },
    ],
    background: '/assets/locations/scriptoria.png',
    encounterChance: 0.3,
  },
  scissor_dominion: {
    id: 'scissor_dominion',
    name: 'Scissor Dominion',
    description: 'Blade forests and sharp cliffs. Metal is becoming unstable, blades shattering randomly.',
    region: 'scissors',
    connections: ['crosspoint', 'edgehaven'],
    interactivePoints: [
      {
        id: 'blade_forest',
        name: 'Blade Forest',
        type: 'quest',
        description: 'Investigate why blades are shattering.',
      },
      {
        id: 'training_arena',
        name: 'Training Arena',
        type: 'training',
        description: 'Practice your Scissor-aligned moves.',
      },
    ],
    background: '/assets/locations/scissors.png',
    encounterChance: 0.4,
  },
  edgehaven: {
    id: 'edgehaven',
    name: 'Edgehaven',
    description: 'Port city where all trade routes converge. Home to the Scissor Blades.',
    region: 'scissors',
    connections: ['scissor_dominion'],
    interactivePoints: [
      {
        id: 'blade_hq',
        name: 'Blade Headquarters',
        type: 'npc',
        npcId: 'zara',
        description: 'Meet with Blade Captain Zara.',
      },
      {
        id: 'metal_market',
        name: 'Metal Market',
        type: 'shop',
        description: 'Buy precision tools and weapons.',
      },
    ],
    background: '/assets/locations/edgehaven.png',
    encounterChance: 0.3,
  },
}

export function getLocation(id: string): Location | null {
  return LOCATIONS[id] || null
}

export function getLocationsByRegion(region: 'rock' | 'paper' | 'scissors' | 'neutral'): Location[] {
  return Object.values(LOCATIONS).filter(loc => loc.region === region)
}

