'use client'

import { useEffect } from 'react'
import { useGameStore } from '@/lib/store/gameStore'
import CharacterSelect from '@/components/character/CharacterSelect'
import ExplorationView from '@/components/game/ExplorationView'
import CombatView from '@/components/combat/CombatView'
import { motion, AnimatePresence } from 'framer-motion'

export default function GamePage() {
  const currentScreen = useGameStore(state => state.ui.currentScreen)
  const player = useGameStore(state => state.player)
  const setScreen = useGameStore(state => state.setScreen)

  // Initialize to character select if no character chosen
  useEffect(() => {
    console.log('[GamePage] Current screen:', currentScreen, 'Character:', player.character)
    
    if (!player.character) {
      if (currentScreen !== 'character-select') {
        console.log('[GamePage] No character selected, showing character select')
        setScreen('character-select')
      }
    }
  }, [player.character, currentScreen, setScreen])
  
  // Fallback: ensure we always show something
  useEffect(() => {
    const screen = useGameStore.getState().ui.currentScreen
    if (!screen || screen === 'title') {
      console.log('[GamePage] Screen not set, defaulting to character-select')
      setScreen('character-select')
    }
  }, [setScreen])

  return (
    <AnimatePresence mode="wait">
      {currentScreen === 'character-select' && (
        <motion.div
          key="character-select"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <CharacterSelect />
        </motion.div>
      )}

      {currentScreen === 'intro' && (
        <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="min-h-screen bg-neutral-bg flex items-center justify-center p-8">
            <div className="max-w-2xl text-center space-y-6">
              <h1 className="text-4xl font-bold">Welcome to Aetheris</h1>
              <p className="text-lg text-neutral-text/80">
                The balance between the three forces is collapsing. You must restore it before the world tears
                itself apart.
              </p>
              <button
                onClick={() => useGameStore.getState().setScreen('exploration')}
                className="px-8 py-4 bg-rock-accent text-white rounded-lg font-bold hover:bg-rock-secondary transition-colors"
              >
                Begin Your Journey
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {currentScreen === 'exploration' && (
        <motion.div
          key="exploration"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <ExplorationView />
        </motion.div>
      )}

      {currentScreen === 'combat' && (
        <motion.div key="combat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <CombatView />
        </motion.div>
      )}

      {currentScreen === 'victory' && (
        <motion.div key="victory" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="min-h-screen bg-neutral-bg flex items-center justify-center p-8">
            <div className="max-w-2xl text-center space-y-6">
              <h1 className="text-5xl font-bold text-rock-highlight">Victory!</h1>
              <p className="text-xl">You have defeated your enemy.</p>
              <button
                onClick={() => useGameStore.getState().setScreen('exploration')}
                className="px-8 py-4 bg-rock-accent text-white rounded-lg font-bold hover:bg-rock-secondary transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {currentScreen === 'defeat' && (
        <motion.div key="defeat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="min-h-screen bg-neutral-bg flex items-center justify-center p-8">
            <div className="max-w-2xl text-center space-y-6">
              <h1 className="text-5xl font-bold text-rock-accent">Defeat</h1>
              <p className="text-xl">You have been defeated. Try again?</p>
              <button
                onClick={() => useGameStore.getState().setScreen('exploration')}
                className="px-8 py-4 bg-rock-accent text-white rounded-lg font-bold hover:bg-rock-secondary transition-colors"
              >
                Return to Exploration
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

