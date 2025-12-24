'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  variant?: 'rock' | 'paper' | 'scissors' | 'neutral'
  className?: string
  onClick?: () => void
}

const variantStyles = {
  rock: 'bg-rock-primary/10 border-rock-accent backdrop-blur-sm',
  paper: 'bg-paper-primary/10 border-paper-accent backdrop-blur-sm',
  scissors: 'bg-scissors-primary/10 border-scissors-accent backdrop-blur-sm',
  neutral: 'bg-neutral-bg/50 border-neutral-border backdrop-blur-sm',
}

export default function Card({
  children,
  variant = 'neutral',
  className = '',
  onClick,
}: CardProps) {
  const Component = onClick ? motion.div : motion.div

  return (
    <Component
      whileHover={onClick ? { y: -4, scale: 1.02 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      onClick={onClick}
      className={`
        ${variantStyles[variant]}
        border-2 rounded-xl p-6
        transition-all duration-300
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </Component>
  )
}

