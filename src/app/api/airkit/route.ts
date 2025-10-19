// API route for AIR Kit credential operations
// Integrates with real AIR Kit SDK for issuance and verification

import { NextRequest, NextResponse } from 'next/server'
import { issueCredential, verifyCredentialWithProof } from '@/lib/airkit/credentials'
import { getAirKitConfig } from '@/lib/airkit/service'

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json()

    switch (action) {
      case 'issue':
        // Issue a new credential via AIR Kit
        const issued = await issueCredential(data)
        return NextResponse.json(
          {
            success: true,
            credential: issued,
            message: 'Credential issued successfully',
          },
          { status: 200 }
        )

      case 'verify':
        // Verify credential with zero-knowledge proof
        const verified = await verifyCredentialWithProof(
          data.credentialId,
          data.walletAddress
        )
        return NextResponse.json(
          {
            success: true,
            verification: verified,
            message: 'Credential verified',
          },
          { status: 200 }
        )

      case 'config':
        // Get AIR Kit configuration
        const config = getAirKitConfig()
        return NextResponse.json(
          {
            success: true,
            config: {
              partnerId: config.partnerId,
              env: config.env,
              issuerDid: config.issuerDid,
            },
          },
          { status: 200 }
        )

      default:
        return NextResponse.json(
          { error: 'Unknown action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('AIR Kit operation failed:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Operation failed',
      },
      { status: 500 }
    )
  }
}
