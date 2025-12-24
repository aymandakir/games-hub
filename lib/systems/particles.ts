// High-performance particle effects system

export interface Particle {
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

export interface ParticleEmitterConfig {
  x: number
  y: number
  rate: number // particles per second
  duration: number // milliseconds
  particleConfig: ParticleConfig
}

export interface ParticleConfig {
  velocity: { min: number; max: number }
  angle: { min: number; max: number }
  life: { min: number; max: number }
  size: { min: number; max: number }
  colors: string[]
  alpha: { start: number; end: number }
  gravity?: number
  friction?: number
  rotation?: boolean
}

export interface ParticlePreset extends ParticleConfig {
  count: number
}

export class ParticleSystem {
  private particles: Particle[] = []
  private particlePool: Particle[] = []
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private animationFrame: number | null = null
  private lastTime = 0
  private emitters: ParticleEmitterConfig[] = []
  private maxParticles = 300

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Could not get canvas context')
    this.ctx = context
    this.createParticlePool(200)
    this.start()
  }

  private createParticlePool(size: number): void {
    for (let i = 0; i < size; i++) {
      this.particlePool.push(this.createParticle())
    }
  }

  private createParticle(): Particle {
    return {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      life: 0,
      maxLife: 1,
      size: 4,
      color: '#ffffff',
      alpha: 1,
      rotation: 0,
      rotationSpeed: 0,
    }
  }

  private getParticleFromPool(): Particle {
    return this.particlePool.pop() || this.createParticle()
  }

  private returnParticleToPool(particle: Particle): void {
    if (this.particlePool.length < 200) {
      this.particlePool.push(particle)
    }
  }

  emit(config: ParticleEmitterConfig): void {
    this.emitters.push(config)
  }

  burst(x: number, y: number, count: number, config: ParticleConfig): void {
    for (let i = 0; i < count && this.particles.length < this.maxParticles; i++) {
      const particle = this.getParticleFromPool()
      this.initializeParticle(particle, x, y, config)
      this.particles.push(particle)
    }
  }

  private initializeParticle(particle: Particle, x: number, y: number, config: ParticleConfig): void {
    const angle = config.angle.min + Math.random() * (config.angle.max - config.angle.min)
    const velocity = config.velocity.min + Math.random() * (config.velocity.max - config.velocity.min)

    particle.x = x
    particle.y = y
    particle.vx = Math.cos(angle) * velocity
    particle.vy = Math.sin(angle) * velocity
    particle.life = 1
    particle.maxLife = 1
    particle.size = config.size.min + Math.random() * (config.size.max - config.size.min)
    particle.color = config.colors[Math.floor(Math.random() * config.colors.length)]
    particle.alpha = config.alpha.start
    particle.rotation = Math.random() * Math.PI * 2
    particle.rotationSpeed = config.rotation ? (Math.random() - 0.5) * 0.1 : 0
  }

  update(deltaTime: number): void {
    // Update emitters
    for (let i = this.emitters.length - 1; i >= 0; i--) {
      const emitter = this.emitters[i]
      const particlesToEmit = Math.floor((emitter.rate * deltaTime) / 1000)

      for (let j = 0; j < particlesToEmit && this.particles.length < this.maxParticles; j++) {
        const particle = this.getParticleFromPool()
        this.initializeParticle(particle, emitter.x, emitter.y, emitter.particleConfig)
        this.particles.push(particle)
      }

      emitter.duration -= deltaTime
      if (emitter.duration <= 0) {
        this.emitters.splice(i, 1)
      }
    }

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i]

      // Apply physics
      if (particle.rotationSpeed) {
        particle.rotation += particle.rotationSpeed * deltaTime * 0.01
      }

      // Apply gravity
      const config = this.getConfigForParticle(particle)
      if (config?.gravity) {
        particle.vy += config.gravity * deltaTime * 0.01
      }

      // Apply friction
      if (config?.friction) {
        particle.vx *= Math.pow(config.friction, deltaTime * 0.01)
        particle.vy *= Math.pow(config.friction, deltaTime * 0.01)
      }

      // Update position
      particle.x += particle.vx * deltaTime * 0.01
      particle.y += particle.vy * deltaTime * 0.01

      // Update life
      particle.life -= deltaTime / (particle.maxLife * 1000)
      if (config) {
        const lifeProgress = 1 - particle.life
        particle.alpha =
          config.alpha.start + (config.alpha.end - config.alpha.start) * lifeProgress
      }

