'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { analytics } from '@/lib/utils/analytics'
import { useLocalStorage } from '@/lib/hooks/useLocalStorage'
import GameStatsPanel from '@/components/ui/GameStatsPanel'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface Game {
  id: string
  title: string
  description: string
  category: string
  icon: string
  route: string
  featured?: boolean
  color: string
  difficulty: string
  playTime: string
  players: string
}

interface Feature {
  id: string
  title: string
  description: string
  icon: string
  route: string
  color: string
}

const GAMES: Game[] = [
  {
    id: 'aetheris',
    title: 'Aetheris: The Symbol War',
    description: 'Epic RPG where Rock, Paper, Scissors define magic and combat',
    category: 'RPG',
    icon: '⚔️',
    route: '/',
    featured: true,
    color: 'from-blue-500 to-purple-600',
    difficulty: 'Medium',
    playTime: '2-4 hours',
    players: 'Single Player',
  },
  {
    id: 'hippo-pumpkin',
    title: 'Hippo Pumpkin Feast',
    description: 'Guide a hungry hippo to eat all Halloween pumpkins!',
    category: 'Arcade',
    icon: '🦛',
    route: '/hippo-game',
    featured: true,
    color: 'from-orange-500 to-red-600',
    difficulty: 'Easy',
    playTime: '5-10 minutes',
    players: 'Single Player',
  },
  {
    id: 'memory-match',
    title: 'Memory Master',
    description: 'Test your memory with this classic card matching game',
    category: 'Puzzle',
    icon: '🧠',
    route: '/memory-game',
    featured: false,
    color: 'from-green-500 to-teal-600',
    difficulty: 'Easy',
    playTime: '3-5 minutes',
    players: 'Single Player',
  },
  {
    id: 'typing-race',
    title: 'Type Racer',
    description: 'Race against time to improve your typing speed',
    category: 'Educational',
    icon: '⌨️',
    route: '/typing-game',
    featured: false,
    color: 'from-yellow-500 to-orange-600',
    difficulty: 'Medium',
    playTime: '1-2 minutes',
    players: 'Single/Multi',
  },
  {
    id: 'word-search',
    title: 'Word Hunter',
    description: 'Find hidden words in a grid of letters',
    category: 'Puzzle',
    icon: '🔤',
    route: '/word-game',
    featured: false,
    color: 'from-pink-500 to-rose-600',
    difficulty: 'Easy',
    playTime: '5-10 minutes',
    players: 'Single Player',
  },
  {
    id: 'snake-modern',
    title: 'Snake Redux',
    description: 'Classic snake game with modern twists',
    category: 'Arcade',
    icon: '🐍',
    route: '/snake-game',
    featured: false,
    color: 'from-emerald-500 to-green-600',
    difficulty: 'Easy',
    playTime: '5-15 minutes',
    players: 'Single Player',
  },
  {
    id: 'tower-defense',
    title: 'Tower Defense',
    description: 'Build towers to defend against waves of enemies',
    category: 'Strategy',
    icon: '🏰',
    route: '/tower-defense',
    featured: false,
    color: 'from-indigo-500 to-blue-600',
    difficulty: 'Medium',
    playTime: '10-30 minutes',
    players: 'Single Player',
  },
  {
    id: 'match-three',
    title: 'Gem Match',
    description: 'Match three or more gems to clear the board',
    category: 'Puzzle',
    icon: '💎',
    route: '/match-three',
    featured: false,
    color: 'from-purple-500 to-pink-600',
    difficulty: 'Easy',
    playTime: '5-10 minutes',
    players: 'Single Player',
  },
  {
    id: '2048',
    title: '2048 Puzzle',
    description: 'Slide tiles to combine numbers and reach 2048',
    category: 'Puzzle',
    icon: '🔢',
    route: '/2048',
    featured: false,
    color: 'from-cyan-500 to-blue-600',
    difficulty: 'Medium',
    playTime: '5-15 minutes',
    players: 'Single Player',
  },
  {
    id: 'breakout',
    title: 'Breakout',
    description: 'Break all the bricks with your paddle and ball',
    category: 'Arcade',
    icon: '🎾',
    route: '/breakout',
    featured: false,
    color: 'from-red-500 to-orange-600',
    difficulty: 'Easy',
    playTime: '5-10 minutes',
    players: 'Single Player',
  },
]

const FEATURES: Feature[] = [
  {
    id: 'procedural',
    title: 'Procedural Content Generator',
    description: 'Generate unique game content using AI and digital libraries',
    icon: '🎲',
    route: '/procedural',
    color: 'from-purple-500 to-pink-600',
  },
  {
    id: 'random-games',
    title: 'Random Games',
    description: 'Play procedurally generated games on demand',
    icon: '🎮',
    route: '/random-games',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    id: 'endless-mode',
    title: 'Endless Arena',
    description: 'Infinite battles with scaling difficulty',
    icon: '♾️',
    route: '/procedural',
    color: 'from-green-500 to-emerald-600',
  },
]

const CATEGORIES = ['All', 'RPG', 'Arcade', 'Puzzle', 'Strategy', 'Educational']

