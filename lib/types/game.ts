// Core game type definitions

export type CharacterId = 'kael' | 'lyra'
export type MoveType = 'rock' | 'paper' | 'scissors'
export type GameScreen = 'title' | 'character-select' | 'intro' | 'exploration' | 'combat' | 'dialogue' | 'victory' | 'defeat' | 'ending'
export type ActNumber = 1 | 2 | 3

// Alignment percentages (must sum to 100)
export interface Alignment {
  rock: number
  paper: number
  scissors: number
}

// Character data
export interface Character {
  id: CharacterId
  name: string
  age: number
  alignment: Alignment
  baseHP: number
  maxHP: number
  symbolBreak: SymbolBreak
  portrait: string
  bio: string
  strengths: string[]
  flaws: string[]
  combatStyle: string
}

// Symbol Break ultimate move
export interface SymbolBreak {
  name: string
  description: string
  type: MoveType
  damage: number
  effect: {
    damage?: number
    confusion?: number
    critical?: boolean
    ignoreDefense?: boolean
  }
}

// Move data
export interface Move {
  id: string
  name: string
  type: MoveType
  damage: number
  description: string
  effect?: MoveEffect
}

export interface MoveEffect {
  defense?: number // +defense for X rounds
  speed?: number // +speed for X rounds
  confusion?: number // enemy uses random move for X rounds
  stun?: number // enemy skips turn for X rounds
  reflect?: number // reflect X% damage
  critical?: boolean // guaranteed crit
  ignoreDefense?: boolean // bypasses defense
  duration?: number // rounds effect lasts
}

// Enemy data
export interface Enemy {
  id: string
  name: string
  type: MoveType
  maxHP: number
  currentHP: number
  pattern: EnemyPattern
  description: string
  sprite?: string
  isBoss?: boolean
  phases?: EnemyPhase[]
}

export type EnemyPattern = 
  | { type: 'predictable'; move: MoveType }
  | { type: 'reactive'; counters: boolean }
  | { type: 'random' }
  | { type: 'sequence'; moves: MoveType[]; index: number }
  | { type: 'phase'; phases: EnemyPhase[]; currentPhase: number }

export interface EnemyPhase {
  hpThreshold: number // Switch phase at this HP%
  preferredMove: MoveType
  pattern: Omit<EnemyPattern, 'type' | 'phases' | 'currentPhase'>
}

// Combat state
export interface CombatState {
  isActive: boolean
  enemy: Enemy | null
  playerHP: number
  playerMaxHP: number
  enemyHP: number
  enemyMaxHP: number
  playerResolve: number
  maxResolve: number
  round: number
  roundHistory: RoundResult[]
  playerMove: MoveType | null
  enemyMove: MoveType | null
  status: 'waiting' | 'revealing' | 'resolving' | 'victory' | 'defeat'
  consecutiveWins: number
  canUseSymbolBreak: boolean
}

export interface RoundResult {
  round: number
  playerMove: MoveType
  enemyMove: MoveType
  winner: 'player' | 'enemy' | 'tie'
  playerDamage: number
  enemyDamage: number
  effects: string[]
}

// Player state
export interface PlayerState {
  character: CharacterId | null
  hp: number
  maxHP: number
  resolve: number
  maxResolve: number
  alignment: Alignment
  inventory: Item[]
  currentLocation: string
  level: number
  experience: number
}

// Item data
export interface Item {
  id: string
  name: string
  description: string
  type: 'consumable' | 'equipment' | 'key'
  effect?: {
    hp?: number
    resolve?: number
    alignment?: Partial<Alignment>
  }
  icon?: string
}

// NPC data
export interface NPC {
  id: string
  name: string
  age: number
  faction: string
  alignment: Alignment
  portrait: string
  description: string
  personality: string[]
  role: 'mentor' | 'ally' | 'rival' | 'authority' | 'mysterious' | 'enemy'
  relationship: number // 0-100
  dialogueTree: string // ID of starting dialogue node
}

// Location data
export interface Location {
  id: string
  name: string
  description: string
  region: 'rock' | 'paper' | 'scissors' | 'neutral'
  connections: string[] // IDs of connected locations
  interactivePoints: InteractivePoint[]
  background?: string
  encounterChance?: number
}

export interface InteractivePoint {
  id: string
  name: string
  type: 'shop' | 'npc' | 'training' | 'lore' | 'quest'
  npcId?: string
  description: string
}

// Dialogue system
export interface DialogueNode {
  id: string
  npcId?: string
  text: string
  choices: DialogueChoice[]
  alignmentRequirement?: {
    type: MoveType
    minValue: number
  }
  storyFlagRequirement?: {
    flag: string
    value: boolean
  }
}

export interface DialogueChoice {
  id: string
  text: string
  alignment: MoveType // Which alignment this choice represents
  nextNodeId: string
  effects?: {
    alignment?: Partial<Alignment>
    relationship?: number
    storyFlag?: { flag: string; value: boolean }
    quest?: { id: string; progress: number }
  }
}

// Story state
export interface StoryState {
  act: ActNumber
  currentQuest?: string
  completedQuests: string[]
  npcRelationships: Record<string, number>
  dialogueChoices: Record<string, string>
  storyFlags: Record<string, boolean>
  unlockedLocations: string[]
  visitedLocations: string[]
}

// Quest data
export interface Quest {
  id: string
  name: string
  description: string
  objectives: QuestObjective[]
  rewards: {
    experience?: number
    gold?: number
    items?: Item[] | string[]
    alignment?: Partial<Alignment>
    relationship?: Record<string, number>
    unlocks?: string[]
  }
  act: ActNumber
  region: 'rock' | 'paper' | 'scissors' | 'neutral'
  status?: 'active' | 'locked' | 'completed'
}

export interface QuestObjective {
  id: string
  description: string
  type: 'defeat' | 'collect' | 'talk' | 'explore' | 'use'
  target?: string
  current?: number
  required?: number
  completed: boolean
}

// UI state
export interface UIState {
  currentScreen: GameScreen
  activeModal: string | null
  animationsInProgress: string[]
  showDebugPanel: boolean
}

// Particle effect
export interface Particle {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  color: string
}

