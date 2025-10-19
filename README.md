# ProofPass - Human-Verified Ticketing Platform

Human-verified, bot-free ticketing powered by verifiable credentials and zero-knowledge proofs.

## 🔹 Problem

Scalpers and bots exploit NFT and ticketing systems, hurting legitimate fans and event organizers. Events need human verification without collecting personal data.

## 🔹 Solution

ProofPass is a ticketing platform where only wallets with a "Human Verified" credential (issued via AIR Kit) can mint or buy tickets. We tie perks to fan credentials for VIP access and loyalty programs.

## 🧰 Tech Stack

- **AIR Kit** - Credential issuance and ZK verification (Moca Network)
- **Next.js + TypeScript** - Frontend framework
- **Solidity** - Smart contracts for ticket NFTs
- **Wagmi + Viem** - Web3 wallet integration
- **Tailwind CSS** - Styling
- **Zustand** - State management

## 🌟 Key Features

✅ **User Authentication** - SSO login via AIR Kit
✅ **Credential Issuance** - Admin panel to issue "Human Verified" credentials
✅ **Credential Verification** - ZK proof verification for ticket purchases
✅ **Smart Contract Ticketing** - NFT tickets with access control
✅ **Fraud Detection** - Optional behavioral analysis for suspicious wallets
✅ **Event Management** - Create, list, and manage events
✅ **Ticket Marketplace** - Buy/sell with credential verification

## 🚀 Quick Start

### Prerequisites

- Node.js v16+
- Wallet with test funds (testnet)
- AIR Kit Developer Account (https://developers.sandbox.air3.com/)

### Setup

1. **Clone and Install**
```bash
git clone https://github.com/sambitsargam/ProofPass
cd ProofPass
npm install
```

2. **Environment Variables**
Create `.env.local`:
```env
NEXT_PUBLIC_AIR_PARTNER_ID=your_partner_id_here
NEXT_PUBLIC_AIR_ENV=SANDBOX
NEXT_PUBLIC_ISSUER_DID=your_issuer_did_here
NEXT_PUBLIC_CREDENTIAL_ID=your_credential_id_here
NEXT_PUBLIC_RPC_URL=https://testnet-rpc.moca.network
NEXT_PUBLIC_CHAIN_ID=7700
```

3. **Setup AIR Kit Dashboard**
- Go to https://developers.sandbox.air3.com/
- Create schemas for:
  - "Human Verified" credential
  - "Fan Badge" credential with VIP tier
- Copy Partner ID, Issuer DID, and Credential IDs to `.env.local`

4. **Run Development Server**
```bash
npm run dev
```

Visit http://localhost:3000

## 📁 Project Structure

```
src/
├── app/               # Next.js app directory
├── components/        # React components
│   ├── Auth/         # Authentication flows
│   ├── Issuer/       # Credential issuance
│   ├── Verifier/     # Credential verification
│   └── Events/       # Event management
├── lib/              # Utilities
│   ├── airkit/       # AIR Kit integration
│   ├── contract/     # Smart contract ABIs
│   └── fraud/        # Fraud detection
├── hooks/            # React hooks
├── stores/           # Zustand stores
└── types/            # TypeScript types
contracts/            # Solidity contracts
```

## 🔐 Security Features

- **Zero-Knowledge Proofs** - Verify credentials without revealing underlying data
- **Decentralized Identity** - Users own their credentials
- **Wallet-Based Access Control** - Only verified wallets can transact
- **Fraud Detection** - AI-powered behavior analysis (optional)
- **No PII Storage** - Privacy-first design

## 📊 User Flows

### Flow 1: Issuer (Event Organizer)
1. Login with AIR Kit
2. Access admin panel
3. Create event and set credential requirements
4. Issue "Human Verified" credentials to attendees
5. Monitor fraud patterns

### Flow 2: Verifier (Ticket Buyer)
1. Login with AIR Kit
2. Browse events
3. Prove credential ownership (ZK proof)
4. Mint ticket NFT
5. Attend event

## 🤖 Fraud Detection

Optional AI layer flags suspicious activity:
- Rapid purchase patterns
- Multiple wallet registrations
- Unusual geographic/temporal patterns
- Behavioral anomalies

## 📜 Smart Contracts

### TicketNFT.sol
```solidity
- Mint tickets only with verified credentials
- Burn upon entry
- Transferable with credential verification
- Event-specific access control
```

## 🌐 Deployment

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

### Testnet Deployment
1. Deploy contracts to Moca testnet
2. Update contract addresses in config
3. Deploy frontend to Vercel
4. Configure production AIR Kit credentials

## 📚 Documentation

- [AIR Kit Docs](https://docs.moca.network/airkit/)
- [Moca Network](https://moca.network/)
- [Smart Contracts README](./contracts/README.md)

## 🛠️ Development

### Install Dependencies
```bash
npm install
```

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 🙋 Support

For questions and support:
- Open an issue on GitHub
- Check AIR Kit documentation
- Join Moca Network community

## 🔮 Future Enhancements

- [ ] Mobile app (Flutter SDK)
- [ ] Multi-chain support
- [ ] Advanced analytics dashboard
- [ ] Secondary ticket marketplace
- [ ] Loyalty rewards program
- [ ] AI-powered fan profiling
- [ ] Cross-event credential portability
- [ ] Integration with major ticketing platforms

---

**ProofPass** - Where verified humans meet verified ticketing 🎟️✅
