import { DialogueNode } from '@/lib/types/game'

// Simplified dialogue system - full implementation would have more nodes
export const DIALOGUE: Record<string, DialogueNode> = {
  // Master Thorne introduction
  thorne_intro: {
    id: 'thorne_intro',
    npcId: 'thorne',
    text: 'Ah. So you felt it too, did you?',
    choices: [
      {
        id: 'thorne_direct',
        text: 'What was that? I need answers.',
        alignment: 'rock',
        nextNodeId: 'thorne_reveal',
      },
      {
        id: 'thorne_diplomatic',
        text: "I'm trying to understand what happened.",
        alignment: 'paper',
        nextNodeId: 'thorne_reveal',
      },
      {
        id: 'thorne_sharp',
        text: 'You know something. Tell me.',
        alignment: 'scissors',
        nextNodeId: 'thorne_reveal',
      },
    ],
  },
  thorne_reveal: {
    id: 'thorne_reveal',
    npcId: 'thorne',
    text: 'That symbol in the sky—it\'s been fifty years since anyone\'s seen it. Not since The Tearing. Your family was involved. Meet me at the Grand Plaza tonight. Come alone.',
    choices: [
      {
        id: 'thorne_agree',
        text: 'I\'ll be there.',
        alignment: 'rock',
        nextNodeId: 'end',
        effects: {
          relationship: 10,
          storyFlag: { flag: 'met_thorne', value: true },
        },
      },
    ],
  },

  // Sage Elara introduction
  elara_intro: {
    id: 'elara_intro',
    npcId: 'elara',
    text: 'Oh! You\'re the one investigating the imbalance! I\'ve been researching this too. The papers are losing their magic—it\'s fascinating and terrifying!',
    choices: [
      {
        id: 'elara_help',
        text: 'Can you help me understand what\'s happening?',
        alignment: 'paper',
        nextNodeId: 'elara_research',
        effects: {
          relationship: 5,
        },
      },
      {
        id: 'elara_direct',
        text: 'What do you know about the Hidden Symbol?',
        alignment: 'rock',
        nextNodeId: 'elara_research',
      },
    ],
  },
  elara_research: {
    id: 'elara_research',
    npcId: 'elara',
    text: 'The Hidden Symbol... I\'ve found references in ancient texts. It\'s not a fourth force—it\'s the combination of all three! But accessing it requires perfect balance.',
    choices: [
      {
        id: 'elara_continue',
        text: 'Tell me more.',
        alignment: 'paper',
        nextNodeId: 'end',
        effects: {
          relationship: 10,
          storyFlag: { flag: 'learned_about_symbol', value: true },
        },
      },
    ],
  },

  // Blade Captain Zara introduction
  zara_intro: {
    id: 'zara_intro',
    npcId: 'zara',
    text: 'You\'re the one everyone\'s talking about. The "balance restorer."',
    choices: [
      {
        id: 'zara_challenge',
        text: 'I don\'t care about talk. I care about results.',
        alignment: 'rock',
        nextNodeId: 'zara_duel',
      },
      {
        id: 'zara_diplomatic',
        text: 'I\'m just trying to help. Maybe we can work together?',
        alignment: 'paper',
        nextNodeId: 'zara_consider',
      },
      {
        id: 'zara_competitive',
        text: 'And you\'re the "Blade Captain." Can you back it up?',
        alignment: 'scissors',
        nextNodeId: 'zara_duel',
      },
    ],
  },
  zara_duel: {
    id: 'zara_duel',
    npcId: 'zara',
    text: 'I like that. Three rounds. Rock, Paper, Scissors. If you win, I\'ll help you. If I win... you\'ll have a new respect for Scissor techniques.',
    choices: [
      {
        id: 'zara_accept',
        text: 'Challenge accepted.',
        alignment: 'scissors',
        nextNodeId: 'end',
        effects: {
          relationship: 5,
          storyFlag: { flag: 'zara_duel_offered', value: true },
        },
      },
    ],
  },
  zara_consider: {
    id: 'zara_consider',
    npcId: 'zara',
    text: 'Diplomatic. Smart. But words won\'t cut it here. Show me you can fight, and maybe we\'ll talk.',
    choices: [
      {
        id: 'zara_ok',
        text: 'Understood.',
        alignment: 'paper',
        nextNodeId: 'end',
      },
    ],
  },
}

export function getDialogueNode(id: string): DialogueNode | null {
  return DIALOGUE[id] || null
}

