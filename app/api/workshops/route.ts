import { NextResponse } from 'next/server'
import { getWorkshops } from '../../../lib/workshops'

export async function GET() {
  return NextResponse.json(await getWorkshops(), {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
  })
}
