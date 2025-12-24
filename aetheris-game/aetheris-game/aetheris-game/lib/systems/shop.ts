// Shop and inventory systems

import { Item } from '@/lib/types/game'

export interface ShopItem {
  id: string
  name: string
  description: string
  price: number
  category: 'consumable' | 'equipment' | 'key_item' | 'upgrade'
  icon: string
  stock: number // -1 = infinite
  requirements?: {
    minLevel?: number
    storyFlags?: string[]
    relationship?: { [npc: string]: number }
  }
  effect?: ItemEffect
}

export interface ItemEffect {
  hp?: number
  resolve?: number
  alignment?: Partial<{ rock: number; paper: number; scissors: number }>
  statBoost?: {
    maxHP?: number
    maxResolve?: number
    damage?: number
  }
}

export interface Shop {
  id: string
  name: string
  npcOwner: string
  location: string
  inventory: ShopItem[]
  buyPriceMultiplier: number
  sellPriceMultiplier: number
}

export interface InventoryItem {
  id: string
  item: Item
  quantity: number
  equipped?: boolean
}

export interface Inventory {
  items: InventoryItem[]
  maxSlots: number
  gold: number
}

// Shop operations
export function getShopInventory(shopId: string, playerState: any): ShopItem[] {
  // Would load from constants and filter by requirements
  return []
}

export function buyItem(shopId: string, itemId: string, playerState: any): boolean {
  // Check if player can afford
  // Check if item is available
  // Deduct gold
  // Add to inventory
  return false
}

export function sellItem(itemId: string, playerState: any): number {
  // Calculate sell price
  // Remove from inventory
  // Add gold
  return 0
}

export function canAfford(price: number, playerGold: number): boolean {
  return playerGold >= price
}

// Inventory operations
export function addItem(inventory: Inventory, itemId: string, quantity: number): boolean {
  if (inventory.items.length >= inventory.maxSlots) return false

  const existingItem = inventory.items.find(i => i.item.id === itemId)
  if (existingItem) {
    existingItem.quantity += quantity
  } else {
    // Would create item from constants
    // inventory.items.push({ id: itemId, item: itemData, quantity })
  }

  return true
}

export function removeItem(inventory: Inventory, itemId: string, quantity: number): boolean {
  const item = inventory.items.find(i => i.item.id === itemId)
  if (!item || item.quantity < quantity) return false

  item.quantity -= quantity
  if (item.quantity <= 0) {
    const index = inventory.items.indexOf(item)
    inventory.items.splice(index, 1)
  }

  return true
}

export function useItem(inventory: Inventory, itemId: string, playerState: any): void {
  const item = inventory.items.find(i => i.item.id === itemId)
  if (!item || item.quantity <= 0) return

  // Apply item effects
  // Remove one from quantity
  removeItem(inventory, itemId, 1)
}

export function getItemCount(inventory: Inventory, itemId: string): number {
  const item = inventory.items.find(i => i.item.id === itemId)
  return item?.quantity || 0
}

