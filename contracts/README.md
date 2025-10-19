# ProofPass Smart Contracts

Solidity contracts for the ProofPass ticketing platform.

## Contracts

### TicketNFT.sol
ERC721 NFT contract for event tickets with credential verification.

**Features:**
- Mint tickets only with verified credentials
- Mark tickets as used upon entry
- Burn tickets for removal from circulation
- Transfer tickets with verification
- Prevent non-humans from acquiring tickets

**Key Functions:**
- `mintTicket()` - Issue new ticket with credential hash
- `useTicket()` - Mark ticket as used at event
- `burnTicket()` - Remove ticket from circulation
- `verifyTicket()` - Check if ticket is valid
- `transferFrom()` - Transfer with credential verification

### TicketMarketplace.sol
Marketplace for primary and secondary ticket sales.

**Features:**
- Create events with ticket counts and pricing
- Purchase tickets with credential verification
- Secondary ticket marketplace (resale)
- Platform fee management
- Fraud-resistant design

**Key Functions:**
- `createEvent()` - Register new event
- `purchaseTickets()` - Buy primary tickets
- `listTicket()` - List for resale
- `buyListedTicket()` - Buy from secondary market
- `getAvailableTickets()` - Check inventory

## Deployment

### Prerequisites
- Hardhat or Truffle
- OpenZeppelin contracts
- Testnet funds (Moca testnet)

### Deploy to Moca Testnet

```bash
# Install dependencies
npm install

# Compile contracts
npx hardhat compile

# Deploy
npx hardhat run scripts/deploy.js --network moca-testnet
```

## Contract Interaction

### Issue a Ticket

```javascript
const txn = await ticketNFT.mintTicket(
  userAddress,
  eventId,
  credentialHash,
  tokenURI
);
```

### Purchase Tickets

```javascript
const txn = await marketplace.purchaseTickets(
  eventId,
  quantity,
  credentialHash,
  uris,
  { value: price }
);
```

### Resell Ticket

```javascript
// List ticket
await ticketNFT.approve(marketplace.address, tokenId);
await marketplace.listTicket(tokenId, newPrice);

// Buy from listing
await marketplace.buyListedTicket(tokenId, { value: newPrice });
```

## Security Considerations

✅ Credential verification on every mint
✅ Only authorized verifiers can mint
✅ Platform fee cannot exceed 5%
✅ Access control for sensitive operations
✅ Re-entrancy protection on payments
✅ Overflow/underflow protection (Solidity 0.8+)

## Testing

```bash
npx hardhat test
```

## License

MIT
