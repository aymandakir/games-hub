/**
 * Keyboard utilities for game controls
 */

export type KeyCode = string

export interface KeyboardHandler {
  key: KeyCode | KeyCode[]
  handler: (event: KeyboardEvent) => void
  preventDefault?: boolean
}

class KeyboardManager {
  private handlers: Map<string, KeyboardHandler[]> = new Map()
  private isEnabled = true

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', this.handleKeyDown.bind(this))
      window.addEventListener('keyup', this.handleKeyUp.bind(this))
    }
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (!this.isEnabled) return

    const key = event.key.toLowerCase()
    const handlers = this.handlers.get(key) || []

    handlers.forEach(({ handler, preventDefault }) => {
      if (preventDefault) {
        event.preventDefault()
      }
      handler(event)
    })
  }

  private handleKeyUp(event: KeyboardEvent) {
    // Handle key up events if needed
  }

  register(handler: KeyboardHandler) {
    const keys = Array.isArray(handler.key) ? handler.key : [handler.key]
    
    keys.forEach(key => {
      const normalizedKey = key.toLowerCase()
      if (!this.handlers.has(normalizedKey)) {
        this.handlers.set(normalizedKey, [])
      }
      this.handlers.get(normalizedKey)!.push(handler)
    })

    // Return unsubscribe function
    return () => {
      keys.forEach(key => {
        const normalizedKey = key.toLowerCase()
        const handlers = this.handlers.get(normalizedKey)
        if (handlers) {
          const index = handlers.indexOf(handler)
          if (index > -1) {
            handlers.splice(index, 1)
          }
        }
      })
    }
  }

  setEnabled(enabled: boolean) {
    this.isEnabled = enabled
  }

  clear() {
    this.handlers.clear()
  }
}

export const keyboardManager = new KeyboardManager()

/**
 * Hook for keyboard shortcuts
 */
export function useKeyboardShortcut(
  key: KeyCode | KeyCode[],
  handler: (event: KeyboardEvent) => void,
  preventDefault = true
) {
  if (typeof window === 'undefined') return

  const keyboardHandler: KeyboardHandler = {
    key,
    handler,
    preventDefault,
  }

  // This would be used in a useEffect in a component
  return keyboardManager.register(keyboardHandler)
}

