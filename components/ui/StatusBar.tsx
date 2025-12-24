'use client'

import { useGameStore } from '@/lib/store/gameStore'

export default function StatusBar() {
  const { player, combat, story } = useGameStore()

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-700 z-30 p-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          {/* HP */}
          <div className="flex items-center gap-2">
            <span className="text-red-400 font-semibold">HP:</span>
            <div className="w-24 bg-gray-700 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(player.hp / player.maxHP) * 100}%` }}
              />
            </div>
            <span className="text-gray-300 text-xs">
              {player.hp}/{player.maxHP}
            </span>
          </div>

          {/* Resolve */}
          <div className="flex items-center gap-2">
            <span className="text-purple-400 font-semibold">Resolve:</span>
            <div className="w-24 bg-gray-700 rounded-full h-2">
              <div
                className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(player.resolve / player.maxResolve) * 100}%` }}
              />
            </div>
            <span className="text-gray-300 text-xs">
              {player.resolve}/{player.maxResolve}
            </span>
          </div>

          {/* Level */}
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 font-semibold">Level:</span>
            <span className="text-gray-300">{player.level}</span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2">
            <span className="text-blue-400 font-semibold">Location:</span>
            <span className="text-gray-300 capitalize">{player.currentLocation.replace('_', ' ')}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Alignment */}
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Alignment:</span>
            <div className="flex gap-1">
              <span className="text-orange-400" title="Rock">
                🗿 {player.alignment.rock}%
              </span>
              <span className="text-blue-400" title="Paper">
                📄 {player.alignment.paper}%
              </span>
              <span className="text-purple-400" title="Scissors">
                ✂️ {player.alignment.scissors}%
              </span>
            </div>
          </div>

          {/* Combat Status */}
          {combat.isActive && (
            <div className="flex items-center gap-2 text-red-400">
              <span className="animate-pulse">⚔️</span>
              <span>In Combat</span>
            </div>
          )}

          {/* Quest Status */}
          {story.currentQuest && (
            <div className="flex items-center gap-2 text-green-400">
              <span>📜</span>
              <span>Quest Active</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

