'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface Tower {
  id: number
  x: number
  y: number
  type: 'basic' | 'rapid' | 'sniper'
  damage: number
  range: number
  cooldown: number
  lastShot: number
}

interface Enemy {
  id: number
  x: number
  y: number
  hp: number
  maxHp: number
  speed: number
  pathIndex: number
  reward: number
}

interface Projectile {
  id: number
  x: number
  y: number
  targetX: number
  targetY: number
  damage: number
}

const PATH = [
  { x: 0, y: 200 },
  { x: 200, y: 200 },
  { x: 200, y: 100 },
  { x: 400, y: 100 },
  { x: 400, y: 300 },
  { x: 600, y: 300 },
  { x: 600, y: 100 },
  { x: 800, y: 100 },
]

export default function TowerDefenseGame() {
  const [towers, setTowers] = useState<Tower[]>([])
  const [enemies, setEnemies] = useState<Enemy[]>([])
  const [projectiles, setProjectiles] = useState<Projectile[]>([])
  const [gold, setGold] = useState(100)
  const [lives, setLives] = useState(20)
  const [wave, setWave] = useState(1)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [selectedTower, setSelectedTower] = useState<'basic' | 'rapid' | 'sniper' | null>(null)
  const [placingTower, setPlacingTower] = useState(false)

  const towerTypes = {
    basic: { cost: 20, damage: 10, range: 100, cooldown: 1000 },
    rapid: { cost: 30, damage: 5, range: 80, cooldown: 500 },
    sniper: { cost: 50, damage: 30, range: 150, cooldown: 2000 },
  }

  const spawnEnemy = useCallback(() => {
    const newEnemy: Enemy = {
      id: Date.now(),
      x: PATH[0].x,
      y: PATH[0].y,
      hp: 50 + wave * 10,
      maxHp: 50 + wave * 10,
      speed: 1 + wave * 0.1,
      pathIndex: 0,
      reward: 10 + wave * 2,
    }
    setEnemies(prev => [...prev, newEnemy])
  }, [wave])

  const placeTower = useCallback((x: number, y: number) => {
    if (!selectedTower || gold < towerTypes[selectedTower].cost) return

    const newTower: Tower = {
      id: Date.now(),
      x,
      y,
      type: selectedTower,
      ...towerTypes[selectedTower],
      lastShot: 0,
    }
    setTowers(prev => [...prev, newTower])
    setGold(prev => prev - towerTypes[selectedTower].cost)
    setSelectedTower(null)
    setPlacingTower(false)
  }, [selectedTower, gold, towerTypes])

  useEffect(() => {
    if (gameOver) return

    const interval = setInterval(() => {
      if (enemies.length < wave * 2) {
        spawnEnemy()
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [enemies.length, wave, spawnEnemy, gameOver])

  useEffect(() => {
    if (gameOver) return

    const gameLoop = setInterval(() => {
      // Update enemies
      setEnemies(prev => prev.map(enemy => {
        if (enemy.pathIndex >= PATH.length - 1) {
          setLives(l => {
            const newLives = l - 1
            if (newLives <= 0) setGameOver(true)
            return newLives
          })
          return null as any
        }

        const nextPoint = PATH[enemy.pathIndex + 1]
        const dx = nextPoint.x - enemy.x
        const dy = nextPoint.y - enemy.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < enemy.speed) {
          return { ...enemy, pathIndex: enemy.pathIndex + 1, x: nextPoint.x, y: nextPoint.y }
        }

        return {
          ...enemy,
          x: enemy.x + (dx / dist) * enemy.speed,
          y: enemy.y + (dy / dist) * enemy.speed,
        }
      }).filter(Boolean))

      // Tower shooting
      setTowers(prev => prev.map(tower => {
        const now = Date.now()
        if (now - tower.lastShot < tower.cooldown) return tower

        const target = enemies.find(e => {
          const dist = Math.sqrt((e.x - tower.x) ** 2 + (e.y - tower.y) ** 2)
          return dist <= tower.range
        })

        if (target) {
          const newProjectile: Projectile = {
            id: Date.now(),
            x: tower.x,
            y: tower.y,
            targetX: target.x,
            targetY: target.y,
            damage: tower.damage,
          }
          setProjectiles(prev => [...prev, newProjectile])

          setEnemies(prev => prev.map(e => {
            if (e.id === target.id) {
              const newHp = e.hp - tower.damage
              if (newHp <= 0) {
                setGold(g => g + e.reward)
                setScore(s => s + e.reward)
                return null as any
              }
              return { ...e, hp: newHp }
            }
            return e
          }).filter(Boolean))

          return { ...tower, lastShot: now }
        }
        return tower
      }))

      // Update projectiles
      setProjectiles(prev => prev.map(proj => {
        const dx = proj.targetX - proj.x
        const dy = proj.targetY - proj.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const speed = 5

        if (dist < speed) {
          return null as any
        }

        return {
          ...proj,
          x: proj.x + (dx / dist) * speed,
          y: proj.y + (dy / dist) * speed,
        }
      }).filter(Boolean))

      // Check wave completion
      if (enemies.length === 0 && wave > 0) {
        setWave(w => w + 1)
        setGold(g => g + 50)
      }
    }, 16)

    return () => clearInterval(gameLoop)
  }, [enemies, towers, wave, gameOver])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <Link href="/home" className="text-blue-400 hover:text-blue-300">← Back to Home</Link>
          <h1 className="text-3xl font-bold">🏰 Tower Defense</h1>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-sm text-gray-400">Gold</div>
            <div className="text-2xl font-bold text-yellow-400">{gold}</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-sm text-gray-400">Lives</div>
            <div className="text-2xl font-bold text-red-400">{lives}</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-sm text-gray-400">Wave</div>
            <div className="text-2xl font-bold text-blue-400">{wave}</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-sm text-gray-400">Score</div>
            <div className="text-2xl font-bold text-green-400">{score}</div>
          </div>
        </div>

        {gameOver ? (
          <div className="text-center py-20">
            <h2 className="text-4xl font-bold mb-4">Game Over!</h2>
            <p className="text-xl mb-8">Final Score: {score}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Play Again
            </button>
          </div>
        ) : (
          <>
            <div className="bg-white/5 rounded-lg p-4 mb-4">
              <div className="text-sm mb-2">Select Tower:</div>
              <div className="flex gap-2">
                {Object.entries(towerTypes).map(([type, stats]) => (
                  <button
                    key={type}
                    onClick={() => {
                      if (gold >= stats.cost) {
                        setSelectedTower(type as any)
                        setPlacingTower(true)
                      }
                    }}
                    disabled={gold < stats.cost}
                    className={`px-4 py-2 rounded-lg ${
                      selectedTower === type
                        ? 'bg-blue-600'
                        : gold >= stats.cost
                        ? 'bg-white/10 hover:bg-white/20'
                        : 'bg-white/5 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    {type} ({stats.cost}g)
                  </button>
                ))}
              </div>
            </div>

            <div
              className="relative bg-gray-800 rounded-lg border-2 border-gray-700"
              style={{ width: '100%', height: '600px' }}
              onClick={(e) => {
                if (placingTower) {
                  const rect = e.currentTarget.getBoundingClientRect()
                  const x = e.clientX - rect.left
                  const y = e.clientY - rect.top
                  placeTower(x, y)
                }
              }}
            >
              {/* Path */}
              <svg className="absolute inset-0 w-full h-full">
                {PATH.slice(0, -1).map((point, i) => {
                  const next = PATH[i + 1]
                  return (
                    <line
                      key={i}
                      x1={point.x}
                      y1={point.y}
                      x2={next.x}
                      y2={next.y}
                      stroke="#4a5568"
                      strokeWidth="20"
                    />
                  )
                })}
              </svg>

              {/* Towers */}
              {towers.map(tower => (
                <div
                  key={tower.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{ left: tower.x, top: tower.y }}
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full border-2 border-blue-400" />
                  <div
                    className="absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/2 border-2 border-blue-400/50 rounded-full"
                    style={{
                      width: tower.range * 2,
                      height: tower.range * 2,
                    }}
                  />
                </div>
              ))}

              {/* Enemies */}
              {enemies.map(enemy => (
                <div
                  key={enemy.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{ left: enemy.x, top: enemy.y }}
                >
                  <div className="w-6 h-6 bg-red-600 rounded-full" />
                  <div className="absolute -top-2 left-0 w-12 h-1 bg-gray-700 rounded">
                    <div
                      className="h-full bg-red-500 rounded"
                      style={{ width: `${(enemy.hp / enemy.maxHp) * 100}%` }}
                    />
                  </div>
                </div>
              ))}

              {/* Projectiles */}
              {projectiles.map(proj => (
                <div
                  key={proj.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{ left: proj.x, top: proj.y }}
                >
                  <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}



