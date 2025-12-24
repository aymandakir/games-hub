'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'

interface Game {
  id: string
  title: string
  description: string
  thumbnail: string
  category: string
  players: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  playTime: string
  featured: boolean
  color: string
  icon: string
  route: string
}

const GAMES: Game[] = [
  {
    id: 'aetheris',
    title: 'Aetheris: The Symbol War',
    description: 'Epic RPG where Rock, Paper, Scissors define magic and combat',
    thumbnail: '/games/aetheris-thumb.jpg',
    category: 'RPG',
    players: 'Single Player',
    difficulty: 'Medium',
    playTime: '2-4 hours',
    featured: true,
    color: 'from-blue-500 to-purple-600',
    icon: '⚔️',
    route: '/game',
  },
  {
    id: 'hippo-pumpkin',
    title: 'Hippo Pumpkin Feast',
    description: 'Guide a hungry hippo to eat all Halloween pumpkins!',
    thumbnail: '/games/hippo-thumb.jpg',
    category: 'Arcade',
    players: 'Single Player',
    difficulty: 'Easy',
    playTime: '5-10 minutes',
    featured: true,
    color: 'from-orange-500 to-red-600',
    icon: '🦛',
    route: '/hippo-game',
  },
  {
    id: 'memory-match',
    title: 'Memory Master',
    description: 'Test your memory with this classic card matching game',
    thumbnail: '/games/memory-thumb.jpg',
    category: 'Puzzle',
    players: 'Single Player',
    difficulty: 'Easy',
    playTime: '3-5 minutes',
    featured: false,
    color: 'from-green-500 to-teal-600',
    icon: '🧠',
    route: '/memory-game',
  },
  {
    id: 'typing-race',
    title: 'Type Racer',
    description: 'Race against time to improve your typing speed',
    thumbnail: '/games/typing-thumb.jpg',
    category: 'Educational',
    players: 'Single/Multi',
    difficulty: 'Medium',
    playTime: '1-2 minutes',
    featured: false,
    color: 'from-yellow-500 to-orange-600',
    icon: '⌨️',
    route: '/typing-game',
  },
  {
    id: 'word-search',
    title: 'Word Hunter',
    description: 'Find hidden words in a grid of letters',
    thumbnail: '/games/word-thumb.jpg',
    category: 'Puzzle',
    players: 'Single Player',
    difficulty: 'Easy',
    playTime: '5-10 minutes',
    featured: false,
    color: 'from-pink-500 to-rose-600',
    icon: '🔤',
    route: '/word-game',
  },
  {
    id: 'snake-modern',
    title: 'Snake Redux',
    description: 'Classic snake game with modern power-ups and graphics',
    thumbnail: '/games/snake-thumb.jpg',
    category: 'Arcade',
    players: 'Single Player',
    difficulty: 'Medium',
    playTime: '5-15 minutes',
    featured: true,
    color: 'from-emerald-500 to-cyan-600',
    icon: '🐍',
    route: '/snake-game',
  },
]

export default function HubPage() {
  const [filter, setFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const categories = ['all', 'RPG', 'Arcade', 'Puzzle', 'Educational']

  const filteredGames = GAMES.filter(game => {
    const matchesCategory = filter === 'all' || game.category === filter
    const matchesSearch =
      game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const featuredGames = GAMES.filter(g => g.featured)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Hero Section */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative container mx-auto px-4 py-20">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-7xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Game Hub
            </h1>
            <p className="text-2xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Discover amazing browser games. Play instantly, no downloads required.
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto mb-8">
              <input
                type="text"
                placeholder="Search games..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 bg-gray-800/50 border border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-8 text-center">
              <div>
                <p className="text-4xl font-bold text-blue-400">{GAMES.length}</p>
                <p className="text-gray-400">Games</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-purple-400">∞</p>
                <p className="text-gray-400">Free</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-pink-400">100%</p>
                <p className="text-gray-400">Browser</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Featured Games Carousel */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold mb-8 text-white">🔥 Featured Games</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredGames.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={game.route}>
                <div className="group relative bg-gray-800 rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer">
                  {/* Thumbnail */}
                  <div
                    className={`h-48 bg-gradient-to-br ${game.color} flex items-center justify-center text-8xl`}
                  >
                    {game.icon}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
                        {game.title}
                      </h3>
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-semibold">
                        {game.category}
                      </span>
                    </div>
                    <p className="text-gray-400 mb-4">{game.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>⏱️ {game.playTime}</span>
                      <span>📊 {game.difficulty}</span>
                    </div>
                  </div>

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="px-8 py-4 bg-white text-black rounded-full font-bold text-xl transform scale-90 group-hover:scale-100 transition-transform">
                      Play Now →
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Category Filter */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex gap-4 justify-center flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                filter === cat
                  ? 'bg-blue-500 text-white scale-110'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {cat === 'all' ? 'All Games' : cat}
            </button>
          ))}
        </div>
      </section>

      {/* All Games Grid */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold mb-8 text-white">🎮 All Games</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredGames.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={game.route}>
                <div className="group bg-gray-800 rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 cursor-pointer">
                  <div
                    className={`h-32 bg-gradient-to-br ${game.color} flex items-center justify-center text-6xl`}
                  >
                    {game.icon}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                      {game.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{game.category}</span>
                      <span>{game.difficulty}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <div className="flex justify-center gap-6 mb-4">
            <Link href="/profile" className="text-blue-400 hover:text-blue-300 transition-colors">
              👤 Profile
            </Link>
          </div>
          <p className="text-xl mb-4">Game Hub - Play Free Browser Games</p>
          <p className="text-sm">
            All games playable directly in your browser. No downloads, no registration required.
          </p>
        </div>
      </footer>
    </div>
  )
}
