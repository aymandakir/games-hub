'use client'

import { useGameStore } from '@/lib/store/gameStore'
import TitleScreen from '@/components/screens/TitleScreen'
import CharacterSelect from '@/components/screens/CharacterSelect'
import ExplorationScreen from '@/components/screens/ExplorationScreen'
import CombatScreen from '@/components/screens/CombatScreen'
import VictoryScreen from '@/components/screens/VictoryScreen'
import DefeatScreen from '@/components/screens/DefeatScreen'
import InventoryView from '@/components/game/InventoryView'
import ShopView from '@/components/game/ShopView'
import NotificationSystem from '@/components/ui/NotificationSystem'
import { ErrorBoundary } from '@/lib/utils/error-boundary'
import { useKeyboardShortcuts } from '@/lib/hooks/useKeyboardShortcuts'
import HelpPanel from '@/components/ui/HelpPanel'
import StatusBar from '@/components/ui/StatusBar'
import { useEffect } from 'react'

export default function GamePage() {
  const currentScreen = useGameStore(state => state.ui.currentScreen)
  useKeyboardShortcuts() // Enable keyboard shortcuts

  // Make notification system available globally
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('@/components/ui/NotificationSystem').then(module => {
        (window as any).showNotification = module.showNotification
      })
    }
  }, [])

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-black text-white relative pb-16">
        <NotificationSystem />
        <HelpPanel />
        {currentScreen !== 'title' && <StatusBar />}
        {currentScreen === 'title' && <TitleScreen />}
        {currentScreen === 'character-select' && <CharacterSelect />}
        {currentScreen === 'exploration' && <ExplorationScreen />}
        {currentScreen === 'combat' && <CombatScreen />}
        {currentScreen === 'victory' && <VictoryScreen />}
        {currentScreen === 'defeat' && <DefeatScreen />}
        {currentScreen === 'inventory' && <InventoryView />}
        {currentScreen === 'shop' && <ShopView />}
      </div>
    </ErrorBoundary>
  )
}

