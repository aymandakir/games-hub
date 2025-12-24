'use client'

import { useState } from 'react'
import { getCharacterSprite, getEnemySprite } from '@/lib/utils/sprite-generator'

interface SpriteProps {
  id: string
  type: 'character' | 'enemy' | 'npc'
  size?: { width: number; height: number }
  className?: string
  faction?: 'rock' | 'paper' | 'scissors'
}

export function Sprite({ id, type, size = { width: 100, height: 120 }, className, faction }: SpriteProps) {
  const [imageError, setImageError] = useState(false)

  // Try to load real asset first
  const realAssetPath = `/assets/sprites/${type}/${id}.png`

  // Fallback to procedural sprite
  const getFallbackSprite = () => {
    if (type === 'character') {
      return getCharacterSprite(id as 'kael' | 'lyra')
    } else if (type === 'enemy' && faction) {
      return getEnemySprite(id, faction)
    }
    // Default fallback
    const defaultSvg = '<svg width="100" height="100"><rect width="100" height="100" fill="#666"/></svg>'
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(defaultSvg)))}`
  }

  const fallbackSprite = getFallbackSprite()

  return (
    <div className={`sprite ${className || ''}`} style={{ width: size.width, height: size.height }}>
      {!imageError ? (
        <img
          src={realAssetPath}
          alt={id}
          onError={() => setImageError(true)}
          className="w-full h-full object-contain"
        />
      ) : (
        <img
          src={fallbackSprite}
          alt={id}
          className="w-full h-full object-contain"
        />
      )}
    </div>
  )
}

