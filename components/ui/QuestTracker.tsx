'use client'

import { useState } from 'react'
import Card from './Card'

export default function QuestTracker() {
  const [expanded, setExpanded] = useState(false)
  // Mock quest data - would come from quest system
  const activeQuests = [
    {
      id: 'tutorial',
      title: 'Learn the Basics',
      objectives: [
        { id: 'obj1', description: 'Defeat Brick', current: 0, required: 1, completed: false },
      ],
    },
  ]

  const trackedQuest = activeQuests[0]

  if (!trackedQuest) return null

  const completedCount = trackedQuest.objectives.filter(o => o.completed).length
  const totalCount = trackedQuest.objectives.length
  const progress = (completedCount / totalCount) * 100

  return (
    <div className="fixed top-20 right-4 z-40">
      {expanded ? (
        <Card variant="neutral" className="w-80 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-lg">Active Quests</h3>
            <button
              onClick={() => setExpanded(false)}
              className="text-neutral-text/60 hover:text-neutral-text transition-colors"
            >
              ✕
            </button>
          </div>

          {activeQuests.map(quest => (
            <div key={quest.id} className="mb-4 pb-4 border-b border-neutral-border last:border-0">
              <h4 className="font-semibold mb-2">{quest.title}</h4>
              <div className="space-y-1">
                {quest.objectives.map(obj => (
                  <div key={obj.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={obj.completed}
                      readOnly
                      className="rounded"
                    />
                    <span className={obj.completed ? 'line-through text-neutral-text/50' : ''}>
                      {obj.description} ({obj.current}/{obj.required})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </Card>
      ) : (
        <Card
          variant="neutral"
          className="w-64 p-3 cursor-pointer"
          onClick={() => setExpanded(true)}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-neutral-text/60 uppercase">Current Quest</span>
            <span className="text-xs text-paper-accent">Click to expand</span>
          </div>
          <h4 className="font-semibold text-sm mb-2">{trackedQuest.title}</h4>
          <div className="text-sm text-neutral-text/80 mb-2">
            {trackedQuest.objectives.find(o => !o.completed)?.description || 'All objectives complete!'}
          </div>
          <div className="mt-2 bg-neutral-bg rounded-full h-2">
            <div
              className="bg-paper-accent h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </Card>
      )}
    </div>
  )
}

