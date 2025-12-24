export function getEnemy(id: string) {
  const enemies: Record<string, any> = {
    brick: {
      id: 'brick',
      name: 'Rock Guardian',
      type: 'rock',
      maxHP: 80,
      pattern: 'random',
    },
  }
  return enemies[id] || null
}

