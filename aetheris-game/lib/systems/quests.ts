// Quest tracking system

export interface Quest {
  id: string
  title: string
  description: string
  type: 'main' | 'side' | 'loyalty' | 'hidden'
  act: 1 | 2 | 3
  giver: string // NPC ID
  location: string
  objectives: QuestObjective[]
  rewards: QuestReward
  status: 'locked' | 'available' | 'active' | 'completed' | 'failed'
  startConditions?: Condition[]
  failConditions?: Condition[]
}

export interface QuestObjective {
  id: string
  description: string
  type: 'defeat' | 'collect' | 'talk' | 'explore' | 'choice'
  target?: string
  current: number
  required: number
  completed: boolean
}

export interface QuestReward {
  gold?: number
  items?: string[]
  alignmentShift?: Partial<{ rock: number; paper: number; scissors: number }>
  relationship?: { [npc: string]: number }
  unlocks?: string[]
  experience?: number
}

export interface Condition {
  type: 'flag' | 'level' | 'location' | 'quest' | 'relationship'
  value: any
}

export class QuestManager {
  private quests: Map<string, Quest> = new Map()
  private activeQuests: Set<string> = new Set()

  addQuest(quest: Quest): void {
    this.quests.set(quest.id, quest)
  }

  startQuest(questId: string): void {
    const quest = this.quests.get(questId)
    if (!quest) return

    if (quest.status === 'available' || quest.status === 'locked') {
      quest.status = 'active'
      this.activeQuests.add(questId)
    }
  }

  updateQuestProgress(questId: string, objectiveId: string, amount: number): void {
    const quest = this.quests.get(questId)
    if (!quest || quest.status !== 'active') return

    const objective = quest.objectives.find(obj => obj.id === objectiveId)
    if (!objective) return

    objective.current = Math.min(objective.current + amount, objective.required)
    objective.completed = objective.current >= objective.required

    // Check if all objectives complete
    if (quest.objectives.every(obj => obj.completed)) {
      this.completeQuest(questId)
    }
  }

  completeQuest(questId: string): void {
    const quest = this.quests.get(questId)
    if (!quest) return

    quest.status = 'completed'
    this.activeQuests.delete(questId)

    // Give rewards
    // This would trigger reward distribution
  }

  failQuest(questId: string): void {
    const quest = this.quests.get(questId)
    if (!quest) return

    quest.status = 'failed'
    this.activeQuests.delete(questId)
  }

  getActiveQuests(): Quest[] {
    return Array.from(this.activeQuests).map(id => this.quests.get(id)!).filter(Boolean)
  }

  getAvailableQuests(): Quest[] {
    return Array.from(this.quests.values()).filter(q => q.status === 'available')
  }

  getQuestByLocation(location: string): Quest[] {
    return Array.from(this.quests.values()).filter(q => q.location === location)
  }

  getQuest(questId: string): Quest | undefined {
    return this.quests.get(questId)
  }
}

// Singleton instance
let questManagerInstance: QuestManager | null = null

export function getQuestManager(): QuestManager {
  if (!questManagerInstance) {
    questManagerInstance = new QuestManager()
  }
  return questManagerInstance
}

