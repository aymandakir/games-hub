/**
 * Particle System for Visual Effects
 * Handles hit effects, heal particles, level up bursts, critical hits, etc.
 */

export interface Particle {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  color: string
  alpha: number
  rotation: number
  rotationSpeed: number
}

export type ParticleEffectType =
  | 'hit'
  | 'heal'
  | 'level_up'
  | 'critical'
  | 'magic'
  | 'confetti'
  | 'blood'
  | 'dust'

class ParticleSystem {
  private particles: Particle[] = []
  private canvas: HTMLCanvasElement | null = null
  private ctx: CanvasRenderingContext2D | null = null
  private animationFrame: number | null = null

  /**
   * Initialize particle system with canvas
   */
  initialize(canvas: HTMLCanvasElement): void {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    if (!this.ctx) {
      console.error('Failed to get 2D context for particles')
      return
    }

    // Set canvas size
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight

    // Start animation loop
    this.animate()
  }

  /**
   * Spawn particle effect
   */
  spawnEffect(
    type: ParticleEffectType,
    x: number,
    y: number,
    count: number = 20
  ): void {
    switch (type) {
      case 'hit':
        this.spawnHitEffect(x, y, count)
        break
      case 'heal':
        this.spawnHealEffect(x, y, count)
        break
      case 'level_up':
        this.spawnLevelUpEffect(x, y, count)
        break
      case 'critical':
        this.spawnCriticalEffect(x, y, count)
        break
      case 'magic':
        this.spawnMagicEffect(x, y, count)
        break
      case 'confetti':
        this.spawnConfettiEffect(x, y, count)
        break
      case 'blood':
        this.spawnBloodEffect(x, y, count)
        break
      case 'dust':
        this.spawnDustEffect(x, y, count)
        break
    }
  }

  /**
   * Spawn hit effect (red flash + particles)
   */
  private spawnHitEffect(x: number, y: number, count: number): void {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count
      const speed = 2 + Math.random() * 3
      this.particles.push({
        id: `hit_${Date.now()}_${i}`,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 30,
        size: 3 + Math.random() * 4,
        color: '#ff0000',
        alpha: 1.0,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
      })
    }
  }

  /**
   * Spawn heal effect (green particles rising)
   */
  private spawnHealEffect(x: number, y: number, count: number): void {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        id: `heal_${Date.now()}_${i}`,
        x,
        y,
        vx: (Math.random() - 0.5) * 1,
        vy: -2 - Math.random() * 2,
        life: 0,
        maxLife: 50,
        size: 4 + Math.random() * 3,
        color: '#00ff00',
        alpha: 1.0,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.1,
      })
    }
  }

  /**
   * Spawn level up effect (gold burst)
   */
  private spawnLevelUpEffect(x: number, y: number, count: number): void {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count
      const speed = 3 + Math.random() * 4
      this.particles.push({
        id: `levelup_${Date.now()}_${i}`,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 60,
        size: 5 + Math.random() * 5,
        color: '#ffd700',
        alpha: 1.0,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.3,
      })
    }
  }

  /**
   * Spawn critical hit effect
   */
  private spawnCriticalEffect(x: number, y: number, count: number): void {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count
      const speed = 4 + Math.random() * 5
      this.particles.push({
        id: `critical_${Date.now()}_${i}`,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 40,
        size: 6 + Math.random() * 6,
        color: '#ff00ff',
        alpha: 1.0,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.4,
      })
    }
  }

  /**
   * Spawn magic spell effect
   */
  private spawnMagicEffect(x: number, y: number, count: number): void {
    const colors = ['#00ffff', '#ff00ff', '#ffff00', '#00ff00']
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count
      const speed = 2 + Math.random() * 3
      this.particles.push({
        id: `magic_${Date.now()}_${i}`,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 50,
        size: 4 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1.0,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
      })
    }
  }

  /**
   * Spawn confetti effect (victory)
   */
  private spawnConfettiEffect(x: number, y: number, count: number): void {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']
    for (let i = 0; i < count; i++) {
      this.particles.push({
        id: `confetti_${Date.now()}_${i}`,
        x,
        y,
        vx: (Math.random() - 0.5) * 4,
        vy: -3 - Math.random() * 4,
        life: 0,
        maxLife: 80,
        size: 6 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1.0,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.3,
      })
    }
  }

  /**
   * Spawn blood effect (optional)
   */
  private spawnBloodEffect(x: number, y: number, count: number): void {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = 1 + Math.random() * 2
      this.particles.push({
        id: `blood_${Date.now()}_${i}`,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 40,
        size: 3 + Math.random() * 3,
        color: '#8b0000',
        alpha: 1.0,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.1,
      })
    }
  }

  /**
   * Spawn dust effect
   */
  private spawnDustEffect(x: number, y: number, count: number): void {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = 0.5 + Math.random() * 1.5
      this.particles.push({
        id: `dust_${Date.now()}_${i}`,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 30,
        size: 2 + Math.random() * 3,
        color: '#888888',
        alpha: 1.0,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.1,
      })
    }
  }

  /**
   * Animation loop
   */
  private animate(): void {
    if (!this.ctx || !this.canvas) return

    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    // Update and draw particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i]

      // Update position
      particle.x += particle.vx
      particle.y += particle.vy
      particle.rotation += particle.rotationSpeed

      // Update life
      particle.life++
      particle.alpha = 1.0 - particle.life / particle.maxLife

      // Apply gravity (for some effects)
      if (particle.vy < 5) {
        particle.vy += 0.1
      }

      // Remove dead particles
      if (particle.life >= particle.maxLife || particle.alpha <= 0) {
        this.particles.splice(i, 1)
        continue
      }

      // Draw particle
      this.ctx.save()
      this.ctx.globalAlpha = particle.alpha
      this.ctx.fillStyle = particle.color
      this.ctx.translate(particle.x, particle.y)
      this.ctx.rotate(particle.rotation)
      this.ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size)
      this.ctx.restore()
    }

    this.animationFrame = requestAnimationFrame(() => this.animate())
  }

  /**
   * Clear all particles
   */
  clear(): void {
    this.particles = []
  }

  /**
   * Resize canvas
   */
  resize(width: number, height: number): void {
    if (this.canvas) {
      this.canvas.width = width
      this.canvas.height = height
    }
  }
}

let particleSystemInstance: ParticleSystem | null = null

export function getParticleSystem(): ParticleSystem {
  if (!particleSystemInstance) {
    particleSystemInstance = new ParticleSystem()
  }
  return particleSystemInstance
}

