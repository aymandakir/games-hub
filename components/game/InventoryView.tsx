'use client'

import { useGameStore } from '@/lib/store/gameStore'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export default function InventoryView() {
  const { player, setScreen } = useGameStore()

  const handleBack = () => {
    setScreen('exploration')
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-4xl mx-auto">
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold">🎒 Inventory</h2>
            <Button onClick={handleBack} variant="secondary">
              Back
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          {player.inventory.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-6xl mb-4">📦</p>
              <p className="text-xl text-gray-400">Your inventory is empty</p>
              <p className="text-sm text-gray-500 mt-2">
                Explore locations and defeat enemies to find items!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {player.inventory.map((item, index) => (
                <Card key={item.id || index} className="p-4 hover:scale-105 transform transition-all">
                  <div className="text-center">
                    <div className="text-4xl mb-2">{item.icon || '📦'}</div>
                    <h4 className="font-bold mb-1">{item.name}</h4>
                    <p className="text-xs text-gray-400 mb-2">{item.description}</p>
                    {item.type === 'consumable' && item.effect && (
                      <div className="text-xs text-green-400">
                        +{item.effect.hp || 0} HP
                        {item.effect.resolve && ` +${item.effect.resolve} Resolve`}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

