// AIR Kit service configuration and initialization

import { AirService, BUILD_ENV, EnvironmentConfig } from '@mocanetwork/airkit';

interface AirKitConfig {
  partnerId: string;
  env: string;
  issuerDid: string;
  credentialIds: {
    humanVerified: string;
    fanBadge: string;
  };
}

let airService: AirService | null = null;
let config: AirKitConfig | null = null;

export const initializeAirKit = (cfg: AirKitConfig): AirService => {
  config = cfg;

  const envMap: Record<string, BUILD_ENV> = {
    SANDBOX: BUILD_ENV.SANDBOX,
    PRODUCTION: BUILD_ENV.PRODUCTION,
  };

  const environmentConfig: EnvironmentConfig = {
    apiUrl: cfg.env === 'SANDBOX' 
      ? 'https://api.sandbox.air3.com' 
      : 'https://api.air3.com',
    widgetUrl: cfg.env === 'SANDBOX'
      ? 'https://widgets.sandbox.air3.com'
      : 'https://widgets.air3.com',
    locale: 'en',
  };

  airService = new AirService({
    partnerId: cfg.partnerId,
    env: envMap[cfg.env] || BUILD_ENV.SANDBOX,
    environmentConfig,
  });

  return airService;
};

export const getAirService = (): AirService => {
  if (!airService) {
    throw new Error('AIR Service not initialized. Call initializeAirKit first.');
  }
  return airService;
};

export const getAirKitConfig = (): AirKitConfig => {
  if (!config) {
    throw new Error('AIR Kit Config not initialized');
  }
  return config;
};

export const isAirKitInitialized = (): boolean => {
  return airService !== null && config !== null;
};
