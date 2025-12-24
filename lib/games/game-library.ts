// Game Design Pattern Library
// Inspired by digital game design libraries and pattern databases

export interface GamePattern {
  id: string
  name: string
  category: string
  description: string
  mechanics: string[]
  examples: string[]
  difficulty: 'easy' | 'medium' | 'hard'
}

export const GAME_PATTERNS: GamePattern[] = [
  // Puzzle Patterns
  {
    id: 'pattern-match',
    name: 'Pattern Matching',
    category: 'puzzle',
    description: 'Identify and replicate visual or logical patterns',
    mechanics: ['observation', 'memory', 'recognition'],
    examples: ['Simon Says', 'Memory games', 'Sequence puzzles'],
    difficulty: 'easy',
  },
  {
    id: 'logic-gate',
    name: 'Logic Gates',
    category: 'puzzle',
    description: 'Solve problems using boolean logic and conditional reasoning',
    mechanics: ['deduction', 'logical thinking', 'problem solving'],
    examples: ['Sudoku', 'Logic puzzles', 'Brain teasers'],
    difficulty: 'medium',
  },
  {
    id: 'spatial-reasoning',
    name: 'Spatial Reasoning',
    category: 'puzzle',
    description: 'Manipulate objects in 2D or 3D space',
    mechanics: ['rotation', 'translation', 'visualization'],
    examples: ['Tetris', 'Block puzzles', 'Tangram'],
    difficulty: 'medium',
  },
  
  // Arcade Patterns
  {
    id: 'dodge-obstacles',
    name: 'Dodge Obstacles',
    category: 'arcade',
    description: 'Avoid falling or moving obstacles',
    mechanics: ['reflex', 'timing', 'spatial awareness'],
    examples: ['Frogger', 'Subway Surfers', 'Temple Run'],
    difficulty: 'easy',
  },
  {
    id: 'collect-items',
    name: 'Collect Items',
    category: 'arcade',
    description: 'Gather items while avoiding obstacles',
    mechanics: ['collection', 'scoring', 'risk/reward'],
    examples: ['Pac-Man', 'Snake', 'Fruit Ninja'],
    difficulty: 'easy',
  },
  {
    id: 'rhythm-action',
    name: 'Rhythm Action',
    category: 'arcade',
    description: 'Match actions to musical beats or patterns',
    mechanics: ['timing', 'rhythm', 'coordination'],
    examples: ['Guitar Hero', 'Dance Dance Revolution', 'Beat Saber'],
    difficulty: 'medium',
  },
  
  // Strategy Patterns
  {
    id: 'resource-management',
    name: 'Resource Management',
    category: 'strategy',
    description: 'Allocate limited resources efficiently',
    mechanics: ['planning', 'optimization', 'trade-offs'],
    examples: ['City builders', 'Tower defense', 'Economic sims'],
    difficulty: 'hard',
  },
  {
    id: 'turn-based',
    name: 'Turn-Based Strategy',
    category: 'strategy',
    description: 'Make decisions in alternating turns',
    mechanics: ['planning', 'prediction', 'counter-strategy'],
    examples: ['Chess', 'Checkers', 'Advance Wars'],
    difficulty: 'medium',
  },
  {
    id: 'real-time',
    name: 'Real-Time Strategy',
    category: 'strategy',
    description: 'Make decisions under time pressure',
    mechanics: ['multitasking', 'prioritization', 'efficiency'],
    examples: ['StarCraft', 'Age of Empires', 'Command & Conquer'],
    difficulty: 'hard',
  },
  
  // Card Patterns
  {
    id: 'deck-building',
    name: 'Deck Building',
    category: 'card',
    description: 'Construct and optimize a deck of cards',
    mechanics: ['synergy', 'optimization', 'strategy'],
    examples: ['Magic: The Gathering', 'Hearthstone', 'Slay the Spire'],
    difficulty: 'hard',
  },
  {
    id: 'hand-management',
    name: 'Hand Management',
    category: 'card',
    description: 'Optimize card play from a limited hand',
    mechanics: ['planning', 'probability', 'adaptation'],
    examples: ['Poker', 'Uno', 'Gin Rummy'],
    difficulty: 'medium',
  },
  
  // Word Patterns
  {
    id: 'word-building',
    name: 'Word Building',
    category: 'word',
    description: 'Create words from available letters',
    mechanics: ['vocabulary', 'anagrams', 'pattern recognition'],
    examples: ['Scrabble', 'Words with Friends', 'Boggle'],
    difficulty: 'medium',
  },
  {
    id: 'word-search',
    name: 'Word Search',
    category: 'word',
    description: 'Find hidden words in a grid',
    mechanics: ['pattern recognition', 'vocabulary', 'observation'],
    examples: ['Word search puzzles', 'Crossword puzzles'],
    difficulty: 'easy',
  },
  
  // Number Patterns
  {
    id: 'arithmetic',
    name: 'Arithmetic Challenge',
    category: 'number',
    description: 'Solve mathematical problems quickly',
    mechanics: ['calculation', 'speed', 'accuracy'],
    examples: ['Math drills', 'Number puzzles', 'Calculation games'],
    difficulty: 'easy',
  },
  {
    id: 'number-sequence',
    name: 'Number Sequences',
    category: 'number',
    description: 'Identify patterns in number sequences',
    mechanics: ['pattern recognition', 'logic', 'deduction'],
    examples: ['Number puzzles', 'Sequence games'],
    difficulty: 'medium',
  },
  
  // Memory Patterns
  {
    id: 'sequence-memory',
    name: 'Sequence Memory',
    category: 'memory',
    description: 'Remember and repeat sequences',
    mechanics: ['working memory', 'recall', 'attention'],
    examples: ['Simon Says', 'Memory games', 'Pattern recall'],
    difficulty: 'easy',
  },
  {
    id: 'visual-memory',
    name: 'Visual Memory',
    category: 'memory',
    description: 'Remember visual patterns and positions',
    mechanics: ['visual memory', 'spatial memory', 'recall'],
    examples: ['Memory cards', 'Spot the difference', 'Visual puzzles'],
    difficulty: 'medium',
  },
  
  // Reaction Patterns
  {
    id: 'quick-reaction',
    name: 'Quick Reaction',
    category: 'reaction',
    description: 'Respond quickly to visual or audio cues',
    mechanics: ['reflex', 'timing', 'attention'],
    examples: ['Reaction time tests', 'Whack-a-mole', 'Quick draw'],
    difficulty: 'easy',
  },
  {
    id: 'timing-window',
    name: 'Timing Window',
    category: 'reaction',
    description: 'Execute actions within specific time windows',
    mechanics: ['precision', 'timing', 'coordination'],
    examples: ['Rhythm games', 'Timing challenges', 'Precision games'],
    difficulty: 'medium',
  },
  
  // Simulation Patterns
  {
    id: 'city-builder',
    name: 'City Builder',
    category: 'simulation',
    description: 'Build and manage a city or settlement',
    mechanics: ['resource management', 'planning', 'optimization'],
    examples: ['SimCity', 'Cities: Skylines', 'Banished'],
    difficulty: 'hard',
  },
  {
    id: 'life-simulation',
    name: 'Life Simulation',
    category: 'simulation',
    description: 'Manage virtual life or ecosystem',
    mechanics: ['resource allocation', 'decision making', 'consequences'],
    examples: ['The Sims', 'Animal Crossing', 'Stardew Valley'],
    difficulty: 'medium',
  },
]

