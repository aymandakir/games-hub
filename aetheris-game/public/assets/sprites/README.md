# Sprite Assets Guide

## Directory Structure

/public/assets/sprites/
├── character/
│   ├── kael.png (100x120px)
│   └── lyra.png (100x120px)
├── enemy/
│   ├── rock_guard.png
│   ├── paper_scholar.png
│   ├── scissor_blade.png
│   └── [enemy_name].png
└── npc/
    ├── master_thorne.png
    ├── sage_elara.png
    └── [npc_name].png

## Specifications

### Character Sprites
- Size: 100x120 pixels
- Format: PNG with transparency
- Style: Stylized 2D, bold outlines
- Facing: Forward (idle pose)

### Enemy Sprites
- Size: 80x100 pixels
- Format: PNG with transparency
- Color-coded by faction (Rock/Paper/Scissors)

### NPC Portraits
- Size: 200x200 pixels
- Format: PNG
- Style: Bust portrait, expressive

## Creation Tools

### Free Options
- **Piskel** (piskelapp.com) - Pixel art sprite editor
- **GIMP** - Free Photoshop alternative
- **Inkscape** - Vector graphics editor
- **Aseprite** (paid, $20) - Professional pixel art tool

### AI Generation
- **Midjourney/DALL-E** - Generate base art, then edit
- **This Person Does Not Exist** - For character portraits
- Prompt: "fantasy RPG character sprite, pixel art style, [description]"

## Fallback System

The game includes procedural sprite generation:
- SVG-based geometric characters
- Automatically generated if PNG missing
- Production-ready fallback (no errors)

Add real sprites as PNG files to replace procedurals.

## Usage

The `Sprite` component automatically:
1. Tries to load `/assets/sprites/{type}/{id}.png`
2. Falls back to procedural SVG if file missing
3. No errors, seamless experience

