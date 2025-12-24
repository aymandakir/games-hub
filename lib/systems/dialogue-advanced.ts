import { Alignment, GameScreen } from '@/lib/types/game'
import { useGameStore } from '@/lib/store/gameStore'

export interface DialogueTree {
  id: string
  npc: string
  root: string // Root node ID
  context: {
    requiredFlags?: string[]
    requiredAlignment?: Partial<Alignment>
    requiredRelationship?: { [npc: string]: number }
  }
}

export interface DialogueNode {
  id: string
  speaker: 'npc' | 'player'
  text: string
  emotion?: 'neutral' | 'happy' | 'angry' | 'sad' | 'surprised'
  choices?: DialogueChoice[]
  autoNext?: string
  sideEffects?: {
    alignmentChange?: Partial<Alignment>
    relationshipChange?: { [npc: string]: number }
    storyFlags?: string[]
    itemGained?: string[]
    questProgress?: { [quest: string]: number }
  }
  conditionalNext?: ConditionalNext[]
  memoryFlags?: string[] // Things to remember
}

export interface DialogueChoice {
  id: string
  text: string
  alignment: 'rock' | 'paper' | 'scissors'
  nextNodeId: string
  requirements?: {
    minAlignment?: Partial<Alignment>
    hasItems?: string[]
    flags?: string[]
    relationship?: { [npc: string]: number }
  }
  locked?: boolean
  lockedTooltip?: string
}

export interface ConditionalNext {
  condition: (state: ReturnType<typeof useGameStore.getState>) => boolean
  nodeId: string
}

export interface RelationshipData {
  [npcId: string]: {
    value: number // -100 to 100
    status: 'hostile' | 'unfriendly' | 'neutral' | 'friendly' | 'trusted'
    firstMet: boolean
    conversationCount: number
    lastInteraction: string
    memoryFlags: string[]
  }
}

// Relationship system
export function updateRelationship(npcId: string, change: number): void {
  const state = useGameStore.getState()
  const current = state.story.npcRelationships[npcId] || 0
  const newValue = Math.max(-100, Math.min(100, current + change))
  
  useGameStore.setState({
    story: {
      ...state.story,
      npcRelationships: {
        ...state.story.npcRelationships,
        [npcId]: newValue,
      },
    },
  })
}

export function getRelationshipStatus(npcId: string): string {
  const state = useGameStore.getState()
  const value = state.story.npcRelationships[npcId] || 0
  
  if (value <= -50) return 'hostile'
  if (value <= -20) return 'unfriendly'
  if (value < 20) return 'neutral'
  if (value < 50) return 'friendly'
  return 'trusted'
}

export function canAccessDialogue(_npcId: string, _treeId: string): boolean {
  // Check if dialogue tree requirements are met
  // This would check flags, alignment, relationships
  return true // Simplified for now
}

// Dialogue evaluation
export function evaluateDialogueNode(node: DialogueNode): DialogueNode {
  const evaluatedNode = { ...node }
  
  // Evaluate choices
  if (evaluatedNode.choices) {
    evaluatedNode.choices = evaluatedNode.choices.map(choice => {
      const locked = !checkChoiceRequirements(choice, state)
      return {
        ...choice,
        locked,
        lockedTooltip: locked ? getLockReason(choice, state) : undefined,
      }
    })
  }
  
  // Check conditional next
  if (evaluatedNode.conditionalNext) {
    for (const conditional of evaluatedNode.conditionalNext) {
      if (conditional.condition(state)) {
        return getDialogueNode(conditional.nodeId) || evaluatedNode
      }
    }
  }
  
  return evaluatedNode
}

function checkChoiceRequirements(
  choice: DialogueChoice,
  state: ReturnType<typeof useGameStore.getState>
): boolean {
  if (!choice.requirements) return true
  
  const { minAlignment, hasItems, flags, relationship } = choice.requirements
  
  // Check alignment
  if (minAlignment) {
    if (minAlignment.rock && state.player.alignment.rock < minAlignment.rock) return false
    if (minAlignment.paper && state.player.alignment.paper < minAlignment.paper) return false
    if (minAlignment.scissors && state.player.alignment.scissors < minAlignment.scissors) return false
  }
  
  // Check items
  if (hasItems) {
    for (const itemId of hasItems) {
      const hasItem = state.player.inventory.some(item => item.id === itemId)
      if (!hasItem) return false
    }
  }
  
  // Check flags
  if (flags) {
    for (const flag of flags) {
      if (!state.story.storyFlags[flag]) return false
    }
  }
  
  // Check relationships
  if (relationship) {
    for (const [npcId, minValue] of Object.entries(relationship)) {
      const currentValue = state.story.npcRelationships[npcId] || 0
      if (currentValue < minValue) return false
    }
  }
  
  return true
}

function getLockReason(
  choice: DialogueChoice,
  _state: ReturnType<typeof useGameStore.getState>
): string {
  if (!choice.requirements) return ''
  
  const reasons: string[] = []
  
  if (choice.requirements.minAlignment) {
    reasons.push('Requires higher alignment')
  }
  if (choice.requirements.hasItems) {
    reasons.push('Missing required items')
  }
  if (choice.requirements.flags) {
    reasons.push('Story requirements not met')
  }
  if (choice.requirements.relationship) {
    reasons.push('Relationship too low')
  }
  
  return reasons.join(', ')
}

// Get dialogue node (would load from constants)
function getDialogueNode(_nodeId: string): DialogueNode | null {
  // This would fetch from dialogue constants
  return null
}

// Apply dialogue side effects
export function applyDialogueEffects(node: DialogueNode): void {
  const state = useGameStore.getState()
  
  if (node.sideEffects) {
    const { alignmentChange, relationshipChange, storyFlags, itemGained, questProgress } =
      node.sideEffects
    
    // Update alignment
    if (alignmentChange) {
      state.updateAlignment(alignmentChange)
    }
    
    // Update relationships
    if (relationshipChange) {
      for (const [npcId, change] of Object.entries(relationshipChange)) {
        updateRelationship(npcId, change)
      }
    }
    
    // Update story flags
    if (storyFlags) {
      for (const flag of storyFlags) {
        state.updateStoryFlag(flag, true)
      }
    }
    
    // Add items (would need inventory system)
    if (itemGained) {
      // state.addItems(itemGained)
    }
    
    // Update quest progress
    if (questProgress) {
      // state.updateQuestProgress(questProgress)
    }
  }
  
  // Store memory flags
  if (node.memoryFlags) {
    // Store in relationship memory
  }
}

