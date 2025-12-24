/**
 * Enhanced Combat Variants
 * Additional combat patterns, special moves, and dynamic combat mechanics
 */

import { MoveType, Enemy, EnemyPattern, RoundResult, Alignment } from '@/lib/types/game'
import { getEnemyMove } from './combat'

/**
 * Advanced enemy AI patterns
 */

// Pattern: Counter-predict (tries to predict what you'll counter)
export function getCounterPredictMove(
  enemy: Enemy,
  roundHistory: RoundResult[]
): MoveType {
  if (roundHistory.length < 2) {
    return enemy.type
  }

  // Analyze player pattern: if player always counters, counter their counter
  const lastTwo = roundHistory.slice(-2)
  const playerPattern: MoveType[] = [lastTwo[0].playerMove, lastTwo[1].playerMove]
  
  // If player always uses same move, counter what beats it
  if (playerPattern[0] === playerPattern[1]) {
    return getCounterMove(playerPattern[0])
  }
  
  // If player always counters enemy, predict their next counter
  const enemyMoves = [lastTwo[0].enemyMove, lastTwo[1].enemyMove]
  const didPlayerCounter = 
    (playerPattern[0] === 'rock' && enemyMoves[0] === 'scissors') ||
    (playerPattern[0] === 'paper' && enemyMoves[0] === 'rock') ||
    (playerPattern[0] === 'scissors' && enemyMoves[0] === 'paper')
  
  if (didPlayerCounter) {
    // Predict player will counter again, so counter their counter
    const predictedPlayerMove = getCounterMove(enemy.type)
    return getCounterMove(predictedPlayerMove)
  }
  
  return enemy.type
}

// Pattern: Weighted random (prefers certain moves but still random)
export function getWeightedRandomMove(
  preferredMove: MoveType,
  weight: number = 0.6 // 60% chance to use preferred
): MoveType {
  if (Math.random() < weight) {
    return preferredMove
  }
  
  const allMoves: MoveType[] = ['rock', 'paper', 'scissors']
  const otherMoves = allMoves.filter(m => m !== preferredMove)
  return otherMoves[Math.floor(Math.random() * otherMoves.length)]
}

// Pattern: Markov chain (learns from history)
export function getMarkovMove(
  enemy: Enemy,
  roundHistory: RoundResult[]
): MoveType {
  if (roundHistory.length < 3) {
    return enemy.type
  }

  // Build transition matrix from player moves
  const transitions: Record<string, Record<string, number>> = {}
  
  for (let i = 0; i < roundHistory.length - 1; i++) {
    const current = roundHistory[i].playerMove
    const next = roundHistory[i + 1].playerMove
    
    if (!transitions[current]) {
      transitions[current] = { rock: 0, paper: 0, scissors: 0 }
    }
    transitions[current][next]++
  }
  
  // Predict next move based on last move
  const lastMove = roundHistory[roundHistory.length - 1].playerMove
  const predictions = transitions[lastMove] || { rock: 1, paper: 1, scissors: 1 }
  
  // Find most likely next move
  let maxCount = 0
  let predictedMove: MoveType = 'rock'
  
  (Object.keys(predictions) as MoveType[]).forEach(move => {
    if (predictions[move] > maxCount) {
      maxCount = predictions[move]
      predictedMove = move
    }
  })
  
  // Counter the predicted move
  return getCounterMove(predictedMove)
}

// Pattern: Adaptive (changes strategy based on win/loss)
export function getAdaptiveMove(
  enemy: Enemy,
  roundHistory: RoundResult[],
  enemyHP: number,
  maxHP: number
): MoveType {
  if (roundHistory.length === 0) {
    return enemy.type
  }

  const recentResults = roundHistory.slice(-3)
  const wins = recentResults.filter(r => r.winner === 'enemy').length
  const losses = recentResults.filter(r => r.winner === 'player').length
  
  const hpPercent = (enemyHP / maxHP) * 100
  
  // If winning, maintain strategy
  if (wins > losses) {
    // Use last winning move
    const lastWin = recentResults.findLast(r => r.winner === 'enemy')
    return lastWin?.enemyMove || enemy.type
  }
  
  // If losing or low HP, try something different
  if (losses > wins || hpPercent < 50) {
    // Try to counter player's pattern
    const playerMoves = recentResults.map(r => r.playerMove)
    const mostCommonMove = getMostCommon(playerMoves)
    return getCounterMove(mostCommonMove)
  }
  
  // Default: use enemy type
  return enemy.type
}

