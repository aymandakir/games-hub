'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '@/lib/store/gameStore'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default function CombatScreen() {
  const { player, currentEnemy, battleLog, playerMove } = useGameStore()
  const [playerAnimation, setPlayerAnimation] = useState<'idle' | 'attack' | 'hit'>('idle')
  const [enemyAnimation, setEnemyAnimation] = useState<'idle' | 'attack' | 'hit'>('idle')
  const [showResult, setShowResult] = useState(false)
  const [lastResult, setLastResult] = useState<string>('')

  if (!currentEnemy) return null

  const moves = [
    { id: 'rock', name: 'Rock', icon: '🗿', color: 'gray' },
    { id: 'paper', name: 'Paper', icon: '📄', color: 'blue' },
    { id: 'scissors', name: 'Scissors', icon: '✂️', color: 'purple' },
  ]

  const handleMove = (move: 'rock' | 'paper' | 'scissors') => {
    setPlayerAnimation('attack')
    setEnemyAnimation('idle')
    setShowResult(false)

    setTimeout(() => {
      playerMove(move)
      setEnemyAnimation('hit')

      setTimeout(() => {
        const latestLog = battleLog[battleLog.length - 1] || ''
        setLastResult(latestLog)
        setShowResult(true)

        setTimeout(() => {
          setPlayerAnimation('idle')
          setEnemyAnimation('idle')
          setShowResult(false)
        }, 1500)
      }, 500)
    }, 300)
  }

  return (
    <div className="min-h-screen p-8 flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-5xl w-full">
        {/* Enemy */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-8 mb-6 text-center relative overflow-hidden">
            <motion.div
              animate={
                enemyAnimation === 'attack'
                  ? { scale: 1.25, rotate: 12, x: 20 }
                  : enemyAnimation === 'hit'
                    ? { scale: 0.9, rotate: -12, x: -20 }
                    : { scale: 1, rotate: 0, x: 0 }
              }
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="text-9xl mb-4"
            >
              {currentEnemy.type === 'rock' ? '🗿' : currentEnemy.type === 'paper' ? '📜' : '✂️'}
            </motion.div>
            <h3 className="text-3xl font-bold mb-4">{currentEnemy.name}</h3>
            <div className="max-w-md mx-auto">
              <div className="w-full bg-gray-700 rounded-full h-4 mb-2 relative overflow-hidden">
                <motion.div
                  className="bg-red-500 h-4 rounded-full"
                  initial={{ width: '100%' }}
                  animate={{ width: `${(currentEnemy.hp / currentEnemy.maxHP) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
                {enemyAnimation === 'hit' && (
                  <motion.div
                    className="absolute inset-0 bg-white"
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </div>
              <p className="text-lg">
                {currentEnemy.hp} / {currentEnemy.maxHP} HP
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Result Display */}
        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Card className="p-6 mb-6 text-center bg-blue-600/20 border-blue-500">
                <p className="text-2xl font-bold text-blue-400">{lastResult}</p>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Battle Log */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 mb-6">
            <h4 className="font-bold text-xl mb-3">Battle Log</h4>
            <div className="space-y-2 min-h-[120px]">
              {battleLog.length === 0 ? (
                <p className="text-gray-500 text-sm">Choose your move...</p>
              ) : (
                battleLog.map((log, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`text-sm transition-all ${
                      i === battleLog.length - 1
                        ? 'text-yellow-400 font-bold'
                        : 'text-gray-300'
                    }`}
                  >
                    {log}
                  </motion.p>
                ))
              )}
            </div>
          </Card>
        </motion.div>

        {/* Player */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.div
                  animate={
                    playerAnimation === 'attack'
                      ? { scale: 1.25, rotate: -12, x: -20 }
                      : playerAnimation === 'hit'
                        ? { scale: 0.9, rotate: 12, x: 20 }
                        : { scale: 1, rotate: 0, x: 0 }
                  }
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="text-5xl"
                >
                  {player.character === 'kael' ? '📘' : '⚔️'}
                </motion.div>
                <div>
                  <h3 className="text-2xl font-bold">
                    {player.character === 'kael' ? 'Kael' : 'Lyra'}
                  </h3>
                  <p className="text-gray-400">
                    Your HP: {player.hp} / {player.maxHP}
                  </p>
                </div>
              </div>
              <div className="w-64 bg-gray-700 rounded-full h-4 relative overflow-hidden">
                <motion.div
                  className="bg-green-500 h-4 rounded-full"
                  initial={{ width: '100%' }}
                  animate={{ width: `${(player.hp / player.maxHP) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
                {playerAnimation === 'hit' && (
                  <motion.div
                    className="absolute inset-0 bg-white"
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Move Selection */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-3 gap-4"
        >
          {moves.map((move, index) => (
            <motion.div
              key={move.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => handleMove(move.id as 'rock' | 'paper' | 'scissors')}
                variant="primary"
                className="py-12 w-full transition-all"
              >
                <div className="relative">
                  <motion.div
                    animate={playerAnimation === 'attack' ? { rotate: 360 } : {}}
                    transition={{ duration: 0.4 }}
                    className="text-6xl mb-3"
                  >
                    {move.icon}
                  </motion.div>
                  <div className="text-2xl font-bold">{move.name}</div>
                </div>
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
