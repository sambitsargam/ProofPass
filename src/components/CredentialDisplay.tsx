'use client'

import { useState } from 'react'

/**
 * Credential Display Component
 */
export function CredentialDisplay({ credential }: { credential: any }) {
  return (
    <div className="card border-l-4 border-primary">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold">{credential.type === 'HUMAN_VERIFIED' ? '✅ Human Verified' : '🎭 Fan Badge'}</h3>
          <p className="text-gray-400 text-sm mt-1">Issued by {credential.issuer}</p>
        </div>
        <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-semibold">
          Active
        </span>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-700 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Holder:</span>
          <span className="font-mono">{credential.holderAddress?.slice(0, 10)}...</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Issued:</span>
          <span>{new Date(credential.issuedAt * 1000).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  )
}

/**
 * Credential List Component
 */
export function CredentialsList() {
  const [credentials] = useState([
    {
      id: '1',
      type: 'HUMAN_VERIFIED',
      holderAddress: '0x1234567890abcdef',
      issuer: 'ProofPass',
      issuedAt: Math.floor(Date.now() / 1000) - 86400 * 30,
      expiresAt: Math.floor(Date.now() / 1000) + 86400 * 335,
    },
    {
      id: '2',
      type: 'FAN_BADGE',
      holderAddress: '0x1234567890abcdef',
      issuer: 'Web3 Summit',
      issuedAt: Math.floor(Date.now() / 1000) - 86400 * 7,
      expiresAt: Math.floor(Date.now() / 1000) + 86400 * 358,
    },
  ])

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Your Credentials</h2>
      <div className="grid gap-4">
        {credentials.map((cred) => (
          <CredentialDisplay key={cred.id} credential={cred} />
        ))}
      </div>
    </div>
  )
}