export default function MasterHomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showSettings, setShowSettings] = useState(false)
  const [theme, setTheme] = useLocalStorage<'dark' | 'light' | 'auto'>('theme', 'dark')
  const [soundEnabled, setSoundEnabled] = useLocalStorage('sound-enabled', true)
  const [musicVolume, setMusicVolume] = useLocalStorage('music-volume', 50)
  const router = useRouter()

  useEffect(() => {
    analytics.trackFeatureUse('home_page_visit')
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const filteredGames = useMemo(() => {
    return GAMES.filter(game => {
      const matchesSearch = 
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  const featuredGames = useMemo(() => GAMES.filter(g => g.featured), [])
  const gamesByCategory = useMemo(() => {
    const grouped: Record<string, Game[]> = {}
    GAMES.forEach(game => {
      if (!grouped[game.category]) grouped[game.category] = []
      grouped[game.category].push(game)
    })
    return grouped
  }, [])

  const handleGameClick = (gameId: string) => {
    analytics.trackGameStart(gameId)
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20 animate-gradient" />
      
      {/* Header */}
      <header className="relative z-10 border-b border-white/10 backdrop-blur-sm bg-black/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                🎮 Game Hub
              </h1>
              <p className="text-gray-400 text-sm mt-1">Your Ultimate Gaming Platform</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                aria-label="Settings"
              >
                ⚙️
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            </div>
          </div>

          {/* Category Filter */}
          <div className="mt-4 flex flex-wrap gap-2">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Game Stats */}
        {!searchQuery && selectedCategory === 'All' && (
          <section className="mb-12">
            <GameStatsPanel />
          </section>
        )}

        {/* Featured Games */}
        {!searchQuery && selectedCategory === 'All' && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              ⭐ Featured Games
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredGames.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={game.route} onClick={() => handleGameClick(game.id)}>
                    <div className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${game.color} p-6 cursor-pointer transform transition-all hover:scale-105 hover:shadow-2xl`}>
                      <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform">
                        {game.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">{game.title}</h3>
                      <p className="text-white/80 text-sm mb-4">{game.description}</p>
                      <div className="flex items-center gap-4 text-xs text-white/60">
                        <span>{game.difficulty}</span>
                        <span>•</span>
                        <span>{game.playTime}</span>
                        <span>•</span>
                        <span>{game.players}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Special Features */}
        {!searchQuery && selectedCategory === 'All' && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              🚀 Special Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {FEATURES.map((feature, index) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={feature.route} onClick={() => analytics.trackFeatureUse(feature.id)}>
                    <div className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${feature.color} p-6 cursor-pointer transform transition-all hover:scale-105 hover:shadow-2xl border border-white/20`}>
                      <div className="text-5xl mb-4 transform group-hover:rotate-12 transition-transform">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                      <p className="text-white/80 text-sm">{feature.description}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Games by Category */}
        {!searchQuery && selectedCategory === 'All' ? (
          Object.entries(gamesByCategory).map(([category, games]) => (
            <section key={category} className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                {getCategoryIcon(category)} {category} Games
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {games.map((game, index) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link href={game.route} onClick={() => handleGameClick(game.id)}>
                      <div className="group relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-5 cursor-pointer transform transition-all hover:scale-105 hover:bg-white/10 hover:border-white/20">
                        <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform">
                          {game.icon}
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-1">{game.title}</h3>
                        <p className="text-gray-400 text-xs mb-3 line-clamp-2">{game.description}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{game.difficulty}</span>
                          <span>•</span>
                          <span>{game.playTime}</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </section>
          ))
        ) : (
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">
              {selectedCategory === 'All' ? 'All Games' : `${selectedCategory} Games`} 
              {searchQuery && ` - "${searchQuery}"`}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredGames.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={game.route}>
                    <div className="group relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-5 cursor-pointer transform transition-all hover:scale-105 hover:bg-white/10 hover:border-white/20">
                      <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform">
                        {game.icon}
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-1">{game.title}</h3>
                      <p className="text-gray-400 text-xs mb-3 line-clamp-2">{game.description}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{game.difficulty}</span>
                        <span>•</span>
                        <span>{game.playTime}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
            {filteredGames.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <p className="text-xl mb-2">No games found</p>
                <p className="text-sm">Try a different search or category</p>
              </div>
            )}
          </section>
        )}

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowSettings(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gray-900 rounded-2xl p-8 max-w-md w-full border border-white/10"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-white text-sm mb-2 block">Theme</label>
                    <select 
                      value={theme}
                      onChange={(e) => setTheme(e.target.value as 'dark' | 'light' | 'auto')}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    >
                      <option value="dark">Dark</option>
                      <option value="light">Light</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-white text-sm mb-2 block flex items-center justify-between">
                      <span>Sound Effects</span>
                      <input 
                        type="checkbox" 
                        checked={soundEnabled}
                        onChange={(e) => setSoundEnabled(e.target.checked)}
                        className="w-4 h-4"
                      />
                    </label>
                  </div>
                  <div>
                    <label className="text-white text-sm mb-2 block">
                      Music Volume: {musicVolume}%
                    </label>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={musicVolume}
                      onChange={(e) => setMusicVolume(Number(e.target.value))}
                      className="w-full" 
                    />
                  </div>
                  <div>
                    <label className="text-white text-sm mb-2 block flex items-center justify-between">
                      <span>Analytics</span>
                      <input 
                        type="checkbox" 
                        checked={analytics.isEnabled()}
                        onChange={(e) => analytics.setEnabled(e.target.checked)}
                        className="w-4 h-4"
                      />
                    </label>
                  </div>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity"
                  >
                    Save Settings
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
    </ErrorBoundary>
  )
}

function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    'RPG': '⚔️',
    'Arcade': '🎮',
    'Puzzle': '🧩',
    'Strategy': '♟️',
    'Educational': '📚',
  }
  return icons[category] || '🎯'
}

