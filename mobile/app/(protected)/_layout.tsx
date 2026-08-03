import { Redirect, Stack } from 'expo-router';

import { useAuthSession } from '../../src/hooks/useAuthSession';

export default function ProtectedLayout() {
  const { isAuthenticated, isBootstrapping } = useAuthSession();

  if (isBootstrapping) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(public)/sign-in" />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="missions/[missionId]" options={{ title: 'Mission' }} />
    </Stack>
  );
}
