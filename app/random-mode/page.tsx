'use client'

import RandomGameMode from '@/components/game/RandomGameMode'
import Link from 'next/link'

export default function RandomModePage() {
  return (
    <div className="min-h-screen">
      <RandomGameMode />
      <div className="fixed bottom-4 left-4">
        <Link
          href="/"
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
        >
          ← Back to Main Menu
        </Link>
      </div>
    </div>
  )
}

