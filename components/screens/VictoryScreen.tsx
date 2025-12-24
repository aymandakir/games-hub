'use client'

import { useGameStore } from '@/lib/store/gameStore'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { motion } from 'framer-motion'

export default function VictoryScreen() {
  const { combat, setScreen, player } = useGameStore()

  const handleContinue = () => {
    setScreen('exploration')
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-900/20 via-gray-900 to-black p-8"
    >
      <Card className="max-w-2xl w-full p-12 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="text-9xl mb-6"
        >
          🎉
        </motion.div>
        
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-6xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent"
        >
          VICTORY!
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-gray-300 mb-8"
        >
          You have defeated {combat.enemy?.name || 'your enemy'}!
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-4 mb-8"
        >
          <div className="bg-gray-800/50 rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-2">Rewards</p>
            <div className="flex items-center justify-center gap-6">
              <div>
                <p className="text-2xl font-bold text-yellow-400">+50</p>
                <p className="text-xs text-gray-400">Experience</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-400">+20</p>
                <p className="text-xs text-gray-400">Gold</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-2">Player Stats</p>
            <div className="flex items-center justify-center gap-6">
              <div>
                <p className="text-lg font-bold">{player.hp}/{player.maxHP}</p>
                <p className="text-xs text-gray-400">HP</p>
              </div>
              <div>
                <p className="text-lg font-bold">{player.resolve}/{player.maxResolve}</p>
                <p className="text-xs text-gray-400">Resolve</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            onClick={handleContinue}
            variant="primary"
            className="text-xl px-12 py-6 hover:scale-105 transform transition-all"
          >
            Continue Adventure
          </Button>
        </motion.div>
      </Card>
    </motion.div>
  )
}

