/**
 * Digital Library Integration System
 * Fetches inspiration and data from various digital libraries and game databases
 */

// Game database APIs and knowledge sources
const GAME_DATABASES = {
  // Free APIs that don't require keys
  RANDOM_FACT_API: 'https://uselessfacts.jsph.pl/random.json?language=en',
  QUOTE_API: 'https://api.quotable.io/random',
  // Wikipedia API (free, no key needed)
  WIKIPEDIA_API: 'https://en.wikipedia.org/api/rest_v1/page/random/summary',
}

// Game-inspired content pools (inspired by popular RPGs)
const GAME_INSPIRATIONS = {
  // Names inspired by various fantasy games
  fantasyNames: [
    'Aether', 'Zephyr', 'Nexus', 'Vortex', 'Prism', 'Echo', 'Nova', 'Cipher', 'Apex', 'Zenith',
    'Kael', 'Lyra', 'Thorne', 'Elara', 'Zara', 'Marcus', 'Rook', 'Kieran', 'Petra', 'Jax',
  ],

  // Quest types from various RPGs
  questTypes: [
    'Slay the Beast', 'Retrieve the Artifact', 'Rescue the Captive', 'Investigate the Mystery',
    'Gather the Ingredients', 'Protect the Village', 'Uncover the Conspiracy', 'Restore the Balance',
    'Defeat the Corrupted', 'Seal the Rift', 'Awaken the Guardian', 'Break the Curse',
  ],

  // Location themes from various games
  locationThemes: [
    'Ancient Ruins', 'Floating Citadel', 'Underground Caverns', 'Crystal Caves', 'Shadow Realm',
    'Temporal Rift', 'Elemental Plane', 'Forgotten Temple', 'Mystic Grove', 'Void Dimension',
  ],

  // Enemy archetypes from RPGs
  enemyArchetypes: [
    'Corrupted Guardian', 'Ancient Construct', 'Shadow Wraith', 'Elemental Spirit', 'Void Entity',
    'Temporal Anomaly', 'Crystal Golem', 'Ethereal Phantom', 'Chaos Beast', 'Balance Breaker',
  ],

  // Item types from various games
  itemTypes: [
    'Legendary Weapon', 'Mystic Artifact', 'Ancient Relic', 'Blessed Armor', 'Cursed Item',
    'Elemental Crystal', 'Temporal Fragment', 'Void Essence', 'Balance Stone', 'Primal Core',
  ],
}

/**
 * Fetch random fact for lore generation
 */
export async function fetchRandomFact(): Promise<string | null> {
  try {
    const response = await fetch(GAME_DATABASES.RANDOM_FACT_API)
    if (!response.ok) return null
    const data = await response.json()
    return data.text || null
  } catch (error) {
    console.warn('Failed to fetch random fact:', error)
    return null
  }
}

/**
 * Fetch random quote for dialogue inspiration
 */
export async function fetchRandomQuote(): Promise<{ text: string; author: string } | null> {
  try {
    const response = await fetch(GAME_DATABASES.QUOTE_API)
    if (!response.ok) return null
    const data = await response.json()
    return {
      text: data.content || '',
      author: data.author || 'Unknown',
    }
  } catch (error) {
    console.warn('Failed to fetch random quote:', error)
    return null
  }
}

/**
 * Fetch random Wikipedia article for worldbuilding inspiration
 */
export async function fetchRandomWikipediaArticle(): Promise<{
  title: string
  extract: string
  url: string
} | null> {
  try {
    const response = await fetch(GAME_DATABASES.WIKIPEDIA_API)
    if (!response.ok) return null
    const data = await response.json()
    return {
      title: data.title || '',
      extract: data.extract || '',
      url: data.content_urls?.desktop?.page || '',
    }
  } catch (error) {
    console.warn('Failed to fetch Wikipedia article:', error)
    return null
  }
}

/**
 * Get random fantasy name from pool
 */
