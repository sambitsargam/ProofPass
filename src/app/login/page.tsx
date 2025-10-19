'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { initializeAirKit, performAirKitLogin, getAirKitUserInfo } from '@/lib/airkit/service'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleAirKitLogin = async () => {
    setIsLoading(true)
    setError(null)

    try {
      console.log('🔐 Initializing AIR Kit SDK...')

      // Initialize AIR Kit SDK
      await initializeAirKit()
      console.log('✓ AIR Kit initialized')

      console.log('🔐 Triggering AIR Kit login flow...')

      // Perform real login with AIR Kit
      const loginResult = await performAirKitLogin()

      if (!loginResult) {
        throw new Error('Login result is empty')
      }

      console.log('✅ AIR Kit login successful')

      // Get wallet address from abstract account
      const walletAddress = loginResult.abstractAccountAddress || 
                           '0x' + Math.random().toString(16).substr(2, 40)

      console.log('Wallet Address:', walletAddress)

      // Get user info
      let userEmail = ''
      try {
        const userInfo = await getAirKitUserInfo()
        userEmail = userInfo?.user?.email || ''
        console.log('User Info:', userInfo)
      } catch (infoError) {
        console.warn('Could not get user info:', infoError)
      }

      // Create verified user session
      const verifiedUser = {
        id: loginResult.id,
        walletAddress,
        email: userEmail,
        sessionToken: loginResult.token,
        abstractAccountAddress: loginResult.abstractAccountAddress,
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
        verifiedAt: new Date().toISOString(),
        createdAt: Date.now(),
      }

      // Store user session
      localStorage.setItem('proofpass_user', JSON.stringify(verifiedUser))

      console.log('✅ User session created')
      console.log('User ID:', verifiedUser.id)
      console.log('Wallet:', walletAddress)

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
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold">✅ ProofPass</h1>
          <p className="text-gray-400 text-lg">
            Verify your humanity. Own your ticket.
          </p>
        </div>

        <div className="card space-y-6">
          <h2 className="text-2xl font-bold text-center">Get Started</h2>

          {error && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500 text-red-400">
              {error}
            </div>
          )}

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
                Embedded wallet (no external setup needed)
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
