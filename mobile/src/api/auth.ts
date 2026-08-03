import { api } from './client';
import { AuthTokens, AuthUser } from '../types/auth';

export async function signInRequest(username: string, password: string): Promise<AuthTokens> {
  const { data } = await api.post('/api/v1/auth/token/', { username, password });
  return data;
}

export async function fetchCurrentUser(accessToken: string): Promise<AuthUser> {
  const { data } = await api.get('/api/v1/auth/me/', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return data;
}
