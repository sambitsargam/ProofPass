// Helper functions for credential issuance

import { IssuanceRequest } from '@/types';

/**
 * Generate JWT token for backend credential issuance
 * In production, this should be generated server-side
 */
export const generateAuthToken = async (
  partnerId: string,
  privateKey: string
): Promise<string> => {
  // This is a placeholder - in production use jsonwebtoken library
  // and generate on backend only
  const header = btoa(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    partnerId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
  }));
  
  return `${header}.${payload}.signature`;
};

/**
 * Prepare credential issuance parameters
 */
export const prepareCredentialIssuance = (
  request: IssuanceRequest,
  credentialType: string
) => {
  return {
    issuerDid: request.issuerDid,
    credentialId: request.credentialId,
    credentialSubject: {
      ...request.credentialSubject,
      issuedAt: Math.floor(Date.now() / 1000),
      userId: request.userId,
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
