import { Redirect } from 'expo-router';

import { useAuthSession } from '../src/hooks/useAuthSession';

export default function IndexScreen() {
  const { isAuthenticated, isBootstrapping } = useAuthSession();

  if (isBootstrapping) {
    return null;
  }

  if (isAuthenticated) {
    return <Redirect href="/(protected)/(tabs)/missions" />;
  }

  return <Redirect href="/(public)/sign-in" />;
}
