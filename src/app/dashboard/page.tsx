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

export default function DashboardPage() {
  const [credentials, setCredentials] = useState<Credential[]>([])
  const [loading, setLoading] = useState(true)
  const [userAddress, setUserAddress] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        // Get real user from localStorage
        const userStr = localStorage.getItem('proofpass_user')
        if (!userStr) {
          setError('No user session found. Please login first.')
          setLoading(false)
          return
        }

        const user = JSON.parse(userStr)
        setUserAddress(user.walletAddress || user.abstractAccountAddress)

        // Get real credentials from user session
        const realCredentials: Credential[] = (user.credentials || []).map(
          (cred: any) => {
            // Helper to safely format dates
            const formatDate = (date: any): string => {
              if (!date) return 'N/A'
              try {
                const dateObj = typeof date === 'number' ? new Date(date * 1000) : new Date(date)
                const formatted = dateObj.toLocaleDateString()
                return formatted === 'Invalid Date' ? 'N/A' : formatted
              } catch {
                return 'N/A'
              }
            }

            return {
              id: cred.id || cred.credentialId || 'unknown',
              type: cred.type || cred.credentialType || 'Unknown',
              issuer: cred.issuer || cred.issuerDid || 'AIR Kit',
              holder: user.walletAddress || user.abstractAccountAddress || 'Unknown',
              issuedAt: formatDate(cred.issuedAt),
              expiresAt: formatDate(cred.expiresAt),
              status: cred.status || 'Active',
            }
          }
        )

        setCredentials(realCredentials)
        setError(null)
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to load dashboard'
        setError(message)
        console.error('Dashboard load error:', err)
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  if (loading) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-400">Loading dashboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-20 text-center space-y-4">
        <p className="text-red-400">{error}</p>
        <a href="/login" className="btn-primary inline-block">
          Go to Login
        </a>
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
          <p className="text-sm text-gray-400">Verified Status</p>
          <p className="text-4xl font-bold text-green-400">✓</p>
        </div>
        <div className="card p-6 space-y-2">
          <p className="text-sm text-gray-400">Fraud Risk</p>
          <p className="text-4xl font-bold text-green-400">Low</p>
        </div>
        <div className="card p-6 space-y-2">
          <p className="text-sm text-gray-400">Member Since</p>
          <p className="text-lg font-bold">Today</p>
        </div>
      </div>

      {/* My Credentials */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">My Credentials</h2>
          <button className="btn-primary text-sm">Renew Verification</button>
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

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Quick Actions</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <a href="/events" className="card p-6 hover:border-primary/50 transition">
            <p className="text-lg font-bold">🎫 Browse Events</p>
            <p className="text-sm text-gray-400 mt-2">Discover verified events</p>
          </a>
          <a href="/buy-tickets" className="card p-6 hover:border-primary/50 transition">
            <p className="text-lg font-bold">🛍️ Buy Tickets</p>
            <p className="text-sm text-gray-400 mt-2">Purchase with your credentials</p>
          </a>
        </div>
      </div>
    </div>
  )
}
