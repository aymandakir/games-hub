import { useEffect } from 'react'
import { useGameStore } from '@/lib/store/gameStore'

export function useKeyboardShortcuts() {
  const quickSave = useGameStore(state => state.quickSave)
  const setScreen = useGameStore(state => state.setScreen)
  const ui = useGameStore(state => state.ui)

  useEffect(() => {
    const handler = async (e: KeyboardEvent) => {
      // Ignore if typing in input
      if ((e.target as HTMLElement).tagName === 'INPUT') return

      // Quick save: S
      if (e.key === 's' && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
        e.preventDefault()
        await quickSave()
      }

      // Open menu: Escape or M
      if (e.key === 'Escape' || (e.key === 'm' && !e.ctrlKey && !e.metaKey)) {
        // Toggle menu (would need menu state)
      }

      // Inventory: I
      if (e.key === 'i' && !e.ctrlKey && !e.metaKey) {
        // Open inventory (would need inventory modal state)
      }

      // Quest log: Q
      if (e.key === 'q' && !e.ctrlKey && !e.metaKey) {
        // Open quest log (would need quest modal state)
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [quickSave, setScreen, ui])
}

