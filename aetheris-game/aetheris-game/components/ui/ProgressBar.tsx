'use client'

import { motion } from 'framer-motion'

interface ProgressBarProps {
  current: number
  max: number
  variant?: 'rock' | 'paper' | 'scissors' | 'neutral'
  shape?: 'mountain' | 'scroll' | 'blade' | 'bar'
  label?: string
  showNumbers?: boolean
}

const variantColors = {
  rock: {
    bg: 'bg-rock-primary',
    accent: 'bg-rock-accent',
    highlight: 'bg-rock-highlight',
  },
  paper: {
    bg: 'bg-paper-primary',
    accent: 'bg-paper-accent',
    highlight: 'bg-paper-highlight',
  },
  scissors: {
    bg: 'bg-scissors-primary',
    accent: 'bg-scissors-accent',
    highlight: 'bg-scissors-highlight',
  },
  neutral: {
    bg: 'bg-neutral-text',
    accent: 'bg-neutral-text/80',
    highlight: 'bg-neutral-text/60',
  },
}

export default function ProgressBar({
  current,
  max,
  variant = 'neutral',
  shape = 'bar',
  label,
  showNumbers = true,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (current / max) * 100))
  const colors = variantColors[variant]

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-neutral-text">{label}</span>
          {showNumbers && (
            <span className="text-sm text-neutral-text/80">
              {current} / {max}
            </span>
          )}
        </div>
      )}
      <div
        className={`
          w-full h-6 rounded-lg overflow-hidden
          ${shape === 'mountain' ? 'rounded-t-lg rounded-b-none' : ''}
          ${shape === 'scroll' ? 'rounded-full' : ''}
          ${shape === 'blade' ? 'rounded-sm' : ''}
          bg-neutral-bg border border-neutral-border
        `}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`
            h-full ${colors.bg}
            ${shape === 'mountain' ? 'rounded-t-lg' : ''}
            ${shape === 'scroll' ? 'rounded-full' : ''}
            relative overflow-hidden
          `}
        >
          {shape === 'mountain' && (
            <div className="absolute inset-0 bg-gradient-to-t from-rock-dark to-transparent opacity-50" />
          )}
        </motion.div>
      </div>
    </div>
  )
}

