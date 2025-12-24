'use client'

import { useGameStore } from '@/lib/store/gameStore'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default function ExplorationScreen() {
  const { player, startBattle } = useGameStore()

  const enemies = [
    { name: 'Rock Guardian', hp: 80, maxHP: 80, type: 'rock' as const, icon: '🗿' },
    { name: 'Paper Scholar', hp: 60, maxHP: 60, type: 'paper' as const, icon: '📜' },
    { name: 'Scissor Blade', hp: 70, maxHP: 70, type: 'scissors' as const, icon: '✂️' },
  ]

  return (
    <div className="min-h-screen p-8">
      {/* Player HUD */}
      <Card className="max-w-4xl mx-auto p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold">
              {player.character === 'kael' ? '📘 Kael' : '⚔️ Lyra'}
            </h3>
            <p className="text-gray-400">Crosspoint Village</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">HP</p>
            <div className="flex items-center gap-3">
              <div className="w-48 bg-gray-700 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all"
                  style={{ width: `${(player.hp / player.maxHP) * 100}%` }}
                />
              </div>
              <span className="text-xl font-bold">
                {player.hp}/{player.maxHP}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Location */}
      <div className="max-w-4xl mx-auto">
        <Card className="p-8 mb-8">
          <p className="text-lg leading-relaxed">
            You stand in the center of <span className="font-bold text-blue-400">Crosspoint Village</span>, where
            all three factions meet. The air feels tense. Strange energy pulses through the ground. You can feel the
            imbalance growing...
          </p>
        </Card>

        <h3 className="text-3xl font-bold mb-6">Choose Your Path</h3>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {enemies.map((enemy, i) => (
            <Button
              key={i}
              onClick={() => startBattle(enemy)}
              variant="primary"
              className="p-6 text-left h-auto hover:scale-105 transform"
            >
              <div className="text-center">
                <div className="text-6xl mb-3">{enemy.icon}</div>
                <p className="font-bold text-xl mb-2">Battle {enemy.name}</p>
                <p className="text-sm text-gray-300">HP: {enemy.hp}</p>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

