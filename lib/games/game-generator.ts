// Random Game Generator System
// Generates procedurally created games using design patterns and content libraries

export type GameType = 
  | 'puzzle' 
  | 'arcade' 
  | 'strategy' 
  | 'adventure' 
  | 'card' 
  | 'word' 
  | 'number' 
  | 'memory' 
  | 'reaction' 
  | 'simulation'

export type GameTheme = 
  | 'fantasy' 
  | 'sci-fi' 
  | 'nature' 
  | 'space' 
  | 'ocean' 
  | 'medieval' 
  | 'cyberpunk' 
  | 'retro' 
  | 'abstract' 
  | 'minimalist'

export interface GeneratedGame {
  id: string
  name: string
  description: string
  type: GameType
  theme: GameTheme
  difficulty: 'easy' | 'medium' | 'hard'
  estimatedTime: number // minutes
  mechanics: string[]
  html: string
  icon: string
  color: string
}

// Content Libraries (inspired by digital game design libraries)
const GAME_NAMES = {
  puzzle: ['Mind Maze', 'Logic Labyrinth', 'Pattern Quest', 'Puzzle Palace', 'Brain Teaser', 'Riddle Realm'],
  arcade: ['Speed Dash', 'Retro Rush', 'Arcade Arena', 'Quick Quest', 'Action Zone', 'Fast Forward'],
  strategy: ['Tactical Tower', 'Strategic Storm', 'Plan Master', 'Decision Domain', 'Think Tank', 'Strategy Saga'],
  adventure: ['Quest Chronicles', 'Journey Junction', 'Explorer Express', 'Adventure Awaits', 'Pathfinder', 'Wander World'],
  card: ['Card Castle', 'Deck Dynasty', 'Hand Hero', 'Card Quest', 'Deal Master', 'Stack Strategy'],
  word: ['Word Wizard', 'Letter Legend', 'Vocab Victory', 'Spell Sprint', 'Text Tactics', 'Linguist League'],
  number: ['Number Ninja', 'Math Master', 'Digit Dash', 'Count Quest', 'Sum Saga', 'Calculate Castle'],
  memory: ['Memory Maze', 'Recall Realm', 'Remember Rush', 'Mind Match', 'Brain Bank', 'Recall Quest'],
  reaction: ['Reflex Rush', 'Quick Quest', 'Speed Sprint', 'Reaction Realm', 'Fast Focus', 'Instant Impact'],
  simulation: ['Sim City', 'Virtual Valley', 'Build Bridge', 'Create Castle', 'Design Domain', 'Craft Quest'],
}

const THEME_COLORS = {
  fantasy: { primary: '#8b5cf6', secondary: '#a78bfa', accent: '#c4b5fd' },
  'sci-fi': { primary: '#06b6d4', secondary: '#22d3ee', accent: '#67e8f9' },
  nature: { primary: '#10b981', secondary: '#34d399', accent: '#6ee7b7' },
  space: { primary: '#6366f1', secondary: '#818cf8', accent: '#a5b4fc' },
  ocean: { primary: '#0891b2', secondary: '#06b6d4', accent: '#22d3ee' },
  medieval: { primary: '#92400e', secondary: '#b45309', accent: '#d97706' },
  cyberpunk: { primary: '#ec4899', secondary: '#f472b6', accent: '#f9a8d4' },
  retro: { primary: '#f59e0b', secondary: '#fbbf24', accent: '#fcd34d' },
  abstract: { primary: '#8b5cf6', secondary: '#a78bfa', accent: '#c4b5fd' },
  minimalist: { primary: '#374151', secondary: '#4b5563', accent: '#6b7280' },
}

const THEME_ICONS = {
  fantasy: ['🧙', '⚔️', '🛡️', '🏰', '🐉', '✨'],
  'sci-fi': ['🚀', '👽', '🤖', '⚡', '🌌', '🔬'],
  nature: ['🌳', '🌸', '🦋', '🌿', '🍄', '🦉'],
  space: ['🌙', '⭐', '🪐', '🌠', '🛸', '🌌'],
  ocean: ['🌊', '🐠', '🐙', '🦈', '🐚', '🏝️'],
  medieval: ['⚔️', '🏰', '🛡️', '👑', '🗡️', '🏺'],
  cyberpunk: ['💾', '🔮', '⚡', '🌃', '💿', '🔋'],
  retro: ['🎮', '📺', '💾', '🎯', '🕹️', '📼'],
  abstract: ['🎨', '🌀', '💫', '✨', '🔷', '🔶'],
  minimalist: ['◼️', '◻️', '▪️', '▫️', '⬛', '⬜'],
}

