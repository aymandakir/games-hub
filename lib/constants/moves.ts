import { Move } from '@/lib/types/game'

export const MOVES: Record<string, Move> = {
  rock: {
    id: 'rock',
    name: 'Rock',
    type: 'rock',
    damage: 25,
    description: 'A solid, defensive move',
  },
  paper: {
    id: 'paper',
    name: 'Paper',
    type: 'paper',
    damage: 20,
    description: 'A strategic, covering move',
  },
  scissors: {
    id: 'scissors',
    name: 'Scissors',
    type: 'scissors',
    damage: 30,
    description: 'A sharp, cutting move',
  },
}

export function getDefaultMove(type: 'rock' | 'paper' | 'scissors'): Move {
  return MOVES[type]
}

