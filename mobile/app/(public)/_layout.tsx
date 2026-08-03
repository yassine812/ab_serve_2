import { Redirect, Stack } from 'expo-router';

import { useAuthSession } from '../../src/hooks/useAuthSession';

export default function PublicLayout() {
  const { isAuthenticated, isBootstrapping } = useAuthSession();

  if (isBootstrapping) {
    return null;
  }

  if (isAuthenticated) {
    return <Redirect href="/(protected)/(tabs)/missions" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
