// Core types for ProofPass

export type CredentialType = 'HUMAN_VERIFIED' | 'FAN_BADGE';

export interface Credential {
  id: string;
  type: CredentialType;
  holderAddress: string;
  issuer: string;
  issuedAt: number;
  expiresAt?: number;
  data: Record<string, any>;
}

export interface User {
  id: string;
  walletAddress: string;
  sessionToken: string;
  credentials: Credential[];
  createdAt: number;
  isFraudulent?: boolean;
  fraudScore?: number;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  date: number;
  location: string;
  organizer: string;
  totalTickets: number;
  mintedTickets: number;
  ticketPrice: string;
  requiredCredential: CredentialType;
  contractAddress: string;
  metadata: Record<string, any>;
}

export interface Ticket {
  id: string;
  eventId: string;
  owner: string;
  mintedAt: number;
  tokenId: string;
  used: boolean;
  usedAt?: number;
}

export interface IssuanceRequest {
  userId: string;
  credentialType: CredentialType;
  credentialSubject: Record<string, any>;
  issuerDid: string;
  credentialId: string;
}

export interface VerificationResult {
  isValid: boolean;
  credentialId?: string;
  credentialType?: CredentialType;
  holderAddress?: string;
  expiresAt?: number;
}

export interface FraudAnalysis {
  walletAddress: string;
  suspiciousScore: number; // 0-100
  flags: string[];
  lastAnalyzedAt: number;
  recommendedAction: 'ALLOW' | 'REVIEW' | 'BLOCK';
}
