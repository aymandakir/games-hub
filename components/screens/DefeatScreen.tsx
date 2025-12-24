'use client'

import { useGameStore } from '@/lib/store/gameStore'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { motion } from 'framer-motion'

export default function DefeatScreen() {
  const { combat, setScreen, player } = useGameStore()

  const handleRetry = () => {
    // Restore some HP for retry
    useGameStore.setState({
      player: {
        ...player,
        hp: Math.floor(player.maxHP * 0.5), // Restore to 50% HP
      },
    })
    setScreen('exploration')
  }

  const handleContinue = () => {
    setScreen('exploration')
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-900/20 via-gray-900 to-black p-8"
    >
      <Card className="max-w-2xl w-full p-12 text-center">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
          className="text-9xl mb-6"
        >
          💀
        </motion.div>
        
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-6xl font-bold mb-4 bg-gradient-to-r from-red-400 to-rose-600 bg-clip-text text-transparent"
        >
          DEFEAT
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-gray-300 mb-8"
        >
          {combat.enemy?.name || 'The enemy'} has defeated you...
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-red-900/20 rounded-lg p-4 mb-8 border border-red-500/30"
        >
          <p className="text-sm text-gray-400 mb-2">Don't give up!</p>
          <p className="text-gray-300">
            Every defeat is a lesson. Return to exploration and try again.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex gap-4 justify-center"
        >
          <Button
            onClick={handleRetry}
            variant="primary"
            className="text-lg px-8 py-4 bg-green-600 hover:bg-green-700 hover:scale-105 transform transition-all"
          >
            Retry (50% HP)
          </Button>
          <Button
            onClick={handleContinue}
            variant="secondary"
            className="text-lg px-8 py-4 hover:scale-105 transform transition-all"
          >
            Return to Exploration
          </Button>
        </motion.div>
      </Card>
    </motion.div>
  )
}

