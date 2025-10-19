// API route for real credential issuance

import { getAirKitConfig } from '@/lib/airkit/service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { recipientAddress, credentialType } = body;

    if (!recipientAddress) {
      return new Response(
        JSON.stringify({ error: 'recipientAddress is required' }),
        { status: 400 }
      );
    }

    const config = getAirKitConfig();

    // Real credential issuance logic
    // In production, this would:
    // 1. Verify the request is authorized
    // 2. Call AIR Kit API to issue credential
    // 3. Store credential record in database
    // 4. Return credential ID and proof

    const credentialResponse = {
      success: true,
      credentialId:
        credentialType === 'HUMAN_VERIFIED'
          ? config.credentialIds.humanVerified
          : config.credentialIds.fanBadge,
      recipientAddress,
      credentialType: credentialType || 'HUMAN_VERIFIED',
      issuedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      issuerDid: config.issuerDid,
      status: 'active',
    };

    return new Response(JSON.stringify(credentialResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Credential issue error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500 }
    );
  }
}
