'use client'

import { useState, useEffect } from 'react'
import { useGameStore } from '@/lib/store/gameStore'
import { SaveMetadata } from '@/lib/systems/save-system'
import Card from './Card'
import Button from './Button'
import { formatPlaytime, formatDate } from '@/lib/utils/game-helpers'

interface LoadMenuProps {
  onClose: () => void
}

export default function LoadMenu({ onClose }: LoadMenuProps) {
  const [saves, setSaves] = useState<SaveMetadata[]>([])
  const loadGame = useGameStore(state => state.loadGame)
  const deleteSave = useGameStore(state => state.deleteSave)
  const getAllSaves = useGameStore(state => state.getAllSaves)

  useEffect(() => {
    loadSaves()
  }, [])

  const loadSaves = async () => {
    const allSaves = await getAllSaves()
    setSaves(allSaves)
  }

  const handleLoad = async (slotId: string) => {
    await loadGame(slotId)
    onClose()
  }

  const handleDelete = async (slotId: string) => {
    if (confirm('Are you sure you want to delete this save?')) {
      await deleteSave(slotId)
      await loadSaves()
    }
  }

  const saveSlots = [
    { id: 'save-1', label: 'Save Slot 1' },
    { id: 'save-2', label: 'Save Slot 2' },
    { id: 'save-3', label: 'Save Slot 3' },
    { id: 'quicksave', label: 'Quick Save' },
    { id: 'autosave', label: 'Auto Save' },
  ]

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl p-8 max-h-[90vh] overflow-y-auto">
        <h2 className="text-3xl font-bold mb-6">Load Game</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {saveSlots.map(slot => {
            const saveData = saves.find(s => s.slotId === slot.id)

            return (
              <Card
                key={slot.id}
                variant="neutral"
                className={`p-4 transition-colors ${
                  saveData ? 'hover:border-paper-accent cursor-pointer' : 'opacity-50'
                }`}
                onClick={() => saveData && handleLoad(slot.id)}
              >
                <div className="flex items-center gap-4">
                  {/* Thumbnail */}
                  <div className="w-24 h-24 bg-neutral-bg rounded flex-shrink-0 flex items-center justify-center border-2 border-neutral-border">
                    {saveData?.screenshot ? (
                      <img src={saveData.screenshot} alt="Save preview" className="w-full h-full object-cover rounded" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-text/40 text-xs">
                        Empty
                      </div>
                    )}
                  </div>

                  {/* Save info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold mb-1 truncate">{slot.label}</h3>
                    {saveData ? (
                      <>
                        <p className="text-sm text-neutral-text/60 truncate">
                          {saveData.characterName} (Lv. {saveData.level})
                        </p>
                        <p className="text-sm text-neutral-text/60 truncate">{saveData.location}</p>
                        <p className="text-xs text-neutral-text/40">
                          {formatPlaytime(saveData.playtime)} • {formatDate(saveData.timestamp)}
                        </p>
                      </>
                    ) : (
                      <p className="text-sm text-neutral-text/40">Empty slot</p>
                    )}
                  </div>

                  {/* Action buttons */}
                  {saveData && (
                    <div className="flex flex-col gap-2">
                      <Button onClick={() => handleLoad(slot.id)} variant="primary" size="sm">
                        Load
                      </Button>
                      <Button onClick={() => handleDelete(slot.id)} variant="secondary" size="sm">
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            )
          })}
        </div>

        <div className="flex justify-end gap-2">
          <Button onClick={onClose} variant="secondary">
            Close
          </Button>
        </div>
      </Card>
    </div>
  )
}

