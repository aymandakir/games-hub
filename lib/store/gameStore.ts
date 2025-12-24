import { create } from 'zustand'

interface Player {
  character: 'kael' | 'lyra' | null
  hp: number
  maxHP: number
  alignment: {
    rock: number
    paper: number
    scissors: number
  }
}

interface Enemy {
  name: string
  hp: number
  maxHP: number
  type: 'rock' | 'paper' | 'scissors'
}

interface GameStore {
  // Game state
  currentScreen: 'title' | 'character_select' | 'exploration' | 'combat'
  player: Player
  currentEnemy: Enemy | null
  battleLog: string[]

  // Actions
  setScreen: (screen: GameStore['currentScreen']) => void
  selectCharacter: (character: 'kael' | 'lyra') => void
  startBattle: (enemy: Enemy) => void
  endBattle: () => void
  playerMove: (move: 'rock' | 'paper' | 'scissors') => void
  addLog: (message: string) => void
}

export const useGameStore = create<GameStore>((set, get) => ({
  currentScreen: 'title',
  player: {
    character: null,
    hp: 100,
    maxHP: 100,
    alignment: { rock: 33, paper: 33, scissors: 34 },
  },
  currentEnemy: null,
  battleLog: [],

  setScreen: (screen) => set({ currentScreen: screen }),

  selectCharacter: (character) => {
    const alignment =
      character === 'kael'
        ? { rock: 15, paper: 60, scissors: 25 }
        : { rock: 25, paper: 15, scissors: 60 }

    set({
      player: { ...get().player, character, alignment },
      currentScreen: 'exploration',
    })
  },

  startBattle: (enemy) => {
    set({
      currentEnemy: enemy,
      currentScreen: 'combat',
      battleLog: [`A ${enemy.name} appears!`],
    })
  },

  endBattle: () => {
    set({
      currentEnemy: null,
      currentScreen: 'exploration',
      battleLog: [],
    })
  },

  playerMove: (playerChoice) => {
    const state = get()
    const enemy = state.currentEnemy
    if (!enemy) return

    // Enemy AI - random choice
    const choices: Array<'rock' | 'paper' | 'scissors'> = ['rock', 'paper', 'scissors']
    const enemyChoice = choices[Math.floor(Math.random() * 3)]

    // Determine winner
    let result: 'win' | 'lose' | 'tie' = 'tie'
    if (playerChoice === enemyChoice) {
      result = 'tie'
    } else if (
      (playerChoice === 'rock' && enemyChoice === 'scissors') ||
      (playerChoice === 'paper' && enemyChoice === 'rock') ||
      (playerChoice === 'scissors' && enemyChoice === 'paper')
    ) {
      result = 'win'
    } else {
      result = 'lose'
    }

    // Apply damage
    let newPlayerHP = state.player.hp
    let newEnemyHP = enemy.hp
    let logMessage = `You: ${playerChoice} | Enemy: ${enemyChoice} - `

    if (result === 'win') {
      newEnemyHP = Math.max(0, enemy.hp - 25)
      logMessage += `Hit! Enemy takes 25 damage.`
    } else if (result === 'lose') {
      newPlayerHP = Math.max(0, state.player.hp - 20)
      logMessage += `Hit! You take 20 damage.`
    } else {
      logMessage += `Tie! No damage.`
    }

    // Update state
    set({
      player: { ...state.player, hp: newPlayerHP },
      currentEnemy: { ...enemy, hp: newEnemyHP },
      battleLog: [...state.battleLog, logMessage].slice(-5),
    })

    // Check for battle end
    setTimeout(() => {
      const currentState = get()
      if (newEnemyHP <= 0) {
        set({ battleLog: [...currentState.battleLog, '🎉 Victory!'] })
        setTimeout(() => get().endBattle(), 2000)
      } else if (newPlayerHP <= 0) {
        set({ battleLog: [...currentState.battleLog, '💀 Defeat!'] })
        setTimeout(() => {
          set({
            player: { ...currentState.player, hp: 100 },
            currentScreen: 'exploration',
            currentEnemy: null,
            battleLog: [],
          })
        }, 2000)
      }
    }, 100)
  },

  addLog: (message) => {
    set({ battleLog: [...get().battleLog, message].slice(-5) })
  },
}))