const MECHANICS_LIBRARY = {
  puzzle: ['pattern matching', 'logic gates', 'sequence solving', 'spatial reasoning', 'deduction'],
  arcade: ['timing', 'reflex', 'precision', 'speed', 'coordination'],
  strategy: ['resource management', 'planning', 'optimization', 'risk assessment', 'trade-offs'],
  adventure: ['exploration', 'choice consequences', 'narrative branching', 'discovery', 'progression'],
  card: ['deck building', 'hand management', 'probability', 'bluffing', 'combo chains'],
  word: ['vocabulary', 'anagram solving', 'word building', 'spelling', 'pattern recognition'],
  number: ['arithmetic', 'pattern finding', 'estimation', 'calculation', 'number sequences'],
  memory: ['pattern recall', 'sequence memory', 'visual memory', 'working memory', 'chunking'],
  reaction: ['quick decisions', 'timing windows', 'reflex training', 'hand-eye coordination', 'split-second choices'],
  simulation: ['resource allocation', 'system management', 'optimization', 'planning', 'efficiency'],
}

// Generate a random game
export function generateRandomGame(seed?: number): GeneratedGame {
  const rng = seed ? createSeededRNG(seed) : Math.random
  
  const type = getRandomElement(Object.keys(GAME_NAMES) as GameType[], rng)
  const theme = getRandomElement(Object.keys(THEME_COLORS) as GameTheme[], rng)
  const difficulty = getRandomElement(['easy', 'medium', 'hard'], rng) as 'easy' | 'medium' | 'hard'
  
  const name = getRandomElement(GAME_NAMES[type], rng)
  const icon = getRandomElement(THEME_ICONS[theme], rng)
  const colors = THEME_COLORS[theme]
  const mechanics = selectRandomMechanics(type, rng)
  
  const description = generateDescription(name, type, theme, difficulty, mechanics)
  const estimatedTime = estimateGameTime(type, difficulty)
  const html = generateGameHTML(name, type, theme, difficulty, colors, icon)
  
  return {
    id: generateId(name, type),
    name,
    description,
    type,
    theme,
    difficulty,
    estimatedTime,
    mechanics,
    html,
    icon,
    color: colors.primary,
  }
}

// Generate multiple random games
export function generateGameCollection(count: number, seed?: number): GeneratedGame[] {
  const games: GeneratedGame[] = []
  const usedIds = new Set<string>()
  
  for (let i = 0; i < count; i++) {
    let game: GeneratedGame
    let attempts = 0
    
    do {
      game = generateRandomGame(seed ? seed + i : undefined)
      attempts++
    } while (usedIds.has(game.id) && attempts < 100)
    
    usedIds.add(game.id)
    games.push(game)
  }
  
  return games
}

// Helper functions
function getRandomElement<T>(array: T[], rng: () => number): T {
  return array[Math.floor(rng() * array.length)]
}

function createSeededRNG(seed: number): () => number {
  let value = seed
  return () => {
    value = (value * 9301 + 49297) % 233280
    return value / 233280
  }
}

function selectRandomMechanics(type: GameType, rng: () => number): string[] {
  const allMechanics = MECHANICS_LIBRARY[type]
  const count = Math.floor(rng() * 3) + 2 // 2-4 mechanics
  const selected: string[] = []
  const used = new Set<number>()
  
  while (selected.length < count && selected.length < allMechanics.length) {
    const index = Math.floor(rng() * allMechanics.length)
    if (!used.has(index)) {
      used.add(index)
      selected.push(allMechanics[index])
    }
  }
  
  return selected
}

function generateDescription(
  name: string,
  type: GameType,
  theme: GameTheme,
  difficulty: string,
  mechanics: string[]
): string {
  const typeDesc = {
    puzzle: 'Challenge your mind with',
    arcade: 'Test your reflexes in',
    strategy: 'Plan your moves in',
    adventure: 'Embark on an epic journey through',
    card: 'Master the deck in',
    word: 'Expand your vocabulary with',
    number: 'Sharpen your math skills with',
    memory: 'Train your memory with',
    reaction: 'Test your reflexes in',
    simulation: 'Build and manage in',
  }
  
  const themeDesc = {
    fantasy: 'a mystical realm',
    'sci-fi': 'a futuristic world',
    nature: 'the natural world',
    space: 'the cosmos',
    ocean: 'the deep blue',
    medieval: 'ancient times',
    cyberpunk: 'a neon-lit future',
    retro: 'a nostalgic past',
    abstract: 'an abstract dimension',
    minimalist: 'a clean space',
  }
  
  return `${typeDesc[type]} ${name}, ${themeDesc[theme]}. Features ${mechanics.slice(0, 2).join(' and ')}. ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} difficulty.`
}

