import { NextResponse } from 'next/server'
import { generateRandomGame } from '@/lib/games/game-generator'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Use ID as seed for consistent generation
    const seed = parseInt(params.id.replace(/\D/g, '').slice(0, 10)) || Date.now()
    const game = generateRandomGame(seed)
    
    return NextResponse.json(game)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate game' },
      { status: 500 }
    )
  }
}

