'use client'

import { useState, useEffect } from 'react'
import { CredentialDisplay } from '@/components/CredentialDisplay'

interface Credential {
  id: string
  type: string
  issuer: string
  holder: string
  issuedAt: string
  expiresAt: string
  status: string
}

interface Ticket {
  id: string
  eventName: string
  date: string
  location: string
  seatNumber: string
  status: string
}

export default function DashboardPage() {
  const [credentials, setCredentials] = useState<Credential[]>([])
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [userAddress, setUserAddress] = useState<string>('')

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        // Get user from localStorage
        const userStr = localStorage.getItem('proofpass_user')
        if (userStr) {
          const user = JSON.parse(userStr)
          setUserAddress(user.walletAddress)
        }

        // Mock credentials
        const mockCredentials: Credential[] = [
          {
            id: 'cred_001',
            type: 'HUMAN_VERIFIED',
            issuer: 'AIR Kit',
            holder: userAddress || '0x1234...5678',
            issuedAt: '2024-10-15',
            expiresAt: '2025-10-15',
            status: 'active',
          },
          {
            id: 'cred_002',
            type: 'FAN_BADGE',
            issuer: 'ProofPass',
            holder: userAddress || '0x1234...5678',
            issuedAt: '2024-09-20',
            expiresAt: '2025-09-20',
            status: 'active',
          },
        ]

        // Mock tickets
        const mockTickets: Ticket[] = [
          {
            id: 'ticket_001',
            eventName: 'Web3 Summit 2024',
            date: '2024-12-15',
            location: 'San Francisco, CA',
            seatNumber: '201A',
            status: 'valid',
          },
          {
            id: 'ticket_002',
            eventName: 'NFT Art Showcase',
            date: '2024-12-20',
            location: 'New York, NY',
            seatNumber: 'VIP-05',
            status: 'valid',
          },
        ]

        setCredentials(mockCredentials)
        setTickets(mockTickets)
      } catch (error) {
        console.error('Failed to load dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [userAddress])

  if (loading) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-400">Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="py-20 space-y-12">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-5xl font-bold">Your Dashboard</h1>
        <p className="text-gray-400">
          Verified wallet: {userAddress ? `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}` : 'Not connected'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="card p-6 space-y-2">
          <p className="text-sm text-gray-400">Active Credentials</p>
          <p className="text-4xl font-bold">{credentials.length}</p>
        </div>
        <div className="card p-6 space-y-2">
          <p className="text-sm text-gray-400">Valid Tickets</p>
          <p className="text-4xl font-bold">{tickets.length}</p>
        </div>
        <div className="card p-6 space-y-2">
          <p className="text-sm text-gray-400">Human Verified</p>
          <p className="text-4xl font-bold text-green-400">✓</p>
        </div>
        <div className="card p-6 space-y-2">
          <p className="text-sm text-gray-400">Fraud Risk</p>
          <p className="text-4xl font-bold text-green-400">Low</p>
        </div>
      </div>

      {/* My Credentials */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">My Credentials</h2>
          <button className="btn-primary text-sm">Verify Humanity</button>
        </div>
        {credentials.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {credentials.map((cred) => (
              <CredentialDisplay key={cred.id} credential={cred} />
            ))}
          </div>
        ) : (
          <div className="card p-8 text-center text-gray-400">
            <p>No credentials yet. Start by verifying your humanity with AIR Kit.</p>
          </div>
        )}
      </div>

      {/* My Tickets */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">My Tickets</h2>
          <button className="btn-primary text-sm">Browse Events</button>
        </div>
        {tickets.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="card hover:border-primary/50 transition p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold">{ticket.eventName}</h3>
                    <p className="text-sm text-gray-400">{ticket.location}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold">
                    {ticket.status.toUpperCase()}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Date</p>
                    <p className="font-semibold">{ticket.date}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Seat</p>
                    <p className="font-semibold">{ticket.seatNumber}</p>
                  </div>
                </div>
                <button className="w-full btn-outline py-2 text-sm">View QR Code</button>
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-8 text-center text-gray-400">
            <p>No tickets yet. Browse and purchase verified event tickets.</p>
          </div>
        )}
      </div>
    </div>
  )
}
