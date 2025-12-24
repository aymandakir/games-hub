import { create } from 'zustand'
import {
  GameScreen,
  CharacterId,
  PlayerState,
  CombatState,
  StoryState,
  UIState,
  Alignment,
  Enemy,
  RoundResult,
  MoveType,
  Location,
  DialogueNode,
} from '@/lib/types/game'
import { CHARACTERS } from '@/lib/constants/characters'
import { getEnemy, ENEMIES } from '@/lib/constants/enemies'
import { getLocation, LOCATIONS } from '@/lib/constants/locations'
import { getDialogueNode } from '@/lib/constants/dialogue'
import {
  resolveRound,
  getEnemyMove,
  checkBattleEnd,
  canUseSymbolBreak,
  calculateResolveGain,
} from '@/lib/systems/combat'
import { getSaveSystem, SaveMetadata } from '@/lib/systems/save-system'

interface GameStore {
  // State slices
  player: PlayerState
  combat: CombatState
  story: StoryState
  ui: UIState

  // Actions
  selectCharacter: (character: CharacterId) => void
  startBattle: (enemyId: string) => void
  makeMove: (move: MoveType) => void
  resolveCombatRound: () => void
  endBattle: (result: 'victory' | 'defeat') => void
  useSymbolBreak: () => void
  travelToLocation: (locationId: string) => void
  interactWithPoint: (pointId: string) => void
  makeDialogueChoice: (choiceId: string) => void
  updateAlignment: (alignment: Partial<Alignment>) => void
  updateStoryFlag: (flag: string, value: boolean) => void
  updateNPCRelationship: (npcId: string, change: number) => void
  setScreen: (screen: GameScreen) => void
  resetGame: () => void

  // Save/Load actions
  saveGame: (slotId: string) => Promise<void>
  loadGame: (slotId: string) => Promise<void>
  quickSave: () => Promise<void>
  getAllSaves: () => Promise<SaveMetadata[]>
  deleteSave: (slotId: string) => Promise<void>
  lastAutoSave: number | null
  autoSaveEnabled: boolean
  setAutoSaveEnabled: (enabled: boolean) => void
  playtime: number
}

const initialPlayerState: PlayerState = {
  character: null,
  hp: 100,
  maxHP: 100,
  resolve: 0,
  maxResolve: 100,
  alignment: { rock: 0, paper: 0, scissors: 0 },
  inventory: [],
  currentLocation: 'crosspoint',
  level: 1,
  experience: 0,
}

const initialCombatState: CombatState = {
  isActive: false,
  enemy: null,
  playerHP: 100,
  playerMaxHP: 100,
  enemyHP: 0,
  enemyMaxHP: 0,
  playerResolve: 0,
  maxResolve: 100,
  round: 0,
  roundHistory: [],
  playerMove: null,
  enemyMove: null,
  status: 'waiting',
  consecutiveWins: 0,
  canUseSymbolBreak: false,
}

const initialStoryState: StoryState = {
  act: 1,
  currentQuest: undefined,
  completedQuests: [],
  npcRelationships: {},
  dialogueChoices: {},
  storyFlags: {},
  unlockedLocations: ['crosspoint'],
  visitedLocations: ['crosspoint'],
}

const initialUIState: UIState = {
  currentScreen: 'title',
  activeModal: null,
  animationsInProgress: [],
  showDebugPanel: false,
}

