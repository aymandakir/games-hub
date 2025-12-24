/**
 * Enhanced Combat System
 * Adds more variety, status effects, and strategic depth
 */

import { MoveType, Alignment, RoundResult, Enemy, Move } from '@/lib/types/game'
import { getDefaultMove } from '@/lib/constants/moves'
import { calculateDamage } from './combat'

export interface StatusEffect {
  type: 'defense' | 'speed' | 'confusion' | 'stun' | 'poison' | 'regeneration' | 'vulnerability'
  value: number
  duration: number
  source: 'player' | 'enemy'
}

export interface CombatModifiers {
  playerStatusEffects: StatusEffect[]
  enemyStatusEffects: StatusEffect[]
  comboMultiplier: number
  lastMoves: MoveType[]
}

/**
 * Apply status effects before combat round
 */
export function applyStatusEffects(
  modifiers: CombatModifiers,
  playerHP: number,
  enemyHP: number
): { playerHP: number; enemyHP: number; playerEffects: StatusEffect[]; enemyEffects: StatusEffect[] } {
  let newPlayerHP = playerHP
  let newEnemyHP = enemyHP

  // Process player effects
  const activePlayerEffects: StatusEffect[] = []
  for (const effect of modifiers.playerStatusEffects) {
    if (effect.duration > 0) {
      activePlayerEffects.push({ ...effect, duration: effect.duration - 1 })

      switch (effect.type) {
        case 'regeneration':
          newPlayerHP = Math.min(newPlayerHP + effect.value, 200)
          break
        case 'poison':
          newPlayerHP = Math.max(0, newPlayerHP - effect.value)
          break
      }
    }
  }

  // Process enemy effects
  const activeEnemyEffects: StatusEffect[] = []
  for (const effect of modifiers.enemyStatusEffects) {
    if (effect.duration > 0) {
      activeEnemyEffects.push({ ...effect, duration: effect.duration - 1 })

      switch (effect.type) {
        case 'regeneration':
          newEnemyHP = Math.min(newEnemyHP + effect.value, 200)
          break
        case 'poison':
          newEnemyHP = Math.max(0, newEnemyHP - effect.value)
          break
      }
    }
  }

  return {
    playerHP: newPlayerHP,
    enemyHP: newEnemyHP,
    playerEffects: activePlayerEffects,
    enemyEffects: activeEnemyEffects,
  }
}

/**
 * Enhanced round resolution with status effects and combos
 */
