'use client'

import ProceduralContentPanel from '@/components/game/ProceduralContentPanel'

export default function ProceduralPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            🎲 Procedural Content Generator
          </h1>
          <p className="text-gray-400 text-lg">
            Generate infinite enemies, quests, locations, and items using procedural generation and digital library integration
          </p>
          <a
            href="/"
            className="inline-block mt-4 text-gray-400 hover:text-white transition-colors text-sm"
          >
            ← Back to Main Menu
          </a>
        </div>
        <ProceduralContentPanel />
      </div>
    </div>
  )
}

