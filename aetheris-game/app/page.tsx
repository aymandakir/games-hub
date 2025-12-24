'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useGameStore } from '@/lib/store/gameStore'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default function HomePage() {
  const router = useRouter()
  const setScreen = useGameStore(state => state.setScreen)

  const handleStartGame = () => {
    console.log('[Title] Starting game...')
    setScreen('character_select')
    router.push('/game')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="p-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-7xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              AETHERIS
            </h1>
            <p className="text-3xl text-gray-400 font-light">The Symbol War</p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-300 mb-8 max-w-md mx-auto"
          >
            An epic fantasy RPG where Rock, Paper, and Scissors define everything—from magic to culture to combat.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <Button
              onClick={handleStartGame}
              variant="primary"
              className="w-full text-xl py-6 hover:scale-105 transform transition-all"
            >
              ⚔️ Begin Adventure
            </Button>
            
            <a
              href="/"
              className="block text-gray-400 hover:text-white transition-colors text-sm mt-6"
            >
              ← Back to Game Hub
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-sm text-gray-500 mt-8"
          >
            Choose your character and restore balance to Aetheris
          </motion.p>
        </Card>
      </motion.div>
    </div>
  )
}
