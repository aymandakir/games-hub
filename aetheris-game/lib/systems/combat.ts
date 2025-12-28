import { MoveType, Alignment, RoundResult, Enemy, EnemyPattern } from '@/lib/types/game'

// Base damage values
const BASE_DAMAGE = 25
const BASE_DEFENSE = 5
const CRITICAL_MULTIPLIER = 2.0
const TIE_DAMAGE = 5 // Stamina loss on ties

/**
 * Resolve RPS round with proper logic and damage calculation
 * CRITICAL BUG FIX: Proper RPS rules, HP bounds, damage formula
 */
export function resolveRound(
  playerMove: MoveType,
  enemyMove: MoveType,
  playerAlignment: Alignment
): RoundResult {
  let winner: 'player' | 'enemy' | 'tie' = 'tie'
  let playerDamage = 0
  let enemyDamage = 0
  let isCritical = false

  // RPS Logic: Rock beats Scissors, Scissors beats Paper, Paper beats Rock
  if (playerMove === enemyMove) {
    winner = 'tie'
    playerDamage = TIE_DAMAGE
    enemyDamage = TIE_DAMAGE
  } else if (
    (playerMove === 'rock' && enemyMove === 'scissors') ||
    (playerMove === 'paper' && enemyMove === 'rock') ||
    (playerMove === 'scissors' && enemyMove === 'paper')
  ) {
    winner = 'player'
    // Calculate damage: (base - defense) * alignment_multiplier * critical
    const alignmentBonus = getAlignmentBonus(playerMove, playerAlignment)
    const baseDamage = BASE_DAMAGE - BASE_DEFENSE
    isCritical = Math.random() < 0.15 // 15% crit chance
    const multiplier = isCritical ? CRITICAL_MULTIPLIER : 1.0
    enemyDamage = Math.max(1, Math.floor(baseDamage * alignmentBonus * multiplier))
    playerDamage = 0
  } else {
    winner = 'enemy'
    // Enemy damage (simplified, no alignment for enemy)
    const baseDamage = BASE_DAMAGE - BASE_DEFENSE
    isCritical = Math.random() < 0.10 // 10% crit chance for enemy
    const multiplier = isCritical ? CRITICAL_MULTIPLIER : 1.0
    playerDamage = Math.max(1, Math.floor(baseDamage * multiplier))
    enemyDamage = 0
  }

  return {
    round: 0, // Will be set by caller
    playerMove,
    enemyMove,
    winner,
    playerDamage,
    enemyDamage,
    effects: isCritical ? ['critical'] : [],
  }
}

/**
 * Get alignment bonus for move type
 */
function getAlignmentBonus(moveType: MoveType, alignment: Alignment): number {
  const alignmentValue = alignment[moveType]
  // Convert 0-100 alignment to 0.8-1.5 multiplier
  return 0.8 + (alignmentValue / 100) * 0.7
}

/**
 * Get enemy move based on pattern
 * CRITICAL BUG FIX: Proper pattern handling
 */
export function getEnemyMove(
  enemy: Enemy,
  history: RoundResult[],
  currentHP: number
): MoveType {
  const moves: MoveType[] = ['rock', 'paper', 'scissors']
  const pattern = enemy.pattern

  if (!pattern || typeof pattern === 'string') {
    // Random fallback
    return moves[Math.floor(Math.random() * moves.length)]
  }

  // Handle different pattern types
  if (pattern.type === 'random') {
    return moves[Math.floor(Math.random() * moves.length)]
  }

  if (pattern.type === 'predictable') {
    return pattern.move
  }

  if (pattern.type === 'reactive') {
    // Counter player's last move
    if (history.length > 0) {
      const lastPlayerMove = history[history.length - 1].playerMove
      return getCounterMove(lastPlayerMove)
    }
    return moves[Math.floor(Math.random() * moves.length)]
  }

  if (pattern.type === 'sequence') {
    const move = pattern.moves[pattern.index % pattern.moves.length]
    pattern.index = (pattern.index + 1) % pattern.moves.length
    return move
  }

  // Default: random
  return moves[Math.floor(Math.random() * moves.length)]
}

/**
 * Get counter move (what beats the given move)
 */
function getCounterMove(move: MoveType): MoveType {
  switch (move) {
    case 'rock':
      return 'paper'
    case 'paper':
      return 'scissors'
    case 'scissors':
      return 'rock'
  }
}

