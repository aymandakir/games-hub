import { Character } from '@/lib/types/game'

export const CHARACTERS: Record<string, Character> = {
  kael: {
    id: 'kael',
    name: 'Kael',
    age: 20,
    alignment: { rock: 15, paper: 60, scissors: 25 },
    baseHP: 100,
    maxHP: 200,
    symbolBreak: {
      name: 'Ink Storm',
      description: "Kael's strategic mind manifests as a storm of paper, each sheet carrying a different possibility, overwhelming the enemy with choices.",
      type: 'paper',
      damage: 150,
      effect: {
        damage: 150,
        confusion: 2,
      },
    },
    portrait: '/assets/kael-portrait.png',
    bio: 'Grew up in Crosspoint village, where all three factions meet. His parents ran a trading post that served travelers from Rock, Paper, and Scissor dominions. Kael learned to read people from all three cultures, but never felt fully accepted by any single faction.',
    strengths: [
      'Adaptable: Can blend into any faction\'s culture',
      'Observant: Notices details others miss',
      'Resilient: Bounces back from setbacks quickly',
    ],
    flaws: [
      'Trust issues: Has trouble fully trusting anyone',
      'Impulsive: Sometimes acts before thinking through consequences',
      'Self-doubt: Questions if he\'s truly capable of saving the world',
    ],
    combatStyle: 'Paper-Aligned (60% Paper affinity, 25% Rock, 15% Scissors). Prefers strategic, defensive play. Uses Paper moves to read opponents and counter their patterns.',
  },
  lyra: {
    id: 'lyra',
    name: 'Lyra',
    age: 19,
    alignment: { rock: 15, paper: 25, scissors: 60 },
    baseHP: 100,
    maxHP: 200,
    symbolBreak: {
      name: 'Blade Cascade',
      description: "Lyra's determination becomes a cascade of blades, each cut perfectly placed, impossible to defend against.",
      type: 'scissors',
      damage: 200,
      effect: {
        damage: 200,
        critical: true,
        ignoreDefense: true,
      },
    },
    portrait: '/assets/lyra-portrait.png',
    bio: 'Also from Crosspoint village, but her family was different—they were scholars who documented the history of all three factions. When she was 12, her older brother vanished during a research expedition into the Scissor Dominion. The only clue: a strange triangular mark appeared on her left hand the day he disappeared.',
    strengths: [
      'Analytical: Excellent at pattern recognition and strategy',
      'Determined: Won\'t give up on finding her brother',
      'Diplomatic: Can navigate complex social situations',
    ],
    flaws: [
      'Overthinking: Sometimes paralyzed by too many options',
      'Stubborn: Once she forms a theory, hard to change her mind',
      'Emotionally guarded: Hides vulnerability behind intellect',
    ],
    combatStyle: 'Scissors-Aligned (60% Scissors affinity, 25% Paper, 15% Rock). Prefers precision and speed. Uses Scissors moves to cut through defenses and strike quickly.',
  },
}

