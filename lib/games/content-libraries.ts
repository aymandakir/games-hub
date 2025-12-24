// Extended Content Libraries
// Inspired by digital libraries, game design databases, and content generation systems

export const THEME_LIBRARIES = {
  fantasy: {
    colors: ['#8b5cf6', '#a78bfa', '#c4b5fd', '#7c3aed', '#6d28d9'],
    icons: ['🧙', '⚔️', '🛡️', '🏰', '🐉', '✨', '🔮', '🗡️', '👑', '🦄'],
    nouns: ['Dragon', 'Wizard', 'Castle', 'Sword', 'Shield', 'Magic', 'Realm', 'Quest', 'Knight', 'Tower'],
    adjectives: ['Mystical', 'Ancient', 'Legendary', 'Enchanted', 'Magical', 'Epic', 'Divine', 'Sacred'],
  },
  'sci-fi': {
    colors: ['#06b6d4', '#22d3ee', '#67e8f9', '#0891b2', '#0e7490'],
    icons: ['🚀', '👽', '🤖', '⚡', '🌌', '🔬', '💾', '🌠', '🛸', '⚙️'],
    nouns: ['Nebula', 'Quantum', 'Neon', 'Cyber', 'Matrix', 'Orbit', 'Nova', 'Photon', 'Plasma', 'Nexus'],
    adjectives: ['Futuristic', 'Digital', 'Neon', 'Quantum', 'Cyber', 'Holographic', 'Neural', 'Synthetic'],
  },
  nature: {
    colors: ['#10b981', '#34d399', '#6ee7b7', '#059669', '#047857'],
    icons: ['🌳', '🌸', '🦋', '🌿', '🍄', '🦉', '🌺', '🍃', '🌲', '🌻'],
    nouns: ['Forest', 'River', 'Mountain', 'Valley', 'Bloom', 'Crystal', 'Grove', 'Peak', 'Meadow', 'Stream'],
    adjectives: ['Verdant', 'Lush', 'Pristine', 'Wild', 'Natural', 'Organic', 'Flourishing', 'Thriving'],
  },
  space: {
    colors: ['#6366f1', '#818cf8', '#a5b4fc', '#4f46e5', '#4338ca'],
    icons: ['🌙', '⭐', '🪐', '🌠', '🛸', '🌌', '☄️', '🔭', '🌍', '🌎'],
    nouns: ['Star', 'Planet', 'Galaxy', 'Comet', 'Asteroid', 'Nebula', 'Cosmos', 'Void', 'Orbit', 'Solar'],
    adjectives: ['Cosmic', 'Stellar', 'Infinite', 'Vast', 'Celestial', 'Astral', 'Ethereal', 'Boundless'],
  },
  ocean: {
    colors: ['#0891b2', '#06b6d4', '#22d3ee', '#0e7490', '#155e75'],
    icons: ['🌊', '🐠', '🐙', '🦈', '🐚', '🏝️', '🐬', '🦀', '🌊', '⚓'],
    nouns: ['Wave', 'Coral', 'Tide', 'Depth', 'Current', 'Reef', 'Abyss', 'Marine', 'Aqua', 'Tide'],
    adjectives: ['Deep', 'Aquatic', 'Marine', 'Fluid', 'Current', 'Tidal', 'Submerged', 'Liquid'],
  },
  medieval: {
    colors: ['#92400e', '#b45309', '#d97706', '#78350f', '#713f12'],
    icons: ['⚔️', '🏰', '🛡️', '👑', '🗡️', '🏺', '⚒️', '🏛️', '🛡️', '⚔️'],
    nouns: ['Knight', 'Castle', 'Realm', 'Crown', 'Throne', 'Banner', 'Keep', 'Fortress', 'Kingdom', 'Sword'],
    adjectives: ['Noble', 'Royal', 'Ancient', 'Historic', 'Regal', 'Majestic', 'Chivalrous', 'Medieval'],
  },
  cyberpunk: {
    colors: ['#ec4899', '#f472b6', '#f9a8d4', '#db2777', '#be185d'],
    icons: ['💾', '🔮', '⚡', '🌃', '💿', '🔋', '📡', '🖥️', '🌐', '⚙️'],
    nouns: ['Neon', 'Grid', 'Data', 'Code', 'Node', 'Link', 'Byte', 'Core', 'Matrix', 'Net'],
    adjectives: ['Neon', 'Digital', 'Cyber', 'Virtual', 'Holographic', 'Synthetic', 'Neural', 'Quantum'],
  },
  retro: {
    colors: ['#f59e0b', '#fbbf24', '#fcd34d', '#d97706', '#b45309'],
    icons: ['🎮', '📺', '💾', '🎯', '🕹️', '📼', '📻', '🎰', '🎲', '🃏'],
    nouns: ['Pixel', 'Arcade', 'Classic', 'Vintage', 'Retro', '8bit', 'Nostalgia', 'Legacy', 'Old', 'Past'],
    adjectives: ['Classic', 'Vintage', 'Retro', 'Nostalgic', 'Timeless', 'Old-school', 'Retro', 'Classic'],
  },
  abstract: {
    colors: ['#8b5cf6', '#a78bfa', '#c4b5fd', '#7c3aed', '#6d28d9'],
    icons: ['🎨', '🌀', '💫', '✨', '🔷', '🔶', '◼️', '◻️', '▪️', '▫️'],
    nouns: ['Flow', 'Form', 'Shape', 'Pattern', 'Essence', 'Core', 'Base', 'Prime', 'Pure', 'Void'],
    adjectives: ['Abstract', 'Pure', 'Minimal', 'Essential', 'Fundamental', 'Core', 'Base', 'Prime'],
  },
  minimalist: {
    colors: ['#374151', '#4b5563', '#6b7280', '#1f2937', '#111827'],
    icons: ['◼️', '◻️', '▪️', '▫️', '⬛', '⬜', '🔲', '🔳', '▬', '▭'],
    nouns: ['Pure', 'Simple', 'Clean', 'Base', 'Core', 'Essential', 'Minimal', 'Basic', 'Plain', 'Clear'],
    adjectives: ['Minimal', 'Simple', 'Clean', 'Pure', 'Essential', 'Basic', 'Clear', 'Plain'],
  },
}