export function resolveEnhancedRound(
  playerMove: MoveType,
  enemyMove: MoveType,
  playerAlignment: Alignment,
  modifiers: CombatModifiers,
  enemy: Enemy
): RoundResult & { newModifiers: CombatModifiers; statusEffects: string[] } {
  const statusEffects: string[] = []
  let newModifiers = { ...modifiers }

  // Check for stun effects
  const playerStunned = modifiers.playerStatusEffects.some(e => e.type === 'stun' && e.duration > 0)
  const enemyStunned = modifiers.enemyStatusEffects.some(e => e.type === 'stun' && e.duration > 0)

  if (playerStunned) {
    statusEffects.push('Player is stunned!')
    return {
      round: 0,
      playerMove,
      enemyMove,
      winner: 'enemy',
      playerDamage: 10,
      enemyDamage: 0,
      effects: statusEffects,
      newModifiers,
      statusEffects: ['Player stunned'],
    }
  }

  if (enemyStunned) {
    statusEffects.push('Enemy is stunned!')
    return {
      round: 0,
      playerMove,
      enemyMove,
      winner: 'player',
      playerDamage: 0,
      enemyDamage: 20,
      effects: statusEffects,
      newModifiers,
      statusEffects: ['Enemy stunned'],
    }
  }

  // Calculate combo multiplier
  const lastMoves = modifiers.lastMoves
  const comboCount = lastMoves.filter(m => m === playerMove).length
  const comboMultiplier = comboCount >= 2 ? 1 + comboCount * 0.1 : 1

  // Standard RPS resolution
  let winner: 'player' | 'enemy' | 'tie'
  let playerDamage = 0
  let enemyDamage = 0

  if (playerMove === enemyMove) {
    winner = 'tie'
    playerDamage = 5
    enemyDamage = 5
    statusEffects.push('Tie! Both take stamina damage.')
  } else if (
    (playerMove === 'rock' && enemyMove === 'scissors') ||
    (playerMove === 'paper' && enemyMove === 'rock') ||
    (playerMove === 'scissors' && enemyMove === 'paper')
  ) {
    winner = 'player'
    const playerMoveData = getDefaultMove(playerMove)
    const baseDamage = calculateDamage(playerMoveData, playerAlignment, playerMove, false)
    enemyDamage = Math.floor(baseDamage * comboMultiplier)
    statusEffects.push(`Combo x${comboMultiplier.toFixed(1)}!`)

    // Apply move effects
    if (playerMoveData.effect) {
      if (playerMoveData.effect.defense) {
        newModifiers.playerStatusEffects.push({
          type: 'defense',
          value: playerMoveData.effect.defense,
          duration: playerMoveData.effect.duration || 1,
          source: 'player',
        })
        statusEffects.push(`+${playerMoveData.effect.defense} Defense`)
      }
      if (playerMoveData.effect.confusion) {
        newModifiers.enemyStatusEffects.push({
          type: 'confusion',
          value: 1,
          duration: playerMoveData.effect.confusion,
          source: 'player',
        })
        statusEffects.push('Enemy confused!')
      }
    }
  } else {
    winner = 'enemy'
    const enemyMoveData = getDefaultMove(enemyMove)
    playerDamage = calculateDamage(enemyMoveData, { rock: 33, paper: 34, scissors: 33 }, enemyMove, false)
    statusEffects.push('Enemy strikes!')
  }

  // Update last moves (keep last 3)
  newModifiers.lastMoves = [...modifiers.lastMoves.slice(-2), playerMove]
  newModifiers.comboMultiplier = comboMultiplier

  return {
    round: 0,
    playerMove,
    enemyMove,
    winner,
    playerDamage,
    enemyDamage,
    effects: statusEffects,
    newModifiers,
    statusEffects,
  }
}

/**
 * Calculate critical hit chance based on alignment and combos
 */
export function calculateCriticalChance(
  moveType: MoveType,
  alignment: Alignment,
  comboCount: number
): number {
  const baseChance = alignment[moveType] / 100 // 0-1 based on alignment
  const comboBonus = comboCount * 0.05 // 5% per combo
  return Math.min(0.95, baseChance + comboBonus) // Cap at 95%
}

/**
 * Check if critical hit occurs
 */
export function checkCriticalHit(chance: number): boolean {
  return Math.random() < chance
}

/**
 * Apply vulnerability status (takes more damage)
 */
export function applyVulnerability(
  target: 'player' | 'enemy',
  modifiers: CombatModifiers,
  duration: number = 2
): CombatModifiers {
  const newModifiers = { ...modifiers }
  if (target === 'player') {
    newModifiers.playerStatusEffects.push({
      type: 'vulnerability',
      value: 1.5, // 50% more damage
      duration,
      source: 'enemy',
    })
  } else {
    newModifiers.enemyStatusEffects.push({
      type: 'vulnerability',
      value: 1.5,
      duration,
      source: 'player',
    })
  }
  return newModifiers
}

/**
 * Get status effect description
 */
export function getStatusEffectDescription(effect: StatusEffect): string {
  switch (effect.type) {
    case 'defense':
      return `+${effect.value} Defense (${effect.duration} rounds)`
    case 'speed':
      return `+${effect.value} Speed (${effect.duration} rounds)`
    case 'confusion':
      return `Confused (${effect.duration} rounds)`
    case 'stun':
      return `Stunned (${effect.duration} rounds)`
    case 'poison':
      return `Poisoned: -${effect.value} HP/round (${effect.duration} rounds)`
    case 'regeneration':
      return `Regenerating: +${effect.value} HP/round (${effect.duration} rounds)`
    case 'vulnerability':
      return `Vulnerable: +50% damage taken (${effect.duration} rounds)`
    default:
      return 'Unknown effect'
  }
}

