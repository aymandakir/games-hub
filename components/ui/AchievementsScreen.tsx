'use client'

import { useState, useEffect } from 'react'
import { getAchievementSystem } from '@/lib/systems/achievements'
import { ACHIEVEMENTS, Achievement } from '@/lib/constants/achievements'
import Card from './Card'
import Button from './Button'
import Modal from './Modal'

export function AchievementsScreen({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [system, setSystem] = useState(getAchievementSystem())
  const [unlocked, setUnlocked] = useState<Achievement[]>([])
  const [progress, setProgress] = useState({ unlocked: 0, total: 0, percentage: 0 })

  useEffect(() => {
    if (isOpen) {
      const sys = getAchievementSystem()
      setSystem(sys)
      setUnlocked(sys.getUnlockedAchievements())
      setProgress(sys.getProgress())
    }
  }, [isOpen])

  const categories = ['story', 'combat', 'alignment', 'collection', 'social', 'secret'] as const

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Achievements">
      <div className="space-y-6">
        {/* Progress Bar */}
        <div className="text-center">
          <div className="text-2xl font-bold mb-2">
            {progress.unlocked} / {progress.total} ({progress.percentage}%)
          </div>
          <div className="w-full bg-neutral-bg rounded-full h-4">
            <div
              className="bg-rock-highlight h-4 rounded-full transition-all"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>

        {/* Categories */}
        <div className="max-h-96 overflow-y-auto space-y-6">
          {categories.map(category => {
            const categoryAchievements = ACHIEVEMENTS.filter(a => a.category === category)

            return (
              <div key={category}>
                <h3 className="text-xl font-bold mb-4 capitalize">{category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categoryAchievements.map(achievement => {
                    const isUnlocked = unlocked.some(a => a.id === achievement.id)
                    const isHidden = achievement.hidden && !isUnlocked

                    return (
                      <Card
                        key={achievement.id}
                        variant="neutral"
                        className={`p-4 ${isUnlocked ? 'border-rock-highlight' : 'opacity-50'}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="text-3xl">{isHidden ? '❓' : achievement.icon}</div>
                          <div className="flex-1">
                            <h4 className="font-bold">{isHidden ? '???' : achievement.name}</h4>
                            <p className="text-sm text-neutral-text/60">
                              {isHidden ? 'Hidden achievement' : achievement.description}
                            </p>
                            {isUnlocked && (
                              <p className="text-xs text-rock-highlight mt-2">✓ Unlocked</p>
                            )}
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Modal>
  )
}

