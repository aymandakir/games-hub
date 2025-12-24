import { MoveType, Alignment, RoundResult, Enemy, EnemyPattern, Move } from '@/lib/types/game'
import { getDefaultMove } from '@/lib/constants/moves'
import { getAudioManager } from '@/lib/systems/audio'

// Initialize combat with audio
export async function initializeCombat(enemy: Enemy): Promise<void> {
  const audio = getAudioManager()
  
  // Play appropriate combat music based on enemy type
  if (enemy.isBoss) {
    await audio.playMusic('combat_boss', true)
  } else {
    await audio.playMusic('combat_normal', true)
  }
  
  // Combat start sound
  audio.playSFX('button_click')
}

// Determine winner of a round
export function resolveRound(
  playerMove: MoveType,
  enemyMove: MoveType,
  playerAlignment: Alignment
): RoundResult {
  const audio = getAudioManager()
  let winner: 'player' | 'enemy' | 'tie'
  let playerDamage = 0
  let enemyDamage = 0

  // Standard RPS rules
  if (playerMove === enemyMove) {
    winner = 'tie'
    playerDamage = 5 // Stamina loss
    enemyDamage = 5
    audio.playSFX('button_click', 0.5) // Clash sound
  } else if (
    (playerMove === 'rock' && enemyMove === 'scissors') ||
    (playerMove === 'paper' && enemyMove === 'rock') ||
    (playerMove === 'scissors' && enemyMove === 'paper')
  ) {
    winner = 'player'
    const playerMoveData = getDefaultMove(playerMove)
    playerDamage = calculateDamage(playerMoveData, playerAlignment, playerMove, false)
    enemyDamage = 0
    audio.playSFX(`${playerMove}_hit`)
    audio.playSFX('button_click', 0.7, 1.2) // Victory sound
  } else {
    winner = 'enemy'
    const enemyMoveData = getDefaultMove(enemyMove)
    enemyDamage = calculateDamage(enemyMoveData, { rock: 33, paper: 34, scissors: 33 }, enemyMove, false)
    playerDamage = 0
    audio.playSFX(`${enemyMove}_hit`, 0.8)
    audio.playSFX('button_click', 0.5, 0.8) // Hurt sound
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

// Trigger Symbol Break with audio
export function triggerSymbolBreak(character: 'kael' | 'lyra'): void {
  const audio = getAudioManager()
  
  // Lower music for dramatic effect
  audio.setMusicVolume(0.3)
  
  // Play ultimate sound
  if (character === 'kael') {
    audio.playSFX('ink_storm', 1.0)
  } else {
    audio.playSFX('blade_cascade', 1.0)
  }
  
  // Restore music volume after 3 seconds
  setTimeout(() => {
    audio.setMusicVolume(0.7)
  }, 3000)
}

// End combat with audio
export function endCombat(result: 'victory' | 'defeat'): void {
  const audio = getAudioManager()
  
  // Stop combat music
  audio.stopMusic(true)
  
  // Play victory/defeat stinger
  if (result === 'victory') {
    audio.playSFX('quest_complete', 1.0)
  } else {
    audio.playSFX('button_click', 0.5, 0.7)
  }
  
  // Return to exploration music after delay
  setTimeout(() => {
    // This would get current location and play appropriate theme
    audio.playMusic('crosspoint_theme', true)
  }, 2000)
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

