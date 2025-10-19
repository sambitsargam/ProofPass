# ProofPass Deployment Guide

## Overview

ProofPass is a decentralized ticketing platform using AIR Kit for verifiable credentials and Solidity smart contracts for NFT tickets. This guide covers setup, configuration, and deployment.

## Prerequisites

- Node.js v18+
- npm or yarn
- Wallet with testnet ETH/MOCA tokens
- AIR Kit Developer Account
- Git

## Step 1: AIR Kit Setup

### 1.1 Create Developer Account

1. Visit [AIR Kit Developer Dashboard](https://developers.sandbox.air3.com/)
2. Connect your wallet
3. Navigate to **Accounts → General**
4. Copy your **Partner ID** and **Issuer DID**

### 1.2 Create Credential Schemas

**Schema 1: Human Verified**
- Name: `HumanVerified`
- Description: `Proof of humanity credential`
- Attributes:
  - `holderAddress` (string)
  - `verificationMethod` (string)
  - `issuedAt` (number)
  - `expiresAt` (number)

**Schema 2: Fan Badge**
- Name: `FanBadge`
- Description: `VIP fan credential with loyalty tier`
- Attributes:
  - `holderAddress` (string)
  - `tier` (string) - "GOLD", "SILVER", "BRONZE"
  - `eventCount` (number)
  - `loyaltyPoints` (number)

### 1.3 Create Issuance Programs

After creating schemas, create issuance programs:
1. Navigate to **Credentials → Create**
2. Select your schema
3. Copy the **Program ID** (Credential ID)

## Step 2: Smart Contract Deployment

### 2.1 Deploy to Moca Testnet

```bash
# Clone and install
git clone https://github.com/sambitsargam/ProofPass.git
cd ProofPass/contracts

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your wallet private key

# Deploy
npx hardhat run scripts/deploy.js --network moca-testnet
```

### 2.2 Record Contract Addresses

After deployment, save:
- `TicketNFT` address
- `TicketMarketplace` address
- Update `.env.local` with these addresses

## Step 3: Frontend Setup

### 3.1 Install Dependencies

```bash
npm install
```

### 3.2 Configure Environment

Create `.env.local`:

```env
# AIR Kit Configuration
NEXT_PUBLIC_AIR_PARTNER_ID=your_partner_id
NEXT_PUBLIC_AIR_ENV=SANDBOX
NEXT_PUBLIC_ISSUER_DID=your_issuer_did
NEXT_PUBLIC_CREDENTIAL_HUMAN_VERIFIED_ID=program_id_1
NEXT_PUBLIC_CREDENTIAL_FAN_BADGE_ID=program_id_2

# Smart Contracts
NEXT_PUBLIC_TICKET_NFT_ADDRESS=0x...
NEXT_PUBLIC_TICKET_MARKETPLACE_ADDRESS=0x...

# RPC and Chain
NEXT_PUBLIC_RPC_URL=https://testnet-rpc.moca.network
NEXT_PUBLIC_CHAIN_ID=7700

# Backend
JWT_PRIVATE_KEY=your_private_key
```

### 3.3 Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Step 4: Test User Flows

### Flow 1: Credential Issuance

1. Visit `/dashboard/issuer`
2. Fill in recipient wallet address
3. Select credential type
4. Click "Issue Credential"
5. Monitor in AIR Kit dashboard

### Flow 2: Ticket Purchase

1. Visit `/events`
2. Select an event
3. Click "Buy Ticket"
4. System verifies credential automatically
5. Complete purchase with MetaMask

### Flow 3: Fraud Detection

1. Make multiple rapid purchases
2. System flags suspicious activity
3. Admin reviews in dashboard

## Step 5: Production Deployment

### 5.1 Smart Contract Deployment

```bash
# Deploy to Moca Mainnet
npx hardhat run scripts/deploy.js --network moca-mainnet

# Verify contracts
npx hardhat verify --network moca-mainnet <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

### 5.2 Frontend Deployment

**Using Vercel:**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel deploy --prod
```

**Environment variables on Vercel:**
- Go to Project Settings → Environment Variables
- Add all `.env.local` variables

### 5.3 AIR Kit Production Setup

1. Navigate to AIR Kit dashboard
2. Switch from SANDBOX to PRODUCTION environment
3. Update environment config in code
4. Regenerate JWT tokens with production private key

## Monitoring & Maintenance

### Monitor Smart Contracts

Use block explorers:
- [Moca Testnet Explorer](https://testnet-explorer.moca.network/)
- [Moca Mainnet Explorer](https://explorer.moca.network/)

### Monitor Fraud Detection

1. Check `/dashboard/issuer` analytics
2. Review flagged wallets
3. Adjust fraud thresholds as needed

### Credential Management

1. Revoke expired credentials via AIR Kit dashboard
2. Monitor issuance success rates
3. Track credential usage patterns

## Troubleshooting

### AIR Kit Login Not Working

- Verify `NEXT_PUBLIC_AIR_PARTNER_ID` is correct
- Check wallet is connected to SANDBOX environment
- Ensure AIR Kit SDK is properly initialized

### Smart Contract Errors

- Verify contract addresses in `.env.local`
- Check wallet has sufficient gas (testnet ETH)
- Ensure contract is deployed to correct chain

### Credential Verification Fails

- Verify JWT token is valid
- Check credential schema matches data
- Ensure credential ID is correct

## API Endpoints

### Credential Issuance
```
POST /api/credentials/issue
Body: {
  recipientAddress: string
  credentialType: "HUMAN_VERIFIED" | "FAN_BADGE"
  credentialSubject: Record<string, any>
}
```

### Credential Verification
```
POST /api/credentials/verify
Body: {
  credentialHash: string
  walletAddress: string
}
```

### Ticket Purchase
```
POST /api/tickets/purchase
Body: {
  eventId: number
  quantity: number
  credentialHash: string
  buyerAddress: string
}
```

### Fraud Analysis
```
POST /api/fraud/analyze
Body: {
  walletAddress: string
  purchaseHistory: Array
}
```

## Security Checklist

- [ ] JWT private key never committed to repo
- [ ] Environment variables secured
- [ ] Contract verified on block explorer
- [ ] Rate limiting on API endpoints
- [ ] CORS properly configured
- [ ] Input validation on all endpoints
- [ ] Re-entrancy protection in contracts
- [ ] Access control properly implemented

## Support & Resources

- [AIR Kit Documentation](https://docs.moca.network/airkit/)
- [Moca Network Docs](https://docs.moca.network/)
- [GitHub Issues](https://github.com/sambitsargam/ProofPass/issues)
- [Discord Community](https://discord.gg/moca)

## License

MIT
