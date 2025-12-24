// Procedural sprite generation for development
// Replace with real PNG assets in production

export function generateCharacterSVG(character: 'kael' | 'lyra'): string {
  const config = {
    kael: {
      skinTone: '#d4a574',
      hairColor: '#6b4423',
      cloakPrimary: '#8b7355',
      cloakAccent: '#a8d5e2',
      eyeColor: '#4a90a4',
    },
    lyra: {
      skinTone: '#d4a574',
      hairColor: '#2c2c2c',
      cloakPrimary: '#4a4a4a',
      cloakAccent: '#6a4c93',
      eyeColor: '#8b4a9c',
    },
  }

  const c = config[character]

  return `
    <svg width="100" height="120" xmlns="http://www.w3.org/2000/svg">
      <!-- Body -->
      <ellipse cx="50" cy="70" rx="25" ry="35" fill="${c.cloakPrimary}"/>
      
      <!-- Head -->
      <circle cx="50" cy="30" r="18" fill="${c.skinTone}"/>
      
      <!-- Hair -->
      ${character === 'kael'
        ? `<ellipse cx="50" cy="20" rx="20" ry="15" fill="${c.hairColor}"/>`
        : `<path d="M 30 25 Q 50 15 70 25 L 70 35 Q 50 30 30 35 Z" fill="${c.hairColor}"/>`
      }
      
      <!-- Eyes -->
      <circle cx="45" cy="30" r="2" fill="${c.eyeColor}"/>
      <circle cx="55" cy="30" r="2" fill="${c.eyeColor}"/>
      
      <!-- Cloak accent -->
      <rect x="40" y="60" width="20" height="30" fill="${c.cloakAccent}" opacity="0.7"/>
      
      ${character === 'lyra'
        ? `<!-- Mark on hand -->
           <path d="M 48 95 L 50 85 L 52 95 Z" fill="#6a4c93" opacity="0.8"/>`
        : ''
      }
    </svg>
  `.trim()
}

export function generateEnemySVG(
  type: string,
  faction: 'rock' | 'paper' | 'scissors'
): string {
  const colors = {
    rock: { primary: '#3a3a3a', secondary: '#6b4423', accent: '#8b2635' },
    paper: { primary: '#ffffff', secondary: '#a8d5e2', accent: '#f7dc6f' },
    scissors: { primary: '#c9c9c9', secondary: '#6a4c93', accent: '#00d4ff' },
  }

  const c = colors[faction]

  // Generate different shapes based on faction
  const shapes = {
    rock: `
      <rect x="30" y="40" width="40" height="40" rx="5" fill="${c.primary}"/>
      <rect x="35" y="45" width="30" height="30" rx="3" fill="${c.secondary}"/>
    `,
    paper: `
      <path d="M 50 20 Q 30 40 50 60 Q 70 40 50 20 Z" fill="${c.primary}" opacity="0.9"/>
      <path d="M 50 30 Q 40 45 50 55 Q 60 45 50 30 Z" fill="${c.secondary}" opacity="0.7"/>
    `,
    scissors: `
      <polygon points="50,20 40,50 50,45 60,50" fill="${c.primary}"/>
      <polygon points="50,45 45,70 50,80 55,70" fill="${c.secondary}"/>
      <line x1="40" y1="50" x2="30" y2="60" stroke="${c.accent}" stroke-width="3"/>
      <line x1="60" y1="50" x2="70" y2="60" stroke="${c.accent}" stroke-width="3"/>
    `,
  }

  return `
    <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      ${shapes[faction]}
      <!-- Eyes -->
      <circle cx="45" cy="40" r="3" fill="#ff0000"/>
      <circle cx="55" cy="40" r="3" fill="#ff0000"/>
    </svg>
  `.trim()
}

// Export as data URIs for immediate use (browser-compatible)
export function getCharacterSprite(character: 'kael' | 'lyra'): string {
  const svg = generateCharacterSVG(character)
  // Browser-compatible base64 encoding
  if (typeof window !== 'undefined') {
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`
  }
  // Node.js fallback
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}

export function getEnemySprite(type: string, faction: 'rock' | 'paper' | 'scissors'): string {
  const svg = generateEnemySVG(type, faction)
  // Browser-compatible base64 encoding
  if (typeof window !== 'undefined') {
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`
  }
  // Node.js fallback
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}

// Helper to get faction from enemy ID
function getFactionFromId(id: string): 'rock' | 'paper' | 'scissors' {
  if (id.includes('rock') || id.includes('stone') || id.includes('mountain')) return 'rock'
  if (id.includes('paper') || id.includes('wind') || id.includes('scroll')) return 'paper'
  if (id.includes('scissor') || id.includes('blade') || id.includes('cut')) return 'scissors'
  return 'rock' // default
}

