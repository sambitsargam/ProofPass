import fs from 'fs'
import path from 'path'

const EVENTS_FILE = path.join(process.cwd(), 'data', 'events.json')

// Ensure data directory exists
function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

export interface StoredEvent {
  id: string
  name: string
  totalTickets: number
  soldTickets: number
  pricePerTicket: number
  description: string
  createdAt: string
  organizer: string
  requiredCredential: string
  contractAddress: string
  metadata: {
    location: string
    image: string
  }
}

// Load all events from file
export function loadEvents(): StoredEvent[] {
  try {
    ensureDataDir()
    if (fs.existsSync(EVENTS_FILE)) {
      const data = fs.readFileSync(EVENTS_FILE, 'utf-8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error loading events:', error)
  }
  return []
}

// Save events to file
export function saveEvent(event: StoredEvent): StoredEvent {
  try {
    ensureDataDir()
    const events = loadEvents()
    events.push(event)
    fs.writeFileSync(EVENTS_FILE, JSON.stringify(events, null, 2))
    return event
  } catch (error) {
    console.error('Error saving event:', error)
    throw error
  }
}

// Get a single event by ID
export function getEvent(id: string): StoredEvent | null {
  const events = loadEvents()
  return events.find((e) => e.id === id) || null
}

// Update event
export function updateEvent(id: string, updates: Partial<StoredEvent>): StoredEvent | null {
  try {
    ensureDataDir()
    let events = loadEvents()
    const index = events.findIndex((e) => e.id === id)
    if (index === -1) return null

    events[index] = { ...events[index], ...updates }
    fs.writeFileSync(EVENTS_FILE, JSON.stringify(events, null, 2))
    return events[index]
  } catch (error) {
    console.error('Error updating event:', error)
    throw error
  }
}
