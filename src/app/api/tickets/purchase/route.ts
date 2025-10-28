// API route for ticket purchase

export async function POST(request: Request) {
  try {
    const body = await request.json()

  const { eventId, quantity, buyerAddress, appliedPerk } = body

    // In production:
    // 1. Verify credential proof
    // 2. Check fraud score
    // 3. Call smart contract to mint tickets
    // 4. Process payment
    // 5. Record transaction

    const ticketIds = Array.from({ length: quantity }, () =>
      Math.random().toString(36).substr(2, 9)
    )

    // Apply perk discount if present
    const unitPrice = 0.5
    const discountPercent = appliedPerk?.discountPercent || 0
    const rawTotal = quantity * unitPrice
    const totalPrice = rawTotal - rawTotal * (discountPercent / 100)

    const purchaseResult = {
      success: true,
      orderId: 'order_' + Math.random().toString(36).substr(2, 9),
      eventId,
      buyerAddress,
      ticketCount: quantity,
      ticketIds,
      transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
      totalPrice: totalPrice.toFixed(4).toString(),
      purchasedAt: new Date().toISOString(),
      appliedPerk: appliedPerk || null,
    }

    return new Response(JSON.stringify(purchaseResult), {
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
