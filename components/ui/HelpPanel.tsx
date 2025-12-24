'use client'

import { useState } from 'react'
import { Card } from './Card'
import { Button } from './Button'
import { X } from 'lucide-react'

export default function HelpPanel() {
  const [isOpen, setIsOpen] = useState(false)

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-40 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-all hover:scale-110"
        title="Help & Shortcuts"
      >
        ?
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setIsOpen(false)}>
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Help & Keyboard Shortcuts</h2>
          <Button
            onClick={() => setIsOpen(false)}
            variant="secondary"
            className="p-2"
          >
            <X size={20} />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Global Shortcuts */}
          <section>
            <h3 className="text-xl font-bold mb-3">Global Shortcuts</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-gray-800 rounded">
                <span className="text-gray-300">Go Back / Close</span>
                <kbd className="px-2 py-1 bg-gray-700 rounded text-sm">Esc</kbd>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-800 rounded">
                <span className="text-gray-300">Quick Save</span>
                <kbd className="px-2 py-1 bg-gray-700 rounded text-sm">Ctrl/Cmd + S</kbd>
              </div>
            </div>
          </section>

          {/* Exploration Shortcuts */}
          <section>
            <h3 className="text-xl font-bold mb-3">Exploration Screen</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-gray-800 rounded">
                <span className="text-gray-300">Open Inventory</span>
                <kbd className="px-2 py-1 bg-gray-700 rounded text-sm">I</kbd>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-800 rounded">
                <span className="text-gray-300">Open Shop</span>
                <kbd className="px-2 py-1 bg-gray-700 rounded text-sm">S</kbd>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-800 rounded">
                <span className="text-gray-300">Random Encounter</span>
                <kbd className="px-2 py-1 bg-gray-700 rounded text-sm">E</kbd>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-800 rounded">
                <span className="text-gray-300">Random Event</span>
                <kbd className="px-2 py-1 bg-gray-700 rounded text-sm">R</kbd>
              </div>
            </div>
          </section>

          {/* Combat Shortcuts */}
          <section>
            <h3 className="text-xl font-bold mb-3">Combat Screen</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-gray-800 rounded">
                <span className="text-gray-300">Choose Rock 🗿</span>
                <kbd className="px-2 py-1 bg-gray-700 rounded text-sm">1</kbd>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-800 rounded">
                <span className="text-gray-300">Choose Paper 📄</span>
                <kbd className="px-2 py-1 bg-gray-700 rounded text-sm">2</kbd>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-800 rounded">
                <span className="text-gray-300">Choose Scissors ✂️</span>
                <kbd className="px-2 py-1 bg-gray-700 rounded text-sm">3</kbd>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-800 rounded">
                <span className="text-gray-300">Use Symbol Break</span>
                <kbd className="px-2 py-1 bg-gray-700 rounded text-sm">U</kbd>
              </div>
            </div>
          </section>

          {/* Game Tips */}
          <section>
            <h3 className="text-xl font-bold mb-3">Game Tips</h3>
            <div className="space-y-3 text-gray-300">
              <div className="p-3 bg-gray-800 rounded">
                <p className="font-semibold text-yellow-400 mb-1">🎯 Combat Strategy</p>
                <p className="text-sm">
                  Pay attention to enemy patterns. Some enemies always use the same move,
                  while others react to your choices. Adapt your strategy!
                </p>
              </div>
              <div className="p-3 bg-gray-800 rounded">
                <p className="font-semibold text-purple-400 mb-1">⚡ Symbol Break</p>
                <p className="text-sm">
                  Build up your Resolve meter by winning rounds or take damage.
                  Use Symbol Break when it becomes available for massive damage!
                </p>
              </div>
              <div className="p-3 bg-gray-800 rounded">
                <p className="font-semibold text-green-400 mb-1">🎲 Random Encounters</p>
                <p className="text-sm">
                  Traveling between locations can trigger random encounters.
                  These offer extra rewards and experience!
                </p>
              </div>
              <div className="p-3 bg-gray-800 rounded">
                <p className="font-semibold text-blue-400 mb-1">📜 Daily Challenges</p>
                <p className="text-sm">
                  Check the Meta-Game Panel for daily challenges with enhanced rewards.
                  Complete them for bonus experience and gold!
                </p>
              </div>
            </div>
          </section>
        </div>
      </Card>
    </div>
  )
}

