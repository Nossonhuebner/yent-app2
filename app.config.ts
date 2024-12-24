import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'yent-app',
  slug: 'yent-app',
  extra: {
    apiUrl: process.env.EXPO_PUBLIC_API_URL,
  },
}); 