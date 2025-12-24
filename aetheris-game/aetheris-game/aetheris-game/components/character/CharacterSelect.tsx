'use client'

import { motion } from 'framer-motion'
import { useGameStore } from '@/lib/store/gameStore'
import { CHARACTERS } from '@/lib/constants/characters'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import ProgressBar from '@/components/ui/ProgressBar'

export default function CharacterSelect() {
  const selectCharacter = useGameStore(state => state.selectCharacter)

  const kael = CHARACTERS.kael
  const lyra = CHARACTERS.lyra

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-bg via-rock-dark to-neutral-bg p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto"
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold font-fantasy text-center mb-12 text-neutral-text"
        >
          Choose Your Hero
        </motion.h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Kael Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card variant="paper" className="h-full">
              <div className="space-y-6">
                {/* Portrait Placeholder */}
                <div className="w-32 h-32 mx-auto bg-paper-primary/20 rounded-full flex items-center justify-center border-4 border-paper-accent">
                  <span className="text-4xl">K</span>
                </div>

                <h2 className="text-3xl font-bold text-center">{kael.name}</h2>
                <p className="text-neutral-text/80 text-center">{kael.bio}</p>

                {/* Alignment Bars */}
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Rock</span>
                      <span>{kael.alignment.rock}%</span>
                    </div>
                    <ProgressBar
                      current={kael.alignment.rock}
                      max={100}
                      variant="rock"
                      showNumbers={false}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Paper</span>
                      <span>{kael.alignment.paper}%</span>
                    </div>
                    <ProgressBar
                      current={kael.alignment.paper}
                      max={100}
                      variant="paper"
                      showNumbers={false}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Scissors</span>
                      <span>{kael.alignment.scissors}%</span>
                    </div>
                    <ProgressBar
                      current={kael.alignment.scissors}
                      max={100}
                      variant="scissors"
                      showNumbers={false}
                    />
                  </div>
                </div>

                <Button
                  onClick={() => selectCharacter('kael')}
                  variant="paper"
                  size="lg"
                  className="w-full"
                >
                  Choose Kael
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Lyra Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card variant="scissors" className="h-full">
              <div className="space-y-6">
                {/* Portrait Placeholder */}
                <div className="w-32 h-32 mx-auto bg-scissors-primary/20 rounded-full flex items-center justify-center border-4 border-scissors-accent">
                  <span className="text-4xl">L</span>
                </div>

                <h2 className="text-3xl font-bold text-center">{lyra.name}</h2>
                <p className="text-neutral-text/80 text-center">{lyra.bio}</p>

                {/* Alignment Bars */}
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Rock</span>
                      <span>{lyra.alignment.rock}%</span>
                    </div>
                    <ProgressBar
                      current={lyra.alignment.rock}
                      max={100}
                      variant="rock"
                      showNumbers={false}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Paper</span>
                      <span>{lyra.alignment.paper}%</span>
                    </div>
                    <ProgressBar
                      current={lyra.alignment.paper}
                      max={100}
                      variant="paper"
                      showNumbers={false}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Scissors</span>
                      <span>{lyra.alignment.scissors}%</span>
                    </div>
                    <ProgressBar
                      current={lyra.alignment.scissors}
                      max={100}
                      variant="scissors"
                      showNumbers={false}
                    />
                  </div>
                </div>

                <Button
                  onClick={() => selectCharacter('lyra')}
                  variant="scissors"
                  size="lg"
                  className="w-full"
                >
                  Choose Lyra
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

