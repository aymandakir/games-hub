'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'

export default function TitleScreen() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-bg via-rock-dark to-neutral-bg flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-8"
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-7xl md:text-9xl font-bold font-fantasy bg-gradient-to-r from-rock-highlight via-paper-accent to-scissors-highlight bg-clip-text text-transparent"
        >
          AETHERIS
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-2xl md:text-3xl text-neutral-text/80 font-fantasy"
        >
          The Symbol War
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="pt-8"
        >
          <Button
            onClick={() => router.push('/game')}
            variant="primary"
            size="lg"
            className="text-xl px-12 py-6"
          >
            Begin Adventure
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}

