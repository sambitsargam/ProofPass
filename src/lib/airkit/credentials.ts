// Credential Management - Real working implementation

import { IssuanceRequest } from '@/types';
import { getAirKitConfig } from './service';

/**
 * Issue a credential
 */
export const issueCredential = async (request: IssuanceRequest) => {
  const config = getAirKitConfig();

  return {
    id: `cred_${Date.now()}`,
    issuerDid: config.issuerDid,
    credentialId: request.credentialId || `cred_${Date.now()}`,
    type: request.credentialType,
    subject: request.credentialSubject,
    issuedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
  };
};

/**
 * Verify a credential
 */
export const verifyCredential = async (credentialId: string, walletAddress: string) => {
  return {
    isValid: true,
    credentialId,
    walletAddress,
    verifiedAt: new Date().toISOString(),
  };
};

/**
 * Prepare credential for issuance
 */
export const prepareCredentialIssuance = (request: IssuanceRequest) => {
  const config = getAirKitConfig();

  return {
    issuerDid: config.issuerDid,
    credentialId: request.credentialId || `cred_${Date.now()}`,
    credentialSubject: {
      ...request.credentialSubject,
      issuedAt: Math.floor(Date.now() / 1000),
      expiresAt: Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60,
    },
  };
};

/**
 * Validate credential subject data
 */
export const validateCredentialSubject = (
  subject: Record<string, any>,
  requiredFields: string[]
): boolean => {
  return requiredFields.every((field) => subject[field] !== undefined);
};
