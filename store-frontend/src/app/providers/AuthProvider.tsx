import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { tokenStorage } from '@/lib/auth/tokenStorage';
import {
  decodeAccessToken,
  isTokenExpired,
  type AuthUser,
} from '@/lib/auth/jwt';
import { authApi } from '@/features/auth/api/authApi';
import type {
  LoginPayload,
  RegisterPayload,
} from '@/features/auth/types/auth.types';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const accessToken = tokenStorage.getAccessToken();

    if (accessToken && !isTokenExpired(accessToken)) {
      setUser(decodeAccessToken(accessToken));
    } else {
      tokenStorage.clearTokens();
    }

    setIsInitializing(false);
  }, []);

  async function login(payload: LoginPayload): Promise<void> {
    const result = await authApi.login(payload);
    tokenStorage.setTokens(result.token, result.refreshToken);
    setUser(decodeAccessToken(result.token));
  }

  async function register(payload: RegisterPayload): Promise<void> {
    const result = await authApi.register(payload);
    tokenStorage.setTokens(result.token, result.refreshToken);
    setUser(decodeAccessToken(result.token));
  }

  async function logout(): Promise<void> {
    try {
      await authApi.logout();
    } finally {
      tokenStorage.clearTokens();
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isInitializing,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
