export function resolveRound(move: string, enemyMove: string, alignment: any) {
  return {
    round: 0,
    playerMove: move,
    enemyMove,
    winner: 'player',
    playerDamage: 25,
    enemyDamage: 20,
  }
}

export function getEnemyMove(enemy: any, history: any[], hp: number) {
  const moves = ['rock', 'paper', 'scissors']
  return moves[Math.floor(Math.random() * moves.length)]
}

export function checkBattleEnd(playerHP: number, enemyHP: number) {
  if (playerHP <= 0) return 'defeat'
  if (enemyHP <= 0) return 'victory'
  return 'ongoing'
}

export function canUseSymbolBreak(resolve: number, consecutiveWins: number, hp: number) {
  return resolve >= 100 && consecutiveWins >= 3 && hp > 0
}

export function calculateResolveGain(result: any) {
  if (result.winner === 'player') return 20
  if (result.winner === 'enemy') return 5
  return 10
}