      // Remove dead particles
      if (particle.life <= 0) {
        this.returnParticleToPool(particle)
        this.particles.splice(i, 1)
        i-- // Adjust index after removal
      }
    }
  }

  private getConfigForParticle(particle: Particle): ParticleConfig | null {
    // Simplified - would track which config was used
    return null
  }

  render(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    for (const particle of this.particles) {
      this.ctx.save()
      this.ctx.globalAlpha = particle.alpha
      this.ctx.translate(particle.x, particle.y)
      this.ctx.rotate(particle.rotation)
      this.ctx.fillStyle = particle.color
      this.ctx.beginPath()
      this.ctx.arc(0, 0, particle.size, 0, Math.PI * 2)
      this.ctx.fill()
      this.ctx.restore()
    }
  }

  private start(): void {
    const animate = (currentTime: number) => {
      const deltaTime = currentTime - this.lastTime
      this.lastTime = currentTime

      this.update(deltaTime)
      this.render()

      this.animationFrame = requestAnimationFrame(animate)
    }

    this.animationFrame = requestAnimationFrame(animate)
  }

  // Preset effects
  emitHitEffect(x: number, y: number, type: 'rock' | 'paper' | 'scissors'): void {
    const presets = PARTICLE_PRESETS
    const preset = presets[`${type}_hit` as keyof typeof presets]
    if (preset) {
      this.burst(x, y, preset.count, preset)
    }
  }

  emitSymbolBreak(type: 'ink_storm' | 'blade_cascade'): void {
    const preset = PARTICLE_PRESETS[type]
    if (preset) {
      // Emit from center of screen
      const x = this.canvas.width / 2
      const y = this.canvas.height / 2
      this.burst(x, y, preset.count, preset)
    }
  }

  emitLevelUp(x: number, y: number): void {
    const preset = PARTICLE_PRESETS.level_up
    if (preset) {
      this.burst(x, y, preset.count, preset)
    }
  }

  clear(): void {
    for (const particle of this.particles) {
      this.returnParticleToPool(particle)
    }
    this.particles = []
    this.emitters = []
  }

  destroy(): void {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame)
    }
    this.clear()
  }
}

export const PARTICLE_PRESETS: Record<string, ParticlePreset> = {
  rock_hit: {
    count: 12,
    velocity: { min: 2, max: 5 },
    angle: { min: 0, max: Math.PI * 2 },
    life: { min: 400, max: 800 },
    size: { min: 4, max: 8 },
    colors: ['#3a3a3a', '#6b4423', '#8b2635'],
    alpha: { start: 1, end: 0 },
    gravity: 0.2,
  },
  paper_whoosh: {
    count: 20,
    velocity: { min: 3, max: 7 },
    angle: { min: -0.5, max: 0.5 },
    life: { min: 600, max: 1000 },
    size: { min: 6, max: 12 },
    colors: ['#ffffff', '#a8d5e2', '#f7dc6f'],
    alpha: { start: 0.8, end: 0 },
    friction: 0.95,
    rotation: true,
  },
  scissors_slice: {
    count: 15,
    velocity: { min: 4, max: 8 },
    angle: { min: Math.PI * 0.25, max: Math.PI * 0.75 },
    life: { min: 300, max: 600 },
    size: { min: 2, max: 6 },
    colors: ['#c9c9c9', '#6a4c93', '#00d4ff'],
    alpha: { start: 1, end: 0 },
    gravity: 0.1,
  },
  ink_storm: {
    count: 100,
    velocity: { min: 1, max: 10 },
    angle: { min: 0, max: Math.PI * 2 },
    life: { min: 1000, max: 2000 },
    size: { min: 8, max: 20 },
    colors: ['#a8d5e2', '#ffffff', '#c0c0c0'],
    alpha: { start: 0.9, end: 0 },
    friction: 0.98,
    rotation: true,
  },
  blade_cascade: {
    count: 50,
    velocity: { min: 5, max: 15 },
    angle: { min: Math.PI * 1.25, max: Math.PI * 1.75 },
    life: { min: 400, max: 800 },
    size: { min: 3, max: 10 },
    colors: ['#6a4c93', '#00d4ff', '#c9c9c9'],
    alpha: { start: 1, end: 0 },
    gravity: 0.3,
  },
  level_up: {
    count: 30,
    velocity: { min: 2, max: 6 },
    angle: { min: -Math.PI / 4, max: -Math.PI * 0.75 },
    life: { min: 1000, max: 1500 },
    size: { min: 4, max: 8 },
    colors: ['#d4af37', '#f7dc6f', '#ffffff'],
    alpha: { start: 1, end: 0 },
    gravity: -0.1,
  },
}

