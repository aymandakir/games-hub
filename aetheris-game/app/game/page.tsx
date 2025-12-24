'use client'

import { useEffect } from 'react'
import { useGameStore } from '@/lib/store/gameStore'
import { motion, AnimatePresence } from 'framer-motion'
import CharacterSelect from '@/components/screens/CharacterSelect'
import ExplorationScreen from '@/components/screens/ExplorationScreen'
import CombatScreen from '@/components/screens/CombatScreen'

export default function GamePage() {
  const currentScreen = useGameStore(state => state.currentScreen)
  const setScreen = useGameStore(state => state.setScreen)
  const player = useGameStore(state => state.player)

  // Ensure we start at character select if no character chosen
  useEffect(() => {
    // Check if coming from landing page
    if (typeof window !== 'undefined') {
      const shouldStart = localStorage.getItem('aetheris-start')
      if (shouldStart) {
        localStorage.removeItem('aetheris-start')
        setScreen('character_select')
        return
      }
    }
    
    if (!player.character && currentScreen !== 'character_select') {
      console.log('[GamePage] No character, setting to character_select')
      setScreen('character_select')
    }
  }, [player.character, currentScreen, setScreen])

  return (
    <div className="min-h-screen bg-black text-white">
      <AnimatePresence mode="wait">
        {currentScreen === 'character_select' && (
          <motion.div
            key="character-select"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CharacterSelect />
          </motion.div>
        )}

        {currentScreen === 'exploration' && (
          <motion.div
            key="exploration"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <ExplorationScreen />
          </motion.div>
        )}

        {currentScreen === 'combat' && (
          <motion.div
            key="combat"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <CombatScreen />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
