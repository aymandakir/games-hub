'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '@/lib/store/gameStore'
import { MoveType } from '@/lib/types/game'
import Button from '@/components/ui/Button'
import ProgressBar from '@/components/ui/ProgressBar'
import { Hand, Shield, Scissors } from 'lucide-react'

const moveIcons = {
  rock: Shield,
  paper: Hand,
  scissors: Scissors,
}

const moveColors = {
  rock: 'rock',
  paper: 'paper',
  scissors: 'scissors',
}

export default function CombatView() {
  const combat = useGameStore(state => state.combat)
  const player = useGameStore(state => state.player)
  const makeMove = useGameStore(state => state.makeMove)
  const useSymbolBreak = useGameStore(state => state.useSymbolBreak)

  if (!combat.isActive || !combat.enemy) {
    return null
  }

  const handleMove = (move: MoveType) => {
    if (combat.status === 'waiting') {
      makeMove(move)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-bg to-rock-dark p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Enemy Display */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="w-32 h-32 mx-auto bg-neutral-bg/50 rounded-full flex items-center justify-center border-4 border-neutral-border">
            <span className="text-6xl">
              {combat.enemy.type === 'rock' ? '🪨' : combat.enemy.type === 'paper' ? '📄' : '✂️'}
            </span>
          </div>
          <h2 className="text-3xl font-bold">{combat.enemy.name}</h2>
          <ProgressBar
            current={combat.enemyHP}
            max={combat.enemyMaxHP}
            variant={moveColors[combat.enemy.type]}
            label="Enemy HP"
          />
        </motion.div>

        {/* Battle Log */}
        {combat.roundHistory.length > 0 && (
          <div className="bg-neutral-bg/50 rounded-lg p-4 space-y-2 max-h-32 overflow-y-auto">
            {combat.roundHistory.slice(-3).map((round, idx) => (
              <div key={idx} className="text-sm text-neutral-text/80">
                Round {round.round}: You chose {round.playerMove}, Enemy chose {round.enemyMove} -{' '}
                {round.winner === 'player'
                  ? 'You win!'
                  : round.winner === 'enemy'
                    ? 'Enemy wins!'
                    : 'Tie!'}
              </div>
            ))}
          </div>
        )}

        {/* Player Stats */}
        <div className="space-y-4">
          <ProgressBar
            current={combat.playerHP}
            max={combat.playerMaxHP}
            variant="neutral"
            shape="mountain"
            label="Your HP"
          />
          <ProgressBar
            current={combat.playerResolve}
            max={combat.maxResolve}
            variant="paper"
            shape="scroll"
            label="Resolve"
          />
        </div>

        {/* Move Selection */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-center">Choose Your Move</h3>
          <div className="grid grid-cols-3 gap-4">
            {(['rock', 'paper', 'scissors'] as MoveType[]).map(move => {
              const Icon = moveIcons[move]
              const isSelected = combat.playerMove === move
              const isWaiting = combat.status === 'waiting'

              return (
                <motion.div
                  key={move}
                  whileHover={isWaiting ? { scale: 1.1 } : {}}
                  whileTap={isWaiting ? { scale: 0.9 } : {}}
                >
                  <Button
                    onClick={() => handleMove(move)}
                    variant={moveColors[move]}
                    size="lg"
                    disabled={!isWaiting}
                    className={`
                      h-32 flex flex-col items-center justify-center gap-2
                      ${isSelected ? 'ring-4 ring-white' : ''}
                    `}
                  >
                    <Icon size={48} />
                    <span className="text-lg font-bold capitalize">{move}</span>
                  </Button>
                </motion.div>
              )
            })}
          </div>

          {/* Symbol Break Button */}
          {combat.canUseSymbolBreak && player.character && (
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: [0.9, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <Button
                onClick={useSymbolBreak}
                variant="primary"
                size="lg"
                className="w-full bg-gradient-to-r from-rock-accent via-paper-accent to-scissors-accent text-white"
              >
                Use Symbol Break!
              </Button>
            </motion.div>
          )}
        </div>

        {/* Reveal Animation */}
        <AnimatePresence>
          {combat.status === 'resolving' && combat.playerMove && combat.enemyMove && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            >
              <div className="text-center space-y-8">
                <div className="text-6xl">
                  {combat.playerMove === 'rock' ? '🪨' : combat.playerMove === 'paper' ? '📄' : '✂️'}
                  <span className="mx-8">VS</span>
                  {combat.enemyMove === 'rock' ? '🪨' : combat.enemyMove === 'paper' ? '📄' : '✂️'}
                </div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-3xl font-bold"
                >
                  {combat.roundHistory[combat.roundHistory.length - 1]?.winner === 'player'
                    ? 'You Win!'
                    : combat.roundHistory[combat.roundHistory.length - 1]?.winner === 'enemy'
                      ? 'Enemy Wins!'
                      : 'Tie!'}
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

