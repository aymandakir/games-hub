'use client'

import { useState, useEffect } from 'react'
import { useGameStore } from '@/lib/store/gameStore'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default function CombatScreen() {
  const { player, currentEnemy, battleLog, playerMove } = useGameStore()
  const [playerAnimation, setPlayerAnimation] = useState<'idle' | 'attack' | 'hit'>('idle')
  const [enemyAnimation, setEnemyAnimation] = useState<'idle' | 'attack' | 'hit'>('idle')
  const [showResult, setShowResult] = useState(false)
  const [lastResult, setLastResult] = useState<string>('')

  if (!currentEnemy) return null

  const moves = [
    { id: 'rock', name: 'Rock', icon: '🗿', color: 'gray' },
    { id: 'paper', name: 'Paper', icon: '📄', color: 'blue' },
    { id: 'scissors', name: 'Scissors', icon: '✂️', color: 'purple' },
  ]

  const handleMove = async (move: 'rock' | 'paper' | 'scissors') => {
    if (combat.status !== 'waiting') return
    
    // Player attack animation
    setPlayerAnimation('attack')
    setEnemyAnimation('idle')
    setShowResult(false)
    
    setTimeout(async () => {
      await makeMove(move)
      
      // Enemy hit animation
      setEnemyAnimation('hit')
      
      // Show result after a delay
      setTimeout(() => {
        const latestRound = combat.roundHistory[combat.roundHistory.length - 1]
        if (latestRound) {
          if (latestRound.winner === 'player') {
            setLastResult(`You win! ${latestRound.playerMove} beats ${latestRound.enemyMove}`)
          } else if (latestRound.winner === 'enemy') {
            setLastResult(`Enemy wins! ${latestRound.enemyMove} beats ${latestRound.playerMove}`)
          } else {
            setLastResult(`Tie! Both used ${latestRound.playerMove}`)
          }
        }
        setShowResult(true)
        
        // Reset animations
        setTimeout(() => {
          setPlayerAnimation('idle')
          setEnemyAnimation('idle')
          setShowResult(false)
        }, 1500)
      }, 500)
    }, 300)
  }

  return (
    <div className="min-h-screen p-8 flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-5xl w-full">
        {/* Enemy */}
        <Card className="p-8 mb-6 text-center relative overflow-hidden">
          <div className={`text-9xl mb-4 transition-all duration-300 ${
            enemyAnimation === 'attack' ? 'scale-125 rotate-12' :
            enemyAnimation === 'hit' ? 'scale-90 -rotate-12 animate-pulse' :
            'scale-100'
          }`}>
            {currentEnemy.type === 'rock' ? '🗿' : currentEnemy.type === 'paper' ? '📜' : '✂️'}
          </div>
          <h3 className="text-3xl font-bold mb-4">{enemy.name}</h3>
          <div className="max-w-md mx-auto">
            <div className="w-full bg-gray-700 rounded-full h-4 mb-2 relative overflow-hidden">
              <div
                className="bg-red-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${(combat.enemyHP / combat.enemyMaxHP) * 100}%` }}
              />
              {enemyAnimation === 'hit' && (
                <div className="absolute inset-0 bg-white animate-ping opacity-50" />
              )}
            </div>
            <p className="text-lg">
              {combat.enemyHP} / {combat.enemyMaxHP} HP
            </p>
            {enemy.isBoss && (
              <p className="text-sm text-red-400 font-bold mt-2">⚠️ BOSS</p>
            )}
          </div>
        </Card>

        {/* Result Display */}
        {showResult && (
          <Card className="p-6 mb-6 text-center animate-pulse bg-blue-600/20 border-blue-500">
            <p className="text-2xl font-bold text-blue-400">{lastResult}</p>
          </Card>
        )}

        {/* Battle Log */}
        <Card className="p-6 mb-6">
          <h4 className="font-bold text-xl mb-3">Battle Log</h4>
          <div className="space-y-2 min-h-[120px]">
            {battleLog.length === 0 ? (
              <p className="text-gray-500 text-sm">Choose your move...</p>
            ) : (
              battleLog.map((log, i) => (
                <p
                  key={i}
                  className={`text-sm transition-all ${
                    i === battleLog.length - 1
                      ? 'text-yellow-400 font-bold animate-pulse'
                      : 'text-gray-300'
                  }`}
                >
                  {log}
                </p>
              ))
            )}
          </div>
        </Card>

        {/* Player */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`text-5xl transition-all duration-300 ${
                playerAnimation === 'attack' ? 'scale-125 -rotate-12' :
                playerAnimation === 'hit' ? 'scale-90 rotate-12 animate-pulse' :
                'scale-100'
              }`}>
                {player.character === 'kael' ? '📘' : '⚔️'}
              </div>
              <div>
                <h3 className="text-2xl font-bold">
                  {player.character === 'kael' ? 'Kael' : 'Lyra'}
                </h3>
                <p className="text-gray-400">
                  HP: {combat.playerHP} / {combat.playerMaxHP}
                </p>
                <p className="text-gray-400 text-sm">
                  Resolve: {combat.playerResolve} / {combat.maxResolve}
                </p>
              </div>
            </div>
            <div className="w-64 bg-gray-700 rounded-full h-4 relative overflow-hidden">
              <div
                className="bg-green-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${(combat.playerHP / combat.playerMaxHP) * 100}%` }}
              />
              {playerAnimation === 'hit' && (
                <div className="absolute inset-0 bg-white animate-ping opacity-50" />
              )}
            </div>
          </div>
        </Card>

        {/* Symbol Break Button */}
        {combat.canUseSymbolBreak && (
          <Card className="p-4 mb-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500">
            <Button
              onClick={() => useSymbolBreak()}
              variant="primary"
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-xl font-bold"
            >
              ⚡ SYMBOL BREAK ⚡
            </Button>
          </Card>
        )}

        {/* Move Selection */}
        <div className="grid grid-cols-3 gap-4">
          {moves.map(move => (
            <Button
              key={move.id}
              onClick={() => handleMove(move.id as 'rock' | 'paper' | 'scissors')}
              variant="primary"
              disabled={combat.status !== 'waiting'}
              className="py-12 hover:scale-110 transform transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="relative">
                <div className={`text-6xl mb-3 transition-transform ${
                  playerAnimation === 'attack' ? 'animate-spin' : ''
                }`}>
                  {move.icon}
                </div>
                <div className="text-2xl font-bold">{move.name}</div>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
