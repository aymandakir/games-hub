/**
 * Centralized Game Data
 * All games on the platform with metadata
 */

export interface GameData {
  id: string
  title: string
  description: string
  icon: string
  category: 'RPG' | 'Arcade' | 'Puzzle' | 'Educational' | 'Action' | 'Strategy' | 'Card' | 'Memory' | 'Reaction' | 'Procedural'
  route: string
  players: 'Single Player' | 'Multiplayer' | 'Single/Multi'
  difficulty: 'Easy' | 'Medium' | 'Hard'
  playTime: string
  featured: boolean
  color: string
  tags: string[]
  thumbnail?: string
  status: 'available' | 'coming-soon' | 'beta'
}

export const ALL_GAMES: GameData[] = [
  // Featured Games
  {
    id: 'aetheris',
    title: 'Aetheris: The Symbol War',
    description: 'An epic fantasy RPG where Rock, Paper, Scissors define magic, culture, and combat. Choose your character and restore balance to Aetheris!',
    icon: '⚔️',
    category: 'RPG',
    route: '/aetheris-game/',
    players: 'Single Player',
    difficulty: 'Medium',
    playTime: '2-4 hours',
    featured: true,
    color: 'from-blue-500 to-purple-600',
    tags: ['RPG', 'Story-Driven', 'Fantasy', 'Strategy'],
    status: 'available',
  },
  {
    id: 'hippo-pumpkin',
    title: 'Hippo Pumpkin Feast',
    description: 'Guide your hippo through a Halloween adventure! Collect all 15 pumpkins using arrow keys or touch controls.',
    icon: '🦛',
    category: 'Arcade',
    route: '/hippo-game.html',
    players: 'Single Player',
    difficulty: 'Easy',
    playTime: '5-10 minutes',
    featured: true,
    color: 'from-orange-500 to-red-600',
    tags: ['Arcade', 'Action', 'Halloween', 'Casual'],
    status: 'available',
  },
  {
    id: 'random-games',
    title: 'Random Games Generator',
    description: 'Procedurally generated games using AI-powered design patterns. Every game is unique! Explore puzzle, arcade, strategy, and more.',
    icon: '🎲',
    category: 'Procedural',
    route: '/random-games',
    players: 'Single Player',
    difficulty: 'Medium',
    playTime: 'Varies',
    featured: true,
    color: 'from-purple-500 to-pink-600',
    tags: ['Procedural', 'Infinite', 'AI-Generated', 'Variety'],
    status: 'available',
  },
  {
    id: 'procedural-content',
    title: 'Procedural Content Generator',
    description: 'Generate infinite enemies, quests, locations, and items using procedural generation and digital library integration.',
    icon: '🎲',
    category: 'Procedural',
    route: '/procedural',
    players: 'Single Player',
    difficulty: 'Easy',
    playTime: 'Unlimited',
    featured: false,
    color: 'from-indigo-500 to-purple-600',
    tags: ['Procedural', 'Content', 'Generator', 'Tools'],
    status: 'available',
  },
  // Puzzle Games
  {
    id: 'memory-match',
    title: 'Memory Master',
    description: 'Test your memory with this classic card matching game. Find all pairs before time runs out!',
    icon: '🧠',
    category: 'Memory',
    route: '/memory-game',
    players: 'Single Player',
    difficulty: 'Easy',
    playTime: '3-5 minutes',
    featured: false,
    color: 'from-green-500 to-teal-600',
    tags: ['Memory', 'Puzzle', 'Card', 'Brain Training'],
    status: 'available',
  },
  {
    id: 'word-search',
    title: 'Word Hunter',
    description: 'Find hidden words in a grid of letters. Challenge yourself with increasing difficulty levels!',
    icon: '🔤',
    category: 'Puzzle',
    route: '/word-game',
    players: 'Single Player',
    difficulty: 'Easy',
    playTime: '5-10 minutes',
    featured: false,
    color: 'from-pink-500 to-rose-600',
    tags: ['Word', 'Puzzle', 'Educational', 'Vocabulary'],
    status: 'available',
  },
  {
    id: 'card-match',
    title: 'Card Match Challenge',
    description: 'Match pairs of cards in this memory game. Multiple difficulty levels and themes available!',
    icon: '🃏',
    category: 'Card',
    route: '/card-match',
    players: 'Single Player',
    difficulty: 'Easy',
    playTime: '2-5 minutes',
    featured: false,
    color: 'from-red-500 to-pink-600',
    tags: ['Card', 'Memory', 'Puzzle', 'Matching'],
    status: 'available',
  },
  {
    id: 'tic-tac-toe',
    title: 'Tic-Tac-Toe Pro',
    description: 'Classic Tic-Tac-Toe with AI opponent. Multiple difficulty levels and beautiful animations!',
    icon: '⭕',
    category: 'Strategy',
    route: '/tic-tac-toe',
    players: 'Single Player',
    difficulty: 'Easy',
    playTime: '1-2 minutes',
    featured: false,
    color: 'from-blue-400 to-cyan-500',
    tags: ['Strategy', 'Classic', 'AI', 'Quick Play'],
    status: 'available',
  },
  {
    id: 'number-puzzle',
    title: 'Number Puzzle',
    description: 'Solve number puzzles by arranging tiles. Multiple game modes and difficulty levels!',
    icon: '🔢',
    category: 'Puzzle',
    route: '/number-puzzle',
    players: 'Single Player',
    difficulty: 'Medium',
    playTime: '5-15 minutes',
    featured: false,
    color: 'from-yellow-500 to-orange-600',
    tags: ['Number', 'Puzzle', 'Logic', 'Math'],
    status: 'available',
  },
  // Arcade Games
  {
    id: 'snake-modern',
    title: 'Snake Redux',
    description: 'Classic snake game with modern power-ups and graphics. How long can you survive?',
    icon: '🐍',
    category: 'Arcade',
    route: '/snake-game',
    players: 'Single Player',
    difficulty: 'Medium',
    playTime: '5-15 minutes',
    featured: true,
    color: 'from-emerald-500 to-cyan-600',
    tags: ['Arcade', 'Classic', 'Retro', 'Action'],
    status: 'available',
  },
  {
    id: 'reaction-test',
    title: 'Reaction Master',
    description: 'Test your reflexes and reaction time. Compete for the fastest response!',
    icon: '⚡',
    category: 'Reaction',
    route: '/reaction-test',
    players: 'Single Player',
    difficulty: 'Easy',
    playTime: '1-2 minutes',
    featured: false,
    color: 'from-yellow-400 to-orange-500',
    tags: ['Reaction', 'Speed', 'Reflexes', 'Quick Play'],
    status: 'available',
  },
  {
    id: 'color-memory',
    title: 'Color Memory',
    description: 'Remember and repeat color sequences. Test your visual memory skills!',
    icon: '🌈',
    category: 'Memory',
    route: '/color-memory',
    players: 'Single Player',
    difficulty: 'Medium',
    playTime: '3-5 minutes',
    featured: false,
    color: 'from-purple-400 to-pink-500',
    tags: ['Memory', 'Color', 'Sequence', 'Brain Training'],
    status: 'available',
  },
  // Educational Games
  {
    id: 'typing-race',
    title: 'Type Racer',
    description: 'Race against time to improve your typing speed. Multiple difficulty levels and word lists!',
    icon: '⌨️',
    category: 'Educational',
    route: '/typing-game',
    players: 'Single/Multi',
    difficulty: 'Medium',
    playTime: '1-2 minutes',
    featured: false,
    color: 'from-yellow-500 to-orange-600',
    tags: ['Educational', 'Typing', 'Speed', 'Learning'],
    status: 'available',
  },
  {
    id: 'sudoku',
    title: 'Sudoku',
    description: 'Classic number puzzle. Fill the grid so every row, column, and 3x3 box contains digits 1-9.',
    icon: '🔢',
    category: 'Puzzle',
    route: '/sudoku',
    players: 'Single Player',
    difficulty: 'Medium',
    playTime: '10-30 minutes',
    featured: true,
    color: 'from-green-500 to-emerald-600',
    tags: ['Puzzle', 'Logic', 'Number', 'Brain Training'],
    status: 'available',
  },
  {
    id: 'wordle',
    title: 'Wordle',
    description: 'Guess the 5-letter word in 6 tries. Classic word puzzle game with color-coded feedback.',
    icon: '📝',
    category: 'Puzzle',
    route: '/wordle',
    players: 'Single Player',
    difficulty: 'Medium',
    playTime: '2-5 minutes',
    featured: true,
    color: 'from-slate-500 to-gray-600',
    tags: ['Word', 'Puzzle', 'Daily', 'Vocabulary'],
    status: 'available',
  },
  {
    id: 'stats',
    title: 'Game Statistics',
    description: 'View your gaming statistics, most played games, and achievements. Track your progress!',
    icon: '📊',
    category: 'Educational',
    route: '/stats',
    players: 'Single Player',
    difficulty: 'Easy',
    playTime: '1 minute',
    featured: false,
    color: 'from-blue-500 to-indigo-600',
    tags: ['Stats', 'Analytics', 'Progress', 'Tracking'],
    status: 'available',
  },
]

export const GAME_CATEGORIES = [
  'All',
  'RPG',
  'Arcade',
  'Puzzle',
  'Educational',
  'Action',
  'Strategy',
  'Card',
  'Memory',
  'Reaction',
  'Procedural',
] as const

export function getGamesByCategory(category: string): GameData[] {
  if (category === 'All') return ALL_GAMES
  return ALL_GAMES.filter(game => game.category === category)
}

export function getFeaturedGames(): GameData[] {
  return ALL_GAMES.filter(game => game.featured)
}

export function searchGames(query: string): GameData[] {
  const lowerQuery = query.toLowerCase()
  return ALL_GAMES.filter(
    game =>
      game.title.toLowerCase().includes(lowerQuery) ||
      game.description.toLowerCase().includes(lowerQuery) ||
      game.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  )
}

export function getGameById(id: string): GameData | undefined {
  return ALL_GAMES.find(game => game.id === id)
}

