import { useEffect } from 'react'
import { useGameStore } from '@/lib/store/gameStore'

export function useAutoSave(intervalMs: number = 5 * 60 * 1000) {
  const autoSaveEnabled = useGameStore(state => state.autoSaveEnabled)
  const quickSave = useGameStore(state => state.quickSave)

  useEffect(() => {
    if (!autoSaveEnabled) return

    const interval = setInterval(async () => {
      console.log('[Auto-Save] Saving game...')
      await quickSave()
    }, intervalMs)

    return () => clearInterval(interval)
  }, [autoSaveEnabled, intervalMs, quickSave])
}

