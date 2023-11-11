import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'nfc-business-card-app',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
