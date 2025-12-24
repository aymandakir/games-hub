import { Move } from '@/lib/types/game'

export const MOVES: Record<string, Record<string, Move>> = {
  rock: {
    stonecrash: {
      id: 'stonecrash',
      name: 'Stone Crash',
      type: 'rock',
      damage: 30,
      description: 'A massive stone fist slams down, creating a defensive barrier.',
      effect: {
        defense: 5,
        duration: 1,
      },
    },
    mountainsguard: {
      id: 'mountainsguard',
      name: "Mountain's Guard",
      type: 'rock',
      damage: 15,
      description: 'Player raises a stone shield, becoming nearly invulnerable.',
      effect: {
        defense: 10,
        reflect: 25,
        duration: 1,
      },
    },
    earthquake: {
      id: 'earthquake',
      name: 'Earthquake',
      type: 'rock',
      damage: 25,
      description: 'Ground shakes, disrupting enemy\'s balance.',
      effect: {
        stun: 1,
      },
    },
  },
  paper: {
    inkveil: {
      id: 'inkveil',
      name: 'Ink Veil',
      type: 'paper',
      damage: 20,
      description: 'A cloud of ink obscures vision and weakens strikes.',
      effect: {
        defense: 3,
        duration: 1,
      },
    },
    scrollofbinding: {
      id: 'scrollofbinding',
      name: 'Scroll of Binding',
      type: 'paper',
      damage: 15,
      description: 'Paper wraps around enemy, restricting their options.',
      effect: {
        confusion: 1,
      },
    },
    windcutter: {
      id: 'windcutter',
      name: 'Wind Cutter',
      type: 'paper',
      damage: 28,
      description: 'Sharp wind slices through defenses.',
      effect: {
        speed: 2,
        duration: 2,
      },
    },
  },
  scissors: {
    bladeflurry: {
      id: 'bladeflurry',
      name: 'Blade Flurry',
      type: 'scissors',
      damage: 35,
      description: 'Rapid series of cuts.',
      effect: {
        critical: true,
      },
    },
    precisionstrike: {
      id: 'precisionstrike',
      name: 'Precision Strike',
      type: 'scissors',
      damage: 40,
      description: 'Single, perfectly aimed cut.',
      effect: {
        critical: true,
        ignoreDefense: true,
      },
    },
    metalshardstorm: {
      id: 'metalshardstorm',
      name: 'Metal Shard Storm',
      type: 'scissors',
      damage: 30,
      description: 'Shards of metal pierce through barriers.',
      effect: {
        ignoreDefense: true,
      },
    },
  },
}

// Get all moves as flat array
export const ALL_MOVES: Move[] = Object.values(MOVES).flatMap(typeMoves => Object.values(typeMoves))

// Get moves by type
export function getMovesByType(type: 'rock' | 'paper' | 'scissors'): Move[] {
  return Object.values(MOVES[type])
}

// Get default move for each type (first move)
export function getDefaultMove(type: 'rock' | 'paper' | 'scissors'): Move {
  return MOVES[type][Object.keys(MOVES[type])[0]]
}

