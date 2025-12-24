'use client'

import { useUserStore } from '@/lib/store/userStore'
import { Card } from '@/components/ui/Card'
import Link from 'next/link'

export default function ProfilePage() {
  const { username, gameProgress, achievements, getTotalGamesPlayed } = useUserStore()

  const totalGames = getTotalGamesPlayed()
  const gamesPlayed = Object.keys(gameProgress).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-8">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-5xl font-bold text-white mb-8">👤 Your Profile</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 text-center">
            <p className="text-4xl font-bold text-blue-400">{totalGames}</p>
            <p className="text-gray-400">Total Plays</p>
          </Card>
          <Card className="p-6 text-center">
            <p className="text-4xl font-bold text-purple-400">{gamesPlayed}</p>
            <p className="text-gray-400">Games Played</p>
          </Card>
          <Card className="p-6 text-center">
            <p className="text-4xl font-bold text-pink-400">{achievements.length}</p>
            <p className="text-gray-400">Achievements</p>
          </Card>
          <Card className="p-6 text-center">
            <p className="text-4xl font-bold text-green-400">∞</p>
            <p className="text-gray-400">More to Play</p>
          </Card>
        </div>

        {/* Game Progress */}
        <h2 className="text-3xl font-bold text-white mb-6">🎮 Game Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {Object.values(gameProgress).map(game => (
            <Card key={game.gameId} className="p-6">
              <h3 className="text-xl font-bold text-white mb-2 capitalize">{game.gameId}</h3>
              <div className="space-y-2 text-gray-400">
                <p>
                  High Score: <span className="text-white font-bold">{game.highScore}</span>
                </p>
                <p>
                  Times Played: <span className="text-white font-bold">{game.timesPlayed}</span>
                </p>
                <p>
                  Last Played:{' '}
                  <span className="text-white font-bold">
                    {new Date(game.lastPlayed).toLocaleDateString()}
                  </span>
                </p>
              </div>
            </Card>
          ))}
        </div>

        <Link href="/">
          <button className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600">
            ← Back to Hub
          </button>
        </Link>
      </div>
    </div>
  )
}

