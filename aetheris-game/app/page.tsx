'use client'

import { useGameStore } from '@/lib/store/gameStore'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default function HomePage() {
  const setScreen = useGameStore(state => state.setScreen)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-12 text-center">
        <div className="mb-8">
          <h1 className="text-7xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            AETHERIS
          </h1>
          <p className="text-3xl text-gray-400 font-light">The Symbol War</p>
        </div>

        <p className="text-lg text-gray-300 mb-8 max-w-md mx-auto">
          An epic fantasy RPG where Rock, Paper, and Scissors define everything—from magic to culture to combat.
        </p>

        <div className="space-y-4">
          <Button
            onClick={() => setScreen('character_select')}
            variant="primary"
            className="w-full text-xl py-6 hover:scale-105 transform transition-all animate-pulse hover:animate-none"
          >
            ⚔️ Begin Adventure
          </Button>
        </div>
        
        <div className="mt-8 text-center">
          <a 
            href="../" 
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            ← Back to Game Hub
          </a>
        </div>

        <p className="text-sm text-gray-500 mt-8">Choose your character and restore balance to Aetheris</p>
      </Card>
    </div>
  )
}