export const MECHANIC_DESCRIPTIONS = {
  'pattern matching': 'Identify and replicate visual or logical patterns',
  'logic gates': 'Solve problems using boolean logic',
  'sequence solving': 'Find the correct order of elements',
  'spatial reasoning': 'Manipulate objects in 2D or 3D space',
  'deduction': 'Use logic to determine solutions',
  'timing': 'Execute actions at precise moments',
  'reflex': 'React quickly to stimuli',
  'precision': 'Perform actions with accuracy',
  'speed': 'Complete tasks quickly',
  'coordination': 'Coordinate multiple actions simultaneously',
  'resource management': 'Allocate limited resources efficiently',
  'planning': 'Think ahead and strategize',
  'optimization': 'Find the best solution',
  'risk assessment': 'Evaluate and manage risks',
  'trade-offs': 'Balance competing priorities',
  'exploration': 'Discover new areas and content',
  'choice consequences': 'Decisions affect outcomes',
  'narrative branching': 'Story changes based on choices',
  'discovery': 'Uncover hidden content',
  'progression': 'Advance through levels or stages',
  'deck building': 'Construct and optimize card decks',
  'hand management': 'Optimize card play from limited hand',
  'probability': 'Calculate and use odds',
  'bluffing': 'Deceive opponents',
  'combo chains': 'Chain actions for bonuses',
  'vocabulary': 'Use knowledge of words',
  'anagram solving': 'Rearrange letters to form words',
  'word building': 'Create words from letters',
  'spelling': 'Correctly spell words',
  'pattern recognition': 'Identify recurring patterns',
  'arithmetic': 'Perform mathematical calculations',
  'pattern finding': 'Discover number patterns',
  'estimation': 'Approximate values',
  'calculation': 'Compute mathematical results',
  'number sequences': 'Identify patterns in numbers',
  'pattern recall': 'Remember and reproduce patterns',
  'sequence memory': 'Remember order of elements',
  'visual memory': 'Remember visual information',
  'working memory': 'Hold information temporarily',
  'chunking': 'Group information for memory',
  'quick decisions': 'Make fast choices',
  'timing windows': 'Act within time limits',
  'reflex training': 'Improve reaction speed',
  'hand-eye coordination': 'Coordinate vision and movement',
  'split-second choices': 'Decide in milliseconds',
  'resource allocation': 'Distribute resources',
  'system management': 'Control complex systems',
  'efficiency': 'Maximize output with minimal input',
}

export const DIFFICULTY_SETTINGS = {
  easy: {
    timeLimit: null,
    attempts: 'unlimited',
    hints: 'available',
    complexity: 'low',
    learningCurve: 'gentle',
  },
  medium: {
    timeLimit: 'moderate',
    attempts: 'limited',
    hints: 'rare',
    complexity: 'moderate',
    learningCurve: 'moderate',
  },
  hard: {
    timeLimit: 'strict',
    attempts: 'few',
    hints: 'none',
    complexity: 'high',
    learningCurve: 'steep',
  },
}

// Generate theme-based content
export function getThemeContent(theme: keyof typeof THEME_LIBRARIES) {
  const library = THEME_LIBRARIES[theme] || THEME_LIBRARIES.fantasy
  return {
    color: library.colors[Math.floor(Math.random() * library.colors.length)],
    icon: library.icons[Math.floor(Math.random() * library.icons.length)],
    noun: library.nouns[Math.floor(Math.random() * library.nouns.length)],
    adjective: library.adjectives[Math.floor(Math.random() * library.adjectives.length)],
  }
}

// Get mechanic description
export function getMechanicDescription(mechanic: string): string {
  return MECHANIC_DESCRIPTIONS[mechanic as keyof typeof MECHANIC_DESCRIPTIONS] || mechanic
}

// Get difficulty settings
export function getDifficultySettings(difficulty: 'easy' | 'medium' | 'hard') {
  return DIFFICULTY_SETTINGS[difficulty]
}

