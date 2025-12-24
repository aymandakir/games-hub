'use client'

import { useState } from 'react'
import { useGameStore } from '@/lib/store/gameStore'
import { getAudioManager } from '@/lib/systems/audio'
import Modal from './Modal'
import Button from './Button'
import SaveMenu from './SaveMenu'
import LoadMenu from './LoadMenu'
import SettingsMenu from './SettingsMenu'
import InventoryView from '../game/InventoryView'

type MenuTab = 'main' | 'save' | 'load' | 'settings' | 'inventory'

export default function MainMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<MenuTab>('main')
  const setScreen = useGameStore(state => state.setScreen)
  const resetGame = useGameStore(state => state.resetGame)
  const audio = getAudioManager()

  const handleResume = () => {
    audio.playSFX('menu_close')
    onClose()
  }

  const handleNewGame = () => {
    if (confirm('Start a new game? This will reset your progress.')) {
      resetGame()
      setScreen('character-select')
      onClose()
    }
  }

  const handleQuit = () => {
    if (confirm('Quit to title screen?')) {
      resetGame()
      setScreen('title')
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <>
      <Modal isOpen={isOpen && activeTab === 'main'} onClose={onClose} title="Menu">
        <div className="space-y-4">
          <Button onClick={handleResume} variant="primary" className="w-full" size="lg">
            Resume
          </Button>
          <Button onClick={() => setActiveTab('save')} variant="secondary" className="w-full" size="lg">
            Save Game
          </Button>
          <Button onClick={() => setActiveTab('load')} variant="secondary" className="w-full" size="lg">
            Load Game
          </Button>
          <Button onClick={() => setActiveTab('inventory')} variant="secondary" className="w-full" size="lg">
            Inventory
          </Button>
          <Button onClick={() => setActiveTab('settings')} variant="secondary" className="w-full" size="lg">
            Settings
          </Button>
          <div className="border-t border-neutral-border pt-4 mt-4">
            <Button onClick={handleNewGame} variant="secondary" className="w-full">
              New Game
            </Button>
            <Button onClick={handleQuit} variant="secondary" className="w-full mt-2">
              Quit to Title
            </Button>
          </div>
        </div>
      </Modal>

      {activeTab === 'save' && <SaveMenu onClose={() => setActiveTab('main')} />}
      {activeTab === 'load' && <LoadMenu onClose={() => setActiveTab('main')} />}
      {activeTab === 'settings' && <SettingsMenu isOpen={true} onClose={() => setActiveTab('main')} />}
      {activeTab === 'inventory' && <InventoryView onClose={() => setActiveTab('main')} />}
    </>
  )
}