/**
 * Check battle end condition
 * CRITICAL BUG FIX: HP bounds checking
 */
export function checkBattleEnd(playerHP: number, enemyHP: number): 'victory' | 'defeat' | 'ongoing' {
  // Ensure HP never goes negative
  const safePlayerHP = Math.max(0, Math.min(playerHP, 9999))
  const safeEnemyHP = Math.max(0, Math.min(enemyHP, 9999))

  if (safePlayerHP <= 0) return 'defeat'
  if (safeEnemyHP <= 0) return 'victory'
  return 'ongoing'
}

/**
 * Check if Symbol Break can be used
 * CRITICAL BUG FIX: Proper condition checking
 */
export function canUseSymbolBreak(resolve: number, consecutiveWins: number, hp: number): boolean {
  return resolve >= 100 && consecutiveWins >= 3 && hp > 0
}

/**
 * Calculate resolve gain from round result
 */
export function calculateResolveGain(result: RoundResult): number {
  if (result.winner === 'player') return 20
  if (result.winner === 'enemy') return 5
  return 10 // Tie
}

/**
 * Apply damage with bounds checking
 * CRITICAL BUG FIX: HP never exceeds max, never goes negative
 */
export function applyDamage(currentHP: number, damage: number, maxHP: number): number {
  const newHP = Math.max(0, Math.min(currentHP - damage, maxHP))
  return newHP
}

/**
 * Battle test function - run 50 consecutive battles
 */
export async function testBattleSystem(iterations: number = 50): Promise<{
  passed: boolean
  errors: string[]
  stats: {
    totalBattles: number
    crashes: number
    invalidHP: number
    invalidRPS: number
  }
}> {
  const errors: string[] = []
  let crashes = 0
  let invalidHP = 0
  let invalidRPS = 0

  for (let i = 0; i < iterations; i++) {
    try {
      let playerHP = 100
      let enemyHP = 80
      const maxPlayerHP = 100
      const maxEnemyHP = 80
      const alignment: Alignment = { rock: 33, paper: 34, scissors: 33 }

      for (let round = 0; round < 20; round++) {
        // Random moves
        const playerMove: MoveType = ['rock', 'paper', 'scissors'][Math.floor(Math.random() * 3)] as MoveType
        const enemyMove: MoveType = ['rock', 'paper', 'scissors'][Math.floor(Math.random() * 3)] as MoveType

        // Resolve round
        const result = resolveRound(playerMove, enemyMove, alignment)

        // Validate RPS logic
        if (playerMove === enemyMove && result.winner !== 'tie') {
          errors.push(`Battle ${i}, Round ${round}: Tie not detected`)
          invalidRPS++
        } else if (
          (playerMove === 'rock' && enemyMove === 'scissors') ||
          (playerMove === 'paper' && enemyMove === 'rock') ||
          (playerMove === 'scissors' && enemyMove === 'paper')
        ) {
          if (result.winner !== 'player') {
            errors.push(`Battle ${i}, Round ${round}: Player should win`)
            invalidRPS++
          }
        } else if (result.winner !== 'enemy') {
          errors.push(`Battle ${i}, Round ${round}: Enemy should win`)
          invalidRPS++
        }

        // Apply damage
        playerHP = applyDamage(playerHP, result.playerDamage, maxPlayerHP)
        enemyHP = applyDamage(enemyHP, result.enemyDamage, maxEnemyHP)

        // Validate HP bounds
        if (playerHP < 0 || playerHP > maxPlayerHP) {
          errors.push(`Battle ${i}, Round ${round}: Invalid player HP: ${playerHP}`)
          invalidHP++
        }
        if (enemyHP < 0 || enemyHP > maxEnemyHP) {
          errors.push(`Battle ${i}, Round ${round}: Invalid enemy HP: ${enemyHP}`)
          invalidHP++
        }

        // Check battle end
        const battleResult = checkBattleEnd(playerHP, enemyHP)
        if (battleResult !== 'ongoing') break
      }
    } catch (error) {
      crashes++
      errors.push(`Battle ${i}: Crash - ${error}`)
    }
  }

  return {
    passed: errors.length === 0,
    errors,
    stats: {
      totalBattles: iterations,
      crashes,
      invalidHP,
      invalidRPS,
    },
  }
}