function estimateGameTime(type: GameType, difficulty: string): number {
  const baseTimes: Record<GameType, number> = {
    puzzle: 10,
    arcade: 5,
    strategy: 15,
    adventure: 20,
    card: 8,
    word: 7,
    number: 6,
    memory: 5,
    reaction: 3,
    simulation: 12,
  }
  
  const multipliers = { easy: 0.7, medium: 1.0, hard: 1.5 }
  
  return Math.ceil(baseTimes[type] * multipliers[difficulty as keyof typeof multipliers])
}

function generateId(name: string, type: string): string {
  return `${name.toLowerCase().replace(/\s+/g, '-')}-${type}-${Date.now()}`
}

function generateGameHTML(
  name: string,
  type: GameType,
  theme: GameTheme,
  difficulty: string,
  colors: { primary: string; secondary: string; accent: string },
  icon: string
): string {
  // Generate game-specific HTML based on type
  return generateGameByType(name, type, theme, difficulty, colors, icon)
}

function generateGameByType(
  name: string,
  type: GameType,
  theme: GameTheme,
  difficulty: string,
  colors: { primary: string; secondary: string; accent: string },
  icon: string
): string {
  const gameTemplates = {
    puzzle: generatePuzzleGame,
    arcade: generateArcadeGame,
    strategy: generateStrategyGame,
    adventure: generateAdventureGame,
    card: generateCardGame,
    word: generateWordGame,
    number: generateNumberGame,
    memory: generateMemoryGame,
    reaction: generateReactionGame,
    simulation: generateSimulationGame,
  }
  
  const generator = gameTemplates[type]
  return generator(name, theme, difficulty, colors, icon)
}

// Game Type Generators
function generatePuzzleGame(name: string, theme: string, difficulty: string, colors: any, icon: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }
        .game-container {
            background: rgba(0,0,0,0.3);
            padding: 2rem;
            border-radius: 20px;
            text-align: center;
            max-width: 500px;
            width: 90%;
        }
        h1 { font-size: 2.5rem; margin-bottom: 1rem; }
        .icon { font-size: 4rem; margin-bottom: 1rem; }
        .puzzle-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            margin: 2rem 0;
        }
        .puzzle-cell {
            aspect-ratio: 1;
            background: ${colors.accent};
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            cursor: pointer;
            transition: transform 0.2s;
        }
        .puzzle-cell:hover { transform: scale(1.1); }
        .score { font-size: 1.5rem; margin-top: 1rem; }
        button {
            background: ${colors.primary};
            color: white;
            border: none;
            padding: 1rem 2rem;
            border-radius: 10px;
            font-size: 1rem;
            cursor: pointer;
            margin-top: 1rem;
        }
    </style>
</head>
<body>
    <div class="game-container">
        <div class="icon">${icon}</div>
        <h1>${name}</h1>
        <div class="puzzle-grid" id="puzzleGrid"></div>
        <div class="score">Score: <span id="score">0</span></div>
        <button onclick="startGame()">New Game</button>
    </div>
    <script>
        let score = 0;
        let pattern = [];
        
        function startGame() {
            score = 0;
            document.getElementById('score').textContent = score;
            generatePattern();
        }
        
        function generatePattern() {
            const grid = document.getElementById('puzzleGrid');
            grid.innerHTML = '';
            pattern = [];
            const cells = 9;
            
            for (let i = 0; i < cells; i++) {
                const cell = document.createElement('div');
                cell.className = 'puzzle-cell';
                cell.textContent = '?';
                cell.onclick = () => checkCell(i);
                grid.appendChild(cell);
            }
            
            // Generate random pattern
            const patternLength = ${difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5};
            for (let i = 0; i < patternLength; i++) {
                pattern.push(Math.floor(Math.random() * cells));
            }
            
            // Show pattern
            showPattern();
        }
        
        function showPattern() {
            pattern.forEach((cellIndex, i) => {
                setTimeout(() => {
                    const cells = document.querySelectorAll('.puzzle-cell');
                    cells[cellIndex].textContent = '⭐';
                    setTimeout(() => {
                        cells[cellIndex].textContent = '?';
                    }, 500);
                }, i * 600);
            });
        }
        
        function checkCell(index) {
            if (pattern.length > 0 && pattern[0] === index) {
                pattern.shift();
                if (pattern.length === 0) {
                    score += 10;
                    document.getElementById('score').textContent = score;
                    setTimeout(generatePattern, 1000);
                }
            } else {
                alert('Wrong! Game Over. Score: ' + score);
                startGame();
            }
        }
        
        startGame();
    </script>
