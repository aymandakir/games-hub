'use client'

import { useState } from 'react'
import { useGameStore } from '@/lib/store/gameStore'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default function CharacterSelect() {
  const selectCharacter = useGameStore(state => state.selectCharacter)
  const [hoveredCharacter, setHoveredCharacter] = useState<string | null>(null)

  const characters = {
    kael: {
      name: 'Kael',
      age: 20,
      description: 'A strategic thinker with Paper alignment. Uses wit and adaptability.',
      alignment: { paper: 60, rock: 15, scissors: 25 },
      icon: '📘',
      color: 'blue',
      emoji: '👤',
    },
    lyra: {
      name: 'Lyra',
      age: 19,
      description: 'A precise warrior with Scissors alignment. Fast and deadly.',
      alignment: { scissors: 60, rock: 25, paper: 15 },
      icon: '⚔️',
      color: 'purple',
      emoji: '👩',
    },
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-6xl w-full">
        <h2 className="text-5xl font-bold text-center mb-4 animate-fade-in">Choose Your Hero</h2>
        <p className="text-center text-gray-400 mb-12">Select your character to begin your journey</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.entries(characters).map(([key, char]) => {
            const isHovered = hoveredCharacter === key
            
            return (
              <Card
                key={key}
                className={`p-8 transition-all duration-300 transform ${
                  isHovered
                    ? 'border-blue-500 scale-105 shadow-2xl shadow-blue-500/20'
                    : 'hover:border-blue-500 hover:scale-102'
                }`}
                onMouseEnter={() => setHoveredCharacter(key)}
                onMouseLeave={() => setHoveredCharacter(null)}
              >
                <div className="text-center mb-6">
                  <div className={`text-8xl mb-4 transition-all duration-300 ${
                    isHovered ? 'animate-bounce scale-110' : ''
                  }`}>
                    {char.emoji}
                  </div>
                  <h3 className="text-4xl font-bold mb-2">{char.name}</h3>
                  <p className="text-gray-400 text-lg">Age {char.age}</p>
                </div>

                <p className="text-gray-300 mb-6 text-center">{char.description}</p>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Rock:</span>
                    <div className="flex-1 mx-3 bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gray-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${char.alignment.rock}%` }}
                      />
                    </div>
                    <span className="text-sm">{char.alignment.rock}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Paper:</span>
                    <div className="flex-1 mx-3 bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${char.alignment.paper}%` }}
                      />
                    </div>
                    <span className="text-sm">{char.alignment.paper}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Scissors:</span>
                    <div className="flex-1 mx-3 bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${char.alignment.scissors}%` }}
                      />
                    </div>
                    <span className="text-sm">{char.alignment.scissors}%</span>
                  </div>
                </div>

                <Button
                  onClick={() => selectCharacter(key as 'kael' | 'lyra')}
                  variant="primary"
                  className={`w-full text-xl py-4 transition-all ${
                    isHovered ? 'scale-105 shadow-lg' : ''
                  }`}
                >
                  Choose {char.name}
                </Button>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
