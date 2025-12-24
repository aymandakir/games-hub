# Audio Assets Guide

## Free Audio Resources

### Music
- **OpenGameArt.org** - CC0 and CC-BY licensed game music
- **Incompetech.com** - Royalty-free music by Kevin MacLeod
- **FreeMusicArchive.org** - Various licenses available
- **Pixabay Audio** - Free music and sound effects

### Sound Effects
- **Freesound.org** - Community-uploaded SFX (CC licenses)
- **Zapsplat.com** - Free SFX for games
- **Sonniss.com** - Annual free game audio bundle
- **BBC Sound Effects** - 16,000+ free sound effects

## Music Requirements

### Title Theme (2-3 minutes, looping)
- Mood: Epic, mysterious, welcoming
- Instruments: Orchestral with ethnic elements
- Tempo: Medium (90-110 BPM)
- Style: Fantasy adventure

### Combat Themes
- **Standard Battle**: Energetic, 120-140 BPM, loopable
- **Boss Battle**: Intense, dramatic, 140-160 BPM
- **Final Boss**: Epic orchestral, choir elements, 130-150 BPM

### Region Themes (all looping, 3-5 minutes)
- **Rock Dominion**: Deep drums, heavy bass, stone percussion
- **Paper Dominion**: Flutes, strings, wind instruments, flowing
- **Scissor Dominion**: Sharp percussion, metallic, precise

## Sound Effect Requirements

### Combat SFX (short, punchy, 0.1-0.5 seconds)
- **Rock**: Heavy impact, stone cracking sounds
- **Paper**: Whoosh, rustling, wind cutting
- **Scissors**: Metal slicing, sharp ringing

### UI SFX (very short, 0.05-0.2 seconds)
- Subtle, not intrusive
- Responsive feedback for clicks
- Gentle hover sounds

## Placeholder System

If audio files are missing, the AudioManager will:
1. Log a warning to console
2. Continue without error
3. Show which files are missing in dev mode

## Adding New Audio

1. Add file to appropriate directory
2. Update `/lib/constants/audio.ts` with file path
3. Preload critical sounds in AudioManager
4. Test in-game with volume controls

## File Structure

```
/public/audio/
├── music/
│   ├── title.mp3
│   ├── crosspoint-peace.mp3
│   ├── rock-mountains.mp3
│   ├── paper-winds.mp3
│   ├── scissor-precision.mp3
│   ├── battle-standard.mp3
│   ├── battle-boss.mp3
│   ├── battle-final.mp3
│   ├── victory-short.mp3
│   ├── defeat.mp3
│   └── story-emotional.mp3
├── sfx/
│   ├── ui/
│   │   ├── hover.wav
│   │   ├── click.wav
│   │   ├── menu-open.wav
│   │   └── menu-close.wav
│   ├── combat/
│   │   ├── rock-impact.wav
│   │   ├── paper-whoosh.wav
│   │   ├── scissors-slice.wav
│   │   ├── hit-connect.wav
│   │   ├── player-hurt.wav
│   │   ├── enemy-hurt.wav
│   │   └── clash.wav
│   ├── moves/
│   │   ├── stone-crash.wav
│   │   ├── ink-veil.wav
│   │   ├── blade-flurry.wav
│   │   ├── earthquake.wav
│   │   └── wind-cutter.wav
│   ├── ultimate/
│   │   ├── ink-storm.wav
│   │   ├── blade-cascade.wav
│   │   └── resolve-charged.wav
│   └── feedback/
│       ├── level-up.wav
│       ├── item-get.wav
│       ├── quest-complete.wav
│       └── save-game.wav
```

## Notes

- Game will function without audio (silent mode)
- All audio paths are relative to `/public/audio/`
- Use MP3 for music (better compression)
- Use WAV for SFX (lower latency)
- Keep file sizes reasonable (< 5MB for music, < 100KB for SFX)

