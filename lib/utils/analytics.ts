// Analytics - Stub implementation
// Full implementation would use analytics service

class Analytics {
  private enabled = true

  isEnabled(): boolean {
    return this.enabled
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled
    if (typeof window !== 'undefined') {
      localStorage.setItem('analytics-enabled', String(enabled))
    }
  }

  trackGameStart(gameId: string): void {
    if (!this.enabled) return
    console.log('[Analytics] Game started:', gameId)
    // Would send to analytics service
  }

  trackFeatureUse(featureId: string): void {
    if (!this.enabled) return
    console.log('[Analytics] Feature used:', featureId)
    // Would send to analytics service
  }
}

export const analytics = new Analytics()

// Load saved preference
if (typeof window !== 'undefined') {
  const saved = localStorage.getItem('analytics-enabled')
  if (saved !== null) {
    analytics.setEnabled(saved === 'true')
  }
}
