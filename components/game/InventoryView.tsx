'use client'

import { useState } from 'react'
import { useGameStore } from '@/lib/store/gameStore'
import { getAudioManager } from '@/lib/systems/audio'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'

interface InventoryViewProps {
  onClose: () => void
}

export default function InventoryView({ onClose }: InventoryViewProps) {
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const player = useGameStore(state => state.player)
  const inventory = player.inventory || []

  const audio = getAudioManager()

  const handleUse = () => {
    if (selectedItem) {
      audio.playSFX('item_get')
      // Would call useItem function
      alert(`Used ${selectedItem.name}`)
    }
  }

  const handleDrop = () => {
    if (selectedItem && confirm(`Drop ${selectedItem.name}?`)) {
      audio.playSFX('button_click')
      // Would call dropItem function
      setSelectedItem(null)
    }
  }

  return (
    <Modal isOpen={true} onClose={onClose} title="Inventory">
      <div className="flex gap-6 h-[60vh]">
        {/* Left: Item grid */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-4 gap-3">
            {inventory.length > 0 ? (
              inventory.map((item: any) => (
                <Card
                  key={item.id}
                  variant="neutral"
                  className={`p-3 cursor-pointer transition-all ${
                    selectedItem?.id === item.id
                      ? 'border-paper-accent ring-2 ring-paper-accent'
                      : 'hover:border-neutral-text/30'
                  }`}
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="w-full aspect-square bg-neutral-bg rounded mb-2 flex items-center justify-center border border-neutral-border">
                    <span className="text-2xl">📦</span>
                  </div>
                  <p className="text-xs font-semibold truncate">{item.name || 'Item'}</p>
                  <p className="text-xs text-neutral-text/60">x{item.quantity || 1}</p>
                </Card>
              ))
            ) : (
              <div className="col-span-4 text-center text-neutral-text/60 py-8">
                Inventory is empty
              </div>
            )}
          </div>
        </div>

        {/* Right: Item details */}
        <div className="w-80 flex flex-col">
          {selectedItem ? (
            <>
              <div className="flex-1">
                <div className="w-full h-48 bg-neutral-bg rounded mb-4 flex items-center justify-center border border-neutral-border">
                  <span className="text-6xl">📦</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{selectedItem.name}</h3>
                <p className="text-sm text-neutral-text/60 mb-4">{selectedItem.category || 'Item'}</p>
                <p className="text-sm text-neutral-text/80 mb-4">{selectedItem.description || 'No description'}</p>
              </div>

              <div className="space-y-2">
                <Button onClick={handleUse} variant="primary" className="w-full">
                  Use
                </Button>
                {selectedItem.category !== 'key_item' && (
                  <Button onClick={handleDrop} variant="secondary" className="w-full">
                    Drop
                  </Button>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-neutral-text/60">
              Select an item
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}

