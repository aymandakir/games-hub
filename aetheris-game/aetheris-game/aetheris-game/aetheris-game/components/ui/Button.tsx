'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { MoveType } from '@/lib/types/game'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'rock' | 'paper' | 'scissors'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  className?: string
}

const variantStyles = {
  primary: 'bg-neutral-bg border-neutral-border text-neutral-text',
  secondary: 'bg-neutral-bg/50 border-neutral-border/50 text-neutral-text/80',
  rock: 'bg-rock-primary border-rock-accent text-white hover:bg-rock-secondary',
  paper: 'bg-paper-primary border-paper-accent text-rock-primary hover:bg-paper-secondary',
  scissors: 'bg-scissors-primary border-scissors-accent text-white hover:bg-scissors-secondary',
}

const sizeStyles = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
}: ButtonProps) {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        border-2 rounded-lg font-medium
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </motion.button>
  )
}

