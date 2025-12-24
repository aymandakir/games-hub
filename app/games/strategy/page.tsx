'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface Resource {
  gold: number
  wood: number
  stone: number
}

interface Building {
  id: string
  name: string
  cost: Resource
  income: Resource
  built: boolean
}

const BUILDINGS: Building[] = [
  { id: 'farm', name: 'Farm', cost: { gold: 50, wood: 20, stone: 0 }, income: { gold: 5, wood: 0, stone: 0 }, built: false },
  { id: 'mine', name: 'Mine', cost: { gold: 100, wood: 0, stone: 30 }, income: { gold: 10, wood: 0, stone: 2 }, built: false },
  { id: 'lumber', name: 'Lumber Mill', cost: { gold: 75, wood: 10, stone: 10 }, income: { gold: 3, wood: 5, stone: 0 }, built: false },
  { id: 'castle', name: 'Castle', cost: { gold: 500, wood: 200, stone: 200 }, income: { gold: 20, wood: 5, stone: 5 }, built: false },
]

export default function StrategyGamePage() {
  const [resources, setResources] = useState<Resource>({ gold: 100, wood: 50, stone: 30 })
  const [buildings, setBuildings] = useState<Building[]>(BUILDINGS)
  const [turn, setTurn] = useState(1)
  const [gameWon, setGameWon] = useState(false)

  const canAfford = (cost: Resource): boolean => {
    return resources.gold >= cost.gold && resources.wood >= cost.wood && resources.stone >= cost.stone
  }

  const build = (buildingId: string) => {
    const building = buildings.find(b => b.id === buildingId)
    if (!building || building.built || !canAfford(building.cost)) return

    setResources({
      gold: resources.gold - building.cost.gold,
      wood: resources.wood - building.cost.wood,
      stone: resources.stone - building.cost.stone,
    })

    setBuildings(buildings.map(b => (b.id === buildingId ? { ...b, built: true } : b)))

    // Check win condition
    if (buildings.filter(b => b.id !== buildingId && b.built).length === buildings.length - 1) {
      setGameWon(true)
    }
  }

  const nextTurn = () => {
    // Collect income from built buildings
    const income = buildings
      .filter(b => b.built)
      .reduce(
        (acc, b) => ({
          gold: acc.gold + b.income.gold,
          wood: acc.wood + b.income.wood,
          stone: acc.stone + b.income.stone,
        }),
        { gold: 0, wood: 0, stone: 0 }
      )

    setResources({
      gold: resources.gold + income.gold,
      wood: resources.wood + income.wood,
      stone: resources.stone + income.stone,
    })
    setTurn(turn + 1)
  }

  const resetGame = () => {
    setResources({ gold: 100, wood: 50, stone: 30 })
    setBuildings(BUILDINGS.map(b => ({ ...b, built: false })))
    setTurn(1)
    setGameWon(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-blue-900 to-indigo-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <Link
            href="/hub"
            className="inline-block mb-4 text-indigo-300 hover:text-white transition-colors"
          >
            ← Back to Game Hub
          </Link>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-blue-500 bg-clip-text text-transparent">
            🎯 Strategic Storm
          </h1>
          <p className="text-xl text-indigo-200">Build your empire!</p>
        </div>

        {/* Resources */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">🪙</div>
            <div className="text-2xl font-bold text-white">{resources.gold}</div>
            <div className="text-indigo-200 text-sm">Gold</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">🪵</div>
            <div className="text-2xl font-bold text-white">{resources.wood}</div>
            <div className="text-indigo-200 text-sm">Wood</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">🪨</div>
            <div className="text-2xl font-bold text-white">{resources.stone}</div>
            <div className="text-indigo-200 text-sm">Stone</div>
          </div>
        </div>

        {/* Turn Counter */}
        <div className="text-center mb-6">
          <div className="inline-block bg-white/10 backdrop-blur-lg rounded-xl px-6 py-3">
            <span className="text-indigo-200">Turn: </span>
            <span className="text-2xl font-bold text-white">{turn}</span>
          </div>
        </div>

        {/* Buildings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {buildings.map(building => (
            <motion.div
              key={building.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white/10 backdrop-blur-lg rounded-xl p-6 border-2 ${
                building.built
                  ? 'border-green-500'
                  : canAfford(building.cost)
                  ? 'border-indigo-400 hover:border-indigo-300'
                  : 'border-neutral-700 opacity-50'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-white">{building.name}</h3>
                {building.built && (
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-bold">
                    ✓ Built
                  </span>
                )}
              </div>

              <div className="mb-4">
                <p className="text-indigo-200 text-sm mb-2">Cost:</p>
                <div className="flex gap-4 text-sm">
                  {building.cost.gold > 0 && (
                    <span className={resources.gold >= building.cost.gold ? 'text-white' : 'text-red-400'}>
                      🪙 {building.cost.gold}
                    </span>
                  )}
                  {building.cost.wood > 0 && (
                    <span className={resources.wood >= building.cost.wood ? 'text-white' : 'text-red-400'}>
                      🪵 {building.cost.wood}
                    </span>
                  )}
                  {building.cost.stone > 0 && (
                    <span className={resources.stone >= building.cost.stone ? 'text-white' : 'text-red-400'}>
                      🪨 {building.cost.stone}
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-indigo-200 text-sm mb-2">Income per turn:</p>
                <div className="flex gap-4 text-sm">
                  {building.income.gold > 0 && <span className="text-white">🪙 +{building.income.gold}</span>}
                  {building.income.wood > 0 && <span className="text-white">🪵 +{building.income.wood}</span>}
                  {building.income.stone > 0 && <span className="text-white">🪨 +{building.income.stone}</span>}
                </div>
              </div>

              <button
                onClick={() => build(building.id)}
                disabled={building.built || !canAfford(building.cost)}
                className={`w-full py-3 rounded-lg font-bold transition-all ${
                  building.built
                    ? 'bg-green-500/50 text-green-200 cursor-not-allowed'
                    : canAfford(building.cost)
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    : 'bg-neutral-700 text-neutral-400 cursor-not-allowed'
                }`}
              >
                {building.built ? 'Built' : canAfford(building.cost) ? 'Build' : 'Cannot Afford'}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={nextTurn}
            disabled={gameWon}
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:opacity-50 text-white rounded-xl font-bold transition-colors"
          >
            ➡️ Next Turn
          </button>
          <button
            onClick={resetGame}
            className="px-8 py-4 bg-white/20 hover:bg-white/30 text-white rounded-xl font-bold transition-colors"
          >
            🔄 Reset
          </button>
          <Link
            href="/hub"
            className="px-8 py-4 bg-white/20 hover:bg-white/30 text-white rounded-xl font-bold transition-colors"
          >
            ← Hub
          </Link>
        </div>

        {/* Win Modal */}
        {gameWon && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            onClick={resetGame}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl p-8 text-center max-w-md mx-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-8xl mb-4">🏆</div>
              <h2 className="text-4xl font-bold text-white mb-4">Victory!</h2>
              <p className="text-indigo-100 mb-6">You built all buildings in {turn} turns!</p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={resetGame}
                  className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-100 transition-colors"
                >
                  Play Again
                </button>
                <Link
                  href="/hub"
                  className="px-6 py-3 bg-white/20 text-white rounded-xl font-bold hover:bg-white/30 transition-colors"
                >
                  Back to Hub
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

