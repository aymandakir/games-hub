// Audio library definitions
// Placeholder paths - replace with actual audio files

export const AUDIO_LIBRARY = {
  music: {
    // Region themes
    title_theme: '/audio/music/title.mp3',
    crosspoint_theme: '/audio/music/crosspoint-peace.mp3',
    rock_dominion: '/audio/music/rock-mountains.mp3',
    paper_dominion: '/audio/music/paper-winds.mp3',
    scissor_dominion: '/audio/music/scissor-precision.mp3',

    // Combat music
    combat_normal: '/audio/music/battle-standard.mp3',
    combat_boss: '/audio/music/battle-boss.mp3',
    combat_final: '/audio/music/battle-final.mp3',

    // Story moments
    victory: '/audio/music/victory-short.mp3',
    defeat: '/audio/music/defeat.mp3',
    emotional_moment: '/audio/music/story-emotional.mp3',
  },

  sfx: {
    // UI sounds
    button_hover: '/audio/sfx/ui-hover.wav',
    button_click: '/audio/sfx/ui-click.wav',
    menu_open: '/audio/sfx/menu-open.wav',
    menu_close: '/audio/sfx/menu-close.wav',

    // Combat sounds
    rock_hit: '/audio/sfx/rock-impact.wav',
    paper_whoosh: '/audio/sfx/paper-whoosh.wav',
    scissors_slice: '/audio/sfx/scissors-slice.wav',

    // Move-specific
    stone_crash: '/audio/sfx/moves/stone-crash.wav',
    ink_veil: '/audio/sfx/moves/ink-veil.wav',
    blade_flurry: '/audio/sfx/moves/blade-flurry.wav',

    // Symbol Breaks
    ink_storm: '/audio/sfx/ultimate/ink-storm.wav',
    blade_cascade: '/audio/sfx/ultimate/blade-cascade.wav',

    // Feedback
    level_up: '/audio/sfx/level-up.wav',
    item_get: '/audio/sfx/item-get.wav',
    quest_complete: '/audio/sfx/quest-complete.wav',
    resolve_full: '/audio/sfx/resolve-charged.wav',

    // Ambient
    wind_gentle: '/audio/sfx/ambient/wind.wav',
    rocks_rumble: '/audio/sfx/ambient/rocks.wav',
    metal_ring: '/audio/sfx/ambient/metal.wav',
  },
}

// Audio characteristics guide:
// - UI sounds: Short (50-200ms), crisp, non-intrusive
// - Combat hits: Impactful (100-300ms), satisfying
// - Music: Looping, 2-4 minute tracks, fade in/out
// - Ambient: Long loops (30s+), subtle, background

