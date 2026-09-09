const CLAIM_NAMEID =
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';
const CLAIM_EMAIL =
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress';
const CLAIM_NAME = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name';
const CLAIM_ROLE =
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

interface RawJwtPayload {
  [CLAIM_NAMEID]: string;
  [CLAIM_EMAIL]: string;
  [CLAIM_NAME]: string;
  [CLAIM_ROLE]?: string | string[];
  exp: number;
}

export interface AuthUser {
  userId: string;
  email: string;
  displayName: string;
  roles: string[];
}

function decodePayload(token: string): RawJwtPayload | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join(''),
    );

    return JSON.parse(json) as RawJwtPayload;
  } catch {
    return null;
  }
}

export function decodeAccessToken(token: string): AuthUser | null {
  const payload = decodePayload(token);

  if (!payload) return null;

  const roleClaim = payload[CLAIM_ROLE];
  const roles = Array.isArray(roleClaim)
    ? roleClaim
    : roleClaim
      ? [roleClaim]
      : [];

  return {
    userId: payload[CLAIM_NAMEID],
    email: payload[CLAIM_EMAIL],
    displayName: payload[CLAIM_NAME],
    roles,
  };
}

export function isTokenExpired(token: string): boolean {
  const payload = decodePayload(token);

  if (!payload) return true;

  return Date.now() >= payload.exp * 1000;
}