export function getRandomFantasyName(): string {
  const names = GAME_INSPIRATIONS.fantasyNames
  return names[Math.floor(Math.random() * names.length)]
}

/**
 * Get random quest type from pool
 */
export function getRandomQuestType(): string {
  const types = GAME_INSPIRATIONS.questTypes
  return types[Math.floor(Math.random() * types.length)]
}

/**
 * Get random location theme from pool
 */
export function getRandomLocationTheme(): string {
  const themes = GAME_INSPIRATIONS.locationThemes
  return themes[Math.floor(Math.random() * themes.length)]
}

/**
 * Get random enemy archetype from pool
 */
export function getRandomEnemyArchetype(): string {
  const archetypes = GAME_INSPIRATIONS.enemyArchetypes
  return archetypes[Math.floor(Math.random() * archetypes.length)]
}

/**
 * Get random item type from pool
 */
export function getRandomItemType(): string {
  const types = GAME_INSPIRATIONS.itemTypes
  return types[Math.floor(Math.random() * types.length)]
}

/**
 * Generate lore text inspired by digital libraries
 */
export async function generateLoreText(topic: string): Promise<string> {
  try {
    // Try to fetch Wikipedia article related to topic
    const article = await fetchRandomWikipediaArticle()
    if (article) {
      // Extract interesting sentences from the article
      const sentences = article.extract.split('.').filter(s => s.length > 20)
      if (sentences.length > 0) {
        const randomSentence = sentences[Math.floor(Math.random() * Math.min(sentences.length, 3))]
        return `In the world of Aetheris, ${topic} is said to be connected to ancient knowledge. ${randomSentence.substring(0, 200)}...`
      }
    }
  } catch (error) {
    console.warn('Failed to generate lore from Wikipedia:', error)
  }

  // Fallback to generated lore
  return `The ancient texts speak of ${topic}, a mysterious force that has shaped the world of Aetheris for millennia. Scholars debate its true nature, but all agree it holds great power.`
}

/**
 * Generate dialogue inspired by quotes
 */
export async function generateDialogue(character: string, context: string): Promise<string> {
  try {
    const quote = await fetchRandomQuote()
    if (quote) {
      // Adapt quote to game context
      return `${character} says: "${quote.text}" - This wisdom applies to our current situation with ${context}.`
    }
  } catch (error) {
    console.warn('Failed to generate dialogue from quotes:', error)
  }

  // Fallback dialogue
  return `${character} contemplates the situation: "The balance must be maintained. ${context} threatens everything we hold dear."`
}

/**
 * Generate quest description with library inspiration
 */
export async function generateQuestDescription(
  questType: string,
  location: string
): Promise<string> {
  try {
    const fact = await fetchRandomFact()
    if (fact) {
      // Use fact as inspiration for quest
      return `${questType} in ${location}. ${fact.substring(0, 150)}... The ancient forces seem connected to this mystery.`
    }
  } catch (error) {
    console.warn('Failed to generate quest from facts:', error)
  }

  // Fallback quest description
  return `${questType} in ${location}. The balance of forces is at stake, and only you can restore order.`
}

/**
 * Get game-inspired content pool
 */
export function getGameInspiredContent(type: 'name' | 'quest' | 'location' | 'enemy' | 'item'): string {
  switch (type) {
    case 'name':
      return getRandomFantasyName()
    case 'quest':
      return getRandomQuestType()
    case 'location':
      return getRandomLocationTheme()
    case 'enemy':
      return getRandomEnemyArchetype()
    case 'item':
      return getRandomItemType()
    default:
      return 'Unknown'
  }
}

/**
 * Batch fetch library data for content generation
 */
export async function fetchLibraryDataBatch(): Promise<{
  fact: string | null
  quote: { text: string; author: string } | null
  wikipedia: { title: string; extract: string; url: string } | null
}> {
  const [fact, quote, wikipedia] = await Promise.all([
    fetchRandomFact(),
    fetchRandomQuote(),
    fetchRandomWikipediaArticle(),
  ])

  return { fact, quote, wikipedia }
}

