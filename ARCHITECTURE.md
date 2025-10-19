# ProofPass - Technical Architecture

## System Overview

ProofPass is a decentralized ticketing platform that prevents scalpers and bots by requiring holders to prove their humanity through verifiable credentials. The system combines AIR Kit for identity, ZK proofs for privacy, and blockchain smart contracts for tickets.

```
┌─────────────────────────────────────────────────────────────┐
│                    ProofPass Architecture                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Frontend (Next.js + React)                                  │
│  ├─ Home Page (Hero & Features)                             │
│  ├─ Events Listing                                          │
│  ├─ Login (AIR Kit SSO)                                     │
│  ├─ Issuer Dashboard (Credential Issuance)                  │
│  ├─ Ticket Purchase (Credential Verification)              │
│  └─ User Dashboard (My Credentials & Tickets)               │
│                                                               │
│  Backend API (Next.js Route Handlers)                        │
│  ├─ POST /api/credentials/issue                            │
│  ├─ POST /api/credentials/verify                           │
│  ├─ POST /api/tickets/purchase                             │
│  └─ POST /api/fraud/analyze                                │
│                                                               │
│  AIR Kit Services (Moca Network)                             │
│  ├─ Account Service (SSO & Wallet)                         │
│  ├─ Credential Service (Issue & Verify)                    │
│  └─ ZK Proof Generation                                    │
│                                                               │
│  Smart Contracts (Solidity)                                  │
│  ├─ TicketNFT (ERC721 with Credential Verification)        │
│  ├─ TicketMarketplace (Purchase & Resale)                  │
│  └─ Fraud Detection & Access Control                       │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Component Architecture

### 1. Frontend Layer

**Pages:**
- `/` - Homepage with features and call-to-action
- `/login` - AIR Kit SSO login flow
- `/events` - Browse verified events
- `/buy-tickets` - Purchase tickets with credential verification
- `/dashboard/issuer` - Admin panel for credential issuance
- `/dashboard/tickets` - User's owned tickets

**Components:**
- `Auth/*` - Authentication flows
- `Issuer/*` - Credential issuance interface
- `Verifier/*` - Credential verification interface
- `Events/*` - Event management UI
- `Fraud/*` - Fraud detection monitoring

### 2. Backend Layer

**API Routes:**
- `POST /api/credentials/issue` - Issue new credentials
- `POST /api/credentials/verify` - Verify credential validity
- `POST /api/tickets/purchase` - Purchase tickets
- `POST /api/fraud/analyze` - Analyze fraud patterns

**Libraries:**
- `lib/airkit/` - AIR Kit integration
- `lib/contract/` - Smart contract ABIs
- `lib/fraud/` - Fraud detection algorithms

### 3. AIR Kit Integration

**Account Services:**
- User login and SSO
- Wallet management
- Session handling
- User metadata

**Credential Services:**
- Schema creation and management
- Credential issuance
- ZK proof generation
- Credential verification

**Flow:**
```
User Login → AIR Kit SSO → Session Created
    ↓
Issue Credential → AIR Kit Issuance API → Credential Stored
    ↓
Verify Credential → Generate ZK Proof → Credential Verified
```

### 4. Smart Contracts

**TicketNFT.sol (ERC721)**
- Mint tickets only with verified credentials
- Track ticket usage (used/unused)
- Burn tickets upon entry
- Transfer with verification

**TicketMarketplace.sol**
- Create events with ticket inventory
- Purchase tickets with credential verification
- Secondary market for ticket resale
- Platform fee management
- Fraud-resistant purchase flow

### 5. Fraud Detection Module

**Algorithms:**
- Purchase velocity analysis
- Wallet age checking
- Geographic anomaly detection
- Multi-wallet detection
- Transaction failure pattern analysis

**Score Calculation:**
- 0-30: Low risk → ALLOW
- 30-70: Medium risk → REVIEW
- 70+: High risk → BLOCK

## Data Flow

### Credential Issuance Flow

```
1. Admin logs into Issuer Dashboard
   ↓
2. Fills credential form (email, name, verification method)
   ↓
3. Submits to POST /api/credentials/issue
   ↓
4. Backend generates JWT token
   ↓
5. Calls AIR Kit issuanceCredential API
   ↓
6. AIR Kit issues credential to user's wallet
   ↓
7. Credential stored in user's decentralized wallet
   ↓
8. Admin dashboard shows "Credential Issued ✓"
```

### Ticket Purchase Flow

```
1. User browses events on /events
   ↓
2. Selects event and clicks "Buy Ticket"
   ↓
3. Redirected to /buy-tickets
   ↓
4. User clicks "Verify Credential"
   ↓
5. AIR Kit retrieves user's credentials
   ↓
6. Generates ZK proof of credential ownership
   ↓
7. Backend verifies proof via POST /api/credentials/verify
   ↓
8. Fraud analysis runs: POST /api/fraud/analyze
   ↓
9. If approved: User enters quantity and price
   ↓
10. Clicks "Complete Purchase"
    ↓
11. MetaMask prompts for transaction
    ↓
12. Smart contract mints NFT tickets
    ↓
13. Payment processed
    ↓
14. User receives ticket NFTs in wallet
```

### Fraud Detection Flow

```
Purchase Attempt
    ↓
Calculate Purchase Velocity (purchases/hour)
    ↓
Check Account Age (days since creation)
    ↓
Analyze Geographic Data (IP locations)
    ↓
Check Multi-Wallet Patterns
    ↓
Review Historical Transactions
    ↓
Calculate Risk Score (0-100)
    ↓
Compare against thresholds
    ↓
ALLOW / REVIEW / BLOCK
```

## Technology Stack

### Frontend
- **Framework:** Next.js 14 + React 18
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Web3:** Wagmi, Viem, ethers.js
- **Wallet:** RainbowKit

### Backend
- **Runtime:** Node.js (via Next.js API routes)
- **Authentication:** JWT (AIR Kit)
- **APIs:** RESTful endpoints

### Blockchain
- **Chain:** Moca Network (Testnet/Mainnet)
- **Smart Contracts:** Solidity 0.8.19
- **Standards:** ERC721 (NFT), ERC20 (optional tokens)
- **Verification:** ZK Proofs (AIR Kit)

### Identity & Credentials
- **Provider:** AIR Kit (Moca Network)
- **Identity Model:** Decentralized (DID)
- **Credential Format:** Verifiable Credentials (W3C)
- **Verification:** Zero-Knowledge Proofs

## Security Architecture

### Authentication
- ✅ AIR Kit SSO for user authentication
- ✅ JWT tokens for API authentication
- ✅ Session management with expiration
- ✅ Wallet-based account recovery

### Credential Verification
- ✅ ZK proofs prevent PII exposure
- ✅ Credential hash verification
- ✅ Timestamp validation
- ✅ Expiration checking

### Smart Contract Security
- ✅ Access control (onlyOwner, onlyVerifier)
- ✅ Re-entrancy protection
- ✅ Integer overflow/underflow protection (Solidity 0.8+)
- ✅ Rate limiting on critical functions
- ✅ Credential verification on minting

### Fraud Prevention
- ✅ Purchase velocity monitoring
- ✅ Account age verification
- ✅ Geographic anomaly detection
- ✅ Behavioral pattern analysis
- ✅ Multi-wallet network analysis
- ✅ Manual review queue for borderline cases

## Scalability Considerations

### Current Capacity
- Events: Unlimited
- Credentials: Limited by AIR Kit (typically 10k+/day)
- Tickets per event: 10,000+
- Concurrent users: ~100-1000 depending on hosting

### Future Improvements
- [ ] Database layer (PostgreSQL/MongoDB)
- [ ] Caching layer (Redis)
- [ ] Message queue (Bull/RabbitMQ)
- [ ] CDN for static assets
- [ ] Subgraph indexing (The Graph)
- [ ] Multi-chain support
- [ ] Mobile app (Flutter)

## Deployment Architecture

### Development
```
Local Machine
├─ Next.js dev server (localhost:3000)
├─ Hardhat local node (for testing)
└─ AIR Kit Sandbox environment
```

### Staging
```
Vercel (Staging)
├─ Preview deployments from branches
├─ AIR Kit Sandbox environment
└─ Moca Testnet smart contracts
```

### Production
```
Vercel (Production)
├─ Main deployment
├─ AIR Kit Production environment
├─ Moca Mainnet smart contracts
└─ Custom domain & SSL
```

## Database Schema (Future)

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY,
  wallet_address VARCHAR UNIQUE,
  created_at TIMESTAMP,
  fraud_score INT,
  is_blocked BOOLEAN
);

-- Credentials
CREATE TABLE credentials (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users,
  type VARCHAR,
  credential_hash VARCHAR,
  issued_at TIMESTAMP,
  expires_at TIMESTAMP,
  air_kit_id VARCHAR
);

-- Events
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  organizer_id UUID REFERENCES users,
  name VARCHAR,
  date TIMESTAMP,
  total_tickets INT,
  minted_tickets INT,
  contract_address VARCHAR
);

-- Tickets
CREATE TABLE tickets (
  id UUID PRIMARY KEY,
  event_id INT REFERENCES events,
  owner_id UUID REFERENCES users,
  token_id BIGINT,
  minted_at TIMESTAMP,
  used_at TIMESTAMP
);

-- Purchases
CREATE TABLE purchases (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users,
  event_id INT REFERENCES events,
  quantity INT,
  amount DECIMAL,
  tx_hash VARCHAR,
  created_at TIMESTAMP
);
```

## Monitoring & Analytics

### Key Metrics
- Daily Active Users (DAU)
- Events Created
- Tickets Minted
- Credentials Issued
- Fraud Detection Rate
- Platform Revenue

### Logging
- API request/response logs
- Smart contract events
- Fraud alerts
- Error tracking (Sentry)

### Alerting
- High fraud score purchases
- Contract failures
- API errors
- Unusual activity patterns

## Roadmap

**Phase 1 (Current):**
- Basic ticketing MVP
- Credential issuance
- Fraud detection

**Phase 2:**
- Secondary marketplace
- Loyalty program
- Analytics dashboard

**Phase 3:**
- Mobile app (Flutter)
- Multi-chain support
- Advanced AI fraud detection

**Phase 4:**
- Cross-event credential portability
- Advanced loyalty mechanics
- Institutional partnerships

## References

- [AIR Kit Docs](https://docs.moca.network/airkit/)
- [Moca Network](https://moca.network/)
- [ERC721 Standard](https://eips.ethereum.org/EIPS/eip-721)
- [Verifiable Credentials](https://www.w3.org/TR/vc-data-model/)
- [Zero-Knowledge Proofs](https://en.wikipedia.org/wiki/Zero-knowledge_proof)
