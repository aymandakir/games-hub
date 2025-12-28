/**
 * Quest Generation System
 * Creates dynamic quests inspired by various RPGs
 */

import { Quest, QuestObjective, Location, Enemy, Item } from '@/lib/types/game'
import { generateRandomQuest, generateRandomEnemy, generateRandomItem, generateRandomLocation } from './procedural-generation'
import { getRandomQuestType, generateQuestDescription } from './digital-libraries'

export interface QuestTemplate {
  id: string
  name: string
  type: 'defeat' | 'collect' | 'explore' | 'talk' | 'boss' | 'chain'
  description: string
  objectives: QuestObjective[]
  rewards: {
    experience: number
    gold: number
    items?: Item[]
  }
  region: 'rock' | 'paper' | 'scissors' | 'neutral'
  level: number
}

/**
 * Generate a quest chain (multiple connected quests)
 */
export async function generateQuestChain(
  region: 'rock' | 'paper' | 'scissors' | 'neutral',
  chainLength: number = 3,
  startingLevel: number = 1
): Promise<Quest[]> {
  const quests: Quest[] = []
  let currentLevel = startingLevel

  for (let i = 0; i < chainLength; i++) {
    const quest = await generateEnhancedQuest(region, currentLevel, i === chainLength - 1)
    if (i > 0) {
      // Link quests together
      quest.description = `Following up on your previous mission, ${quest.description.toLowerCase()}`
    }
    quests.push(quest)
    currentLevel += 2
  }

  return quests
}

/**
 * Generate an enhanced quest with library inspiration
 */
export async function generateEnhancedQuest(
  region: 'rock' | 'paper' | 'scissors' | 'neutral',
  level: number = 1,
  isFinal: boolean = false
): Promise<Quest> {
  // Get base quest
  const baseQuest = generateRandomQuest(region, level)

  // Enhance with library data
  const questType = getRandomQuestType()
  const location = generateRandomLocation(region)
  const enhancedDescription = await generateQuestDescription(questType, location.name)

  // Create enhanced quest
  const enhancedQuest: Quest = {
    ...baseQuest,
    name: isFinal ? `${questType} (Final)` : questType,
    description: enhancedDescription,
    rewards: {
      ...baseQuest.rewards,
      experience: baseQuest.rewards.experience * (isFinal ? 2 : 1),
      gold: baseQuest.rewards.gold * (isFinal ? 1.5 : 1),
    },
  }

  return enhancedQuest
}

/**
 * Generate a boss quest
 */
export function generateBossQuest(
  region: 'rock' | 'paper' | 'scissors',
  level: number = 5
): Quest {
  const boss = generateRandomEnemy(region, level, true)
  const location = generateRandomLocation(region)

  return {
    id: `boss_quest_${Date.now()}`,
    name: `Defeat ${boss.name}`,
    description: `A powerful ${boss.name} has appeared in ${location.name}. This is a dangerous foe that requires all your skill to defeat.`,
    objectives: [
      {
        id: 'defeat_boss',
        description: `Defeat ${boss.name}`,
        type: 'defeat',
        target: boss.id,
        current: 0,
        required: 1,
        completed: false,
      },
    ],
    rewards: {
      experience: level * 200,
      gold: level * 100,
      items: [generateRandomItem(region), generateRandomItem(region)],
    },
    act: (level <= 5 ? 1 : level <= 10 ? 2 : 3) as 1 | 2 | 3,
    region,
    status: 'active',
  }
}

/**
 * Generate daily quests (refreshes each day)
 */
export function generateDailyQuests(): Quest[] {
  const regions: Array<'rock' | 'paper' | 'scissors' | 'neutral'> = ['rock', 'paper', 'scissors', 'neutral']
  const quests: Quest[] = []

  regions.forEach(region => {
    const quest = generateRandomQuest(region, 1)
    quest.name = `Daily: ${quest.name}`
    quest.description = `A daily task to help maintain balance in the ${region} region.`
    quests.push(quest)
  })

  return quests
}

/**
 * Generate event quests (special limited-time quests)
 */
export async function generateEventQuest(
  eventTheme: string,
  region: 'rock' | 'paper' | 'scissors' | 'neutral'
): Promise<Quest> {
  const questType = getRandomQuestType()
  const location = generateRandomLocation(region)
  const description = await generateQuestDescription(
    `${eventTheme}: ${questType}`,
    location.name
  )

  return {
    id: `event_quest_${Date.now()}`,
    name: `${eventTheme} Quest`,
    description,
    objectives: [
      {
        id: 'event_objective',
        description: `Complete the ${eventTheme} challenge`,
        type: 'explore',
        target: location.id,
        completed: false,
      },
    ],
    rewards: {
      experience: 500,
      gold: 200,
      items: [generateRandomItem(region)],
    },
    act: 2,
    region,
    status: 'active',
  }
}



