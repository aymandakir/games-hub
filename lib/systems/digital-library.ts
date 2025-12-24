/**
 * Digital Library Integration Service
 * Fetches content inspiration from various public APIs and databases
 * Provides fallbacks to local generation when APIs are unavailable
 */

// API endpoints for various content sources
const API_ENDPOINTS = {
  // Fantasy name generators (these are examples - replace with actual APIs)
  nameGenerator: 'https://api.namefake.com/english-united-states/fantasy',
  
  // Wikipedia API for lore/inspiration
  wikipedia: 'https://en.wikipedia.org/api/rest_v1/page/summary/',
  
  // D&D 5e API for inspiration (D&D Beyond or similar)
  dndMonsters: 'https://www.dnd5eapi.co/api/monsters/',
  
  // Random quotes for dialogue inspiration
  quotes: 'https://api.quotable.io/random?tags=wisdom',
}

/**
 * Fetch a fantasy name from external API
 */
export async function fetchFantasyName(faction?: 'rock' | 'paper' | 'scissors'): Promise<string> {
  try {
    // Try to fetch from external API
    // Note: In production, you'd want to handle CORS and use a proxy if needed
    const response = await fetch(API_ENDPOINTS.nameGenerator, {
      headers: {
        'Accept': 'application/json',
      },
    })
    
    if (response.ok) {
      const data = await response.json()
      // Extract and format name from API response
      const name = data.name?.first || data.name || 'Unknown'
      
      // Adapt name to faction if provided
      if (faction) {
        return adaptNameToFaction(name, faction)
      }
      
      return name
    }
  } catch (error) {
    console.warn('Failed to fetch name from external API:', error)
  }
  
  // Fallback to local generation
  return generateLocalName(faction || 'rock')
}

/**
 * Fetch lore/inspiration from Wikipedia
 */
export async function fetchLoreInspiration(topic: string): Promise<string> {
  try {
    // Search Wikipedia for fantasy/RPG related topics
    const topics = [
      'Fantasy',
      'Mythology',
      'Medieval',
      'Dungeons & Dragons',
      'Legendary creature',
      'Ancient history',
    ]
    
    const searchTopic = topic || topics[Math.floor(Math.random() * topics.length)]
    const response = await fetch(`${API_ENDPOINTS.wikipedia}${searchTopic}`)
    
    if (response.ok) {
      const data = await response.json()
      if (data.extract) {
        // Extract interesting sentences from Wikipedia summary
        const sentences = data.extract.split('. ').slice(0, 2)
        return sentences.join('. ') + '.'
      }
    }
  } catch (error) {
    console.warn('Failed to fetch lore from Wikipedia:', error)
  }
  
  // Fallback to local lore templates
  return generateLocalLore()
}

/**
 * Fetch monster/enemy inspiration from D&D API
 */
export async function fetchMonsterInspiration(): Promise<{
  name: string
  description: string
  challenge_rating?: number
} | null> {
  try {
    // Get random monster from D&D 5e API
    const monsterListResponse = await fetch(API_ENDPOINTS.dndMonsters)
    
    if (monsterListResponse.ok) {
      const monsterList = await monsterListResponse.json()
      const monsters = monsterList.results || []
      
      if (monsters.length > 0) {
        const randomMonster = monsters[Math.floor(Math.random() * monsters.length)]
        const monsterResponse = await fetch(`https://www.dnd5eapi.co${randomMonster.url}`)
        
        if (monsterResponse.ok) {
          const monsterData = await monsterResponse.json()
          return {
            name: monsterData.name || 'Unknown Creature',
            description: monsterData.desc?.[0] || 'A mysterious creature.',
            challenge_rating: monsterData.challenge_rating,
          }
        }
      }
    }
  } catch (error) {
    console.warn('Failed to fetch monster data from D&D API:', error)
  }
  
  return null
}

/**
 * Fetch quote for dialogue inspiration
 */
