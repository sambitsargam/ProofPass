'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Home() {
  const [email, setEmail] = useState('')

  const handleDemo = async () => {
    // Placeholder for demo flow
    alert('Demo flow - Redirect to AIR Kit login')
  }

  return (
    <div className="space-y-20 py-20">
      {/* Hero Section */}
      <section className="text-center space-y-8">
        <div className="inline-block px-4 py-2 rounded-full border border-primary/30 bg-primary/10">
          <span className="text-sm text-primary font-semibold">
            🎟️ Verified Ticketing for the Web3 Era
          </span>
        </div>

        <h1 className="text-6xl font-bold leading-tight max-w-4xl mx-auto">
          Bot-Free Ticketing with{' '}
          <span className="gradient-text">Verifiable Credentials</span>
        </h1>

        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          ProofPass uses AIR Kit and zero-knowledge proofs to ensure only humans can buy tickets. 
          No scalpers, no bots, just real fans.
        </p>

        <div className="flex gap-4 justify-center">
          <button 
            onClick={handleDemo}
            className="btn-primary"
          >
            Get Started
          </button>
          <Link href="/events" className="btn-outline">
            Browse Events
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8">
        {[
          {
            icon: '🔐',
            title: 'Zero-Knowledge Proofs',
            description: 'Verify credentials without revealing personal data. Privacy-first design.'
          },
          {
            icon: '✅',
            title: 'Human Verified',
            description: 'AIR Kit credentials prove humanity. Scalpers and bots stay out.'
          },
          {
            icon: '🎭',
            title: 'Decentralized Identity',
            description: 'Users own their credentials. Reuse them across events and platforms.'
          },
          {
            icon: '⚡',
            title: 'Instant Access',
            description: 'Mint NFT tickets instantly after credential verification. No delays.'
          },
          {
            icon: '🤖',
            title: 'Fraud Detection',
            description: 'AI-powered behavioral analysis flags suspicious activities automatically.'
          },
          {
            icon: '🌐',
            title: 'Interoperable',
            description: 'Credentials work across events. Build cross-app loyalty programs.'
          },
        ].map((feature, idx) => (
          <div key={idx} className="card hover:border-primary/50 transition">
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
            <p className="text-gray-400">{feature.description}</p>
          </div>
        ))}
      </section>

      {/* Flow Section */}
      <section className="space-y-12">
        <h2 className="text-4xl font-bold text-center">How It Works</h2>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Issuer Flow */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold flex items-center gap-3">
              <span className="badge-primary">1</span> Event Organizer
            </h3>
            <div className="space-y-4">
              {[
                'Sign in with AIR Kit',
                'Create event on blockchain',
                'Issue "Human Verified" credentials',
                'Monitor fraud patterns',
                'Manage attendee list'
              ].map((step, idx) => (
                <div key={idx} className="flex gap-3">
                  <span className="text-primary font-bold">→</span>
                  <span className="text-gray-300">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Verifier Flow */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold flex items-center gap-3">
              <span className="badge-primary">2</span> Ticket Buyer
            </h3>
            <div className="space-y-4">
              {[
                'Sign in with AIR Kit wallet',
                'Browse verified events',
                'Prove credential ownership (ZK)',
                'Mint NFT ticket instantly',
                'Attend event or resell'
              ].map((step, idx) => (
                <div key={idx} className="flex gap-3">
                  <span className="text-secondary font-bold">→</span>
                  <span className="text-gray-300">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="card border-primary/50 bg-gradient-to-r from-primary/10 to-secondary/10 py-12">
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold">Ready to Verify Your Event?</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Join ProofPass and protect your events from scalpers and bots. 
            Start issuing credentials today.
          </p>
          <button 
            onClick={handleDemo}
            className="btn-primary"
          >
            Launch Dashboard
          </button>
        </div>
      </section>
    </div>
  )
}
