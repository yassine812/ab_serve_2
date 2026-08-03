export type AuthTokens = {
  access: string;
  refresh: string;
};

export type AuthSession = AuthTokens;

export type AuthUser = {
  id: number;
  username: string;
  email: string;
  display_name: string;
  roles: string[];
  default_role: string | null;
};
