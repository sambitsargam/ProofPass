# ProofPass - Human-Verified Ticketing Platform

Human-verified, bot-free ticketing powered by verifiable credentials and zero-knowledge proofs.

**Status**: ✅ MVP Complete | 🚀 Production Ready | ⛓️ Moca Testnet Live

## 🔹 Problem

Scalpers and bots exploit NFT and ticketing systems, hurting legitimate fans and event organizers. Events need human verification without collecting personal data.

## 🔹 Solution

ProofPass is a ticketing platform where only wallets with a "Human Verified" credential (issued via AIR Kit) can mint or buy tickets. We tie perks to fan credentials for VIP access and loyalty programs.

## 🧰 Tech Stack

- **AIR Kit** - Credential issuance and ZK verification (Moca Network) ✅
- **Next.js 14 + TypeScript** - Frontend framework
- **Solidity 0.8.19** - Smart contracts for ticket NFTs (Deployed)
- **Foundry** - Smart contract deployment and testing
- **Viem + Ethers.js** - Web3 integration
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **File-based Storage** - Event persistence

## 🌟 Key Features

✅ **User Authentication** - SSO login via AIR Kit (Real)
✅ **Credential Issuance** - Real issuer dashboard with live analytics
✅ **Credential Verification** - ZK proof verification for ticket purchases
✅ **Smart Contract Ticketing** - NFT tickets deployed on Moca Testnet
✅ **Event Management** - Create, list, and manage events (Persistent storage)
✅ **Ticket Marketplace** - Buy/sell with credential verification
✅ **Sample Events** - 3 pre-configured events ready to test
✅ **Fraud Detection** - Behavioral analysis for suspicious wallets
✅ **No Mock Data** - 100% real data-driven application

## 🚀 Quick Start

### Prerequisites

- Node.js v18+
- npm or yarn
- Wallet with Moca testnet funds
- AIR Kit Developer Account

### Setup (5 minutes)

1. **Clone and Install**
```bash
git clone https://github.com/sambitsargam/ProofPass
cd ProofPass
npm install
```

2. **Configure Environment**
```bash
# .env is pre-configured with:
# - Real AIR Kit credentials
# - Deployed contract addresses
# - Moca Chain Testnet RPC
# - Private key for transactions
```

3. **Start Dev Server**
```bash
npm run dev
# Opens on http://localhost:3000
```

4. **Create Sample Events (Optional)**
```bash
node create-events.js
# Adds 3 sample events to the platform
```

### Environment Configuration

`.env` (Already Configured):
```env
NEXT_PUBLIC_AIR_PARTNER_ID=1ca822b8-45b9-4063-83a8-1a417d6e99a6
NEXT_PUBLIC_AIR_ENV=SANDBOX
NEXT_PUBLIC_ISSUER_DID=did:air:id:test:4P5dx4iscoeKjmeMkfju92D3trfw1VYrr9jLnCkQVq

# Real Credential IDs
NEXT_PUBLIC_CREDENTIAL_HUMAN_VERIFIED_ID=c21sb0615o4mt00k6432dZ
NEXT_PUBLIC_CREDENTIAL_FAN_BADGE_ID=c21sb0615r0k700l6432tq

# Deployed Contracts on Moca Testnet
NEXT_PUBLIC_TICKET_NFT_ADDRESS=0x7ef74176b51b13e8753c1ca5055da870a5ec63f2
NEXT_PUBLIC_TICKET_MARKETPLACE_ADDRESS=0x88f155b4e2e95dbcccec21ead02a77adc88432ef

# Moca Chain Testnet
NEXT_PUBLIC_RPC_URL=https://testnet-rpc.mocachain.org/
NEXT_PUBLIC_CHAIN_ID=222888

# Private Key for Event Creation
MOCA_PRIVATE_KEY=562af48ec39a46796d0ef943786a0059a96a804480204ae107c8bd69301a652c
```

## 📁 Project Structure

```
src/
├── app/                      # Next.js app directory
│   ├── page.tsx             # Landing page
│   ├── login/               # AIR Kit login
│   ├── events/              # Event listing
│   ├── buy-tickets/         # Ticket purchase flow
│   ├── dashboard/
│   │   ├── issuer/          # Real credential issuance
│   │   └── analytics/       # Event analytics
│   └── api/                 # API endpoints
│       ├── events/          # Event management (list, create)
│       ├── credentials/     # Credential issue & verify
│       ├── fraud/           # Fraud detection
│       └── tickets/         # Ticket operations
├── components/              # React components
│   ├── CredentialDisplay    # Show verified credentials
│   └── Navigation          # App navbar
├── lib/
│   ├── events-storage.ts   # Persistent event storage
│   ├── airkit/             # AIR Kit integration
│   ├── contract/           # Contract ABIs
│   └── fraud/              # Fraud detection logic
├── hooks/                  # React hooks
├── stores/                 # Zustand state
└── types/                  # TypeScript types

contracts/                   # Solidity contracts
├── TicketNFT.sol          # NFT ticket contract
└── TicketMarketplace.sol  # Marketplace contract

data/
└── events.json            # Persistent event storage
```

## 🔐 Security Features

- **Zero-Knowledge Proofs** - Verify credentials without revealing underlying data
- **Decentralized Identity** - Users own their credentials
- **Wallet-Based Access Control** - Only verified wallets can transact
- **Fraud Detection** - AI-powered behavior analysis (optional)
- **No PII Storage** - Privacy-first design

## 📊 User Flows

### Flow 1: Issuer (Event Organizer) ✅ Live
1. Login with AIR Kit
2. Access admin dashboard at `/dashboard/issuer`
3. Create event and set credential requirements
4. Issue "Human Verified" credentials to attendees
5. View real-time analytics and issued credentials count

