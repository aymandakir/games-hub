import { NextResponse } from 'next/server'
import { generateGameCollection, generateRandomGame } from '@/lib/games/game-generator'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const count = parseInt(searchParams.get('count') || '5', 10)
  const seed = searchParams.get('seed') ? parseInt(searchParams.get('seed')!, 10) : undefined
  
  try {
    const games = generateGameCollection(Math.min(count, 20), seed)
    return NextResponse.json({ games, count: games.length })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate games' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { count = 5, seed } = body
    
    const games = generateGameCollection(Math.min(count, 20), seed)
    return NextResponse.json({ games, count: games.length })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate games' },
      { status: 500 }
    )
  }
}

