/**
 * Hook for tracking game plays
 * Automatically tracks when games are started/ended
 */

import { useEffect, useRef } from 'react'
import { analytics } from '@/lib/utils/analytics'

export function useGameTracking(gameId: string) {
  const startTimeRef = useRef<number>(0)
  const isTrackingRef = useRef(false)

  const startTracking = () => {
    if (isTrackingRef.current) return
    startTimeRef.current = Date.now()
    isTrackingRef.current = true
  }

  const stopTracking = () => {
    if (!isTrackingRef.current) return
    const playTime = Math.floor((Date.now() - startTimeRef.current) / 1000)
    analytics.trackGamePlay(gameId, playTime)
    isTrackingRef.current = false
  }

  useEffect(() => {
    startTracking()
    return () => {
      stopTracking()
    }
  }, [gameId])

  return { startTracking, stopTracking }
}

