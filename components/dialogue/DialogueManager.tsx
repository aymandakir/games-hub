'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { DialogueNode, DialogueChoice } from '@/lib/systems/dialogue-advanced'
import Button from '@/components/ui/Button'
import { Lock } from 'lucide-react'

interface DialogueManagerProps {
  node: DialogueNode
  onChoiceSelected: (choiceId: string, nextNodeId: string) => void
  onClose: () => void
}

export default function DialogueManager({ node, onChoiceSelected, onClose }: DialogueManagerProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const typingSpeed = 30 // ms per character
  const textIndexRef = useRef(0)

  // Typewriter effect
  useEffect(() => {
    if (!isTyping) return

    const timer = setInterval(() => {
      if (textIndexRef.current < node.text.length) {
        setDisplayedText(node.text.slice(0, textIndexRef.current + 1))
        textIndexRef.current++
      } else {
        setIsTyping(false)
        clearInterval(timer)
      }
    }, typingSpeed)

    return () => clearInterval(timer)
  }, [node.text, isTyping])

  // Reset when node changes
  useEffect(() => {
    textIndexRef.current = 0
    setDisplayedText('')
    setIsTyping(true)
  }, [node.id])

  const handleChoice = (choice: DialogueChoice) => {
    if (choice.locked) return
    onChoiceSelected(choice.id, choice.nextNodeId)
  }

  const handleSkip = () => {
    setDisplayedText(node.text)
    setIsTyping(false)
    textIndexRef.current = node.text.length
  }

  const getAlignmentColor = (alignment: 'rock' | 'paper' | 'scissors') => {
    switch (alignment) {
      case 'rock':
        return 'border-rock-accent bg-rock-primary/20'
      case 'paper':
        return 'border-paper-accent bg-paper-primary/20'
      case 'scissors':
        return 'border-scissors-accent bg-scissors-primary/20'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 pointer-events-none">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialogue Box */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="relative w-full max-w-4xl bg-neutral-bg border-2 border-neutral-border rounded-xl p-6 pointer-events-auto"
      >
        {/* NPC Portrait */}
        {node.speaker === 'npc' && (
          <div className="absolute -top-16 left-6 w-24 h-24 bg-neutral-bg border-2 border-neutral-border rounded-full flex items-center justify-center">
            <span className="text-4xl">👤</span>
          </div>
        )}

        {/* Dialogue Text */}
        <div className="mb-4 min-h-[80px]">
          <p className="text-lg text-neutral-text leading-relaxed">
            {displayedText}
            {isTyping && <span className="animate-pulse">|</span>}
          </p>
        </div>

        {/* Skip Button */}
        {isTyping && (
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 text-sm text-neutral-text/60 hover:text-neutral-text transition-colors"
          >
            Skip
          </button>
        )}

        {/* Choices */}
        {!isTyping && node.choices && node.choices.length > 0 && (
          <div className="space-y-3 mt-4">
            {node.choices.map((choice, index) => (
              <motion.div
                key={choice.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  onClick={() => handleChoice(choice)}
                  variant={choice.alignment}
                  disabled={choice.locked}
                  className={`
                    w-full text-left justify-start relative
                    ${choice.locked ? 'opacity-50 cursor-not-allowed' : ''}
                    ${getAlignmentColor(choice.alignment)}
                  `}
                >
                  <div className="flex items-center justify-between w-full">
                    <span>{choice.text}</span>
                    {choice.locked && (
                      <div className="group relative">
                        <Lock size={16} />
                        {choice.lockedTooltip && (
                          <div className="absolute right-0 bottom-full mb-2 px-3 py-2 bg-neutral-bg border border-neutral-border rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            {choice.lockedTooltip}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </Button>
              </motion.div>
            ))}
          </div>
        )}

        {/* Auto-advance indicator */}
        {node.autoNext && !isTyping && (
          <div className="text-center mt-4 text-sm text-neutral-text/60">
            Press any key to continue...
          </div>
        )}
      </motion.div>
    </div>
  )
}

