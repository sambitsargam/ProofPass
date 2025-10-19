// AIR Kit Service - Real integration with Moca Network

export interface AirKitConfig {
  partnerId: string;
  env: 'SANDBOX' | 'PRODUCTION';
  issuerDid: string;
  credentialIds: {
    humanVerified: string;
    fanBadge: string;
  };
}

let config: AirKitConfig | null = null;

export const initializeAirKit = (cfg: AirKitConfig) => {
  config = cfg;
  console.log('✓ AIR Kit initialized:', cfg.partnerId);
  return config;
};

export const getAirKitConfig = (): AirKitConfig => {
  if (!config) {
    throw new Error('AIR Kit not initialized');
  }
  return config;
};

export const isAirKitInitialized = (): boolean => {
  return config !== null;
};
