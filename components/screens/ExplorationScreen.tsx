'use client'

import { useState, useEffect } from 'react'
import { useGameStore } from '@/lib/store/gameStore'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

interface Location {
  id: string
  name: string
  x: number
  y: number
  icon: string
  description: string
}

const locations: Location[] = [
  { id: 'crosspoint', name: 'Crosspoint Village', x: 50, y: 50, icon: '🏘️', description: 'The neutral hub where all factions meet' },
  { id: 'rock', name: 'Rock Dominion', x: 20, y: 30, icon: '🗿', description: 'Mountain strongholds and stone fortresses' },
  { id: 'paper', name: 'Paper Dominion', x: 80, y: 30, icon: '📜', description: 'Floating libraries and wind plains' },
  { id: 'scissors', name: 'Scissor Dominion', x: 50, y: 80, icon: '✂️', description: 'Blade forests and metal markets' },
]

export default function ExplorationScreen() {
  const { player, startBattle } = useGameStore()
  const [currentLocation, setCurrentLocation] = useState('crosspoint')
  const [characterPosition, setCharacterPosition] = useState({ x: 50, y: 50 })
  const [isMoving, setIsMoving] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)

  const enemies = [
    { name: 'Rock Guardian', hp: 80, maxHP: 80, type: 'rock' as const, icon: '🗿' },
    { name: 'Paper Scholar', hp: 60, maxHP: 60, type: 'paper' as const, icon: '📜' },
    { name: 'Scissor Blade', hp: 70, maxHP: 70, type: 'scissors' as const, icon: '✂️' },
  ]

  const handleLocationClick = (location: Location) => {
    if (isMoving) return
    
    setIsMoving(true)
    setSelectedLocation(location)
    
    // Animate character movement
    const startX = characterPosition.x
    const startY = characterPosition.y
    const endX = location.x
    const endY = location.y
    
    const duration = 1000 // 1 second
    const startTime = Date.now()
    
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function
      const ease = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 2) / 2
      
      setCharacterPosition({
        x: startX + (endX - startX) * ease,
        y: startY + (endY - startY) * ease,
      })
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setIsMoving(false)
        setCurrentLocation(location.id)
        setSelectedLocation(null)
      }
    }
    
    requestAnimationFrame(animate)
  }

  const currentLoc = locations.find(l => l.id === currentLocation) || locations[0]

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-gray-900 via-gray-800 to-black">
      {/* Player HUD */}
      <Card className="max-w-6xl mx-auto p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-4xl animate-bounce">
              {player.character === 'kael' ? '📘' : '⚔️'}
            </div>
            <div>
              <h3 className="text-2xl font-bold">
                {player.character === 'kael' ? 'Kael' : 'Lyra'}
              </h3>
              <p className="text-gray-400">{currentLoc.name}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400 mb-1">HP</p>
            <div className="flex items-center gap-3">
              <div className="w-48 bg-gray-700 rounded-full h-4">
                <div
                  className="bg-green-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${(player.hp / player.maxHP) * 100}%` }}
                />
              </div>
              <span className="text-xl font-bold">
                {player.hp}/{player.maxHP}
              </span>
            </div>
          </div>
        </div>
      </Card>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* World Map */}
        <div className="lg:col-span-2">
          <Card className="p-6 relative overflow-hidden" style={{ minHeight: '500px' }}>
            <h3 className="text-2xl font-bold mb-4">World Map</h3>
            
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 1px, transparent 1px)',
                backgroundSize: '30px 30px',
              }} />
            </div>
            
            {/* Map container */}
            <div className="relative w-full h-full" style={{ minHeight: '400px' }}>
              {/* Locations */}
              {locations.map(location => (
                <button
                  key={location.id}
                  onClick={() => handleLocationClick(location)}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                    currentLocation === location.id
                      ? 'scale-125 z-20'
                      : 'hover:scale-110 z-10'
                  } ${isMoving ? 'pointer-events-none' : 'cursor-pointer'}`}
                  style={{
                    left: `${location.x}%`,
                    top: `${location.y}%`,
                  }}
                  disabled={isMoving}
                >
                  <div className={`text-6xl transition-all ${
                    currentLocation === location.id
                      ? 'animate-pulse'
                      : 'hover:animate-bounce'
                  }`}>
                    {location.icon}
                  </div>
                  <div className="text-xs text-center mt-1 font-semibold bg-black/50 px-2 py-1 rounded">
                    {location.name}
                  </div>
                </button>
              ))}
              
              {/* Character */}
              <div
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-30 transition-all duration-100"
                style={{
                  left: `${characterPosition.x}%`,
                  top: `${characterPosition.y}%`,
                }}
              >
                <div className={`text-5xl ${isMoving ? 'animate-bounce' : ''}`}>
                  {player.character === 'kael' ? '👤' : '👩'}
                </div>
                {isMoving && (
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-blue-400 animate-pulse">
                    Moving...
                  </div>
                )}
              </div>
              
              {/* Connection lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                {locations.map((loc, i) => {
                  if (i === 0) return null
                  return (
                    <line
                      key={`line-${i}`}
                      x1={`${locations[0].x}%`}
                      y1={`${locations[0].y}%`}
                      x2={`${loc.x}%`}
                      y2={`${loc.y}%`}
                      stroke="rgba(59, 130, 246, 0.5)"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                    />
                  )
                })}
              </svg>
            </div>
          </Card>
        </div>

        {/* Actions Panel */}
        <div className="space-y-4">
          {/* Location Info */}
          <Card className="p-6">
            <h4 className="text-xl font-bold mb-3">Current Location</h4>
            <div className="text-center mb-4">
              <div className="text-6xl mb-2">{currentLoc.icon}</div>
              <h5 className="text-lg font-semibold">{currentLoc.name}</h5>
            </div>
            <p className="text-sm text-gray-300">{currentLoc.description}</p>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h4 className="text-xl font-bold mb-4">Quick Actions</h4>
            <div className="space-y-3">
              {enemies.map((enemy, i) => (
                <Button
                  key={i}
                  onClick={() => startBattle(enemy)}
                  variant="primary"
                  className="w-full p-4 hover:scale-105 transform transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{enemy.icon}</span>
                    <div className="text-left">
                      <p className="font-bold">Battle {enemy.name}</p>
                      <p className="text-xs text-gray-300">HP: {enemy.hp}</p>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
