import { Enemy } from '@/lib/types/game'

export const ENEMIES: Record<string, Enemy> = {
  // Tutorial enemy
  brick: {
    id: 'brick',
    name: 'Brick',
    type: 'rock',
    maxHP: 50,
    currentHP: 50,
    pattern: {
      type: 'predictable',
      move: 'rock',
    },
    description: 'A local troublemaker from Crosspoint. Always uses Rock.',
    isBoss: false,
  },

  // Rock Dominion enemies
  rockguard: {
    id: 'rockguard',
    name: 'Rock Guard',
    type: 'rock',
    maxHP: 80,
    currentHP: 80,
    pattern: {
      type: 'reactive',
      counters: true,
    },
    description: 'A defensive warrior from the Rock Order. Counters your last move.',
    isBoss: false,
  },
  earthshaker: {
    id: 'earthshaker',
    name: 'The Earth Shaker',
    type: 'rock',
    maxHP: 150,
    currentHP: 150,
    pattern: {
      type: 'sequence',
      moves: ['rock', 'rock', 'paper'],
      index: 0,
    },
    description: 'A mini-boss from the Rock Dominion. Shows moves 2 rounds in advance.',
    isBoss: true,
    phases: [
      {
        hpThreshold: 100,
        preferredMove: 'rock',
        pattern: {
          type: 'sequence',
          moves: ['rock', 'rock', 'paper'],
          index: 0,
        },
      },
      {
        hpThreshold: 50,
        preferredMove: 'paper',
        pattern: {
          type: 'reactive',
          counters: true,
        },
      },
    ],
  },

  // Paper Dominion enemies
  paperscholar: {
    id: 'paperscholar',
    name: 'Paper Scholar',
    type: 'paper',
    maxHP: 60,
    currentHP: 60,
    pattern: {
      type: 'random',
    },
    description: 'A scholar experimenting with Paper magic. Unpredictable.',
    isBoss: false,
  },
  scrollkeeper: {
    id: 'scrollkeeper',
    name: 'The Scroll Keeper',
    type: 'paper',
    maxHP: 120,
    currentHP: 120,
    pattern: {
      type: 'reactive',
      counters: true,
    },
    description: 'A mini-boss guarding the library. Hides choices but gives hints.',
    isBoss: true,
  },

  // Scissor Dominion enemies
  scissorblade: {
    id: 'scissorblade',
    name: 'Scissor Blade',
    type: 'scissors',
    maxHP: 70,
    currentHP: 70,
    pattern: {
      type: 'sequence',
      moves: ['scissors', 'rock', 'paper'],
      index: 0,
    },
    description: 'A warrior from the Scissor Blades. Follows a pattern.',
    isBoss: false,
  },
  blademaster: {
    id: 'blademaster',
    name: 'The Blade Master',
    type: 'scissors',
    maxHP: 180,
    currentHP: 180,
    pattern: {
      type: 'reactive',
      counters: true,
    },
    description: 'A mini-boss from the Scissor Dominion. Uses 2 moves per round.',
    isBoss: true,
    phases: [
      {
        hpThreshold: 100,
        preferredMove: 'scissors',
        pattern: {
          type: 'sequence',
          moves: ['scissors', 'scissors', 'rock'],
          index: 0,
        },
      },
      {
        hpThreshold: 50,
        preferredMove: 'rock',
        pattern: {
          type: 'random',
        },
      },
    ],
  },

  // Final boss
  shatteredleader: {
    id: 'shatteredleader',
    name: 'The Shattered Leader',
    type: 'rock',
    maxHP: 300,
    currentHP: 300,
    pattern: {
      type: 'phase',
      phases: [
        {
          hpThreshold: 200,
          preferredMove: 'rock',
          pattern: {
            type: 'random',
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
        {
          hpThreshold: 0,
          preferredMove: 'scissors',
          pattern: {
            type: 'random',
          },
        },
      ],
      currentPhase: 0,
    },
    description: 'The leader of The Shattered. Uses distorted RPS rules.',
    isBoss: true,
  },
}

// Get enemy by ID
export function getEnemy(id: string): Enemy | null {
  return ENEMIES[id] ? { ...ENEMIES[id], currentHP: ENEMIES[id].maxHP } : null
}

// Get enemies by region
export function getEnemiesByRegion(region: 'rock' | 'paper' | 'scissors'): Enemy[] {
  return Object.values(ENEMIES).filter(enemy => {
    if (region === 'rock') return ['brick', 'rockguard', 'earthshaker'].includes(enemy.id)
    if (region === 'paper') return ['paperscholar', 'scrollkeeper'].includes(enemy.id)
    if (region === 'scissors') return ['scissorblade', 'blademaster'].includes(enemy.id)
    return false
  })
}

