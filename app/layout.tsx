'use client'

import { useEffect } from 'react'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import './globals.css'

// Note: Metadata export doesn't work with 'use client'
// For SEO, create a separate metadata file or use next/head
import { getAudioManager } from '@/lib/systems/audio'
import { getSaveSystem } from '@/lib/systems/save-system'
import ParticleCanvas from '@/components/effects/ParticleCanvas'
import { useAutoSave } from '@/lib/hooks/useAutoSave'
import { useKeyboardShortcuts } from '@/lib/hooks/useKeyboardShortcuts'
import QuestTracker from '@/components/ui/QuestTracker'
import AutoSaveIndicator from '@/components/ui/AutoSaveIndicator'
import { AchievementNotification } from '@/components/ui/AchievementNotification'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Initialize systems
  useEffect(() => {
    initializeSystems()
  }, [])

  // Auto-save every 5 minutes
  useAutoSave(5 * 60 * 1000)

  // Keyboard shortcuts
  useKeyboardShortcuts()

  async function initializeSystems() {
    if (typeof window === 'undefined') return

    console.log('[Init] Initializing game systems...')

    try {
      // Audio
      const audio = getAudioManager()
      await audio.preloadCriticalSounds()
      console.log('[Init] Audio system ready')

      // Save system
      const saveSystem = await getSaveSystem()
      await saveSystem.initialize()
      console.log('[Init] Save system ready')

      // Load settings
      const settings = await saveSystem.loadSettings()
      if (settings.audio) {
        audio.setMasterVolume(settings.audio.masterVolume || 1.0)
        audio.setMusicVolume(settings.audio.musicVolume || 0.7)
        audio.setSFXVolume(settings.audio.sfxVolume || 0.8)
      }

      console.log('[Init] All systems initialized')
    } catch (error) {
      console.error('[Init] Failed to initialize systems:', error)
    }
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        {children}

        {/* Global UI overlays */}
        <ParticleCanvas />
        <QuestTracker />
        <AutoSaveIndicator />
        <AchievementNotification />
      </body>
    </html>
  )
}

