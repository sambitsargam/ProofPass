'use client'

/**
 * Events Listing Page
 */
export default function EventsPage() {
  const events = [
    {
      id: 1,
      name: 'Web3 Summit 2024',
      date: '2024-12-15',
      location: 'San Francisco, CA',
      totalTickets: 500,
      mintedTickets: 245,
      ticketPrice: '0.5',
      requiredCredential: 'HUMAN_VERIFIED',
      description: 'Annual Web3 conference with top keynote speakers',
    },
    {
      id: 2,
      name: 'NFT Art Showcase',
      date: '2024-12-20',
      location: 'New York, NY',
      totalTickets: 200,
      mintedTickets: 189,
      ticketPrice: '1.0',
      requiredCredential: 'HUMAN_VERIFIED',
      description: 'Exclusive digital art exhibition and auction',
    },
    {
      id: 3,
      name: 'Crypto Music Fest',
      date: '2024-12-28',
      location: 'Los Angeles, CA',
      totalTickets: 1000,
      mintedTickets: 567,
      ticketPrice: '0.75',
      requiredCredential: 'HUMAN_VERIFIED',
      description: 'Electronic music festival with blockchain integration',
    },
  ]

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
        />
        <select className="input-field w-48">
          <option>All Events</option>
          <option>Upcoming</option>
          <option>This Month</option>
          <option>This Week</option>
        </select>
      </div>

      {/* Events Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event) => (
          <div key={event.id} className="card hover:border-primary/50 transition">
            {/* Event Image Placeholder */}
            <div className="w-full h-40 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-4xl">🎪</span>
            </div>

            {/* Event Details */}
            <h3 className="text-xl font-bold mb-2">{event.name}</h3>

            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <span>📅</span>
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📍</span>
                <span>{event.location}</span>
              </div>
              <p className="text-gray-300">{event.description}</p>
            </div>

            {/* Availability */}
            <div className="mt-4 pt-4 border-t border-gray-700 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Tickets available</span>
                <span className="font-semibold">
                  {event.totalTickets - event.mintedTickets} / {event.totalTickets}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{
                    width: `${(event.mintedTickets / event.totalTickets) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Price and Action */}
            <div className="mt-6 flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400">Per ticket</div>
                <div className="text-2xl font-bold text-primary">
                  {event.ticketPrice} ETH
                </div>
              </div>
              <button className="btn-primary">Buy Ticket</button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {events.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">No events found</p>
        </div>
      )}
    </div>
  )
}
