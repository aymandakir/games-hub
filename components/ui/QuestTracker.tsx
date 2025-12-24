'use client'

import { useGameStore } from '@/lib/store/gameStore'
import { Card } from './Card'
import { useState } from 'react'

export default function QuestTracker() {
  const { story } = useGameStore()
  const [expanded, setExpanded] = useState(false)

  // For now, just show current quest if available
  // In full implementation, this would show quest objectives and progress
  if (!story.currentQuest && !expanded) {
    return null
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-bold text-lg">📜 Quest</h4>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-gray-400 hover:text-white"
        >
          {expanded ? '▼' : '▲'}
        </button>
      </div>

      {story.currentQuest ? (
        <div>
          <p className="text-sm font-semibold mb-1">Current Quest</p>
          <p className="text-xs text-gray-400">Quest ID: {story.currentQuest}</p>
        </div>
      ) : (
        <p className="text-sm text-gray-400">No active quest</p>
      )}

      {expanded && (
        <div className="mt-3 pt-3 border-t border-gray-700">
          <p className="text-xs text-gray-400 mb-2">Completed Quests: {story.completedQuests.length}</p>
          {story.completedQuests.length > 0 && (
            <div className="space-y-1">
              {story.completedQuests.slice(-3).map((questId, i) => (
                <p key={i} className="text-xs text-gray-500 line-through">
                  {questId}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  )
}
