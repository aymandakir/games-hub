'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Achievement } from '@/lib/constants/achievements'

export function AchievementNotification() {
  const [achievement, setAchievement] = useState<Achievement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleAchievement = (event: CustomEvent<Achievement>) => {
      setAchievement(event.detail)
      setVisible(true)

      // Auto-hide after 5 seconds
      setTimeout(() => {
        setVisible(false)
      }, 5000)
    }

    window.addEventListener('achievement-unlocked', handleAchievement as EventListener)

    return () => {
      window.removeEventListener('achievement-unlocked', handleAchievement as EventListener)
    }
  }, [])

  if (!achievement || !visible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 300, opacity: 0 }}
        className="fixed top-20 right-4 bg-gradient-to-r from-yellow-600 to-yellow-500 text-white p-4 rounded-lg shadow-2xl z-50 w-80"
      >
        <div className="flex items-center gap-3">
          <div className="text-4xl">{achievement.icon}</div>
          <div className="flex-1">
            <p className="text-xs uppercase tracking-wide opacity-80">Achievement Unlocked!</p>
            <h3 className="font-bold text-lg">{achievement.name}</h3>
            <p className="text-sm opacity-90">{achievement.description}</p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