// Content Libraries
export const CONTENT_LIBRARIES = {
  names: {
    fantasy: ['Dragon', 'Wizard', 'Castle', 'Sword', 'Shield', 'Magic', 'Realm', 'Quest'],
    'sci-fi': ['Nebula', 'Quantum', 'Neon', 'Cyber', 'Matrix', 'Orbit', 'Nova', 'Photon'],
    nature: ['Forest', 'River', 'Mountain', 'Valley', 'Bloom', 'Crystal', 'Grove', 'Peak'],
    space: ['Star', 'Planet', 'Galaxy', 'Comet', 'Asteroid', 'Nebula', 'Cosmos', 'Void'],
    ocean: ['Wave', 'Coral', 'Tide', 'Depth', 'Current', 'Reef', 'Abyss', 'Marine'],
    medieval: ['Knight', 'Castle', 'Realm', 'Crown', 'Throne', 'Banner', 'Keep', 'Fortress'],
    cyberpunk: ['Neon', 'Grid', 'Data', 'Code', 'Node', 'Link', 'Byte', 'Core'],
    retro: ['Pixel', 'Arcade', 'Classic', 'Vintage', 'Retro', '8bit', 'Nostalgia', 'Legacy'],
    abstract: ['Flow', 'Form', 'Shape', 'Pattern', 'Essence', 'Core', 'Base', 'Prime'],
    minimalist: ['Pure', 'Simple', 'Clean', 'Base', 'Core', 'Essential', 'Minimal', 'Basic'],
  },
  
  adjectives: [
    'Epic', 'Mystic', 'Ancient', 'Legendary', 'Divine', 'Sacred', 'Eternal', 'Infinite',
    'Rapid', 'Swift', 'Quick', 'Fast', 'Instant', 'Lightning', 'Turbo', 'Speed',
    'Strategic', 'Tactical', 'Clever', 'Wise', 'Smart', 'Brilliant', 'Genius', 'Master',
    'Mysterious', 'Hidden', 'Secret', 'Unknown', 'Enigmatic', 'Cryptic', 'Obscure', 'Veiled',
  ],
  
  actions: [
    'Quest', 'Journey', 'Adventure', 'Expedition', 'Voyage', 'Mission', 'Challenge', 'Trial',
    'Battle', 'Combat', 'Fight', 'Duel', 'War', 'Conflict', 'Struggle', 'Confrontation',
    'Puzzle', 'Riddle', 'Mystery', 'Enigma', 'Challenge', 'Test', 'Trial', 'Puzzle',
    'Race', 'Dash', 'Sprint', 'Rush', 'Run', 'Speed', 'Rush', 'Haste',
  ],
}

// Generate game name from libraries
export function generateGameName(type: string, theme: string): string {
  const names = CONTENT_LIBRARIES.names[theme as keyof typeof CONTENT_LIBRARIES.names] || CONTENT_LIBRARIES.names.fantasy
  const adjectives = CONTENT_LIBRARIES.adjectives
  const actions = CONTENT_LIBRARIES.actions
  
  const name = names[Math.floor(Math.random() * names.length)]
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]
  const action = actions[Math.floor(Math.random() * actions.length)]
  
  const patterns = [
    `${adjective} ${name}`,
    `${name} ${action}`,
    `${adjective} ${action}`,
    `The ${name} ${action}`,
  ]
  
  return patterns[Math.floor(Math.random() * patterns.length)]
}

// Get patterns by category
export function getPatternsByCategory(category: string): GamePattern[] {
  return GAME_PATTERNS.filter(p => p.category === category)
}

// Get pattern by ID
export function getPatternById(id: string): GamePattern | undefined {
  return GAME_PATTERNS.find(p => p.id === id)
}

// Get random pattern
export function getRandomPattern(category?: string): GamePattern {
  const patterns = category ? getPatternsByCategory(category) : GAME_PATTERNS
  return patterns[Math.floor(Math.random() * patterns.length)]
}

