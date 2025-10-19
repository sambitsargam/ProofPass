# ProofPass - Quick Reference Guide

## 🎯 What is ProofPass?

ProofPass is a **bot-free ticketing platform** that uses verifiable credentials and zero-knowledge proofs to ensure only humans can buy tickets. No more scalpers, no more bots!

```
Problem: 🤖 Bots buy all tickets → 😞 Fans can't get tickets
Solution: ✅ Prove humanity with credentials → 🎟️ Instant NFT tickets
```

---

## 🚀 Quick Start (5 minutes)

### 1. Setup
```bash
cd ProofPass
npm install
npm run dev
```
Visit http://localhost:3000

### 2. Configure
- Go to https://developers.sandbox.air3.com/
- Get your Partner ID and Issuer DID
- Add to `.env.local`

### 3. Test
- Click "Get Started"
- Complete AIR Kit login
- Issue a credential
- Buy a ticket

---

## 📋 Project Structure at a Glance

```
ProofPass/
├── Frontend (Next.js)
│   ├── Pages: Home, Login, Events, Buy Tickets, Dashboard
│   ├── Components: Auth, Issuer, Marketplace
│   └── Styles: Tailwind CSS
│
├── Backend (API Routes)
│   ├── Credentials: Issue & Verify
│   ├── Tickets: Purchase & Resale
│   └── Fraud: Analyze & Score
│
├── Smart Contracts (Solidity)
│   ├── TicketNFT.sol (ERC721)
│   └── TicketMarketplace.sol
│
└── Documentation
    ├── README.md (Overview)
    ├── DEPLOYMENT.md (Setup)
    ├── ARCHITECTURE.md (Technical)
    └── This file (Quick Reference)
```

---

## 🔐 How It Works

### 1️⃣ User Proves Humanity
```
User → AIR Kit → Verification → Credential → Wallet
```

### 2️⃣ User Buys Ticket
```
Browse Event → Select Quantity → Prove Credential (ZK) 
→ Pay → Mint NFT → Get Ticket ✓
```

### 3️⃣ Fraud Detection Runs
```
Purchase → Analyze Velocity → Check Age → Check Geography 
→ Score Risk (0-100) → Allow/Review/Block
```

---

## 💻 Technology Stack

| Layer | Tech |
|-------|------|
| **Frontend** | Next.js 14 + React 18 + TypeScript + Tailwind |
| **Backend** | Next.js API Routes + JWT |
| **Identity** | AIR Kit (Moca Network) |
| **Blockchain** | Solidity (Moca Network) |
| **Web3** | Wagmi, Viem, ethers.js |
| **State** | Zustand |

---

## 🎨 Pages Overview

| Page | Purpose | Path |
|------|---------|------|
| **Home** | Features & CTA | `/` |
| **Login** | AIR Kit SSO | `/login` |
| **Events** | Browse events | `/events` |
| **Buy Tickets** | Purchase with verification | `/buy-tickets` |
| **Issuer Dashboard** | Issue credentials | `/dashboard/issuer` |
| **User Dashboard** | My tickets | `/dashboard/tickets` |

---

## 🔄 API Endpoints

```bash
# Issue a credential
POST /api/credentials/issue
{ recipientAddress, credentialType, credentialSubject }

# Verify credential
POST /api/credentials/verify
{ credentialHash, walletAddress }

# Buy tickets
POST /api/tickets/purchase
{ eventId, quantity, credentialHash, buyerAddress }

# Analyze fraud
POST /api/fraud/analyze
{ walletAddress, purchaseHistory }
```

---

## 🛠️ Configuration Checklist

### AIR Kit Setup
- [ ] Create AIR Kit Developer Account
- [ ] Get Partner ID
- [ ] Get Issuer DID
- [ ] Create "Human Verified" schema
- [ ] Create "Fan Badge" schema
- [ ] Copy Credential IDs

### Smart Contracts
- [ ] Deploy TicketNFT.sol
- [ ] Deploy TicketMarketplace.sol
- [ ] Copy contract addresses

### Environment (.env.local)
- [ ] NEXT_PUBLIC_AIR_PARTNER_ID
- [ ] NEXT_PUBLIC_ISSUER_DID
- [ ] NEXT_PUBLIC_CREDENTIAL_HUMAN_VERIFIED_ID
- [ ] NEXT_PUBLIC_CREDENTIAL_FAN_BADGE_ID
- [ ] NEXT_PUBLIC_TICKET_NFT_ADDRESS
- [ ] NEXT_PUBLIC_TICKET_MARKETPLACE_ADDRESS
- [ ] NEXT_PUBLIC_RPC_URL
- [ ] NEXT_PUBLIC_CHAIN_ID

---

## 🔍 Fraud Detection Scoring

