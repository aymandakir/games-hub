'use client'

import { useEffect, useState } from 'react'
import { useGameStore } from '@/lib/store/gameStore'
import { motion, AnimatePresence } from 'framer-motion'

export default function AutoSaveIndicator() {
  const [visible, setVisible] = useState(false)
  const lastAutoSave = useGameStore(state => state.lastAutoSave)

  useEffect(() => {
    if (lastAutoSave) {
      setVisible(true)
      const timer = setTimeout(() => setVisible(false), 2000)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [lastAutoSave])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            💾
          </motion.div>
          <span>Game saved</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

