# Aetheris: The Symbol War

A narrative-driven RPG where battles are resolved using Rock-Paper-Scissors, built with Next.js 14, TypeScript, and modern web technologies.

## 🎮 Game Overview

Aetheris is a fantasy world where three ancient forces (Rock, Paper, Scissors) define cultures, magic, and combat. Players choose between two protagonists (Kael or Lyra) and embark on an epic adventure to restore the balance between the three forces.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to see the game.

## 🏗️ Project Structure

```
/app
  /page.tsx              # Title screen
  /game/page.tsx         # Main game container/router
  /layout.tsx            # Root layout
  /globals.css           # Global styles

/components
  /ui                    # Reusable UI components
    Button.tsx
    Card.tsx
    ProgressBar.tsx
    Modal.tsx
  /character             # Character-related components
    CharacterSelect.tsx
  /combat                # Combat system components
    CombatView.tsx
  /game                  # Game-specific components
    ExplorationView.tsx
  /dialogue              # Dialogue system (to be implemented)
    DialogueView.tsx

/lib
  /store                 # Zustand state management
    gameStore.ts
  /types                 # TypeScript type definitions
    game.ts
  /constants             # Game data constants
    characters.ts
    moves.ts
    enemies.ts
    npcs.ts
    locations.ts
    dialogue.ts
  /systems               # Game logic systems
    combat.ts
    dialogue.ts (to be implemented)
    exploration.ts (to be implemented)
```

## 🎯 Core Systems

### State Management (Zustand)

The game uses Zustand for centralized state management with these slices:
- **Player State**: Character, HP, Resolve, Alignment, Inventory
- **Combat State**: Active battles, enemy data, round history
- **Story State**: Act progress, quests, NPC relationships, flags
- **UI State**: Current screen, modals, animations

### Combat System

Rock-Paper-Scissors based combat with:
- Alignment bonuses (affinity affects damage)
- Move effects (buffs, debuffs, status effects)
- Symbol Break ultimate moves
- Enemy AI patterns (predictable, reactive, random, sequence, phase-based)

### Exploration System

Node-based world navigation:
- Locations with interactive points
- Region-based encounters
- Travel between connected nodes

### Dialogue System

Branching dialogue trees:
- Alignment-based choices
- Story flag requirements
- Relationship effects

## 🎨 Design System

### Colors

- **Rock**: Deep grays (#3a3a3a), browns (#6b4423), reds (#8b2635)
- **Paper**: Whites (#ffffff), light blues (#a8d5e2), pastels (#f7dc6f)
- **Scissors**: Metallic silvers (#c9c9c9), purples (#6a4c93), dark blues (#2c3e50)

### Typography

- **UI Text**: Inter (system font)
- **Titles**: Cinzel (fantasy font)

### Animations

- Framer Motion for all transitions
- Custom Tailwind animations for effects
- Particle systems for combat

## 🛠️ Development

### TypeScript

Strict mode enabled. All types defined in `/lib/types/game.ts`.

### Code Quality

- ESLint for linting
- Prettier for formatting
- Type checking: `npm run type-check`

### Debug Mode

Press `D` in-game to toggle debug panel (development only).

Keyboard shortcuts (dev mode):
- `1`, `2`, `3`: Skip to Act 1, 2, or 3
- `W`: Instant win current battle
- `G`: Toggle god mode
- `D`: Reveal all dialogue choices

## 📦 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

The project is configured for Vercel deployment with optimal settings.

### Static Export

```bash
npm run build
# Output in /out directory
```

## 🎮 Game Design

See `RPS-RPG-Design-Document.md` in the parent directory for complete game design documentation.

## 📝 TODO / Roadmap

- [ ] Complete dialogue system implementation
- [ ] Add sound effects and music
- [ ] Implement full story (Acts II and III)
- [ ] Add inventory system
- [ ] Create quest system
- [ ] Add save/load functionality
- [ ] Implement Symbol Break animations
- [ ] Add particle effects for combat
- [ ] Create actual character/enemy sprites
- [ ] Add mobile touch optimizations
- [ ] Implement shop system

## 📄 License

MIT License - See LICENSE file for details

## 👤 Author

Built by Ayman

---

**Version**: 1.0.0  
**Status**: In Development

