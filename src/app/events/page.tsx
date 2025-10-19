'use client'

import { useState, useEffect } from 'react'

interface Event {
  id: string
  name: string
  description: string
  totalTickets: number
  pricePerTicket: number
  createdAt: string
}

/**
 * Events Listing Page
 */
export default function EventsPage() {
  const [loading, setLoading] = useState(true)
  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/events/list')
      if (!response.ok) {
        throw new Error('Failed to fetch events')
      }
      const data = await response.json()
      setEvents(Array.isArray(data.events) ? data.events : [])
    } catch (err) {
      console.error('Error fetching events:', err)
      setEvents([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-400">Loading events...</p>
      </div>
    )
  }

  return (
    <div className="py-20 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-5xl font-bold">Verified Events</h1>
        <p className="text-gray-400 text-lg">
          Browse and attend bot-free events with credential verification.
        </p>
      </div>

      {/* Filter and Sort */}
      <div className="flex gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Search events..."
          className="input-field flex-1"
          disabled
        />
        <select className="input-field w-48" disabled>
          <option>All Events</option>
          <option>Upcoming</option>
          <option>This Month</option>
          <option>This Week</option>
        </select>
      </div>

      {/* Events Grid */}
      {events.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div key={event.id} className="card p-6 hover:border-blue-400 transition cursor-pointer">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white">{event.name}</h3>
                <p className="text-gray-400 line-clamp-2">{event.description}</p>
                
                <div className="border-t border-gray-700 pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Available Tickets:</span>
                    <span className="text-white font-semibold">{event.totalTickets}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Price per Ticket:</span>
                    <span className="text-green-400 font-semibold">{event.pricePerTicket} MOCA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Created:</span>
                    <span className="text-gray-300 text-sm">{new Date(event.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <button className="btn-primary w-full mt-4">
                  Get Ticket
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <div className="text-6xl mb-4">🎪</div>
          <p className="text-xl text-gray-300 mb-4">No events yet</p>
          <p className="text-gray-400 mb-6">
            Events will appear here once organizers create them on the platform.
          </p>
          <a href="/dashboard/issuer" className="btn-primary inline-block">
            Create an Event
          </a>
        </div>
      )}
    </div>
  )
}
