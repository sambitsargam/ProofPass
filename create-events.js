#!/usr/bin/env node

/**
 * Create Sample Events via API
 * Adds sample events to ProofPass platform
 */

const SAMPLE_EVENTS = [
  {
    name: 'Web3 Summit 2024',
    totalTickets: 500,
    pricePerTicket: 0.5,
    description: 'Annual Web3 conference with top keynote speakers',
  },
  {
    name: 'NFT Art Showcase',
    totalTickets: 200,
    pricePerTicket: 1.0,
    description: 'Exclusive digital art exhibition and auction',
  },
  {
    name: 'Crypto Music Fest',
    totalTickets: 1000,
    pricePerTicket: 0.75,
    description: 'Electronic music festival with blockchain integration',
  },
];

// Detect which port is in use
async function findAvailablePort() {
  for (let port of [3000, 3001, 3002, 3003]) {
    try {
      const response = await fetch(`http://localhost:${port}/api/events/list`);
      if (response.ok) {
        return port;
      }
    } catch (e) {
      // Port not available, try next
    }
  }
  return 3000; // Default fallback
}

const basePort = await findAvailablePort();
const API_URL = `http://localhost:${basePort}/api/events/create`;

async function createEvents() {
  console.log('🚀 Creating Sample Events via API\n');
  console.log('📋 Configuration:');
  console.log(`   API: ${API_URL}`);
  console.log(`   Events: ${SAMPLE_EVENTS.length}\n`);

  console.log('📝 Events to create:');
  SAMPLE_EVENTS.forEach((event, idx) => {
    console.log(`   ${idx + 1}. ${event.name}`);
    console.log(`      Tickets: ${event.totalTickets}`);
    console.log(`      Price: ${event.pricePerTicket} MOCA`);
  });
  console.log();

  const createdEvents = [];

  for (let i = 0; i < SAMPLE_EVENTS.length; i++) {
    const event = SAMPLE_EVENTS[i];
    console.log(`${i + 1}️⃣  Creating "${event.name}"...`);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create event');
      }

      const result = await response.json();
      console.log(`   ✅ Created: ${result.id}`);
      console.log(`   📋 Event ID: ${result.id}`);

      createdEvents.push(result);
      console.log();
    } catch (error) {
      console.error(
        `   ❌ Failed: ${error instanceof Error ? error.message : String(error)}`
      );
      console.log();
    }
  }

  console.log('📊 Summary:');
  console.log('════════════════════════════════════════');
  console.log(`✅ Created ${createdEvents.length} events\n`);

  createdEvents.forEach((event) => {
    console.log(`📍 ${event.name}`);
    console.log(`   ID: ${event.id}`);
    console.log(`   Tickets: ${event.totalTickets}`);
    console.log(`   Price: ${event.pricePerTicket} MOCA`);
    console.log(`   Created: ${event.createdAt}`);
    console.log();
  });

  console.log('View events at: http://localhost:3000/events');
  console.log('════════════════════════════════════════');
}

createEvents().catch((error) => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
