'use client'

import { useGameStore } from '@/lib/store/gameStore'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { generateItem } from '@/lib/systems/random-generation'
import { useState } from 'react'

export default function ShopView() {
  const { player, setScreen } = useGameStore()
  const [shopItems] = useState(() => {
    // Generate random shop items
    return [
      generateItem('consumable', player.level),
      generateItem('consumable', player.level),
      generateItem('equipment', player.level),
      generateItem('consumable', player.level + 1),
    ]
  })

  const handleBack = () => {
    setScreen('exploration')
  }

  const handleBuy = (item: any) => {
    // In full implementation, would check gold and add to inventory
    // For now, just add to inventory
    useGameStore.setState({
      player: {
        ...player,
        inventory: [...player.inventory, item],
      },
    })
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-4xl mx-auto">
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold mb-2">🛒 Shop</h2>
              <p className="text-gray-400">Gold: {0} (Gold system coming soon!)</p>
            </div>
            <Button onClick={handleBack} variant="secondary">
              Back
            </Button>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shopItems.map((item, index) => (
            <Card key={item.id || index} className="p-6">
              <div className="flex items-start gap-4">
                <div className="text-6xl">{item.icon || '📦'}</div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg mb-2">{item.name}</h4>
                  <p className="text-sm text-gray-400 mb-4">{item.description}</p>
                  {item.type === 'consumable' && item.effect && (
                    <div className="text-sm text-green-400 mb-4">
                      +{item.effect.hp || 0} HP
                      {item.effect.resolve && ` +${item.effect.resolve} Resolve`}
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-yellow-400">Free</span>
                    <Button
                      onClick={() => handleBuy(item)}
                      variant="primary"
                      className="px-6"
                    >
                      Buy
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