// Helper function to show notifications
function showNotification(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
  // Create notification element
  const notification = document.createElement('div')
  notification.className = `fixed top-4 right-4 px-4 py-2 rounded shadow-lg z-50 ${
    type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-blue-600'
  } text-white`
  notification.textContent = message
  document.body.appendChild(notification)

  setTimeout(() => {
    notification.remove()
  }, 3000)
}

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  player: initialPlayerState,
  combat: initialCombatState,
  story: initialStoryState,
  ui: initialUIState,

  // Character selection
  selectCharacter: (character: CharacterId) => {
    const char = CHARACTERS[character]
    set({
      player: {
        ...initialPlayerState,
        character,
        hp: char.baseHP,
        maxHP: char.maxHP,
        alignment: { ...char.alignment },
      },
      ui: {
        ...get().ui,
        currentScreen: 'intro',
      },
    })
  },

  // Combat actions
  startBattle: (enemyId: string) => {
    const enemy = getEnemy(enemyId)
    if (!enemy) return

    const player = get().player
    set({
      combat: {
        ...initialCombatState,
        isActive: true,
        enemy: { ...enemy, currentHP: enemy.maxHP },
        playerHP: player.hp,
        playerMaxHP: player.maxHP,
        enemyHP: enemy.maxHP,
        enemyMaxHP: enemy.maxHP,
        playerResolve: player.resolve,
        status: 'waiting',
      },
      ui: {
        ...get().ui,
        currentScreen: 'combat',
      },
    })
  },

  makeMove: (move: MoveType) => {
    const state = get()
    if (!state.combat.isActive || state.combat.status !== 'waiting') return

    const enemy = state.combat.enemy
    if (!enemy) return

    // Get enemy move
    const enemyMove = getEnemyMove(enemy, state.combat.roundHistory, enemy.currentHP)

    // Resolve round
    const roundResult = resolveRound(move, enemyMove, state.player.alignment)
    roundResult.round = state.combat.round + 1

    // Calculate new HP
    const newPlayerHP = Math.max(0, state.combat.playerHP - roundResult.enemyDamage)
    const newEnemyHP = Math.max(0, enemy.currentHP - roundResult.playerDamage)

    // Update enemy HP
    enemy.currentHP = newEnemyHP

    // Calculate resolve gain
    const resolveGain = calculateResolveGain(roundResult)
    const newResolve = Math.min(100, state.combat.playerResolve + resolveGain)

    // Update consecutive wins
    const newConsecutiveWins =
      roundResult.winner === 'player' ? state.combat.consecutiveWins + 1 : 0

    // Check Symbol Break availability
    const symbolBreakAvailable = canUseSymbolBreak(
      newResolve,
      newConsecutiveWins,
      newPlayerHP
    )

    // Update round history
    const newRoundHistory = [...state.combat.roundHistory, roundResult].slice(-10) // Keep last 10

    set({
      combat: {
        ...state.combat,
        playerMove: move,
        enemyMove,
        playerHP: newPlayerHP,
        enemyHP: newEnemyHP,
        enemy,
        playerResolve: newResolve,
        round: roundResult.round,
        roundHistory: newRoundHistory,
        status: 'resolving',
        consecutiveWins: newConsecutiveWins,
        canUseSymbolBreak: symbolBreakAvailable,
      },
    })

    // Check battle end after a delay (for animation)
    setTimeout(() => {
      const battleResult = checkBattleEnd(newPlayerHP, newEnemyHP)
      if (battleResult !== 'ongoing') {
        get().endBattle(battleResult)
      } else {
        // Continue battle
        set({
          combat: {
            ...get().combat,
            status: 'waiting',
            playerMove: null,
            enemyMove: null,
          },
        })
      }
    }, 1500) // 1.5s delay for animations
  },

  resolveCombatRound: () => {
    // This is called after animations complete
    const state = get()
    if (state.combat.status === 'resolving') {
      const battleResult = checkBattleEnd(state.combat.playerHP, state.combat.enemyHP)
      if (battleResult !== 'ongoing') {
        get().endBattle(battleResult)
      } else {
        set({
          combat: {
            ...state.combat,
            status: 'waiting',
            playerMove: null,
            enemyMove: null,
          },
        })
      }
    }
  },

  endBattle: (result: 'victory' | 'defeat') => {
    const state = get()
    set({
      combat: {
        ...state.combat,
        isActive: false,
        status: result,
      },
      player: {
        ...state.player,
        hp: state.combat.playerHP,
        resolve: state.combat.playerResolve,
      },
      ui: {
        ...state.ui,
        currentScreen: result === 'victory' ? 'victory' : 'defeat',
      },
    })
  },

  useSymbolBreak: () => {
    const state = get()
    if (!state.combat.canUseSymbolBreak || !state.player.character) return

    const character = CHARACTERS[state.player.character]
    const symbolBreak = character.symbolBreak

    // Apply Symbol Break damage
    const enemy = state.combat.enemy
    if (!enemy) return

    const damage = symbolBreak.effect.damage || 150
    const newEnemyHP = Math.max(0, enemy.currentHP - damage)
    enemy.currentHP = newEnemyHP

    // Reset resolve
    set({
      combat: {
        ...state.combat,
        enemyHP: newEnemyHP,
        enemy,
        playerResolve: 0,
        canUseSymbolBreak: false,
      },
    })

    // Check if battle ends
    setTimeout(() => {
      const battleResult = checkBattleEnd(state.combat.playerHP, newEnemyHP)
      if (battleResult !== 'ongoing') {
        get().endBattle(battleResult)
      } else {
        set({
          combat: {
            ...get().combat,
            status: 'waiting',
            playerMove: null,
            enemyMove: null,
          },
        })
      }
    }, 2000)
  },

  // Exploration actions
  travelToLocation: (locationId: string) => {
    const location = getLocation(locationId)
    if (!location) return

    const state = get()
    const visited = [...state.story.visitedLocations]
    if (!visited.includes(locationId)) {
      visited.push(locationId)
    }

    set({
      player: {
        ...state.player,
        currentLocation: locationId,
      },
      story: {
        ...state.story,
        visitedLocations: visited,
      },
      ui: {
        ...state.ui,
        currentScreen: 'exploration',
      },
    })
  },

  interactWithPoint: (pointId: string) => {
    const state = get()
    const location = getLocation(state.player.currentLocation)
    if (!location) return

    const point = location.interactivePoints.find(p => p.id === pointId)
    if (!point) return

    if (point.type === 'npc' && point.npcId) {
      // Start dialogue
      const dialogueNode = getDialogueNode('thorne_intro') // Simplified - should get from NPC
      if (dialogueNode) {
        set({
          ui: {
            ...state.ui,
            currentScreen: 'dialogue',
            activeModal: point.npcId,
          },
        })
      }
    } else if (point.type === 'shop') {
      // Open shop (placeholder)
      set({
        ui: {
          ...state.ui,
          activeModal: 'shop',
        },
      })
    } else if (point.type === 'training') {
      // Start training battle
      get().startBattle('brick')
    }
  },

  // Dialogue actions
  makeDialogueChoice: (choiceId: string) => {
    // Simplified - full implementation would navigate dialogue tree
    const state = get()
    set({
      story: {
        ...state.story,
        dialogueChoices: {
          ...state.story.dialogueChoices,
          [choiceId]: choiceId,
        },
      },
      ui: {
        ...state.ui,
        currentScreen: 'exploration',
        activeModal: null,
      },
    })
  },

  // State updates
  updateAlignment: (alignment: Partial<Alignment>) => {
    const state = get()
    const newAlignment = {
      ...state.player.alignment,
      ...alignment,
    }
    // Normalize to 100%
    const total = newAlignment.rock + newAlignment.paper + newAlignment.scissors
    if (total !== 100) {
      const factor = 100 / total
      newAlignment.rock = Math.round(newAlignment.rock * factor)
      newAlignment.paper = Math.round(newAlignment.paper * factor)
      newAlignment.scissors = Math.round(newAlignment.scissors * factor)
    }
    set({
      player: {
        ...state.player,
        alignment: newAlignment,
      },
    })
  },

  updateStoryFlag: (flag: string, value: boolean) => {
    set({
      story: {
        ...get().story,
        storyFlags: {
          ...get().story.storyFlags,
          [flag]: value,
        },
      },
    })
  },

  updateNPCRelationship: (npcId: string, change: number) => {
    const state = get()
    const current = state.story.npcRelationships[npcId] || 0
    set({
      story: {
        ...state.story,
        npcRelationships: {
          ...state.story.npcRelationships,
          [npcId]: Math.max(0, Math.min(100, current + change)),
        },
      },
    })
  },

  setScreen: (screen: GameScreen) => {
    set({
      ui: {
        ...get().ui,
        currentScreen: screen,
      },
    })
  },

  resetGame: () => {
    set({
      player: initialPlayerState,
      combat: initialCombatState,
      story: initialStoryState,
      ui: initialUIState,
      playtime: 0,
      lastAutoSave: null,
    })
  },

  // Save/Load actions
  playtime: 0,
  lastAutoSave: null,
  autoSaveEnabled: true,

  saveGame: async (slotId: string) => {
    const saveSystem = await getSaveSystem()
    const currentState = get()

    const saveData = {
      version: '1.0.0',
      timestamp: Date.now(),
      playtime: currentState.playtime,
      player: currentState.player,
      story: currentState.story,
      combat: currentState.combat,
      inventory: currentState.player.inventory,
      relationships: currentState.story.npcRelationships,
      quests: currentState.story.completedQuests,
      currentLocation: currentState.player.currentLocation,
      unlockedLocations: currentState.story.unlockedLocations,
      storyFlags: currentState.story.storyFlags,
      achievements: [],
    }

    await saveSystem.saveGame(slotId, saveData)
    set({ lastAutoSave: Date.now() })
    showNotification('Game saved successfully!', 'success')
  },

  loadGame: async (slotId: string) => {
    const saveSystem = await getSaveSystem()
    const saveData = await saveSystem.loadGame(slotId)

    if (!saveData) {
      showNotification('Failed to load save', 'error')
      return
    }

    set({
      player: saveData.player,
      story: saveData.story,
      combat: saveData.combat,
      playtime: saveData.playtime,
    })

    showNotification('Game loaded successfully!', 'success')
  },

  quickSave: async () => {
    await get().saveGame('quicksave')
  },

  getAllSaves: async () => {
    const saveSystem = await getSaveSystem()
    return await saveSystem.getAllSaves()
  },

  deleteSave: async (slotId: string) => {
    const saveSystem = await getSaveSystem()
    await saveSystem.deleteSave(slotId)
    showNotification('Save deleted', 'info')
  },

  setAutoSaveEnabled: (enabled: boolean) => {
    set({ autoSaveEnabled: enabled })
  },
}))

