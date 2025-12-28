/**
 * Audio System for Aetheris Game
 * Handles background music, SFX, ambient sounds, and volume controls
 */

export interface AudioTrack {
  id: string
  url: string
  loop: boolean
  volume: number
}

export interface AudioSettings {
  masterVolume: number
  musicVolume: number
  sfxVolume: number
  ambientVolume: number
  muted: boolean
}

class AudioManager {
  private musicAudio: HTMLAudioElement | null = null
  private ambientAudio: HTMLAudioElement | null = null
  private sfxCache: Map<string, HTMLAudioElement> = new Map()
  private settings: AudioSettings = {
    masterVolume: 1.0,
    musicVolume: 0.7,
    sfxVolume: 0.8,
    ambientVolume: 0.5,
    muted: false,
  }

  constructor() {
    this.loadSettings()
  }

  /**
   * Play background music
   */
  playMusic(trackId: string): void {
    if (this.settings.muted) return

    // Stop current music
    if (this.musicAudio) {
      this.musicAudio.pause()
      this.musicAudio = null
    }

    // Load and play new track
    const track = this.getMusicTrack(trackId)
    if (!track) return

    this.musicAudio = new Audio(track.url)
    this.musicAudio.loop = track.loop
    this.musicAudio.volume = this.settings.masterVolume * this.settings.musicVolume * track.volume
    this.musicAudio.play().catch((error) => {
      console.warn('Failed to play music:', error)
    })
  }

  /**
   * Play sound effect
   */
  playSFX(sfxId: string, volume: number = 1.0, pitch: number = 1.0): void {
    if (this.settings.muted) return

    let audio = this.sfxCache.get(sfxId)
    if (!audio) {
      const sfx = this.getSFX(sfxId)
      if (!sfx) return

      audio = new Audio(sfx.url)
      this.sfxCache.set(sfxId, audio)
    }

    // Clone audio for overlapping sounds
    const audioClone = audio.cloneNode() as HTMLAudioElement
    audioClone.volume = this.settings.masterVolume * this.settings.sfxVolume * volume
    audioClone.playbackRate = pitch
    audioClone.play().catch((error) => {
      console.warn('Failed to play SFX:', error)
    })
  }

  /**
   * Play ambient sound
   */
  playAmbient(ambientId: string): void {
    if (this.settings.muted) return

    if (this.ambientAudio) {
      this.ambientAudio.pause()
      this.ambientAudio = null
    }

    const ambient = this.getAmbient(ambientId)
    if (!ambient) return

    this.ambientAudio = new Audio(ambient.url)
    this.ambientAudio.loop = true
    this.ambientAudio.volume = this.settings.masterVolume * this.settings.ambientVolume
    this.ambientAudio.play().catch((error) => {
      console.warn('Failed to play ambient:', error)
    })
  }

  /**
   * Stop all audio
   */
  stopAll(): void {
    if (this.musicAudio) {
      this.musicAudio.pause()
      this.musicAudio = null
    }
    if (this.ambientAudio) {
      this.ambientAudio.pause()
      this.ambientAudio = null
    }
  }

  /**
   * Update settings
   */
  updateSettings(settings: Partial<AudioSettings>): void {
    this.settings = { ...this.settings, ...settings }
    this.saveSettings()

    // Update current audio volumes
    if (this.musicAudio) {
      this.musicAudio.volume = this.settings.masterVolume * this.settings.musicVolume
    }
    if (this.ambientAudio) {
      this.ambientAudio.volume = this.settings.masterVolume * this.settings.ambientVolume
    }
  }

  /**
   * Get current settings
   */
  getSettings(): AudioSettings {
    return { ...this.settings }
  }

  /**
   * Load settings from localStorage
   */
  private loadSettings(): void {
    try {
      const saved = localStorage.getItem('aetheris_audio_settings')
      if (saved) {
        this.settings = { ...this.settings, ...JSON.parse(saved) }
      }
    } catch (error) {
      console.warn('Failed to load audio settings:', error)
    }
  }

  /**
   * Save settings to localStorage
   */
  private saveSettings(): void {
    try {
      localStorage.setItem('aetheris_audio_settings', JSON.stringify(this.settings))
    } catch (error) {
      console.warn('Failed to save audio settings:', error)
    }
  }

  /**
   * Get music track by ID
   */
  private getMusicTrack(trackId: string): AudioTrack | null {
    const tracks: Record<string, AudioTrack> = {
      exploration: {
        id: 'exploration',
        url: '/audio/music/exploration.mp3',
        loop: true,
        volume: 0.7,
      },
      battle: {
        id: 'battle',
        url: '/audio/music/battle.mp3',
        loop: true,
        volume: 0.8,
      },
      town: {
        id: 'town',
        url: '/audio/music/town.mp3',
        loop: true,
        volume: 0.6,
      },
    }
    return tracks[trackId] || null
  }

  /**
   * Get SFX by ID
   */
  private getSFX(sfxId: string): AudioTrack | null {
    const sfx: Record<string, AudioTrack> = {
      button_click: {
        id: 'button_click',
        url: '/audio/sfx/ui/click.mp3',
        loop: false,
        volume: 0.5,
      },
      rock_hit: {
        id: 'rock_hit',
        url: '/audio/sfx/combat/rock.mp3',
        loop: false,
        volume: 0.8,
      },
      paper_hit: {
        id: 'paper_hit',
        url: '/audio/sfx/combat/paper.mp3',
        loop: false,
        volume: 0.8,
      },
      scissors_hit: {
        id: 'scissors_hit',
        url: '/audio/sfx/combat/scissors.mp3',
        loop: false,
        volume: 0.8,
      },
      critical_hit: {
        id: 'critical_hit',
        url: '/audio/sfx/combat/critical.mp3',
        loop: false,
        volume: 1.0,
      },
      heal: {
        id: 'heal',
        url: '/audio/sfx/feedback/heal.mp3',
        loop: false,
        volume: 0.7,
      },
      level_up: {
        id: 'level_up',
        url: '/audio/sfx/feedback/levelup.mp3',
        loop: false,
        volume: 0.9,
      },
      victory: {
        id: 'victory',
        url: '/audio/sfx/feedback/victory.mp3',
        loop: false,
        volume: 0.8,
      },
      defeat: {
        id: 'defeat',
        url: '/audio/sfx/feedback/defeat.mp3',
        loop: false,
        volume: 0.8,
      },
    }
    return sfx[sfxId] || null
  }

  /**
   * Get ambient sound by ID
   */
  private getAmbient(ambientId: string): AudioTrack | null {
    const ambient: Record<string, AudioTrack> = {
      forest: {
        id: 'forest',
        url: '/audio/ambient/forest.mp3',
        loop: true,
        volume: 0.4,
      },
      wind: {
        id: 'wind',
        url: '/audio/ambient/wind.mp3',
        loop: true,
        volume: 0.3,
      },
      town: {
        id: 'town',
        url: '/audio/ambient/town.mp3',
        loop: true,
        volume: 0.4,
      },
    }
    return ambient[ambientId] || null
  }
}

let audioManagerInstance: AudioManager | null = null

export function getAudioManager(): AudioManager {
  if (!audioManagerInstance) {
    audioManagerInstance = new AudioManager()
  }
  return audioManagerInstance
}

