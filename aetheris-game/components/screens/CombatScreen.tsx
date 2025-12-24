'use client'

import { useGameStore } from '@/lib/store/gameStore'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default function CombatScreen() {
  const { player, currentEnemy, battleLog, playerMove } = useGameStore()

  if (!currentEnemy) return null

  const moves = [
    { id: 'rock', name: 'Rock', icon: '🗿', color: 'gray' },
    { id: 'paper', name: 'Paper', icon: '📄', color: 'blue' },
    { id: 'scissors', name: 'Scissors', icon: '✂️', color: 'purple' },
  ]

  return (
    <div className="min-h-screen p-8 flex items-center justify-center">
      <div className="max-w-4xl w-full">
        {/* Enemy */}
        <Card className="p-8 mb-8 text-center transform transition-all">
          <div className="text-9xl mb-4">
            {currentEnemy.type === 'rock' ? '🗿' : currentEnemy.type === 'paper' ? '📜' : '✂️'}
          </div>
          <h3 className="text-3xl font-bold mb-4">{currentEnemy.name}</h3>
          <div className="max-w-md mx-auto">
            <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
              <div
                className="bg-red-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${(currentEnemy.hp / currentEnemy.maxHP) * 100}%` }}
              />
            </div>
            <p className="text-lg">
              {currentEnemy.hp} / {currentEnemy.maxHP} HP
            </p>
          </div>
        </Card>

        {/* Battle Log */}
        <Card className="p-6 mb-8">
          <h4 className="font-bold text-xl mb-3">Battle Log</h4>
          <div className="space-y-2 min-h-[120px]">
            {battleLog.map((log, i) => (
              <p key={i} className="text-sm text-gray-300">
                {log}
              </p>
            ))}
          </div>
        </Card>

        {/* Player */}
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">
                {player.character === 'kael' ? '📘 Kael' : '⚔️ Lyra'}
              </h3>
              <p className="text-gray-400">
                Your HP: {player.hp} / {player.maxHP}
              </p>
            </div>
            <div className="w-64 bg-gray-700 rounded-full h-4">
              <div
                className="bg-green-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${(player.hp / player.maxHP) * 100}%` }}
              />
            </div>
          </div>
        </Card>

        {/* Move Selection */}
        <div className="grid grid-cols-3 gap-4">
          {moves.map(move => (
            <Button
              key={move.id}
              onClick={() => playerMove(move.id as 'rock' | 'paper' | 'scissors')}
              variant="primary"
              className="py-12 hover:scale-110 transform transition-all"
            >
              <div>
                <div className="text-6xl mb-3">{move.icon}</div>
                <div className="text-2xl font-bold">{move.name}</div>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

