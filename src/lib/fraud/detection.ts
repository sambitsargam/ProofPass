// Fraud detection and analysis module

import { FraudAnalysis } from '@/types';

interface WalletActivity {
  address: string;
  transactionCount: number;
  purchaseFrequency: number; // purchases per hour
  accountAge: number; // days
  failedTransactions: number;
  uniqueIPs?: string[];
  locations?: string[];
}

/**
 * Analyze wallet for suspicious activity
 */
export const analyzeFraud = (activity: WalletActivity): FraudAnalysis => {
  const flags: string[] = [];
  let suspiciousScore = 0;

  // Check rapid purchase patterns
  if (activity.purchaseFrequency > 5) {
    flags.push('RAPID_PURCHASES');
    suspiciousScore += 30;
  }

  // Check new account
  if (activity.accountAge < 7) {
    flags.push('NEW_ACCOUNT');
    suspiciousScore += 25;
  }

  // Check high transaction count
  if (activity.transactionCount > 100) {
    flags.push('HIGH_TRANSACTION_COUNT');
    suspiciousScore += 15;
  }

  // Check failed transactions
  if (activity.failedTransactions > 10) {
    flags.push('MULTIPLE_FAILURES');
    suspiciousScore += 20;
  }

  // Check geographic inconsistencies
  if (activity.locations && activity.locations.length > 5) {
    flags.push('SUSPICIOUS_LOCATIONS');
    suspiciousScore += 15;
  }

  // Check multiple IPs
  if (activity.uniqueIPs && activity.uniqueIPs.length > 10) {
    flags.push('MULTIPLE_IPS');
    suspiciousScore += 10;
  }

  return {
    walletAddress: activity.address,
    suspiciousScore: Math.min(suspiciousScore, 100),
    flags,
    lastAnalyzedAt: Date.now(),
    recommendedAction: getRecommendedAction(suspiciousScore),
  };
};

/**
 * Determine recommended action based on score
 */
export const getRecommendedAction = (
  score: number
): 'ALLOW' | 'REVIEW' | 'BLOCK' => {
  if (score < 30) return 'ALLOW';
  if (score < 70) return 'REVIEW';
  return 'BLOCK';
};

/**
 * Check if wallet is flagged for fraud
 */
export const isFraudulent = (analysis: FraudAnalysis): boolean => {
  return analysis.recommendedAction === 'BLOCK';
};

/**
 * Calculate purchase velocity (purchases per time window)
 */
export const calculatePurchaseVelocity = (
  purchaseTimestamps: number[],
  windowMinutes: number = 60
): number => {
  const now = Date.now();
  const windowMs = windowMinutes * 60 * 1000;
  
  const recentPurchases = purchaseTimestamps.filter(
    (ts) => now - ts <= windowMs
  );
  
  return recentPurchases.length / windowMinutes;
};

/**
 * Detect unusual patterns
 */
export const detectAnomalies = (
  walletActivities: WalletActivity[]
): Map<string, string[]> => {
  const anomalies = new Map<string, string[]>();
  
  if (!walletActivities.length) return anomalies;

  // Calculate average metrics
  const avgTransactions = 
    walletActivities.reduce((sum, w) => sum + w.transactionCount, 0) / 
    walletActivities.length;
  const avgFrequency =
    walletActivities.reduce((sum, w) => sum + w.purchaseFrequency, 0) /
    walletActivities.length;

  for (const activity of walletActivities) {
    const flags: string[] = [];

    // Outlier detection
    if (activity.transactionCount > avgTransactions * 2) {
      flags.push('TRANSACTION_OUTLIER');
    }

    if (activity.purchaseFrequency > avgFrequency * 2) {
      flags.push('FREQUENCY_OUTLIER');
    }

    if (flags.length > 0) {
      anomalies.set(activity.address, flags);
    }
  }

  return anomalies;
};
