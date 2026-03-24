import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { MOCK_PASSWORD, MOCK_USER } from '../constants';
import { dataMode } from '../lib/env';
import { supabase } from '../lib/supabase';
import type { AuthCredentials, AuthUser, DataMode } from '../types';

const MOCK_USERS_STORAGE_KEY = 'pets_adopt_auth_users';
const MOCK_SESSION_STORAGE_KEY = 'pets_adopt_auth_session';

interface SignUpResult {
  requiresEmailConfirmation: boolean;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  mode: DataMode;
  signIn: (credentials: AuthCredentials) => Promise<void>;
  signUp: (credentials: AuthCredentials) => Promise<SignUpResult>;
  signOut: () => Promise<void>;
}

interface MockStoredUser extends AuthUser {
  password: string;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function mapSupabaseUser(user: User | null): AuthUser | null {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email ?? '',
    displayName: (user.user_metadata.display_name as string | undefined) ?? user.email?.split('@')[0] ?? '领养申请人',
    registeredAt: user.created_at ?? new Date().toISOString(),
    city: (user.user_metadata.city as string | undefined) ?? '',
    source: 'supabase',
  };
}

function readMockUsers(): MockStoredUser[] {
  const raw = window.localStorage.getItem(MOCK_USERS_STORAGE_KEY);

  if (!raw) {
    const seededUsers: MockStoredUser[] = [{ ...MOCK_USER, password: MOCK_PASSWORD }];
    window.localStorage.setItem(MOCK_USERS_STORAGE_KEY, JSON.stringify(seededUsers));
    return seededUsers;
  }

  try {
    const parsed = JSON.parse(raw) as MockStoredUser[];
    if (parsed.length > 0) {
      return parsed;
    }
  } catch {
    // ignore and reseed below
  }

  const seededUsers: MockStoredUser[] = [{ ...MOCK_USER, password: MOCK_PASSWORD }];
  window.localStorage.setItem(MOCK_USERS_STORAGE_KEY, JSON.stringify(seededUsers));
  return seededUsers;
}

function writeMockUsers(users: MockStoredUser[]) {
  window.localStorage.setItem(MOCK_USERS_STORAGE_KEY, JSON.stringify(users));
}

function readMockSession() {
  const raw = window.localStorage.getItem(MOCK_SESSION_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

function writeMockSession(user: AuthUser | null) {
  if (!user) {
    window.localStorage.removeItem(MOCK_SESSION_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(MOCK_SESSION_STORAGE_KEY, JSON.stringify(user));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (dataMode === 'disabled') {
      setUser(null);
      setLoading(false);
      return;
    }

    if (!supabase) {
      setUser(readMockSession());
      setLoading(false);
      return;
    }

    let subscribed = true;

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!subscribed) {
          return;
        }
        if (error) {
          setUser(null);
        } else {
          setUser(mapSupabaseUser(data.session?.user ?? null));
        }
        setLoading(false);
      })
      .catch(() => {
        if (subscribed) {
          setUser(null);
          setLoading(false);
        }
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(mapSupabaseUser(session?.user ?? null));
      setLoading(false);
    });

    return () => {
      subscribed = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      mode: dataMode,
      async signIn(credentials) {
        if (dataMode === 'disabled') {
          throw new Error('当前未配置 Supabase，且已关闭本地 mock 登录。');
        }

        if (!supabase) {
          const account = readMockUsers().find((entry) => entry.email.toLowerCase() === credentials.email.toLowerCase());
          if (!account || account.password !== credentials.password) {
            throw new Error('邮箱或密码不正确，请检查后重试。');
          }

          const nextUser: AuthUser = {
            id: account.id,
            email: account.email,
            displayName: account.displayName,
            registeredAt: account.registeredAt,
            city: account.city,
            source: 'mock',
          };

          writeMockSession(nextUser);
          setUser(nextUser);
          return;
        }

        const { error } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

        if (error) {
          throw new Error(error.message);
        }
      },
      async signUp(credentials) {
        if (!credentials.displayName) {
          throw new Error('请输入你的称呼或姓名。');
        }

        if (dataMode === 'disabled') {
          throw new Error('当前未配置 Supabase，且已关闭本地 mock 注册。');
        }

        if (!supabase) {
          const users = readMockUsers();
          const exists = users.some((entry) => entry.email.toLowerCase() === credentials.email.toLowerCase());
          if (exists) {
            throw new Error('这个邮箱已经注册过了，请直接登录。');
          }

          const nextUser: MockStoredUser = {
            id: crypto.randomUUID(),
            email: credentials.email,
            displayName: credentials.displayName,
            registeredAt: new Date().toISOString(),
            city: '',
            source: 'mock',
            password: credentials.password,
          };

          writeMockUsers([nextUser, ...users]);
          writeMockSession({
            id: nextUser.id,
            email: nextUser.email,
            displayName: nextUser.displayName,
            registeredAt: nextUser.registeredAt,
            city: nextUser.city,
            source: 'mock',
          });
          setUser({
            id: nextUser.id,
            email: nextUser.email,
            displayName: nextUser.displayName,
            registeredAt: nextUser.registeredAt,
            city: nextUser.city,
            source: 'mock',
          });
          return { requiresEmailConfirmation: false };
        }

        const { data, error } = await supabase.auth.signUp({
          email: credentials.email,
          password: credentials.password,
          options: {
            data: {
              display_name: credentials.displayName,
            },
          },
        });

        if (error) {
          throw new Error(error.message);
        }

        return {
          requiresEmailConfirmation: Boolean(data.user) && !data.session,
        };
      },
      async signOut() {
        if (dataMode === 'disabled') {
          setUser(null);
          return;
        }

        if (!supabase) {
          writeMockSession(null);
          setUser(null);
          return;
        }

        const { error } = await supabase.auth.signOut();
        if (error) {
          throw new Error(error.message);
        }
      },
    }),
    [loading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth 必须在 AuthProvider 内使用。');
  }

  return context;
}