export async function fetchQuoteInspiration(): Promise<string> {
  try {
    const response = await fetch(API_ENDPOINTS.quotes)
    
    if (response.ok) {
      const data = await response.json()
      return data.content || 'Wisdom comes with experience.'
    }
  } catch (error) {
    console.warn('Failed to fetch quote:', error)
  }
  
  return 'Every battle teaches us something new.'
}

/**
 * Adapt external name to fit game faction theme
 */
function adaptNameToFaction(name: string, faction: 'rock' | 'paper' | 'scissors'): string {
  const prefixes = {
    rock: ['Stone', 'Granite', 'Iron'],
    paper: ['Scroll', 'Parchment', 'Wind'],
    scissors: ['Blade', 'Edge', 'Razor'],
  }
  
  const suffix = name.split(' ').pop() || ''
  const prefix = prefixes[faction][Math.floor(Math.random() * prefixes[faction].length)]
  
  return `${prefix}${suffix.charAt(0).toUpperCase() + suffix.slice(1)}`
}

/**
 * Local name generation fallback
 */
function generateLocalName(faction: 'rock' | 'paper' | 'scissors'): string {
  const nameSets = {
    rock: ['Boulder', 'Crag', 'Terra', 'Ston', 'Iron', 'Granite'],
    paper: ['Scroll', 'Quill', 'Parchment', 'Wind', 'Cloud', 'Whisper'],
    scissors: ['Blade', 'Edge', 'Razor', 'Slice', 'Cut', 'Sharp'],
  }
  
  const names = nameSets[faction]
  return names[Math.floor(Math.random() * names.length)]
}

/**
 * Local lore generation fallback
 */
function generateLocalLore(): string {
  const loreTemplates = [
    'Long ago, the three forces of Rock, Paper, and Scissors existed in perfect balance.',
    'The ancient texts speak of a time before The Tearing, when harmony reigned.',
    'Legends tell of powerful warriors who mastered all three forces.',
    'In the depths of forgotten ruins, secrets of the old ways still lie hidden.',
    'The balance between the forces is delicate, like a three-legged stool.',
  ]
  
  return loreTemplates[Math.floor(Math.random() * loreTemplates.length)]
}

/**
 * Batch fetch content for game initialization
 * @deprecated Use fetchFantasyContentBatch instead
 */
export async function fetchGameContentBatch(): Promise<{
  names: string[]
  lore: string[]
  monsters: any[]
}> {
  return fetchFantasyContentBatch()
}

/**
 * Batch fetch content for game initialization
 */
export async function fetchFantasyContentBatch(): Promise<{
  names: string[]
  lore: string[]
  monsters: any[]
}> {
  try {
    const [names, lore, monsters] = await Promise.allSettled([
      Promise.all([
        fetchFantasyName('rock'),
        fetchFantasyName('paper'),
        fetchFantasyName('scissors'),
      ]),
      Promise.all([
        fetchLoreInspiration('Fantasy'),
        fetchLoreInspiration('Mythology'),
      ]),
      Promise.all([
        fetchMonsterInspiration(),
        fetchMonsterInspiration(),
      ]),
    ])
    
    return {
      names: names.status === 'fulfilled' ? names.value : [],
      lore: lore.status === 'fulfilled' ? lore.value : [],
      monsters: monsters.status === 'fulfilled' ? monsters.value.filter(m => m !== null) : [],
    }
  } catch (error) {
    console.warn('Failed to fetch content batch:', error)
    return {
      names: [],
      lore: [],
      monsters: [],
    }
  }
}

/**
 * Search for content based on keyword (for dynamic quest/location generation)
 */
export async function searchContent(keyword: string, type: 'name' | 'lore' | 'monster' = 'name'): Promise<string> {
  try {
    switch (type) {
      case 'name':
        return await fetchFantasyName()
      case 'lore':
        return await fetchLoreInspiration(keyword)
      case 'monster':
        const monster = await fetchMonsterInspiration()
        return monster?.name || keyword
      default:
        return keyword
    }
  } catch (error) {
    console.warn(`Failed to search ${type} for "${keyword}":`, error)
    return keyword
  }
}

