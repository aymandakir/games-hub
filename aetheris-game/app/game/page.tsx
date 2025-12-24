'use client'

import { useGameStore } from '@/lib/store/gameStore'
import TitleScreen from '@/app/page'
import CharacterSelect from '@/components/screens/CharacterSelect'
import ExplorationScreen from '@/components/screens/ExplorationScreen'
import CombatScreen from '@/components/screens/CombatScreen'

export default function GamePage() {
  const currentScreen = useGameStore(state => state.currentScreen)

  return (
    <div className="min-h-screen bg-black text-white">
      {currentScreen === 'title' && <TitleScreen />}
      {currentScreen === 'character_select' && <CharacterSelect />}
      {currentScreen === 'exploration' && <ExplorationScreen />}
      {currentScreen === 'combat' && <CombatScreen />}
    </div>
  )
}

