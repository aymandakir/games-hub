'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { feedbackSystem, FeedbackMessage } from '@/lib/systems/feedback-system'

export default function FeedbackToast() {
  const [messages, setMessages] = useState<FeedbackMessage[]>([])

  useEffect(() => {
    const unsubscribe = feedbackSystem.subscribe(setMessages)
    return unsubscribe
  }, [])

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-600 text-white'
      case 'error':
        return 'bg-red-600 text-white'
      case 'warning':
        return 'bg-yellow-600 text-white'
      case 'achievement':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
      default:
        return 'bg-blue-600 text-white'
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✓'
      case 'error':
        return '✕'
      case 'warning':
        return '⚠'
      case 'achievement':
        return '★'
      default:
        return 'ℹ'
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {messages.map(message => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className={`${getTypeStyles(message.type)} px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] max-w-[400px]`}
          >
            <span className="text-xl font-bold">{getIcon(message.type)}</span>
            <span className="flex-1 text-sm font-medium">{message.message}</span>
            <button
              onClick={() => feedbackSystem.remove(message.id)}
              className="text-white/80 hover:text-white text-lg font-bold"
            >
              ×
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

