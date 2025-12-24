'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export interface Notification {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  duration?: number
}

let notificationId = 0
const notifications: Notification[] = []
const listeners: Array<() => void> = []

export function showNotification(message: string, type: Notification['type'] = 'info', duration = 3000) {
  const id = `notification-${notificationId++}`
  const notification: Notification = { id, message, type, duration }
  
  notifications.push(notification)
  listeners.forEach(listener => listener())
  
  setTimeout(() => {
    const index = notifications.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.splice(index, 1)
      listeners.forEach(listener => listener())
    }
  }, duration)
}

export default function NotificationSystem() {
  const [notifs, setNotifs] = useState<Notification[]>([])

  useEffect(() => {
    const update = () => {
      setNotifs([...notifications])
    }
    
    listeners.push(update)
    update()
    
    return () => {
      const index = listeners.indexOf(update)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [])

  const getColorClasses = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-600 border-green-500'
      case 'error':
        return 'bg-red-600 border-red-500'
      case 'warning':
        return 'bg-yellow-600 border-yellow-500'
      default:
        return 'bg-blue-600 border-blue-500'
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifs.map(notification => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            className={`${getColorClasses(notification.type)} text-white px-4 py-3 rounded-lg shadow-lg border max-w-sm`}
          >
            <p className="font-semibold">{notification.message}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

