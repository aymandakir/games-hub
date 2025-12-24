import { MoveType, Alignment, RoundResult, Enemy, EnemyPattern, Move } from '@/lib/types/game'
import { getDefaultMove } from '@/lib/constants/moves'

// Determine winner of a round
export function resolveRound(
  playerMove: MoveType,
  enemyMove: MoveType,
  playerAlignment: Alignment
): RoundResult {
  let winner: 'player' | 'enemy' | 'tie'
  let playerDamage = 0
  let enemyDamage = 0

  // Standard RPS rules
  if (playerMove === enemyMove) {
    winner = 'tie'
    playerDamage = 5 // Stamina loss
    enemyDamage = 5
  } else if (
    (playerMove === 'rock' && enemyMove === 'scissors') ||
    (playerMove === 'paper' && enemyMove === 'rock') ||
    (playerMove === 'scissors' && enemyMove === 'paper')
  ) {
    winner = 'player'
    const playerMoveData = getDefaultMove(playerMove)
    playerDamage = calculateDamage(playerMoveData, playerAlignment, playerMove, false)
    enemyDamage = 0
  } else {
    winner = 'enemy'
    const enemyMoveData = getDefaultMove(enemyMove)
    enemyDamage = calculateDamage(enemyMoveData, { rock: 33, paper: 34, scissors: 33 }, enemyMove, false)
    playerDamage = 0
  }

  return {
    round: 0, // Will be set by caller
    playerMove,
    enemyMove,
    winner,
    playerDamage,
    enemyDamage,
    effects: [],
  }
}

// Calculate damage with alignment bonuses
export function calculateDamage(
  move: Move,
  alignment: Alignment,
  moveType: MoveType,
  isCritical: boolean
): number {
  let baseDamage = move.damage

  // Alignment bonus: +10% damage per 10% affinity
  const alignmentBonus = (alignment[moveType] / 10) * 0.1
  baseDamage = Math.floor(baseDamage * (1 + alignmentBonus))

  // Critical hit: 2x damage
  if (isCritical || move.effect?.critical) {
    baseDamage = Math.floor(baseDamage * 2)
  }

  return baseDamage
}

// Get enemy move based on pattern
export function getEnemyMove(
  enemy: Enemy,
  roundHistory: RoundResult[],
  currentHP: number
): MoveType {
  const pattern = enemy.pattern

  switch (pattern.type) {
    case 'predictable':
      return pattern.move

    case 'reactive':
      // Counter player's last move
      if (roundHistory.length > 0) {
        const lastPlayerMove = roundHistory[roundHistory.length - 1].playerMove
        // Return what beats the player's move
        if (lastPlayerMove === 'rock') return 'paper'
        if (lastPlayerMove === 'paper') return 'scissors'
        if (lastPlayerMove === 'scissors') return 'rock'
      }
      return enemy.type // Default to enemy's type

    case 'random':
      const moves: MoveType[] = ['rock', 'paper', 'scissors']
      return moves[Math.floor(Math.random() * moves.length)]

    case 'sequence':
      const currentIndex = pattern.index % pattern.moves.length
      const move = pattern.moves[currentIndex]
      // Update index for next call (stored in enemy state)
      return move

    case 'phase':
      // Check current phase based on HP
      const hpPercent = (currentHP / enemy.maxHP) * 100
      let currentPhase = 0
      for (let i = 0; i < pattern.phases.length; i++) {
        if (hpPercent <= pattern.phases[i].hpThreshold) {
          currentPhase = i
          break
        }
      }
      const phase = pattern.phases[currentPhase]
      // Recursively get move from phase pattern
      const phaseEnemy: Enemy = {
        ...enemy,
        pattern: phase.pattern as EnemyPattern,
      }
      return getEnemyMove(phaseEnemy, roundHistory, currentHP)

    default:
      return enemy.type
  }
}

// Check if battle has ended
export function checkBattleEnd(
  playerHP: number,
  enemyHP: number
): 'victory' | 'defeat' | 'ongoing' {
  if (playerHP <= 0) return 'defeat'
  if (enemyHP <= 0) return 'victory'
  return 'ongoing'
}

// Check if Symbol Break can be used
export function canUseSymbolBreak(
  resolve: number,
  consecutiveWins: number,
  currentHP: number
): boolean {
  return resolve >= 100 || (consecutiveWins >= 3 && currentHP <= 50)
}

// Apply move effects (simplified - full implementation would track status effects)
export function applyMoveEffects(move: Move, targetAlignment: Alignment): {
  defense?: number
  speed?: number
  confusion?: number
  stun?: number
} {
  return move.effect || {}
}

// Calculate resolve gain
export function calculateResolveGain(
  roundResult: RoundResult,
  baseGain: number = 10
): number {
  if (roundResult.winner === 'player') {
    return baseGain
  } else if (roundResult.winner === 'enemy') {
    return Math.floor(baseGain * 0.5) // Gain less when hit
  }
  return Math.floor(baseGain * 0.3) // Minimal gain on tie
}