```
Score Calculation:
├─ Purchase Velocity (0-30 pts)
│  └─ >5 purchases/hour = +30
├─ Account Age (0-25 pts)
│  └─ <7 days old = +25
├─ Geographic (0-15 pts)
│  └─ >5 different locations = +15
├─ Failure Rate (0-20 pts)
│  └─ >10 failed transactions = +20
└─ Multi-Wallet (0-10 pts)
   └─ >10 IPs = +10

Total Score:
├─ 0-30: ✅ ALLOW
├─ 30-70: ⚠️ REVIEW
└─ 70+: ❌ BLOCK
```

---

## 📊 Key Metrics

- **DAU** - Daily Active Users
- **Events Created** - Total events
- **Tickets Minted** - NFTs issued
- **Credentials Issued** - Total verified
- **Fraud Detection Rate** - % of attempted fraud
- **Platform Revenue** - Fees collected

---

## 🔐 Security Checklist

- ✅ JWT authentication
- ✅ Zero-knowledge proofs
- ✅ Credential verification
- ✅ Access control (smart contracts)
- ✅ Fraud detection
- ✅ Rate limiting
- ✅ Input validation
- ✅ Re-entrancy protection

---

## 🚨 Troubleshooting

| Issue | Solution |
|-------|----------|
| Login fails | Check Partner ID in .env.local |
| Credential won't issue | Verify schema ID and credential ID |
| Tickets won't mint | Check contract address and gas |
| Fraud score too high | Review fraud thresholds |
| Slow performance | Add caching/database layer |

---

## 📚 Documentation Map

```
README.md
├─ Project overview
├─ Features
├─ Quick start
└─ Setup instructions

DEPLOYMENT.md
├─ AIR Kit setup
├─ Contract deployment
├─ Frontend config
├─ Production deployment
└─ Monitoring

ARCHITECTURE.md
├─ System design
├─ Data flows
├─ Security
├─ Scalability
└─ Roadmap

Smart Contracts (contracts/README.md)
├─ Contract descriptions
├─ Functions
├─ Deployment
└─ Interaction examples
```

---

## 🎯 Development Roadmap

### Week 1-2: Foundation
- [ ] Setup AIR Kit
- [ ] Deploy contracts
- [ ] Test login
- [ ] Issue credentials

### Week 3-4: Features
- [ ] Add database
- [ ] Implement caching
- [ ] Create admin panel
- [ ] Build analytics

### Month 2: Advanced
- [ ] Mobile app
- [ ] Multi-chain
- [ ] Advanced fraud AI
- [ ] Loyalty program

### Month 3+: Scale
- [ ] DAO governance
- [ ] Global partnerships
- [ ] Real-world integrations
- [ ] Enterprise features

---

## 🔗 Important Links

- **AIR Kit Docs:** https://docs.moca.network/airkit/
- **Moca Network:** https://moca.network/
- **Developer Dashboard:** https://developers.sandbox.air3.com/
- **GitHub:** https://github.com/sambitsargam/ProofPass
- **Testnet Explorer:** https://testnet-explorer.moca.network/

---

## 💡 Key Concepts

**Verifiable Credential** - A digital credential proving something about you (e.g., human verified) without exposing your identity.

**Zero-Knowledge Proof** - A proof that you have a credential without revealing the credential itself or its data.

**Decentralized Identity (DID)** - Your identifier on the blockchain that you fully control.

**NFT Ticket** - An ERC721 token representing event access that's transferable and verifiable.

**Fraud Detection** - AI system that flags suspicious buying patterns and blocks potential bot attacks.

---

## 🎓 Learning Resources

- **Web3 Basics:** https://ethereum.org/en/developers/
- **Smart Contracts:** https://docs.soliditylang.org/
- **Next.js:** https://nextjs.org/docs
- **Verifiable Credentials:** https://www.w3.org/TR/vc-data-model/
- **ZK Proofs:** https://zkproof.org/

---

## ✨ Pro Tips

1. **Test with small amounts first** - Use testnet with small ETH amounts
2. **Keep credentials updated** - Refresh credentials regularly
3. **Monitor fraud scores** - Review high-risk transactions manually
4. **Use environment variables** - Never hardcode secrets
5. **Enable rate limiting** - Prevent brute force attacks
6. **Document API usage** - Track rate limits and quotas
7. **Test edge cases** - Try extreme fraud scenarios
8. **Log everything** - Maintain audit trail for compliance

---

## 🤝 Contributing

Found an issue? Have a feature idea?
1. Open GitHub issue
2. Describe problem/feature
3. Provide code examples
4. Submit PR when ready

---

## 📞 Support

- **GitHub Issues:** Report bugs
- **Discord:** Community support
- **Docs:** Check documentation first
- **Email:** Contact team

---

## 📄 License

MIT - See LICENSE file

---

## 🚀 Ready to Build?

```bash
# Clone
git clone https://github.com/sambitsargam/ProofPass.git

# Install
npm install

# Configure
cp .env.example .env.local
# Edit .env.local with your values

# Run
npm run dev

# Build
npm run build

# Deploy
vercel deploy --prod
```

**Good luck! 🎉**
