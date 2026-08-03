import { createContext, ReactNode, useEffect, useMemo, useState } from 'react';

import { fetchCurrentUser, signInRequest } from '../api/auth';
import { deleteSession, readSession, writeSession } from '../storage/secure-store';
import { AuthSession, AuthUser } from '../types/auth';

type AuthContextValue = {
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  isSigningIn: boolean;
  session: AuthSession | null;
  user: AuthUser | null;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const storedSession = await readSession();
        if (!storedSession) {
          return;
        }

        const me = await fetchCurrentUser(storedSession.access);
        setSession(storedSession);
        setUser(me);
      } catch (error) {
        await deleteSession();
        setSession(null);
        setUser(null);
      } finally {
        setIsBootstrapping(false);
      }
    };

    void bootstrap();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: Boolean(session?.access),
      isBootstrapping,
      isSigningIn,
      session,
      user,
      signIn: async (username: string, password: string) => {
        setIsSigningIn(true);
        try {
          const tokens = await signInRequest(username, password);
          const nextSession: AuthSession = {
            access: tokens.access,
            refresh: tokens.refresh,
          };
          const me = await fetchCurrentUser(nextSession.access);
          await writeSession(nextSession);
          setSession(nextSession);
          setUser(me);
        } finally {
          setIsSigningIn(false);
        }
      },
      signOut: async () => {
        await deleteSession();
        setSession(null);
        setUser(null);
      },
    }),
    [isBootstrapping, isSigningIn, session, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
