/**
 * Procedural Content Panel
 * UI component to showcase and interact with procedurally generated content
 */

'use client'

import { useState, useEffect } from 'react'
import { Enemy, Location, Quest, Item } from '@/lib/types/game'
import {
  generateRandomEnemy,
  generateRandomLocation,
  generateRandomItem,
  generateProceduralDungeon,
} from '@/lib/systems/procedural-generation'
import {
  fetchLibraryDataBatch,
  generateLoreText,
  getGameInspiredContent,
} from '@/lib/systems/digital-libraries'
import {
  initializeProceduralRegion,
  generateRandomEncounter,
  generateRandomDungeon,
  getDailyContent,
} from '@/lib/systems/game-integration'

export default function ProceduralContentPanel() {
  const [region, setRegion] = useState<'rock' | 'paper' | 'scissors' | 'neutral'>('neutral')
  const [level, setLevel] = useState(1)
  const [generatedEnemies, setGeneratedEnemies] = useState<Enemy[]>([])
  const [generatedLocations, setGeneratedLocations] = useState<Location[]>([])
  const [generatedQuests, setGeneratedQuests] = useState<Quest[]>([])
  const [generatedItems, setGeneratedItems] = useState<Item[]>([])
  const [libraryData, setLibraryData] = useState<{
    fact: string | null
    quote: { text: string; author: string } | null
    wikipedia: { title: string; extract: string; url: string } | null
  } | null>(null)
  const [lore, setLore] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const generateRegionContent = async () => {
    setIsLoading(true)
    try {
      const content = await initializeProceduralRegion(region, level)
      setGeneratedEnemies(content.enemies)
      setGeneratedLocations(content.locations)
      setGeneratedQuests(content.quests)
      setGeneratedItems(content.items)
      setLore(content.lore)
    } catch (error) {
      console.error('Failed to generate region content:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchLibraryData = async () => {
    setIsLoading(true)
    try {
      const data = await fetchLibraryDataBatch()
      setLibraryData(data)
    } catch (error) {
      console.error('Failed to fetch library data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateSingleEnemy = () => {
    const enemy = generateRandomEncounter(region as 'rock' | 'paper' | 'scissors', level)
    setGeneratedEnemies([enemy])
  }

  const generateDungeon = () => {
    const dungeon = generateRandomDungeon(region as 'rock' | 'paper' | 'scissors', 3)
    setGeneratedLocations(dungeon)
  }

  const generateDaily = () => {
    const daily = getDailyContent()
    setGeneratedQuests(daily.quests)
    if (daily.specialEnemy) setGeneratedEnemies([daily.specialEnemy])
    if (daily.specialItem) setGeneratedItems([daily.specialItem])
  }

  useEffect(() => {
    fetchLibraryData()
  }, [])

  return (
    <div className="p-6 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white rounded-lg shadow-2xl">
      <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
        🎲 Procedural Content Generator
      </h2>

      {/* Controls */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-4 flex-wrap">
          <select
            value={region}
            onChange={e => setRegion(e.target.value as typeof region)}
            className="px-4 py-2 bg-gray-800 rounded-lg border border-gray-700"
          >
            <option value="rock">Rock Dominion</option>
            <option value="paper">Paper Dominion</option>
            <option value="scissors">Scissor Dominion</option>
            <option value="neutral">Neutral</option>
          </select>

          <input
            type="number"
            value={level}
            onChange={e => setLevel(parseInt(e.target.value) || 1)}
            min="1"
            max="20"
            className="px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 w-20"
            placeholder="Level"
          />

          <button
            onClick={generateRegionContent}
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Generating...' : 'Generate Region'}
          </button>

          <button
            onClick={generateSingleEnemy}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            Random Enemy
          </button>

          <button
            onClick={generateDungeon}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
          >
            Generate Dungeon
          </button>

          <button
            onClick={generateDaily}
            className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors"
          >
            Daily Content
          </button>

          <button
            onClick={fetchLibraryData}
            disabled={isLoading}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors disabled:opacity-50"
          >
            Fetch Library Data
          </button>
        </div>
      </div>

      {/* Library Data Display */}
      {libraryData && (
        <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <h3 className="text-xl font-bold mb-3">📚 Library Inspiration</h3>
          {libraryData.fact && (
            <div className="mb-2">
              <strong>Random Fact:</strong> {libraryData.fact}
            </div>
          )}
          {libraryData.quote && (
            <div className="mb-2">
              <strong>Quote:</strong> "{libraryData.quote.text}" - {libraryData.quote.author}
            </div>
          )}
          {libraryData.wikipedia && (
            <div>
              <strong>Wikipedia:</strong> {libraryData.wikipedia.title}
              <p className="text-sm text-gray-400 mt-1">{libraryData.wikipedia.extract.substring(0, 200)}...</p>
            </div>
          )}
        </div>
      )}

      {/* Lore Display */}
      {lore && (
        <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <h3 className="text-xl font-bold mb-2">📖 Generated Lore</h3>
          <p className="text-gray-300">{lore}</p>
        </div>
      )}

      {/* Generated Content Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Enemies */}
        {generatedEnemies.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h3 className="text-xl font-bold mb-3">⚔️ Enemies ({generatedEnemies.length})</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {generatedEnemies.map(enemy => (
                <div key={enemy.id} className="p-3 bg-gray-700 rounded">
                  <div className="font-bold">{enemy.name}</div>
                  <div className="text-sm text-gray-400">
                    HP: {enemy.maxHP} | Type: {enemy.type} | {enemy.isBoss ? '👑 BOSS' : ''}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{enemy.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Locations */}
        {generatedLocations.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h3 className="text-xl font-bold mb-3">🗺️ Locations ({generatedLocations.length})</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {generatedLocations.map(location => (
                <div key={location.id} className="p-3 bg-gray-700 rounded">
                  <div className="font-bold">{location.name}</div>
                  <div className="text-sm text-gray-400">{location.region}</div>
                  <div className="text-xs text-gray-500 mt-1">{location.description}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    Points: {location.interactivePoints.length} | Encounter: {(location.encounterChance || 0) * 100}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quests */}
        {generatedQuests.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h3 className="text-xl font-bold mb-3">📜 Quests ({generatedQuests.length})</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {generatedQuests.map(quest => (
                <div key={quest.id} className="p-3 bg-gray-700 rounded">
                  <div className="font-bold">{quest.name}</div>
                  <div className="text-sm text-gray-400">
                    {quest.region} | Level {quest.act} | XP: {quest.rewards.experience} | Gold: {quest.rewards.gold}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{quest.description}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    Objectives: {quest.objectives.length}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Items */}
        {generatedItems.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h3 className="text-xl font-bold mb-3">💎 Items ({generatedItems.length})</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {generatedItems.map(item => (
                <div key={item.id} className="p-3 bg-gray-700 rounded">
                  <div className="font-bold">{item.name}</div>
                  <div className="text-sm text-gray-400">{item.type}</div>
                  <div className="text-xs text-gray-500 mt-1">{item.description}</div>
                  {item.effect && (
                    <div className="text-xs text-gray-400 mt-1">
                      {item.effect.hp && `HP: +${item.effect.hp} `}
                      {item.effect.resolve && `Resolve: +${item.effect.resolve} `}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Game-Inspired Content */}
      <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
        <h3 className="text-xl font-bold mb-3">🎮 Game-Inspired Content</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
          <div>
            <strong>Name:</strong> {getGameInspiredContent('name')}
          </div>
          <div>
            <strong>Quest:</strong> {getGameInspiredContent('quest')}
          </div>
          <div>
            <strong>Location:</strong> {getGameInspiredContent('location')}
          </div>
          <div>
            <strong>Enemy:</strong> {getGameInspiredContent('enemy')}
          </div>
          <div>
            <strong>Item:</strong> {getGameInspiredContent('item')}
          </div>
        </div>
      </div>
    </div>
  )
}



