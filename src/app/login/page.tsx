'use client'

import { useState, useEffect } from 'react'

/**
 * AIR Kit Login Component
 * Implements SSO login flow with AIR Kit
 */
export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleAirKitLogin = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // In production, initialize AIR Kit service here
      // const airService = getAirService();
      // const result = await airService.login();
      
      // Placeholder for AIR Kit login flow
      const mockUser = {
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        walletAddress: '0x' + Math.random().toString(16).substr(2),
        sessionToken: 'session_' + Date.now(),
        credentials: [],
        createdAt: Date.now(),
      }

      // Store user session
      localStorage.setItem('proofpass_user', JSON.stringify(mockUser))
      setIsLoggedIn(true)

      // Redirect to dashboard
      window.location.href = '/dashboard'
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Login failed. Please try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold">✅ ProofPass</h1>
          <p className="text-gray-400 text-lg">
            Verify your humanity. Own your ticket.
          </p>
        </div>

        {/* Login Card */}
        <div className="card space-y-6">
          <h2 className="text-2xl font-bold text-center">Get Started</h2>

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500 text-red-400">
              {error}
            </div>
          )}

          {/* AIR Kit Login */}
          <button
            onClick={handleAirKitLogin}
            disabled={isLoading}
            className="w-full btn-primary py-3 text-lg font-semibold"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <span className="inline-block w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
                Connecting...
              </span>
            ) : (
              '🔐 Sign in with AIR Kit'
            )}
          </button>

          {/* Features List */}
          <div className="space-y-3 pt-4">
            <div className="flex gap-3 text-sm">
              <span className="text-primary font-bold">✓</span>
              <span className="text-gray-300">
                Secure SSO with decentralized identity
              </span>
            </div>
            <div className="flex gap-3 text-sm">
              <span className="text-primary font-bold">✓</span>
              <span className="text-gray-300">
                Zero-knowledge credential verification
              </span>
            </div>
            <div className="flex gap-3 text-sm">
              <span className="text-primary font-bold">✓</span>
              <span className="text-gray-300">
                No personal data collection
              </span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="text-center text-sm text-gray-400">
          <p>
            By signing in, you agree to our{' '}
            <a href="#" className="text-primary hover:underline">
              Terms of Service
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