// Pattern: RPS-Plus (uses meta-strategy)
export function getRPSPlusMove(
  enemy: Enemy,
  roundHistory: RoundResult[]
): MoveType {
  if (roundHistory.length < 4) {
    return enemy.type
  }

  // Analyze if player is following any common strategy:
  // 1. Always plays same
  // 2. Always counters
  // 3. Follows sequence
  // 4. Tries to counter enemy's counter
  
  const playerMoves = roundHistory.slice(-4).map(r => r.playerMove)
  
  // Check for repetition
  if (playerMoves.every(m => m === playerMoves[0])) {
    return getCounterMove(playerMoves[0])
  }
  
  // Check if player is countering
  const enemyMoves = roundHistory.slice(-4).map(r => r.enemyMove)
  let counterCount = 0
  
  for (let i = 0; i < playerMoves.length - 1; i++) {
    if (doesBeat(playerMoves[i], enemyMoves[i])) {
      counterCount++
    }
  }
  
  if (counterCount >= 2) {
    // Player counters a lot, so counter their counter
    const predictedCounter = getCounterMove(enemy.type)
    return getCounterMove(predictedCounter)
  }
  
  // Default: use enemy type
  return enemy.type
}

// Helper functions
function getCounterMove(move: MoveType): MoveType {
  if (move === 'rock') return 'paper'
  if (move === 'paper') return 'scissors'
  return 'rock'
}

function doesBeat(move1: MoveType, move2: MoveType): boolean {
  return (
    (move1 === 'rock' && move2 === 'scissors') ||
    (move1 === 'paper' && move2 === 'rock') ||
    (move1 === 'scissors' && move2 === 'paper')
  )
}

function getMostCommon(moves: MoveType[]): MoveType {
  const counts: Record<MoveType, number> = { rock: 0, paper: 0, scissors: 0 }
  moves.forEach(m => counts[m]++)
  
  let maxCount = 0
  let mostCommon: MoveType = 'rock'
  
  (Object.keys(counts) as MoveType[]).forEach(move => {
    if (counts[move] > maxCount) {
      maxCount = counts[move]
      mostCommon = move
    }
  })
  
  return mostCommon
}

/**
 * Enhanced enemy pattern with multiple strategies
 */
export function getEnhancedEnemyMove(
  enemy: Enemy,
  roundHistory: RoundResult[],
  currentHP: number
): MoveType {
  // Check if enemy has a special pattern type
  const pattern = enemy.pattern

  // Handle advanced pattern types
  if (pattern.type === 'reactive' && roundHistory.length > 3) {
    // After a few rounds, switch to counter-predict
    return getCounterPredictMove(enemy, roundHistory)
  }

  // Use default pattern resolution
  return getEnemyMove(enemy, roundHistory, currentHP)
}

/**
 * Dynamic difficulty adjustment
 */
export function adjustEnemyDifficulty(
  enemy: Enemy,
  playerWinStreak: number,
  playerLevel: number
): Enemy {
  // Scale enemy HP based on player performance
  const difficultyMultiplier = 1 + (playerWinStreak * 0.1) + (playerLevel * 0.05)
  
  return {
    ...enemy,
    maxHP: Math.floor(enemy.maxHP * difficultyMultiplier),
    currentHP: Math.floor(enemy.currentHP * difficultyMultiplier),
  }
}

/**
 * Generate special combat scenario
 */
export function generateSpecialCombat(
  baseEnemy: Enemy
): {
  enemy: Enemy
  specialRules: string[]
} {
  const specialRules: string[] = []
  const enemy = { ...baseEnemy }
  
  const scenario = Math.floor(Math.random() * 4)
  
  switch (scenario) {
    case 0:
      // Mirror match: Enemy copies your last move
      enemy.pattern = {
        type: 'reactive',
        counters: false,
      }
      specialRules.push('The enemy mimics your last move!')
      break
      
    case 1:
      // Chaos: Random rules each round
      enemy.pattern = {
        type: 'random',
      }
      specialRules.push('The rules of combat are unstable!')
      break
      
    case 2:
      // Predictable sequence but with a twist
      enemy.pattern = {
        type: 'sequence',
        moves: ['rock', 'paper', 'scissors', 'rock', 'paper'],
        index: 0,
      }
      specialRules.push('The enemy follows a complex pattern!')
      break
      
    case 3:
      // Adaptive difficulty
      enemy.maxHP = Math.floor(enemy.maxHP * 1.2)
      enemy.currentHP = enemy.maxHP
      specialRules.push('The enemy adapts to your fighting style!')
      break
  }
  
  return { enemy, specialRules }
}

