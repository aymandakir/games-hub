'use client'

import { useState } from 'react'
import Modal from './Modal'
import { getAudioManager } from '@/lib/systems/audio'
import { useGameStore } from '@/lib/store/gameStore'

interface SettingsMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function SettingsMenu({ isOpen, onClose }: SettingsMenuProps) {
  const [masterVolume, setMasterVolume] = useState(1.0)
  const [musicVolume, setMusicVolume] = useState(0.7)
  const [sfxVolume, setSfxVolume] = useState(0.8)
  const [musicEnabled, setMusicEnabled] = useState(true)
  const [sfxEnabled, setSfxEnabled] = useState(true)

  const audioManager = getAudioManager()

  const handleMasterVolumeChange = (value: number) => {
    setMasterVolume(value)
    audioManager.setMasterVolume(value)
  }

  const handleMusicVolumeChange = (value: number) => {
    setMusicVolume(value)
    audioManager.setMusicVolume(value)
  }

  const handleSFXVolumeChange = (value: number) => {
    setSfxVolume(value)
    audioManager.setSFXVolume(value)
  }

  const testSFX = () => {
    audioManager.playSFX('button_click')
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings">
      <div className="space-y-6">
        {/* Audio Settings */}
        <div>
          <h3 className="text-xl font-bold mb-4">Audio</h3>

          {/* Master Volume */}
          <div className="mb-4">
            <label className="block mb-2">Master Volume</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={masterVolume}
              onChange={e => handleMasterVolumeChange(parseFloat(e.target.value))}
              className="w-full"
            />
            <span className="text-sm text-neutral-text/60">{Math.round(masterVolume * 100)}%</span>
          </div>

          {/* Music Volume */}
          <div className="mb-4">
            <label className="block mb-2">Music Volume</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={musicVolume}
              onChange={e => handleMusicVolumeChange(parseFloat(e.target.value))}
              className="w-full"
              disabled={!musicEnabled}
            />
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm text-neutral-text/60">{Math.round(musicVolume * 100)}%</span>
              <button
                onClick={() => setMusicEnabled(!musicEnabled)}
                className="text-sm text-neutral-text/60 hover:text-neutral-text"
              >
                {musicEnabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>

          {/* SFX Volume */}
          <div className="mb-4">
            <label className="block mb-2">Sound Effects Volume</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={sfxVolume}
              onChange={e => handleSFXVolumeChange(parseFloat(e.target.value))}
              className="w-full"
              disabled={!sfxEnabled}
            />
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm text-neutral-text/60">{Math.round(sfxVolume * 100)}%</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setSfxEnabled(!sfxEnabled)}
                  className="text-sm text-neutral-text/60 hover:text-neutral-text"
                >
                  {sfxEnabled ? 'Enabled' : 'Disabled'}
                </button>
                <button
                  onClick={testSFX}
                  className="text-sm px-3 py-1 bg-rock-accent rounded hover:bg-rock-secondary"
                >
                  Test
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Game Settings */}
        <div>
          <h3 className="text-xl font-bold mb-4">Game</h3>
          {/* Add more game settings here */}
        </div>
      </div>
    </Modal>
  )
}

