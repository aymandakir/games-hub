'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
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

  const handleSelect = (key: 'kael' | 'lyra') => {
    console.log('[CharacterSelect] Selected:', key)
    selectCharacter(key)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-6xl w-full">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold text-center mb-4"
        >
          Choose Your Hero
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center text-gray-400 mb-12"
        >
          Select your character to begin your journey
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.entries(characters).map(([key, char], index) => {
            const isHovered = hoveredCharacter === key

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card
                  className={`p-8 transition-all duration-300 transform ${
                    isHovered
                      ? 'border-blue-500 scale-105 shadow-2xl shadow-blue-500/20'
                      : 'hover:border-blue-500 hover:scale-102'
                  }`}
                  onMouseEnter={() => setHoveredCharacter(key)}
                  onMouseLeave={() => setHoveredCharacter(null)}
                >
                  <div className="text-center mb-6">
                    <motion.div
                      animate={isHovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      className="text-8xl mb-4"
                    >
                      {char.emoji}
                    </motion.div>
                    <h3 className="text-4xl font-bold mb-2">{char.name}</h3>
                    <p className="text-gray-400 text-lg">Age {char.age}</p>
                  </div>

                  <p className="text-gray-300 mb-6 text-center">{char.description}</p>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Rock:</span>
                      <div className="flex-1 mx-3 bg-gray-700 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${char.alignment.rock}%` }}
                          transition={{ delay: 0.5, duration: 0.8 }}
                          className="bg-gray-500 h-2 rounded-full"
                        />
                      </div>
                      <span className="text-sm">{char.alignment.rock}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Paper:</span>
                      <div className="flex-1 mx-3 bg-gray-700 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${char.alignment.paper}%` }}
                          transition={{ delay: 0.6, duration: 0.8 }}
                          className="bg-blue-500 h-2 rounded-full"
                        />
                      </div>
                      <span className="text-sm">{char.alignment.paper}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Scissors:</span>
                      <div className="flex-1 mx-3 bg-gray-700 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${char.alignment.scissors}%` }}
                          transition={{ delay: 0.7, duration: 0.8 }}
                          className="bg-purple-500 h-2 rounded-full"
                        />
                      </div>
                      <span className="text-sm">{char.alignment.scissors}%</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleSelect(key as 'kael' | 'lyra')}
                    variant="primary"
                    className={`w-full text-xl py-4 transition-all ${
                      isHovered ? 'scale-105 shadow-lg' : ''
                    }`}
                  >
                    Choose {char.name}
                  </Button>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
