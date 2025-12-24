/**
 * Enhanced Feedback System
 * Provides visual and audio feedback for game events
 */

export type FeedbackType = 'success' | 'error' | 'info' | 'warning' | 'achievement'

export interface FeedbackMessage {
  id: string
  type: FeedbackType
  message: string
  duration: number
  timestamp: number
}

class FeedbackSystem {
  private messages: FeedbackMessage[] = []
  private subscribers: Array<(messages: FeedbackMessage[]) => void> = []

  /**
   * Show a feedback message
   */
  show(message: string, type: FeedbackType = 'info', duration: number = 3000): void {
    const feedback: FeedbackMessage = {
      id: `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      message,
      duration,
      timestamp: Date.now(),
    }

    this.messages.push(feedback)
    this.notifySubscribers()

    // Auto-remove after duration
    setTimeout(() => {
      this.remove(feedback.id)
    }, duration)
  }

  /**
   * Remove a feedback message
   */
  remove(id: string): void {
    this.messages = this.messages.filter(msg => msg.id !== id)
    this.notifySubscribers()
  }

  /**
   * Clear all messages
   */
  clear(): void {
    this.messages = []
    this.notifySubscribers()
  }

  /**
   * Get current messages
   */
  getMessages(): FeedbackMessage[] {
    return [...this.messages]
  }

  /**
   * Subscribe to feedback updates
   */
  subscribe(callback: (messages: FeedbackMessage[]) => void): () => void {
    this.subscribers.push(callback)
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback)
    }
  }

  private notifySubscribers(): void {
    this.subscribers.forEach(callback => callback(this.messages))
  }

  // Convenience methods
  success(message: string, duration?: number): void {
    this.show(message, 'success', duration)
  }

  error(message: string, duration?: number): void {
    this.show(message, 'error', duration)
  }

  info(message: string, duration?: number): void {
    this.show(message, 'info', duration)
  }

  warning(message: string, duration?: number): void {
    this.show(message, 'warning', duration)
  }

  achievement(message: string, duration?: number): void {
    this.show(message, 'achievement', duration || 5000)
  }
}

export const feedbackSystem = new FeedbackSystem()

