'use client'

import { useState, useEffect, useCallback } from 'react'
import { useGameStore } from '@/lib/store/gameStore'
import { getLocation } from '@/lib/constants/locations'
import { getAudioManager } from '@/lib/systems/audio'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import ProgressBar from '@/components/ui/ProgressBar'
import MainMenu from '@/components/ui/MainMenu'
import ShopView from './ShopView'
import DialogueManager from '@/components/dialogue/DialogueManager'

export default function ExplorationView() {
  const [showMenu, setShowMenu] = useState(false)
  const [showShop, setShowShop] = useState(false)
  const [showDialogue, setShowDialogue] = useState(false)
  const [currentDialogue, setCurrentDialogue] = useState<unknown>(null)

  const player = useGameStore(state => state.player)
  const travelToLocation = useGameStore(state => state.travelToLocation)
  const interactWithPoint = useGameStore(state => state.interactWithPoint)
  const startBattle = useGameStore(state => state.startBattle)

  const location = getLocation(player.currentLocation)
  
  // Play location music - hook at top level, condition inside
  useEffect(() => {
    if (location) {
      const audio = getAudioManager()
      const regionMusic: Record<string, string> = {
        rock: 'rock_dominion',
        paper: 'paper_dominion',
        scissors: 'scissor_dominion',
        neutral: 'crosspoint_theme',
      }
      audio.playMusic(regionMusic[location.region] || 'crosspoint_theme', true)
    }
  }, [location?.region])

  if (!location) return null

  const handleInteract = useCallback((pointId: string) => {
    if (!location) return
    const point = location.interactivePoints.find(p => p.id === pointId)
    if (!point) return

    const audio = getAudioManager()
    audio.playSFX('button_click')

    if (point.type === 'shop') {
      setShowShop(true)
    } else if (point.type === 'npc') {
      // Start dialogue
      setShowDialogue(true)
      // Would load dialogue node here
    } else if (point.type === 'training') {
      startBattle('brick')
    } else {
      interactWithPoint(pointId)
    }
  }, [location, interactWithPoint, startBattle, setShowShop, setShowDialogue])

  const regionColors = {
    rock: 'rock',
    paper: 'paper',
    scissors: 'scissors',
    neutral: 'neutral',
  } as const

  const buttonVariants = {
    rock: 'rock' as const,
    paper: 'paper' as const,
    scissors: 'scissors' as const,
    neutral: 'primary' as const,
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-bg to-rock-dark p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* HUD */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Player Portrait */}
          <Card variant={regionColors[location.region]}>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-neutral-bg/50 rounded-full flex items-center justify-center border-2 border-neutral-border">
                <span className="text-2xl">{player.character === 'kael' ? 'K' : 'L'}</span>
              </div>
              <div>
                <h3 className="font-bold">{player.character === 'kael' ? 'Kael' : 'Lyra'}</h3>
                <p className="text-sm text-neutral-text/60">Level {player.level}</p>
              </div>
            </div>
          </Card>

          {/* HP Bar */}
          <Card variant="neutral">
            <ProgressBar
              current={player.hp}
              max={player.maxHP}
              variant="rock"
              shape="mountain"
              label="HP"
            />
          </Card>

          {/* Resolve Bar */}
          <Card variant="neutral">
            <ProgressBar
              current={player.resolve}
              max={player.maxResolve}
              variant="paper"
              shape="scroll"
              label="Resolve"
            />
          </Card>
        </div>

        {/* Alignment Indicator */}
        <Card variant="neutral">
          <h3 className="text-lg font-bold mb-4">Alignment</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Rock</span>
                <span>{player.alignment.rock}%</span>
              </div>
              <ProgressBar
                current={player.alignment.rock}
                max={100}
                variant="rock"
                showNumbers={false}
              />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Paper</span>
                <span>{player.alignment.paper}%</span>
              </div>
              <ProgressBar
                current={player.alignment.paper}
                max={100}
                variant="paper"
                showNumbers={false}
              />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Scissors</span>
                <span>{player.alignment.scissors}%</span>
              </div>
              <ProgressBar
                current={player.alignment.scissors}
                max={100}
                variant="scissors"
                showNumbers={false}
              />
            </div>
          </div>
        </Card>

        {/* Location Info */}
        <Card variant={regionColors[location.region]}>
          <h2 className="text-3xl font-bold mb-4">{location.name}</h2>
          <p className="text-neutral-text/80 mb-6">{location.description}</p>

          {/* Interactive Points */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold">Available Actions</h3>
            {location.interactivePoints.map(point => (
              <Button
                key={point.id}
                onClick={() => handleInteract(point.id)}
                variant={buttonVariants[location.region]}
                className="w-full text-left justify-start"
              >
                {point.name} - {point.description}
              </Button>
            ))}
          </div>
        </Card>

        {/* Navigation */}
        {location.connections.length > 0 && (
          <Card variant="neutral">
            <h3 className="text-xl font-bold mb-4">Travel To</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {location.connections.map(locId => {
                const connectedLoc = getLocation(locId)
                if (!connectedLoc) return null
                return (
                  <Button
                    key={locId}
                    onClick={() => travelToLocation(locId)}
                    variant="secondary"
                    className="w-full"
                  >
                    {connectedLoc.name}
                  </Button>
                )
              })}
            </div>
          </Card>
        )}

        {/* Quick Battle (for testing) */}
        <Button onClick={() => startBattle('brick')} variant="primary" className="w-full">
          Start Tutorial Battle
        </Button>

        {/* Menu Button */}
        <Button
          onClick={() => setShowMenu(true)}
          variant="secondary"
          className="fixed bottom-4 right-4"
        >
          Menu (M)
        </Button>
      </div>

      {/* Modals */}
      <MainMenu isOpen={showMenu} onClose={() => setShowMenu(false)} />
      {showShop && <ShopView shopId="crosspoint_shop" onClose={() => setShowShop(false)} />}
      {showDialogue && currentDialogue && (
        <DialogueManager
          node={currentDialogue}
          onChoiceSelected={(choiceId, nextNodeId) => {
            // Handle dialogue choice
            setShowDialogue(false)
          }}
          onClose={() => setShowDialogue(false)}
        />
      )}
    </div>
  )
}

