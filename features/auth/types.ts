// Mirrors social-feed-api UserDto and AuthTokensDto exactly. createdAt /
// updatedAt come back as ISO strings over JSON (not Date) — typed as string
// here so callers don't accidentally call .toISOString() on a string.

export type UserStatus = 'ACTIVE' | 'BLOCKED' | 'DELETED';

export interface SessionUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarKey: string | null;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  expiresIn: number;
  user: SessionUser;
}

export interface RefreshResponse {
  accessToken: string;
  expiresIn: number;
}
