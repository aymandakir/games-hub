'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ALL_GAMES, GAME_CATEGORIES, getGamesByCategory, searchGames, getFeaturedGames } from '@/lib/data/games'
import type { GameData } from '@/lib/data/games'

export default function HubPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filteredGames = useMemo(() => {
    let games = ALL_GAMES

    // Filter by category
    if (selectedCategory !== 'All') {
      games = getGamesByCategory(selectedCategory)
    }

    // Filter by search
    if (searchTerm) {
      games = searchGames(searchTerm)
      // Also filter by category if selected
      if (selectedCategory !== 'All') {
        games = games.filter(game => game.category === selectedCategory)
      }
    }

    return games
  }, [searchTerm, selectedCategory])

  const featuredGames = useMemo(() => getFeaturedGames(), [])

  const GameCard = ({ game }: { game: GameData }) => (
    <motion.a
      href={game.route}
      className={`game-card ${game.featured ? 'featured' : ''} ${game.status !== 'available' ? 'coming-soon' : ''}`}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {game.featured && (
        <span className="featured-badge">⭐ Featured</span>
      )}
      {game.status !== 'available' && (
        <span className="coming-soon-badge">Coming Soon</span>
      )}
      <span className="game-icon">{game.icon}</span>
      <h2 className="game-title">{game.title}</h2>
      <p className="game-description">{game.description}</p>
      <div className="game-meta">
        <span className="game-tag category">{game.category}</span>
        <span className="game-tag">{game.difficulty}</span>
        <span>•</span>
        <span>{game.players}</span>
        <span>•</span>
        <span>{game.playTime}</span>
        {game.status === 'available' && (
          <span className="game-status available">Available</span>
        )}
      </div>
      {game.tags.length > 0 && (
        <div className="game-tags">
          {game.tags.slice(0, 3).map(tag => (
            <span key={tag} className="game-tag-small">{tag}</span>
          ))}
        </div>
      )}
    </motion.a>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="header">
        <motion.h1
          className="logo"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          HUB GAMES
        </motion.h1>
        <p className="tagline">Discover. Play. Enjoy.</p>
      </header>

      {/* Controls Bar */}
      <div className="controls-bar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search games..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="clear-search"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        <div className="category-filter">
          {GAME_CATEGORIES.map((category) => (
            <button
              key={category}
              className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="view-toggle">
          <button
            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            aria-label="Grid view"
          >
            ⊞
          </button>
          <button
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            aria-label="List view"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="container">
        {/* Featured Games Section */}
        {featuredGames.length > 0 && searchTerm === '' && selectedCategory === 'All' && (
          <section className="section">
            <div className="section-header">
              <span className="section-icon">⭐</span>
              <h2 className="section-title">Featured Games</h2>
              <span className="section-count">{featuredGames.length} games</span>
            </div>
            <div className={`games-grid ${viewMode}`}>
              <AnimatePresence>
                {featuredGames.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </AnimatePresence>
            </div>
          </section>
        )}

        {/* All Games Section */}
        <section className="section">
          <div className="section-header">
            <span className="section-icon">🎮</span>
            <h2 className="section-title">
              {searchTerm ? `Search Results` : selectedCategory !== 'All' ? `${selectedCategory} Games` : 'All Games'}
            </h2>
            <span className="section-count">{filteredGames.length} games</span>
          </div>

          {filteredGames.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <div className="empty-state-text">No games found</div>
              <p className="empty-state-subtext">Try a different search or category</p>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('All')
                }}
                className="reset-btn"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className={`games-grid ${viewMode}`}>
              <AnimatePresence>
                {filteredGames.map((game, index) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <GameCard game={game} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>© 2024 HUB GAMES • Built with passion by <strong>Ayman</strong></p>
        <div className="footer-links">
          <a href="/">Home</a>
          <span>•</span>
          <a href="/hub">Game Hub</a>
          <span>•</span>
          <a href="/random-games">Random Games</a>
        </div>
      </footer>

      <style jsx>{`
        .header {
          padding: 60px 40px 40px;
          text-align: center;
        }

        .logo {
          font-size: 72px;
          font-weight: 700;
          letter-spacing: -2px;
          margin-bottom: 12px;
          background: linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.8) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .tagline {
          font-size: 20px;
          color: rgba(255, 255, 255, 0.6);
          font-weight: 400;
        }

        .controls-bar {
          max-width: 1400px;
          margin: 0 auto 40px;
          padding: 0 40px;
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          align-items: center;
        }

        .search-box {
          flex: 1;
          min-width: 200px;
          position: relative;
        }

        .search-input {
          width: 100%;
          padding: 14px 20px 14px 48px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          color: white;
          font-size: 16px;
          transition: all 0.3s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #007aff;
          background: rgba(255, 255, 255, 0.1);
          box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.1);
        }

        .search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 20px;
          color: rgba(255, 255, 255, 0.6);
        }

        .clear-search {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
        }

        .category-filter {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 10px 20px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .filter-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: #007aff;
          color: white;
        }

        .filter-btn.active {
          background: #007aff;
          border-color: #007aff;
          color: white;
        }

        .view-toggle {
          display: flex;
          gap: 4px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 4px;
        }

        .view-btn {
          padding: 8px 12px;
          background: transparent;
          border: none;
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.6);
          font-size: 18px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .view-btn.active {
          background: #007aff;
          color: white;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 40px 80px;
        }

        .section {
          margin-bottom: 60px;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 30px;
        }

        .section-icon {
          font-size: 32px;
        }

        .section-title {
          font-size: 36px;
          font-weight: 700;
          letter-spacing: -1px;
          color: white;
        }

        .section-count {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.6);
          margin-left: auto;
        }

        .games-grid {
          display: grid;
          gap: 24px;
        }

        .games-grid.grid {
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        }

        .games-grid.list {
          grid-template-columns: 1fr;
        }

        .game-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 32px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          display: block;
        }

        .game-card.featured {
          border: 2px solid #007aff;
          background: linear-gradient(135deg, rgba(0, 122, 255, 0.15) 0%, rgba(0, 122, 255, 0.05) 100%);
        }

        .featured-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          background: #007aff;
          color: white;
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .coming-soon-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          background: rgba(255, 255, 255, 0.1);
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.6);
        }

        .game-icon {
          font-size: 64px;
          margin-bottom: 20px;
          display: block;
        }

        .game-title {
          font-size: 28px;
          font-weight: 600;
          margin-bottom: 8px;
          letter-spacing: -0.5px;
          color: white;
        }

        .game-description {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.6;
          margin-bottom: 16px;
        }

        .game-meta {
          display: flex;
          align-items: center;
          gap: 16px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
          flex-wrap: wrap;
          margin-bottom: 12px;
        }

        .game-tag {
          background: rgba(0, 122, 255, 0.2);
          color: #007aff;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .game-tag.category {
          background: rgba(52, 199, 89, 0.2);
          color: #34c759;
        }

        .game-status {
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .game-status.available {
          background: rgba(52, 199, 89, 0.2);
          color: #34c759;
        }

        .game-tags {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 12px;
        }

        .game-tag-small {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.7);
          padding: 2px 8px;
          border-radius: 8px;
          font-size: 11px;
        }

        .empty-state {
          text-align: center;
          padding: 80px 20px;
          color: rgba(255, 255, 255, 0.6);
        }

        .empty-state-icon {
          font-size: 64px;
          margin-bottom: 20px;
        }

        .empty-state-text {
          font-size: 24px;
          font-weight: 600;
          color: white;
          margin-bottom: 8px;
        }

        .empty-state-subtext {
          font-size: 16px;
          margin-bottom: 24px;
        }

        .reset-btn {
          padding: 12px 24px;
          background: #007aff;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .reset-btn:hover {
          background: #0051d5;
        }

        .footer {
          text-align: center;
          padding: 60px 40px;
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
        }

        .footer-links {
          margin-top: 16px;
          display: flex;
          justify-content: center;
          gap: 12px;
          align-items: center;
        }

        .footer-links a {
          color: rgba(255, 255, 255, 0.6);
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .footer-links a:hover {
          color: white;
        }

        @media (max-width: 768px) {
          .header {
            padding: 40px 24px 30px;
          }

          .logo {
            font-size: 52px;
          }

          .controls-bar {
            padding: 0 24px;
            flex-direction: column;
          }

          .search-box {
            width: 100%;
          }

          .category-filter {
            width: 100%;
            justify-content: center;
          }

          .container {
            padding: 0 24px 60px;
          }

          .games-grid.grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
