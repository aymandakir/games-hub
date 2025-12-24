// Animation utilities

export function shakeScreen(duration = 300): void {
  const container = document.querySelector('.combat-view') || document.body
  if (!container) return

  container.classList.add('screen-shake')

  setTimeout(() => {
    container.classList.remove('screen-shake')
  }, duration)
}

export function emitDamageNumber(x: number, y: number, damage: number): void {
  // Create floating damage text
  const damageElement = document.createElement('div')
  damageElement.className = 'damage-number'
  damageElement.textContent = `-${damage}`
  damageElement.style.left = `${x}px`
  damageElement.style.top = `${y}px`
  damageElement.style.position = 'fixed'
  damageElement.style.pointerEvents = 'none'
  damageElement.style.zIndex = '1000'

  document.body.appendChild(damageElement)

  // Animate and remove
  setTimeout(() => {
    damageElement.remove()
  }, 1000)
}

