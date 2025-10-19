import { loadEvents } from '@/lib/events-storage'

export async function GET() {
  try {
    const events = loadEvents()
    
    return new Response(
      JSON.stringify({
        success: true,
        events: events,
        count: events.length,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error fetching events:', error)
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Failed to fetch events',
      }),
      { status: 500 }
    )
  }
}
