import { verifyCredential } from '@/lib/airkit/credentials'

// Simple perks API: given a credential id and wallet address, verify the credential
// and return applicable perks (discounts / benefits). This is intentionally
// lightweight and uses the existing verifyCredential helper. In production
// this should inspect the credential type and claims, check expiry/flags,
// and consult an organizer-managed perks configuration.

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { credentialId, walletAddress } = body

    if (!credentialId) {
      return new Response(JSON.stringify({ error: 'credentialId required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Verify the credential using the lib helper (mocked in this project)
    const verification = await verifyCredential(credentialId, walletAddress || '')

    if (!verification || !verification.isValid) {
      return new Response(JSON.stringify({ isValid: false, perks: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Derive a simple perk mapping. In a real app this would be data-driven.
    // We use credentialId contents as a hint for different tiers for demo.
    let perk = {
      id: 'human_basic',
      title: 'Human Verified Access',
      description: '10% discount on ticket purchases for verified attendees.',
      discountPercent: 10,
      extraBenefit: 'Priority entry',
    }

    if (credentialId.toLowerCase().includes('vip')) {
      perk = {
        id: 'vip_pass',
        title: 'VIP Pass',
        description: '25% discount + VIP lounge access.',
        discountPercent: 25,
        extraBenefit: 'VIP lounge access',
      }
    }

    const result = {
      isValid: true,
      credentialId,
      walletAddress: walletAddress || null,
      verifiedAt: verification.verifiedAt || new Date().toISOString(),
      perks: [perk],
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
