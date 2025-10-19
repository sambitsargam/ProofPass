'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

/**
 * AIR Kit Login Component
 * Implements SSO login flow with AIR Kit for human verification
 */
export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleAirKitLogin = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // In production: Use real AIR Kit SDK
      // import { AirKit } from '@mocanetwork/airkit';
      // const airkit = new AirKit({
      //   partnerId: process.env.NEXT_PUBLIC_AIR_KIT_PARTNER_ID,
      //   env: 'SANDBOX'
      // });
      // const result = await airkit.startSSO();

      // For MVP: Simulate AIR Kit login
      console.log('🔐 Initiating AIR Kit SSO...')

      // Simulate AIR Kit SSO flow
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Create mock user with verified credential
      const mockUser = {
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        walletAddress: '0x' + Math.random().toString(16).substr(2, 40),
        sessionToken: 'session_' + Date.now(),
        credentials: [
          {
            id: 'cred_human_verified',
            type: 'HUMAN_VERIFIED',
            issuer: 'AIR Kit',
            issuedAt: Math.floor(Date.now() / 1000),
            expiresAt: Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60,
            status: 'active',
          },
        ],
        createdAt: Date.now(),
      }

      // Store user session
      localStorage.setItem('proofpass_user', JSON.stringify(mockUser))

      console.log('✅ AIR Kit verification complete')
      console.log('User wallet:', mockUser.walletAddress)
      console.log('Credentials:', mockUser.credentials.map((c) => c.type))

      // Redirect to dashboard
      router.push('/dashboard')
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Login failed. Please try again.'
      setError(message)
      console.error('AIR Kit login error:', err)
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

          {/* AIR Kit Login Button */}
          <button
            onClick={handleAirKitLogin}
            disabled={isLoading}
            className="w-full btn-primary py-3 text-lg font-semibold"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <span className="inline-block w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
                Verifying with AIR Kit...
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
            <div className="flex gap-3 text-sm">
              <span className="text-primary font-bold">✓</span>
              <span className="text-gray-300">
                Prove humanity, prevent bot attacks
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
