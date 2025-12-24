/**
 * Helper functions to quickly create story content
 * Use these in your story constant files
 */

import { Location, Quest, Enemy, DialogueTree, DialogueNode } from '@/lib/types/game'

export function createLocation(data: Partial<Location>): Location {
  return {
    id: data.id || '',
    name: data.name || 'Unnamed Location',
    region: data.region || 'neutral',
    description: data.description || 'A mysterious place.',
    interactivePoints: data.interactivePoints || [],
    connections: data.connections || [],
    background: data.background || '/assets/locations/placeholder.jpg',
    encounterChance: data.encounterChance || 0.3,
    ...data,
  }
}

export function createQuest(data: Partial<Quest>): Quest {
  return {
    id: data.id || '',
    name: data.name || 'Untitled Quest',
    description: data.description || '',
    type: data.type || 'side',
    act: data.act || 1,
    region: data.region || 'neutral',
    objectives: data.objectives || [],
    rewards: data.rewards || {},
    ...data,
  }
}

export function createEnemy(data: Partial<Enemy>): Enemy {
  return {
    id: data.id || '',
    name: data.name || 'Unknown Enemy',
    type: data.type || 'rock',
    maxHP: data.maxHP || 100,
    currentHP: data.currentHP || data.maxHP || 100,
    pattern: data.pattern || { type: 'random' },
    description: data.description || '',
    isBoss: data.isBoss || false,
    ...data,
  }
}

export function createDialogue(data: Partial<DialogueTree>): DialogueTree {
  return {
    id: data.id || '',
    npc: data.npc || 'unknown',
    root: data.root || createDialogueNode({ text: 'Hello.' }),
    context: data.context || {},
  }
}

export function createDialogueNode(data: Partial<DialogueNode>): DialogueNode {
  return {
    id: data.id || `node_${Date.now()}`,
    speaker: data.speaker || 'npc',
    text: data.text || '',
    emotion: data.emotion || 'neutral',
    choices: data.choices || [],
    ...data,
  }
}

// Example usage:
// export const ROCK_QUEST = createQuest({
//   id: 'cracking_earth',
//   title: 'The Cracking Earth',
//   // ... other fields
// })

