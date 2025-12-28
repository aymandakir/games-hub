# 🎲 Procedural Generation & Digital Library Integration Guide

## Quick Start

### 1. Generate Random Content

```typescript
import { 
  generateRandomEnemy, 
  generateRandomQuest, 
  generateRandomLocation,
  generateRandomItem 
} from '@/lib/systems/procedural-generation'

// Generate a random enemy
const enemy = generateRandomEnemy('rock', 5, false)

// Generate a quest
const quest = await generateRandomQuest('paper', 3)

// Generate a location
const location = generateRandomLocation('scissors')

// Generate an item
const item = generateRandomItem('neutral')
```

### 2. Use Digital Libraries

```typescript
import { 
  fetchLibraryDataBatch,
  generateLoreText,
  generateDialogue 
} from '@/lib/systems/digital-libraries'

// Fetch library data
const data = await fetchLibraryDataBatch()
// Returns: { fact, quote, wikipedia }

// Generate lore
const lore = await generateLoreText('ancient magic')

// Generate dialogue
const dialogue = await generateDialogue('Master Thorne', 'the balance')
```

### 3. Enhanced Combat

```typescript
import { resolveEnhancedRound } from '@/lib/systems/enhanced-combat'

const modifiers = {
  playerStatusEffects: [],
  enemyStatusEffects: [],
  comboMultiplier: 1,
  lastMoves: [],
}

const result = resolveEnhancedRound(
  'rock', 
  'scissors', 
  alignment, 
  modifiers, 
  enemy
)
```

### 4. Full Integration

```typescript
import { initializeProceduralRegion } from '@/lib/systems/game-integration'

// Initialize entire region with all content
const region = await initializeProceduralRegion('rock', 5)
// Returns: { enemies, locations, quests, items, lore }
```

## Features

### ✅ Procedural Generation
- **Enemies**: Random names, stats, patterns
- **Quests**: Dynamic quest creation
- **Locations**: Procedural dungeons and areas
- **Items**: Random equipment and consumables

### ✅ Digital Libraries
- **Random Facts**: For lore generation
- **Quotes**: For dialogue inspiration
- **Wikipedia**: For worldbuilding
- **Game-Inspired**: Content pools from popular RPGs

### ✅ Enhanced Combat
- **Status Effects**: Defense, speed, confusion, stun, poison, regeneration
- **Combos**: Consecutive move bonuses
- **Critical Hits**: Alignment-based crits

### ✅ Quest System
- **Regular Quests**: Standard procedurally generated
- **Boss Quests**: Special boss encounters
- **Quest Chains**: Connected multi-quest stories
- **Daily Quests**: Refreshing daily content

## UI Component

Access the procedural content generator at `/procedural`:

```tsx
import ProceduralContentPanel from '@/components/game/ProceduralContentPanel'

<ProceduralContentPanel />
```

## Examples

### Generate a Boss Encounter

```typescript
import { generateBossEncounter } from '@/lib/systems/game-integration'

const boss = generateBossEncounter('rock', 10)
// Returns: { enemy, quest, rewards }
```

### Create a Quest Chain

```typescript
import { generateQuestChain } from '@/lib/systems/quest-generator'

const chain = await generateQuestChain('paper', 3, 1)
// Returns: Array of 3 connected quests
```

### Generate a Dungeon

```typescript
import { generateProceduralDungeon } from '@/lib/systems/procedural-generation'

const dungeon = generateProceduralDungeon('scissors', 5)
// Returns: Array of 5 connected rooms
```

## Performance Tips

1. **Preload Library Data**: Use `preloadLibraryData()` at game start
2. **Cache Results**: Store generated content for reuse
3. **Batch Generation**: Generate multiple items at once
4. **Lazy Loading**: Generate content on-demand

## API Reference

See `IMPROVEMENTS_COMPLETE.md` for full API documentation.



