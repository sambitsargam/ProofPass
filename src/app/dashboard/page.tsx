'use client'

/**
 * Main Dashboard Page
 */
export default function DashboardPage() {
  return (
    <div className="py-20 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-5xl font-bold">Dashboard</h1>
        <p className="text-gray-400 text-lg">
          Manage your events, credentials, and tickets.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        {[
          { label: 'My Credentials', value: '2', icon: '🎫' },
          { label: 'Events Attended', value: '5', icon: '🎪' },
          { label: 'Tickets Owned', value: '7', icon: '🎟️' },
          { label: 'Fraud Score', value: 'Low', icon: '✅' },
        ].map((stat, idx) => (
          <div key={idx} className="card">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-gray-400 text-sm">{stat.label}</div>
            <div className="text-2xl font-bold mt-2">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card hover:border-primary/50 transition">
          <h3 className="text-xl font-bold mb-4">My Credentials</h3>
          <div className="space-y-3">
            {[
              { name: 'Human Verified', issuer: 'ProofPass', status: 'Active' },
              { name: 'Fan Badge (Gold)', issuer: 'Web3 Summit', status: 'Active' },
            ].map((cred, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 rounded bg-gray-700/50">
                <div>
                  <div className="font-semibold">{cred.name}</div>
                  <div className="text-sm text-gray-400">{cred.issuer}</div>
                </div>
                <span className="text-green-400 text-sm">✓ {cred.status}</span>
              </div>
            ))}
          </div>
          <button className="btn-primary mt-6 w-full">View All</button>
        </div>

        <div className="card hover:border-secondary/50 transition">
          <h3 className="text-xl font-bold mb-4">My Tickets</h3>
          <div className="space-y-3">
            {[
              { event: 'Web3 Summit 2024', date: '2024-12-15', status: 'Valid' },
              { event: 'NFT Art Showcase', date: '2024-12-20', status: 'Valid' },
            ].map((ticket, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 rounded bg-gray-700/50">
                <div>
                  <div className="font-semibold">{ticket.event}</div>
                  <div className="text-sm text-gray-400">{ticket.date}</div>
                </div>
                <span className="text-green-400 text-sm">✓ {ticket.status}</span>
              </div>
            ))}
          </div>
          <button className="btn-primary mt-6 w-full">View All</button>
        </div>
      </div>
    </div>
  )
}
