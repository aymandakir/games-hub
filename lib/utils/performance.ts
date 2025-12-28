/**
 * Performance monitoring and optimization utilities
 */

export class PerformanceMonitor {
  private static marks: Map<string, number> = new Map()
  private static measures: Array<{ name: string; duration: number }> = []

  static mark(name: string) {
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.mark(name)
      this.marks.set(name, performance.now())
    }
  }

  static measure(name: string, startMark: string, endMark?: string) {
    if (typeof window !== 'undefined' && window.performance) {
      try {
        if (endMark) {
          window.performance.measure(name, startMark, endMark)
        } else {
          window.performance.measure(name, startMark)
        }
        const measure = window.performance.getEntriesByName(name, 'measure')[0]
        if (measure) {
          this.measures.push({ name, duration: measure.duration })
        }
      } catch (error) {
        console.warn('Performance measure failed:', error)
      }
    }
  }

  static getMeasures() {
    return [...this.measures]
  }

  static clear() {
    this.marks.clear()
    this.measures = []
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.clearMarks()
      window.performance.clearMeasures()
    }
  }

  static getFPS(): Promise<number> {
    return new Promise((resolve) => {
      let frames = 0
      const start = performance.now()
      
      function countFrame() {
        frames++
        if (frames < 60) {
          requestAnimationFrame(countFrame)
        } else {
          const duration = performance.now() - start
          resolve(Math.round((frames / duration) * 1000))
        }
      }
      
      requestAnimationFrame(countFrame)
    })
  }
}

/**
 * Debounce function to limit function calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }
    
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle function to limit function calls
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Lazy load images
 */
export function lazyLoadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = reject
    img.src = src
  })
}