### Flow 2: Verifier (Ticket Buyer) ✅ Live
1. Login with AIR Kit
2. Browse events at `/events`
3. Select event and prove credential ownership (ZK proof)
4. Mint ticket NFT (requires HUMAN_VERIFIED credential)
5. Receive ticket on Moca testnet

### Flow 3: Credential Management ✅ Live
1. View issued credentials at `/credentials`
2. Display credential details with verification status
3. Copy credential proofs for sharing

## � Smart Contracts (Deployed ✅)

### TicketNFT.sol
```solidity
Address: 0x7ef74176b51b13e8753c1ca5055da870a5ec63f2
- Mint tickets only with verified credentials
- Burn upon entry (Ticket validation)
- Event-specific access control
- Verifier authorization
- ERC721 standard compliance
```

### TicketMarketplace.sol
```solidity
Address: 0x88f155b4e2e95dbcccec21ead02a77adc88432ef
- Purchase tickets with credential verification
- Price control (set by organizer)
- Event management
- Commission handling
- Credential-gated access
```

**Network**: Moca Chain Testnet (222888)
**RPC**: https://testnet-rpc.mocachain.org/

## 🌐 Deployment

### Development (Local)
```bash
npm run dev
# Runs on http://localhost:3000
# Auto-restarts on file changes
# Uses .env configuration
```

### Production Build
```bash
npm run build
npm start
# Optimized production bundle
# Ready for deployment
```

### Smart Contract Deployment
Contracts already deployed to Moca Testnet. To redeploy:
```bash
# Deploy TicketNFT
forge create contracts/TicketNFT.sol:TicketNFT \
  --rpc-url https://testnet-rpc.mocachain.org/ \
  --private-key $MOCA_PRIVATE_KEY

# Deploy TicketMarketplace (provide TicketNFT address)
forge create contracts/TicketMarketplace.sol:TicketMarketplace \
  --rpc-url https://testnet-rpc.mocachain.org/ \
  --private-key $MOCA_PRIVATE_KEY \
  --constructor-args "0x..." # TicketNFT address
```

### Vercel Deployment
```bash
# Push to GitHub, connect to Vercel
# Vercel auto-builds and deploys
# Environment variables already in .env
```

## 📚 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - 5-minute quick start guide
- **[EVENTS_GUIDE.md](./EVENTS_GUIDE.md)** - Event creation and management
- **[ISSUER_DASHBOARD_GUIDE.md](./ISSUER_DASHBOARD_GUIDE.md)** - Credential issuance tutorial
- **[CREDENTIAL_IDS_QUICK_GUIDE.md](./CREDENTIAL_IDS_QUICK_GUIDE.md)** - Credential reference
- **[SCHEMA_SETUP_GUIDE.md](./SCHEMA_SETUP_GUIDE.md)** - AIR Kit schema configuration
- **[GETTING_REAL_CREDENTIALS.md](./GETTING_REAL_CREDENTIALS.md)** - How to obtain credentials
- **[AIR Kit Docs](https://docs.moca.network/airkit/)** - Official AIR Kit documentation
- **[Moca Network](https://moca.network/)** - Moca blockchain
- **[Smart Contracts README](./contracts/README.md)** - Contract documentation

## 🛠️ Development

### Install Dependencies
```bash
npm install
```

### Type Checking
```bash
npm run type-check
```

### Linting & Formatting
```bash
npm run lint
npm run format
```

### Build
```bash
npm run build
```

### Testing Smart Contracts
```bash
cd contracts
forge test
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
- [ ] Multi-chain support (Ethereum, Polygon)
- [ ] Advanced analytics dashboard
- [ ] Secondary ticket marketplace (peer-to-peer)
- [ ] Loyalty rewards program
- [ ] AI-powered fan profiling
- [ ] Cross-event credential portability
- [ ] Integration with major ticketing platforms
- [ ] QR code ticket validation at events
- [ ] Dynamic NFT metadata updates

## 📈 Current Status

**MVP Features**: ✅ Complete
- ✅ Smart contracts deployed and tested
- ✅ Real AIR Kit credentials configured
- ✅ All mock data removed
- ✅ Issuer dashboard fully functional
- ✅ Event management (create, list, display)
- ✅ Credential issuance & verification
- ✅ Persistent storage for events
- ✅ Sample events pre-loaded
- ✅ Zero-knowledge proof integration

**Tested**: ✅ All Core Flows
- ✅ User login via AIR Kit
- ✅ Credential issuance on issuer dashboard
- ✅ Event creation and display
- ✅ Credential verification for purchases

**Live Network**: ✅ Moca Chain Testnet
- ✅ TicketNFT contract active
- ✅ TicketMarketplace contract active
- ✅ Ready for ticket minting & trading

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 🙋 Support & Questions

For questions and support:
- 📖 Check [QUICKSTART.md](./QUICKSTART.md)
- 🔍 Browse documentation files in root
- 📚 Review AIR Kit documentation
- 🤝 Join Moca Network community

## 🎯 Key Endpoints

| Page | URL | Status |
|------|-----|--------|
| Landing | `/` | ✅ Live |
| Login | `/login` | ✅ Live |
| Events | `/events` | ✅ Live (3 samples) |
| Buy Tickets | `/buy-tickets` | ✅ Live |
| Issuer Dashboard | `/dashboard/issuer` | ✅ Live |
| Credentials | `/credentials` | ✅ Live |
| API: Events List | `/api/events/list` | ✅ Live |
| API: Create Event | `/api/events/create` | ✅ Live |
| API: Issue Credential | `/api/credentials/issue` | ✅ Live |
| API: Verify Credential | `/api/credentials/verify` | ✅ Live |

---

**ProofPass** - Where verified humans meet verified ticketing 🎟️✅

*Built for the Moca Network Hackathon*
