// API route for fraud analysis

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { walletAddress, purchaseHistory } = body

    // Analyze fraud patterns
    let suspiciousScore = 0
    const flags: string[] = []

    // Check purchase frequency
    if (purchaseHistory?.length > 5) {
      flags.push('RAPID_PURCHASES')
      suspiciousScore += 25
    }

    // Check account age
    const accountAge = purchaseHistory?.[0]?.timestamp 
      ? (Date.now() - purchaseHistory[0].timestamp) / (1000 * 60 * 60 * 24)
      : 100

    if (accountAge < 7) {
      flags.push('NEW_ACCOUNT')
      suspiciousScore += 20
    }

    // Check geographic consistency
    const locations = [...new Set(purchaseHistory?.map((p: any) => p.location))]
    if (locations.length > 5) {
      flags.push('SUSPICIOUS_LOCATIONS')
      suspiciousScore += 15
    }

    const fraudAnalysis = {
      walletAddress,
      suspiciousScore: Math.min(suspiciousScore, 100),
      flags,
      lastAnalyzedAt: new Date().toISOString(),
      recommendedAction:
        suspiciousScore < 30 ? 'ALLOW' : suspiciousScore < 70 ? 'REVIEW' : 'BLOCK',
    }

    return new Response(JSON.stringify(fraudAnalysis), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500 }
    )
  }
}
