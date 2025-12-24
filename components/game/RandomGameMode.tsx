'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { generateRandomGameMode, generateEndlessMode } from '@/lib/systems/procedural-generator'
import { useGameStore } from '@/lib/store/gameStore'

interface GameMode {
  name: string
  description: string
  enemies: any[]
  locations: any[]
  quests: any[]
  difficulty: number
}

export default function RandomGameMode() {
  const [gameMode, setGameMode] = useState<GameMode | null>(null)
  const [loading, setLoading] = useState(false)
  const [endlessLevel, setEndlessLevel] = useState(1)
  const [endlessMode, setEndlessMode] = useState<any>(null)
  const { startBattle, travelToLocation } = useGameStore()

  const generateMode = async () => {
    setLoading(true)
    try {
      const mode = await generateRandomGameMode()
      setGameMode(mode)
    } catch (error) {
      console.error('Failed to generate game mode:', error)
    } finally {
      setLoading(false)
    }
  }

  const startEndlessMode = async (level: number = 1) => {
    setLoading(true)
    try {
      const mode = await generateEndlessMode(level)
      setEndlessMode(mode)
      setEndlessLevel(level)
      
      // Start battle with generated enemy
      if (mode.enemy) {
        // Add enemy to store temporarily
        startBattle(mode.enemy.id)
      }
    } catch (error) {
      console.error('Failed to start endless mode:', error)
    } finally {
      setLoading(false)
    }
  }

  const nextEndlessLevel = () => {
    startEndlessMode(endlessLevel + 1)
  }

  useEffect(() => {
    // Auto-generate on mount
    generateMode()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-bg via-rock-dark to-neutral-bg p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold font-fantasy bg-gradient-to-r from-rock-highlight via-paper-accent to-scissors-highlight bg-clip-text text-transparent mb-4">
            Random Game Modes
          </h1>
          <p className="text-neutral-text/80 text-lg">
            Experience procedurally generated content powered by digital libraries
          </p>
        </motion.div>

        {/* Random Game Mode Generator */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Procedural Adventure</h2>
            <Button
              onClick={generateMode}
              disabled={loading}
              variant="primary"
            >
              {loading ? 'Generating...' : 'Generate New Mode'}
            </Button>
          </div>

          {gameMode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div>
                <h3 className="text-xl font-semibold mb-2">{gameMode.name}</h3>
                <p className="text-neutral-text/70">{gameMode.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-rock-dark/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Enemies</h4>
                  <p className="text-sm text-neutral-text/70">
                    {gameMode.enemies.length} enemies generated
                  </p>
                  <p className="text-xs text-neutral-text/50 mt-1">
                    Difficulty: {gameMode.difficulty}/5
                  </p>
                </div>

                <div className="bg-paper-dark/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Locations</h4>
                  <p className="text-sm text-neutral-text/70">
                    {gameMode.locations.length} locations generated
                  </p>
                </div>

                <div className="bg-scissors-dark/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Quests</h4>
                  <p className="text-sm text-neutral-text/70">
                    {gameMode.quests.length} quests generated
                  </p>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <Button
                  onClick={() => {
                    if (gameMode.enemies.length > 0) {
                      startBattle(gameMode.enemies[0])
                    }
                  }}
                  variant="primary"
                  className="flex-1"
                >
                  Start Adventure
                </Button>
                <Button
                  onClick={generateMode}
                  variant="secondary"
                  className="flex-1"
                >
                  Regenerate
                </Button>
              </div>
            </motion.div>
          )}
        </Card>

        {/* Endless Mode */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold">Endless Arena</h2>
              <p className="text-sm text-neutral-text/70 mt-1">
                Infinite battles with scaling difficulty
              </p>
            </div>
            {endlessMode && (
              <div className="text-right">
                <div className="text-3xl font-bold text-rock-highlight">
                  Level {endlessLevel}
                </div>
                <div className="text-sm text-neutral-text/70">
                  Difficulty: {endlessMode.difficulty}
                </div>
              </div>
            )}
          </div>

          {!endlessMode ? (
            <Button
              onClick={() => startEndlessMode(1)}
              disabled={loading}
              variant="primary"
              className="w-full"
            >
              {loading ? 'Starting...' : 'Start Endless Mode'}
            </Button>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="bg-gradient-to-r from-rock-dark to-scissors-dark p-4 rounded-lg">
                <h3 className="font-semibold mb-2">{endlessMode.enemy.name}</h3>
                <p className="text-sm text-neutral-text/70 mb-2">
                  {endlessMode.enemy.description}
                </p>
                <div className="flex gap-4 text-sm">
                  <div>
                    <span className="text-neutral-text/50">HP: </span>
                    <span className="font-semibold">{endlessMode.enemy.maxHP}</span>
                  </div>
                  <div>
                    <span className="text-neutral-text/50">Type: </span>
                    <span className="font-semibold capitalize">{endlessMode.enemy.type}</span>
                  </div>
                  {endlessMode.enemy.isBoss && (
                    <div className="text-rock-highlight font-bold">BOSS</div>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => startBattle(endlessMode.enemy)}
                  variant="primary"
                  className="flex-1"
                >
                  Fight Enemy
                </Button>
                <Button
                  onClick={nextEndlessLevel}
                  variant="secondary"
                  className="flex-1"
                >
                  Next Level
                </Button>
              </div>
            </motion.div>
          )}
        </Card>

        {/* Info Card */}
        <Card className="p-6 bg-gradient-to-r from-paper-dark/50 to-scissors-dark/50">
          <h3 className="text-xl font-bold mb-3">About Procedural Generation</h3>
          <div className="space-y-2 text-sm text-neutral-text/80">
            <p>
              This system uses procedural generation algorithms combined with digital library APIs
              to create unique game content including:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Randomly generated enemies with adaptive AI</li>
              <li>Procedural locations with unique descriptions</li>
              <li>Dynamic quests that scale with difficulty</li>
              <li>Infinite/endless mode with progressive challenges</li>
            </ul>
            <p className="mt-3 text-xs text-neutral-text/60">
              Content is inspired by real-world data from digital libraries and APIs,
              ensuring variety and authenticity in every playthrough.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

