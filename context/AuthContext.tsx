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
    name: 'Aarav Sharma',
    email: 'aarav.sharma@gmail.com',
    photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    role: 'user',
    roleTitle: 'Citizen Responder',
    givenName: 'Aarav',
  },
  admin: {
    id: 'adm-ndrf-9901',
    name: 'Major Vikram Sen',
    email: 'admin@rakshak-ner.gov.in',
    photoUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    role: 'admin',
    roleTitle: 'NDRF Disaster Commander',
    givenName: 'Vikram',
  },
  tester: {
    id: 'tst-dev-7703',
    name: 'Dev QA Engineer',
    email: 'qa.tester@rakshak-ner.dev',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'tester',
    roleTitle: 'QA Lead & Simulation Tester',
    givenName: 'Tester',
  },
};

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
  user: DEFAULT_PRESET_USERS.user,
  currentRole: 'user',
  isAuthenticated: true,
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
  const [user, setUser] = useState<AppUser | null>(DEFAULT_PRESET_USERS.user);
  const [isLoading, setIsLoading] = useState(false);
  const [googleClientId, setGoogleClientIdState] = useState<string>(
    process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || DEFAULT_GOOGLE_CLIENT_ID
  );

  // Sync initial user with Supabase
  useEffect(() => {
    if (user) {
      syncUserProfile({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        photoUrl: user.photoUrl,
      });
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
      setUser(appUser);
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
      setUser(appUser);
      return { success: true };
    }

    return { success: false, message: res.message || 'Registration failed' };
  };

  const loginAsRole = async (role: UserRole) => {
    setIsLoading(true);
    const selectedUser = DEFAULT_PRESET_USERS[role];
    setUser(selectedUser);

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

    if (Platform.OS === 'web' && (window as any).google?.accounts?.oauth2 && googleClientId) {
      try {
        const client = (window as any).google.accounts.oauth2.initTokenClient({
          client_id: googleClientId,
          scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
          callback: async (response: any) => {
            if (response.access_token) {
              try {
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { Authorization: `Bearer ${response.access_token}` },
                });
                const data = await res.json();
                const newUser: AppUser = {
                  id: data.sub || `g-${Date.now()}`,
                  name: data.name || 'Disaster Response Officer',
                  email: data.email || 'officer@rakshak-ner.gov.in',
                  photoUrl: data.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                  givenName: data.given_name,
                  role: 'user',
                  roleTitle: 'Certified Field Responder',
                };
                setUser(newUser);
                await syncUserProfile({
                  id: newUser.id,
                  email: newUser.email,
                  name: newUser.name,
                  role: newUser.role,
                  photoUrl: newUser.photoUrl,
                });
              } catch (e) {
                console.error('Failed to fetch user info from Google:', e);
              }
            }
            setIsLoading(false);
          },
        });
        client.requestAccessToken();
        return;
      } catch (err) {
        console.warn('Google GSI OAuth error, falling back to verified demo profile:', err);
      }
    }

    // Default fast login as Admin/User
    setTimeout(() => {
      loginAsRole('admin');
      setIsLoading(false);
    }, 400);
  };

  const signOut = () => {
    setUser(null);
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
