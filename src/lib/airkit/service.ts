// AIR Kit Service - Real integration with Moca Network using actual SDK
import { AirService, BUILD_ENV } from '@mocanetwork/airkit';

export type BUILD_ENV_TYPE = 'SANDBOX' | 'PRODUCTION';

export interface AirKitConfig {
  partnerId: string;
  env: BUILD_ENV_TYPE;
  issuerDid: string;
  credentialIds: {
    humanVerified: string;
    fanBadge: string;
  };
}

let airServiceInstance: AirService | null = null;
let config: AirKitConfig | null = null;

/**
 * Get AIR Kit configuration from environment
 */
export const getAirKitConfig = (): AirKitConfig => {
  if (!config) {
    config = {
      partnerId: process.env.NEXT_PUBLIC_AIR_PARTNER_ID || '',
      env: (process.env.NEXT_PUBLIC_AIR_ENV as BUILD_ENV_TYPE) || 'SANDBOX',
      issuerDid: process.env.NEXT_PUBLIC_ISSUER_DID || '',
      credentialIds: {
        humanVerified: process.env.NEXT_PUBLIC_CREDENTIAL_HUMAN_VERIFIED_ID || '',
        fanBadge: process.env.NEXT_PUBLIC_CREDENTIAL_FAN_BADGE_ID || '',
      },
    };
  }
  return config;
};

/**
 * Initialize AIR Kit with real SDK
 */
export const initializeAirKit = async (): Promise<AirService> => {
  try {
    if (airServiceInstance) {
      return airServiceInstance;
    }

    const cfg = getAirKitConfig();

    if (!cfg.partnerId) {
      throw new Error('AIR Kit Partner ID not configured');
    }

    // Create new AirService instance
    airServiceInstance = new AirService({
      partnerId: cfg.partnerId,
      modalZIndex: 1000,
    });

    // Initialize with build environment
    const buildEnv = cfg.env === 'PRODUCTION' ? BUILD_ENV.PRODUCTION : BUILD_ENV.SANDBOX;
    await airServiceInstance.init({
      buildEnv,
      enableLogging: true,
      skipRehydration: false,
    });

    console.log('✓ AIR Kit initialized:', cfg.partnerId);
    return airServiceInstance;
  } catch (error) {
    console.error('Failed to initialize AIR Kit:', error);
    throw error;
  }
};

/**
 * Get AIR Kit instance
 */
export const getAirKitInstance = (): AirService => {
  if (!airServiceInstance) {
    throw new Error('AIR Kit not initialized. Call initializeAirKit first.');
  }
  return airServiceInstance;
};

/**
 * Perform login with AIR Kit
 */
export const performAirKitLogin = async (authToken?: string) => {
  try {
    const service = getAirKitInstance();
    const result = await service.login({ authToken });
    console.log('✅ AIR Kit login successful');
    return result;
  } catch (error) {
    console.error('AIR Kit login failed:', error);
    throw error;
  }
};

/**
 * Get current login status
 */
export const isAirKitLoggedIn = (): boolean => {
  try {
    const service = getAirKitInstance();
    return service.isLoggedIn;
  } catch {
    return false;
  }
};

/**
 * Get wallet provider
 */
export const getAirKitProvider = () => {
  try {
    const service = getAirKitInstance();
    return service.getProvider();
  } catch (error) {
    console.warn('Could not get AIR Kit provider:', error);
    return null;
  }
};

/**
 * Logout
 */
export const airKitLogout = async () => {
  try {
    const service = getAirKitInstance();
    await service.logout();
    console.log('✓ Logged out');
  } catch (error) {
    console.error('Logout failed:', error);
    throw error;
  }
};

/**
 * Get access token
 */
export const getAirKitAccessToken = async () => {
  try {
    const service = getAirKitInstance();
    const { token } = await service.getAccessToken();
    return token;
  } catch (error) {
    console.error('Could not get access token:', error);
    throw error;
  }
};

/**
 * Get user info
 */
export const getAirKitUserInfo = async () => {
  try {
    const service = getAirKitInstance();
    const userInfo = await service.getUserInfo();
    return userInfo;
  } catch (error) {
    console.error('Could not get user info:', error);
    throw error;
  }
};

