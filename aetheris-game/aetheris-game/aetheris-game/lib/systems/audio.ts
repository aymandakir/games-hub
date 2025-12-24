// Web Audio API Audio Manager

export class AudioManager {
  private audioContext: AudioContext | null = null
  private masterVolume: GainNode | null = null
  private musicVolume: GainNode | null = null
  private sfxVolume: GainNode | null = null
  private currentMusic: AudioBufferSourceNode | null = null
  private loadedSounds: Map<string, AudioBuffer> = new Map()
  private musicTracks: Map<string, string> = new Map()
  private sfxLibrary: Map<string, string> = new Map()
  private isInitialized = false

  constructor() {
    if (typeof window !== 'undefined') {
      this.initialize()
    }
  }

  private async initialize(): Promise<void> {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      this.setupAudioGraph()
      await this.preloadCriticalSounds()
      this.isInitialized = true
    } catch (error) {
      console.warn('Audio initialization failed:', error)
    }
  }

  private setupAudioGraph(): void {
    if (!this.audioContext) return

    // Master volume
    this.masterVolume = this.audioContext.createGain()
    this.masterVolume.connect(this.audioContext.destination)
    this.masterVolume.gain.value = 1.0

    // Music volume
    this.musicVolume = this.audioContext.createGain()
    this.musicVolume.connect(this.masterVolume)
    this.musicVolume.gain.value = 0.7

    // SFX volume
    this.sfxVolume = this.audioContext.createGain()
    this.sfxVolume.connect(this.masterVolume)
    this.sfxVolume.gain.value = 0.8
  }

  private async preloadCriticalSounds(): Promise<void> {
    // Skip preloading if files don't exist - run in silent mode
    console.log('[Audio] Skipping audio preload - files not present, running in silent mode')
    return Promise.resolve()
  }

  async preloadSound(url: string, id: string): Promise<void> {
    if (!this.audioContext || this.loadedSounds.has(id)) return

    try {
      const response = await fetch(url)
      if (!response.ok) {
        console.warn(`[Audio] File not found: ${url} - Running in silent mode`)
        return
      }
      const arrayBuffer = await response.arrayBuffer()
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer)
      this.loadedSounds.set(id, audioBuffer)
    } catch (error) {
      console.warn(`[Audio] Failed to load ${id}, continuing without audio:`, error)
    }
  }

  async playMusic(trackId: string, fadeIn = true): Promise<void> {
    if (!this.audioContext || !this.musicVolume) {
      console.log(`[Audio] Would play music: ${trackId} (silent mode)`)
      return
    }

    // Stop current music
    this.stopMusic(false)

    const url = this.musicTracks.get(trackId) || `/audio/music/${trackId}.mp3`

    try {
      const response = await fetch(url)
      if (!response.ok) {
        console.log(`[Audio] Music file not found: ${trackId} - Running in silent mode`)
        return
      }
      const arrayBuffer = await response.arrayBuffer()
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer)

      const source = this.audioContext.createBufferSource()
      source.buffer = audioBuffer
      source.loop = true

      if (fadeIn) {
        this.musicVolume.gain.setValueAtTime(0, this.audioContext.currentTime)
        this.musicVolume.gain.linearRampToValueAtTime(
          0.7,
          this.audioContext.currentTime + 1
        )
      }

      source.connect(this.musicVolume)
      source.start(0)
      this.currentMusic = source
    } catch (error) {
      console.warn(`[Audio] Failed to play music ${trackId}, continuing silently:`, error)
    }
  }

  stopMusic(fadeOut = true): void {
    if (!this.audioContext || !this.musicVolume || !this.currentMusic) return

    if (fadeOut) {
      this.musicVolume.gain.linearRampToValueAtTime(
        0,
        this.audioContext.currentTime + 0.5
      )
      setTimeout(() => {
        this.currentMusic?.stop()
        this.currentMusic = null
      }, 500)
    } else {
      this.currentMusic.stop()
      this.currentMusic = null
    }
  }

  async crossfadeMusic(fromTrack: string, toTrack: string, duration = 2): Promise<void> {
    // Fade out current, fade in new
    this.stopMusic(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    await this.playMusic(toTrack, true)
  }

  async playSFX(soundId: string, volume = 1.0, pitch = 1.0): Promise<void> {
    if (!this.audioContext || !this.sfxVolume) {
      console.log(`[Audio] Would play SFX: ${soundId} (silent mode)`)
      return
    }

    const url = this.sfxLibrary.get(soundId) || `/audio/sfx/${soundId}.wav`

    try {
      let audioBuffer = this.loadedSounds.get(soundId)

      if (!audioBuffer) {
        const response = await fetch(url)
        if (!response.ok) {
          console.log(`[Audio] SFX file not found: ${soundId} - Running in silent mode`)
          return
        }
        const arrayBuffer = await response.arrayBuffer()
        audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer)
        this.loadedSounds.set(soundId, audioBuffer)
      }

      const source = this.audioContext.createBufferSource()
      const gainNode = this.audioContext.createGain()

      source.buffer = audioBuffer
      source.playbackRate.value = pitch
      gainNode.gain.value = volume

      source.connect(gainNode)
      gainNode.connect(this.sfxVolume)
      source.start(0)
    } catch (error) {
      console.log(`[Audio] Failed to play SFX ${soundId}, continuing silently`)
    }
  }

  playSFXWithDelay(soundId: string, delay: number): void {
    setTimeout(() => this.playSFX(soundId), delay)
  }

  setMasterVolume(volume: number): void {
    if (this.masterVolume) {
      this.masterVolume.gain.value = Math.max(0, Math.min(1, volume))
    }
  }

  setMusicVolume(volume: number): void {
    if (this.musicVolume) {
      this.musicVolume.gain.value = Math.max(0, Math.min(1, volume))
    }
  }

  setSFXVolume(volume: number): void {
    if (this.sfxVolume) {
      this.sfxVolume.gain.value = Math.max(0, Math.min(1, volume))
    }
  }

  releaseSound(id: string): void {
    this.loadedSounds.delete(id)
  }

  // Resume audio context (required after user interaction)
  async resume(): Promise<void> {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume()
    }
  }
}

// Singleton instance
let audioManagerInstance: AudioManager | null = null

export function getAudioManager(): AudioManager {
  if (!audioManagerInstance) {
    audioManagerInstance = new AudioManager()
  }
  return audioManagerInstance
}

