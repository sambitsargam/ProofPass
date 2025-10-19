'use client'

import { useState, useEffect } from 'react'

/**
 * Events Listing Page
 */
export default function EventsPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In production, fetch real events from smart contract or API
    // For now, showing empty state until events are created
    setLoading(false)
  }, [])

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

      {/* Events Grid - Empty State */}
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
    </div>
  )
}
