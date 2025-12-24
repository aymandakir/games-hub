import { useEffect } from 'react'
import { useGameStore } from '@/lib/store/gameStore'
import { showNotification } from '@/components/ui/NotificationSystem'

/**
 * Global keyboard shortcuts for the game
 */
export function useKeyboardShortcuts() {
  const { 
    setScreen, 
    ui, 
    quickSave, 
    generateRandomEncounter,
    triggerRandomEvent,
  } = useGameStore()

  useEffect(() => {
    const handleKeyPress = async (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      // Escape key - go back or close modals
      if (e.key === 'Escape') {
        if (ui.activeModal) {
          useGameStore.setState({
            ui: { ...ui, activeModal: null },
          })
        } else if (ui.currentScreen !== 'exploration' && ui.currentScreen !== 'title') {
          setScreen('exploration')
        }
        return
      }

      // Save shortcut (Ctrl+S or Cmd+S)
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        try {
          await quickSave()
          showNotification('Game saved!', 'success')
        } catch (error) {
          showNotification('Failed to save game', 'error')
        }
        return
      }

      // Quick shortcuts based on current screen
      switch (ui.currentScreen) {
        case 'exploration':
          // I - Open inventory
          if (e.key === 'i' || e.key === 'I') {
            e.preventDefault()
            setScreen('inventory')
          }
          // S - Open shop
          if (e.key === 's' || e.key === 'S') {
            if (!e.ctrlKey && !e.metaKey) {
              e.preventDefault()
              setScreen('shop')
            }
          }
          // E - Random encounter
          if (e.key === 'e' || e.key === 'E') {
            e.preventDefault()
            generateRandomEncounter()
          }
          // R - Random event
          if (e.key === 'r' || e.key === 'R') {
            e.preventDefault()
            triggerRandomEvent()
          }
          break

        case 'combat':
          // Number keys for moves (1=Rock, 2=Paper, 3=Scissors)
          if (e.key === '1') {
            e.preventDefault()
            const { makeMove } = useGameStore.getState()
            makeMove('rock')
          }
          if (e.key === '2') {
            e.preventDefault()
            const { makeMove } = useGameStore.getState()
            makeMove('paper')
          }
          if (e.key === '3') {
            e.preventDefault()
            const { makeMove } = useGameStore.getState()
            makeMove('scissors')
          }
          // U - Use Symbol Break
          if (e.key === 'u' || e.key === 'U') {
            e.preventDefault()
            const { useSymbolBreak } = useGameStore.getState()
            useSymbolBreak()
          }
          break
      }

      // M - Meta-game panel toggle (if we add that feature)
      // Q - Quest tracker toggle (if we add that feature)
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [ui, setScreen, quickSave, generateRandomEncounter, triggerRandomEvent])
}