</body>
</html>
  `.trim()
}

function generateArcadeGame(name: string, theme: string, difficulty: string, colors: any, icon: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }
        .game-container {
            width: 100vw;
            height: 100vh;
            position: relative;
            color: white;
        }
        .player {
            position: absolute;
            bottom: 50px;
            left: 50%;
            transform: translateX(-50%);
            width: 50px;
            height: 50px;
            background: ${colors.accent};
            border-radius: 50%;
            font-size: 2rem;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .obstacle {
            position: absolute;
            width: 40px;
            height: 40px;
            background: ${colors.primary};
            border-radius: 5px;
            top: -40px;
        }
        .score {
            position: absolute;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 2rem;
            font-weight: bold;
        }
        .controls {
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 20px;
        }
        button {
            padding: 15px 30px;
            background: ${colors.primary};
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 1rem;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div class="game-container">
        <div class="score">Score: <span id="score">0</span></div>
        <div class="player" id="player">${icon}</div>
        <div class="controls">
            <button onclick="moveLeft()">←</button>
            <button onclick="moveRight()">→</button>
        </div>
    </div>
    <script>
        let score = 0;
        let playerX = window.innerWidth / 2;
        let obstacles = [];
        let gameSpeed = ${difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 4};
        
        const player = document.getElementById('player');
        const gameContainer = document.querySelector('.game-container');
        
        function moveLeft() {
            playerX = Math.max(25, playerX - 50);
            player.style.left = playerX + 'px';
        }
        
        function moveRight() {
            playerX = Math.min(window.innerWidth - 25, playerX + 50);
            player.style.left = playerX + 'px';
        }
        
        function createObstacle() {
            const obstacle = document.createElement('div');
            obstacle.className = 'obstacle';
            obstacle.style.left = Math.random() * (window.innerWidth - 40) + 'px';
            gameContainer.appendChild(obstacle);
            obstacles.push({ element: obstacle, x: parseFloat(obstacle.style.left), y: -40 });
        }
        
        function update() {
            obstacles.forEach((obs, i) => {
                obs.y += gameSpeed;
                obs.element.style.top = obs.y + 'px';
                
                if (obs.y > window.innerHeight) {
                    obs.element.remove();
                    obstacles.splice(i, 1);
                    score += 10;
                    document.getElementById('score').textContent = score;
                }
                
                // Collision detection
                if (obs.y > window.innerHeight - 100 && obs.y < window.innerHeight - 50 &&
                    Math.abs(obs.x - playerX) < 45) {
                    alert('Game Over! Score: ' + score);
                    location.reload();
                }
            });
            
            requestAnimationFrame(update);
        }
        
        setInterval(createObstacle, ${difficulty === 'easy' ? 2000 : difficulty === 'medium' ? 1500 : 1000});
        update();
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') moveLeft();
            if (e.key === 'ArrowRight') moveRight();
        });
    </script>
</body>
</html>
  `.trim()
}

// Placeholder generators for other game types (can be expanded)
function generateStrategyGame(name: string, theme: string, difficulty: string, colors: any, icon: string): string {
  return generatePuzzleGame(name, theme, difficulty, colors, icon) // Placeholder
}

function generateAdventureGame(name: string, theme: string, difficulty: string, colors: any, icon: string): string {
  return generatePuzzleGame(name, theme, difficulty, colors, icon) // Placeholder
}

function generateCardGame(name: string, theme: string, difficulty: string, colors: any, icon: string): string {
  return generatePuzzleGame(name, theme, difficulty, colors, icon) // Placeholder
}

function generateWordGame(name: string, theme: string, difficulty: string, colors: any, icon: string): string {
  return generatePuzzleGame(name, theme, difficulty, colors, icon) // Placeholder
}

function generateNumberGame(name: string, theme: string, difficulty: string, colors: any, icon: string): string {
  return generatePuzzleGame(name, theme, difficulty, colors, icon) // Placeholder
}

function generateMemoryGame(name: string, theme: string, difficulty: string, colors: any, icon: string): string {
  return generatePuzzleGame(name, theme, difficulty, colors, icon) // Placeholder
}

function generateReactionGame(name: string, theme: string, difficulty: string, colors: any, icon: string): string {
  return generateArcadeGame(name, theme, difficulty, colors, icon) // Placeholder
}

function generateSimulationGame(name: string, theme: string, difficulty: string, colors: any, icon: string): string {
  return generatePuzzleGame(name, theme, difficulty, colors, icon) // Placeholder
}

