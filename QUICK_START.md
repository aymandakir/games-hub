# Quick Start Guide - New Features

## 🎲 Random Game Modes

### Accessing Random Modes
1. Go to the main menu
2. Click "🎲 Random Game Modes"
3. Choose between:
   - **Procedural Adventure**: Complete random game experience
   - **Endless Arena**: Infinite battles with scaling difficulty

### Procedural Adventure
- Generates 5-10 enemies
- Creates 3-5 unique locations
- Generates 2-4 quests
- All content is procedurally created using digital library APIs

### Endless Arena
- Start at Level 1
- Each level increases difficulty
- Boss encounters every 5 levels
- Infinite progression

---

## 🎮 Using Procedural Content

### In Your Code

```typescript
// Generate a random enemy
import { generateRandomEnemy } from '@/lib/systems/procedural-generator'

const enemy = await generateRandomEnemy('rock', 3)
// Creates a Rock-aligned enemy at difficulty 3

// Generate a location
import { generateRandomLocation } from '@/lib/systems/procedural-generator'

const location = await generateRandomLocation('paper', 2)
// Creates a Paper region location at difficulty 2

// Generate a quest
import { generateRandomQuest } from '@/lib/systems/procedural-generator'

const quest = await generateRandomQuest('scissors', 4)
// Creates a Scissor region quest at difficulty 4

// Start endless mode
import { generateEndlessMode } from '@/lib/systems/procedural-generator'

const mode = await generateEndlessMode(5)
// Level 5 endless mode with appropriate difficulty
```

### Using Enhanced Combat

```typescript
// Generate procedural moves
import { ProceduralMoveGenerator } from '@/lib/systems/enhanced-combat'

const move = ProceduralMoveGenerator.generateMove('rock', 'epic')
// Creates an epic rarity Rock move

// Use adaptive AI
import { adaptiveAI } from '@/lib/systems/enhanced-combat'

const nextMove = adaptiveAI.generateMove(
  enemy,
  roundHistory,
  currentHP,
  playerHP
)
// AI adapts based on player patterns
```

### Using Feedback System

```typescript
import { feedbackSystem } from '@/lib/systems/feedback-system'

// Show different types of feedback
feedbackSystem.success('Enemy defeated!')
feedbackSystem.error('Battle lost!')
feedbackSystem.info('New quest available')
feedbackSystem.warning('Low health!')
feedbackSystem.achievement('Level 10 reached!')
```

---

## 🔧 Integration Points

### Game Store
The `startBattle()` function now accepts:
- String IDs (existing enemies): `startBattle('brick')`
- Enemy objects (procedural): `startBattle(generatedEnemy)`

### New Screen Types
Added to `GameScreen` type:
- `'random-mode'`: Random game mode screen
- `'endless-mode'`: Endless arena screen

---

## 📚 API Integration

### Digital Library APIs Used

1. **RandomUser.me**
   - Fetches random names for characters
   - Fallback to local generator if unavailable

2. **Wikipedia API**
   - Provides lore and descriptions
   - Cached for 24 hours
   - Fallback to generated descriptions

### Caching
- All API responses cached for 24 hours
- Reduces API calls and improves performance
- Automatic cache invalidation

---

## 🎯 Best Practices

1. **Error Handling**: All API calls have fallbacks
2. **Type Safety**: Use TypeScript types throughout
3. **Performance**: Content is generated asynchronously
4. **User Experience**: Loading states for all async operations

---

## 🐛 Troubleshooting

### API Not Working?
- System automatically falls back to local generators
- Check browser console for API errors
- All features work without external APIs

### Content Not Generating?
- Check that async/await is used correctly
- Verify difficulty levels (1-5)
- Ensure region types are correct ('rock' | 'paper' | 'scissors')

### Feedback Not Showing?
- Ensure `FeedbackToast` is in your layout
- Check that `feedbackSystem` is imported correctly
- Verify message types are valid

---

## 🚀 Next Steps

1. Try generating a random game mode
2. Test endless mode progression
3. Experiment with different difficulty levels
4. Check out the adaptive AI in combat
5. Use feedback system for game events

Enjoy the enhanced Aetheris experience! 🎮

