import { NPC } from '@/lib/types/game'

export const NPCS: Record<string, NPC> = {
  thorne: {
    id: 'thorne',
    name: 'Master Thorne',
    age: 65,
    faction: 'neutral',
    alignment: { rock: 70, paper: 20, scissors: 10 },
    portrait: '/assets/npcs/thorne.png',
    description: 'A wise mentor who lost his left arm during The Tearing. Lives in Crosspoint and teaches about the three forces.',
    personality: [
      'Wise but gruff',
      'Patient teacher who pushes you to think',
      'Has a dry sense of humor',
    ],
    role: 'mentor',
    relationship: 50,
    dialogueTree: 'thorne_intro',
  },
  elara: {
    id: 'elara',
    name: 'Sage Elara',
    age: 28,
    faction: 'paper',
    alignment: { rock: 10, paper: 80, scissors: 10 },
    portrait: '/assets/npcs/elara.png',
    description: 'A brilliant but scattered Paper Scholar from the Radical faction. Always carries multiple books.',
    personality: [
      'Brilliant but scattered',
      'Passionate about knowledge',
      'Slightly chaotic good',
    ],
    role: 'ally',
    relationship: 30,
    dialogueTree: 'elara_intro',
  },
  zara: {
    id: 'zara',
    name: 'Blade Captain Zara',
    age: 22,
    faction: 'scissors',
    alignment: { rock: 10, paper: 15, scissors: 75 },
    portrait: '/assets/npcs/zara.png',
    description: 'A competitive but fair Scissor Blade warrior. Has a scar across her right cheek.',
    personality: [
      'Competitive but fair',
      'Respects strength and skill',
      'Has a hidden soft side',
    ],
    role: 'rival',
    relationship: 20,
    dialogueTree: 'zara_intro',
  },
  marcus: {
    id: 'marcus',
    name: 'Elder Marcus',
    age: 55,
    faction: 'paper',
    alignment: { rock: 5, paper: 85, scissors: 10 },
    portrait: '/assets/npcs/marcus.png',
    description: 'The cautious leader of the Paper Scholars Traditionalist faction. Always seems to be reading.',
    personality: [
      'Cautious and methodical',
      'Suspicious of change',
      'Well-intentioned but stubborn',
    ],
    role: 'authority',
    relationship: 10,
    dialogueTree: 'marcus_intro',
  },
  rook: {
    id: 'rook',
    name: 'Rook the Wanderer',
    age: 0, // Unknown
    faction: 'unknown',
    alignment: { rock: 33, paper: 34, scissors: 33 },
    portrait: '/assets/npcs/rook.png',
    description: 'A mysterious hooded figure who appears at key moments. True allegiance is ambiguous.',
    personality: [
      'Cryptic and mysterious',
      'Knows more than he should',
      'Helpful but with unclear motives',
    ],
    role: 'mysterious',
    relationship: 0,
    dialogueTree: 'rook_intro',
  },
}

export function getNPC(id: string): NPC | null {
  return NPCS[id] || null
}

