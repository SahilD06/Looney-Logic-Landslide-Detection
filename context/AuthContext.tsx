import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { supabase, syncUserProfile, UserRole, authenticateUserFromDatabase, registerUserInDatabase } from '../services/supabase';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  photoUrl: string;
  role: UserRole;
  roleTitle: string;
  givenName?: string;
}

export const ROLE_CONFIGS: Record<UserRole, { title: string; badge: string; desc: string }> = {
  user: {
    title: 'Citizen Responder',
    badge: '👤 Citizen / Field User',
    desc: 'Access to live alerts, highway corridor monitoring, geotagged camera reporting, and GeoShield AI chatbot.',
  },
  admin: {
    title: 'NDRF Command Administrator',
    badge: '🛡️ Admin Command Center',
    desc: 'Full administrative control over incident reports database, emergency dispatches, sensor thresholds, and system health.',
  },
  tester: {
    title: 'QA & Simulation Tester',
    badge: '🧪 QA / Dev Tester',
    desc: 'Access to Simulation Suite: Simulate Risk danger mode, telemetry injection, AI vision stress tester, and debug logs.',
  },
};

const DEFAULT_PRESET_USERS: Record<UserRole, AppUser> = {
  user: {
    id: 'usr-cit-1049',
    name: 'user',
    email: 'user@rakshak-ner.in',
    photoUrl: '',
    role: 'user',
    roleTitle: 'Citizen Responder',
    givenName: 'User',
  },
  admin: {
    id: 'adm-ndrf-9901',
    name: 'admin',
    email: 'admin@rakshak-ner.gov.in',
    photoUrl: '',
    role: 'admin',
    roleTitle: 'NDRF Command Administrator',
    givenName: 'Admin',
  },
  tester: {
    id: 'tst-dev-7703',
    name: 'tester',
    email: 'tester@rakshak-ner.dev',
    photoUrl: '',
    role: 'tester',
    roleTitle: 'QA & Simulation Tester',
    givenName: 'Tester',
  },
};

const STORAGE_KEY = 'rakshak_auth_user';

interface AuthContextType {
  user: AppUser | null;
  currentRole: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  loginAsRole: (role: UserRole) => Promise<void>;
  loginWithCredentials: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  registerNewUser: (username: string, password: string, name: string, email: string) => Promise<{ success: boolean; message?: string }>;
  signOut: () => void;
  googleClientId: string;
  setGoogleClientId: (id: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  currentRole: 'user',
  isAuthenticated: false,
  isLoading: false,
  signInWithGoogle: async () => {},
  loginAsRole: async () => {},
  loginWithCredentials: async () => ({ success: false }),
  registerNewUser: async () => ({ success: false }),
  signOut: () => {},
  googleClientId: '',
  setGoogleClientId: () => {},
});

export const DEFAULT_GOOGLE_CLIENT_ID =
  '758692905104-ro5c26nh59321ro51gavdmjgc9fj5vrg.apps.googleusercontent.com';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore
        }
      }
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [googleClientId, setGoogleClientIdState] = useState<string>(
    process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || DEFAULT_GOOGLE_CLIENT_ID
  );

  const saveUserSession = (newUser: AppUser | null) => {
    setUser(newUser);
    if (typeof window !== 'undefined' && window.localStorage) {
      if (newUser) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
  };

  // Helper to fetch user info with access token and set as Citizen User
  const fetchGoogleUser = async (accessToken: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      if (data.email) {
        const newUser: AppUser = {
          id: data.sub || `g-${Date.now()}`,
          name: data.name || data.email.split('@')[0],
          email: data.email,
          photoUrl: data.picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          givenName: data.given_name,
          role: 'user', // All Google logins get citizen user role by default
          roleTitle: 'Citizen Responder',
        };
        saveUserSession(newUser);
        await syncUserProfile({
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          photoUrl: newUser.photoUrl,
        });
      }
    } catch (e) {
      console.error('Failed to fetch Google profile:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Check for redirect access_token from Google OAuth callback in URL hash
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

    if (window.location.hash && window.location.hash.includes('access_token')) {
      const params = new URLSearchParams(window.location.hash.substring(1));
      const token = params.get('access_token');
      if (token) {
        fetchGoogleUser(token);
        // Clean URL hash without triggering a full page reload
        window.history.replaceState(null, '', window.location.pathname);
      }
    }
  }, []);

  const loginWithCredentials = async (username: string, password: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    const res = await authenticateUserFromDatabase(username, password);
    setIsLoading(false);

    if (res.success && res.user) {
      const u = res.user;
      const appUser: AppUser = {
        id: u.id,
        name: u.name,
        email: u.email,
        photoUrl: u.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        role: u.role,
        roleTitle: ROLE_CONFIGS[u.role].title,
      };
      saveUserSession(appUser);
      return { success: true };
    }

    return { success: false, message: res.message || 'Invalid credentials' };
  };

  const registerNewUser = async (username: string, password: string, name: string, email: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    const res = await registerUserInDatabase(username, password, name, email);
    setIsLoading(false);

    if (res.success && res.user) {
      const u = res.user;
      const appUser: AppUser = {
        id: u.id,
        name: u.name,
        email: u.email,
        photoUrl: u.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        role: 'user',
        roleTitle: ROLE_CONFIGS.user.title,
      };
      saveUserSession(appUser);
      return { success: true };
    }

    return { success: false, message: res.message || 'Registration failed' };
  };

  const loginAsRole = async (role: UserRole) => {
    setIsLoading(true);
    const selectedUser = DEFAULT_PRESET_USERS[role];
    saveUserSession(selectedUser);

    try {
      await syncUserProfile({
        id: selectedUser.id,
        email: selectedUser.email,
        name: selectedUser.name,
        role: selectedUser.role,
        photoUrl: selectedUser.photoUrl,
      });
    } catch (e) {
      console.warn('Supabase profile sync error:', e);
    }

    setIsLoading(false);
  };

  const setGoogleClientId = (id: string) => {
    setGoogleClientIdState(id);
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      // Direct Google OAuth 2.0 Browser Redirect to accounts.google.com
      const redirectUri = window.location.origin;
      const clientId = googleClientId || DEFAULT_GOOGLE_CLIENT_ID;
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&response_type=token&scope=openid%20email%20profile&prompt=select_account`;

      // Redirect the entire browser window to Google OAuth page
      window.location.href = googleAuthUrl;
      return;
    }

    setIsLoading(false);
  };

  const signOut = () => {
    saveUserSession(null);
  };

  const currentRole: UserRole = user?.role || 'user';

  return (
    <AuthContext.Provider
      value={{
        user,
        currentRole,
        isAuthenticated: !!user,
        isLoading,
        signInWithGoogle,
        loginAsRole,
        loginWithCredentials,
        registerNewUser,
        signOut,
        googleClientId,
        setGoogleClientId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
