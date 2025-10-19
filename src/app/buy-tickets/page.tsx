'use client'

import { useState } from 'react'

/**
 * Ticket Purchase & Credential Verification
 * User flows for buying tickets with credential proof
 */
export default function BuyTicketsPage() {
  const [step, setStep] = useState<'select' | 'verify' | 'purchase' | 'success'>('select')
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null)
  const [credentialProof, setCredentialProof] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)

  const events = [
    {
      id: 1,
      name: 'Web3 Summit 2024',
      price: '0.5',
      available: 255,
      image: '🎪',
    },
    {
      id: 2,
      name: 'NFT Art Showcase',
      price: '1.0',
      available: 11,
      image: '🎨',
    },
    {
      id: 3,
      name: 'Crypto Music Fest',
      price: '0.75',
      available: 433,
      image: '🎵',
    },
  ]

  const handleVerifyCredential = async () => {
    // In production, this would:
    // 1. Retrieve AIR Kit credential from user's wallet
    // 2. Generate ZK proof
    // 3. Verify credential validity
    // 4. Check fraud score

    // Simulate verification process
    setStep('verify')
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock credential proof
    setCredentialProof(
      'zk_proof_' + Math.random().toString(36).substr(2, 9)
    )
    setStep('purchase')
  }

  const handlePurchaseTicket = async () => {
    if (!credentialProof || !selectedEvent) return

    // In production, this would:
    // 1. Call smart contract with credential hash
    // 2. Mint NFT tickets
    // 3. Process payment

    setStep('success')
  }

  return (
    <div className="py-20 max-w-4xl mx-auto space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-5xl font-bold">Buy Tickets</h1>
        <p className="text-gray-400 text-lg">
          Prove your humanity to access verified events.
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex gap-4 justify-between mb-8">
        {['Select', 'Verify', 'Purchase', 'Success'].map((label, idx) => (
          <div
            key={idx}
            className={`flex items-center ${idx < 3 ? 'flex-1' : ''}`}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                step === ['select', 'verify', 'purchase', 'success'][idx]
                  ? 'bg-primary text-white'
                  : 'bg-gray-700 text-gray-400'
              }`}
            >
              {idx + 1}
            </div>
            <div
              className={`flex-1 h-1 ml-4 ${
                idx < 3 && step !== 'select' ? 'bg-primary' : 'bg-gray-700'
              }`}
            ></div>
            <div className="ml-4 text-sm font-semibold hidden md:block">
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Step 1: Select Event */}
      {step === 'select' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Select an Event</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                onClick={() => {
                  setSelectedEvent(event.id)
                  handleVerifyCredential()
                }}
                className="card hover:border-primary/50 cursor-pointer transition"
              >
                <div className="text-5xl mb-4">{event.image}</div>
                <h3 className="text-xl font-bold mb-2">{event.name}</h3>
                <div className="space-y-2 text-gray-400 text-sm">
                  <p>Price: {event.price} ETH</p>
                  <p>Available: {event.available} tickets</p>
                </div>
                <button className="btn-primary mt-4 w-full">
                  Select Event
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Verify Credential */}
      {step === 'verify' && (
        <div className="card space-y-6 text-center">
          <h2 className="text-2xl font-bold">Verify Your Humanity</h2>
          <p className="text-gray-400">
            Proving credential ownership with zero-knowledge proof...
          </p>

          {/* Loading Animation */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full border-4 border-gray-700 border-t-primary animate-spin"></div>
          </div>

          <div className="space-y-3 text-sm text-gray-400">
            <p>✓ Checking AIR Kit credentials</p>
            <p>✓ Generating ZK proof</p>
            <p>⏳ Verifying credential validity</p>
            <p>⏳ Checking fraud score</p>
          </div>
        </div>
      )}

      {/* Step 3: Purchase */}
      {step === 'purchase' && selectedEvent && (
        <div className="card space-y-6">
          <h2 className="text-2xl font-bold">Purchase Tickets</h2>

          {/* Credential Status */}
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500 text-green-400">
            ✅ Credential verified! Your humanity is confirmed.
          </div>

          {/* Event Details */}
          <div className="p-4 rounded-lg bg-gray-800 border border-gray-700 space-y-2">
            {(() => {
              const event = events.find((e) => e.id === selectedEvent)
              return (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Event:</span>
                    <span className="font-semibold">{event?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Price per ticket:</span>
                    <span className="font-semibold">{event?.price} ETH</span>
                  </div>
                </>
              )
            })()}
          </div>

          {/* Quantity Selection */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Number of Tickets
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="btn-outline px-6"
              >
                −
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="input-field text-center"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="btn-outline px-6"
              >
                +
              </button>
            </div>
          </div>

          {/* Total */}
          {(() => {
            const event = events.find((e) => e.id === selectedEvent)
            const total =
              quantity * (parseFloat(event?.price || '0'))
            return (
              <div className="p-4 rounded-lg bg-primary/10 border border-primary space-y-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>{total.toFixed(2)} ETH</span>
                </div>
              </div>
            )
          })()}

          {/* Purchase Button */}
          <button
            onClick={handlePurchaseTicket}
            className="btn-primary w-full py-3 text-lg font-semibold"
          >
            Complete Purchase
          </button>

          {/* Proof Display */}
          <div className="text-center text-sm text-gray-400">
            <p className="font-mono text-xs break-all">
              Credential Proof: {credentialProof}
            </p>
          </div>
        </div>
      )}

      {/* Step 4: Success */}
      {step === 'success' && (
        <div className="card text-center space-y-6">
          <div className="text-6xl">🎉</div>
          <h2 className="text-3xl font-bold">Tickets Purchased!</h2>
          <p className="text-gray-400 text-lg">
            Your NFT tickets have been minted and are ready for use.
          </p>

          <div className="p-4 rounded-lg bg-gray-800 border border-gray-700 text-left space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Transaction:</span>
              <span className="font-mono text-sm text-primary">
                0x1234...5678
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Tickets:</span>
              <span className="font-semibold">{quantity} NFTs</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Status:</span>
              <span className="text-green-400 font-semibold">✓ Confirmed</span>
            </div>
          </div>

          <div className="flex gap-4">
            <a href="/events" className="btn-secondary flex-1 text-center">
              Browse More Events
            </a>
            <a href="/dashboard/tickets" className="btn-primary flex-1 text-center">
              View My Tickets
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
