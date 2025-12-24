'use client'

import { useState } from 'react'
import { useGameStore } from '@/lib/store/gameStore'
import { getAudioManager } from '@/lib/systems/audio'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'

interface ShopViewProps {
  shopId: string
  onClose: () => void
}

// Mock shop data - would come from constants
const mockShop = {
  id: 'crosspoint_shop',
  name: 'Crosspoint Trading Post',
  npcOwner: 'Merchant',
  inventory: [
    {
      id: 'hp_potion',
      name: 'HP Potion',
      description: 'Restores 50 HP',
      price: 50,
      category: 'consumable',
      stock: -1,
    },
    {
      id: 'resolve_crystal',
      name: 'Resolve Crystal',
      description: 'Restores 30 Resolve',
      price: 40,
      category: 'consumable',
      stock: -1,
    },
  ],
}

export default function ShopView({ shopId: _shopId, onClose }: ShopViewProps) {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy')
  const player = useGameStore(state => state.player)
  const gold = 500 // Mock gold - would come from inventory
  const inventory = player.inventory || []

  const audio = getAudioManager()

  const handleBuy = async (item: typeof mockShop.inventory[0]) => {
    if (gold >= item.price) {
      audio.playSFX('item_get')
      // Would call buyItem function
      alert(`Purchased ${item.name}!`)
    } else {
      audio.playSFX('button_click', 0.5)
      alert('Not enough gold!')
    }
  }

  const handleSell = async (item: any) => {
    audio.playSFX('item_get')
    // Would call sellItem function
    alert(`Sold ${item.name}`)
  }

  return (
    <Modal isOpen={true} onClose={onClose} title={mockShop.name}>
      <div className="space-y-6">
        {/* Gold Display */}
        <div className="text-center">
          <p className="text-sm text-neutral-text/60 mb-1">Your Gold</p>
          <p className="text-3xl font-bold text-rock-highlight">{gold}</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-neutral-border">
          <button
            onClick={() => setActiveTab('buy')}
            className={`flex-1 py-3 font-semibold transition-colors ${
              activeTab === 'buy'
                ? 'border-b-2 border-paper-accent text-paper-accent'
                : 'text-neutral-text/60 hover:text-neutral-text'
            }`}
          >
            Buy
          </button>
          <button
            onClick={() => setActiveTab('sell')}
            className={`flex-1 py-3 font-semibold transition-colors ${
              activeTab === 'sell'
                ? 'border-b-2 border-scissors-accent text-scissors-accent'
                : 'text-neutral-text/60 hover:text-neutral-text'
            }`}
          >
            Sell
          </button>
        </div>

        {/* Content */}
        <div className="max-h-96 overflow-y-auto">
          {activeTab === 'buy' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockShop.inventory.map(item => (
                <Card key={item.id} variant="neutral" className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 bg-neutral-bg rounded flex-shrink-0 flex items-center justify-center border border-neutral-border">
                      <span className="text-2xl">📦</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold">{item.name}</h3>
                      <p className="text-xs text-neutral-text/60">{item.category}</p>
                    </div>
                  </div>
                  <p className="text-sm text-neutral-text/80 mb-3">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-rock-highlight font-bold">{item.price} G</span>
                    <Button
                      onClick={() => handleBuy(item)}
                      disabled={gold < item.price || item.stock === 0}
                      variant="primary"
                      size="sm"
                    >
                      Buy
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {inventory.length > 0 ? (
                inventory.map((item: any) => (
                  <Card key={item.id} variant="neutral" className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 bg-neutral-bg rounded flex-shrink-0 flex items-center justify-center border border-neutral-border">
                        <span className="text-2xl">📦</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold">{item.name}</h3>
                        <p className="text-xs text-neutral-text/60">x{item.quantity || 1}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-rock-highlight font-bold">
                        {Math.floor((item.value || 10) * 0.5)} G
                      </span>
                      <Button onClick={() => handleSell(item)} variant="secondary" size="sm">
                        Sell
                      </Button>
                    </div>
                  </Card>
                ))
              ) : (
                <p className="text-neutral-text/60 text-center py-8">No items to sell</p>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}

