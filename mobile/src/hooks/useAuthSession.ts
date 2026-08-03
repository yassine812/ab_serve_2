import { useContext } from 'react';

import { AuthContext } from '../providers/AuthProvider';

export function useAuthSession() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuthSession must be used inside AuthProvider');
  }

  return context;
}
