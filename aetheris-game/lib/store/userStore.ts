import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface GameProgress {
  gameId: string
  highScore: number
  timesPlayed: number
  lastPlayed: number
  achievements: string[]
}

interface UserStore {
  username: string | null
  totalPlaytime: number
  gameProgress: Record<string, GameProgress>
  achievements: string[]

  setUsername: (name: string) => void
  updateGameProgress: (gameId: string, score: number) => void
  unlockAchievement: (id: string) => void
  getTotalGamesPlayed: () => number
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      username: null,
      totalPlaytime: 0,
      gameProgress: {},
      achievements: [],

      setUsername: name => set({ username: name }),

      updateGameProgress: (gameId, score) => {
        const current = get().gameProgress[gameId] || {
          gameId,
          highScore: 0,
          timesPlayed: 0,
          lastPlayed: 0,
          achievements: [],
        }

        set({
          gameProgress: {
            ...get().gameProgress,
            [gameId]: {
              ...current,
              highScore: Math.max(current.highScore, score),
              timesPlayed: current.timesPlayed + 1,
              lastPlayed: Date.now(),
            },
          },
        })
      },

      unlockAchievement: id => {
        if (!get().achievements.includes(id)) {
          set({ achievements: [...get().achievements, id] })
        }
      },

      getTotalGamesPlayed: () => {
        return Object.values(get().gameProgress).reduce((sum, game) => sum + game.timesPlayed, 0)
      },
    }),
    {
      name: 'game-hub-user',
    }
  )
)

