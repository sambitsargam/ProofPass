// API route for creating events
import { saveEvent } from '@/lib/events-storage'

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, totalTickets, pricePerTicket, description } = body;

    // Validate input
    if (!name || !totalTickets || !pricePerTicket) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400 }
      );
    }

    // Create event data
    const eventData = {
      id: `event_${Date.now()}`,
      name,
      totalTickets: parseInt(totalTickets),
      soldTickets: 0,
      pricePerTicket: parseFloat(pricePerTicket),
      description: description || '',
      createdAt: new Date().toISOString(),
      organizer: '0x90D9CD66FAdFF1C2Ba32C99A47C76532d08A704B',
      requiredCredential: 'HUMAN_VERIFIED',
      contractAddress: process.env.NEXT_PUBLIC_TICKET_MARKETPLACE_ADDRESS || '',
      metadata: {
        location: 'Virtual',
        image: '🎪',
      },
    };

    // Save event to persistent storage
    const savedEvent = saveEvent(eventData)

    return new Response(JSON.stringify(savedEvent), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Event creation error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500 }
    );
  }
}
