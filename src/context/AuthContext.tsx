import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../config/firebase';
import { authService, DEMO_ACCOUNTS } from '../services/authService';
import { AppUser, UserRole } from '../types/credit';

interface AuthContextValue {
  user: AppUser | null;
  loading: boolean;
  loginAsDemo: (role: UserRole) => void;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // 1. Revisar si hay sesión Demo activa
    const storedDemo = authService.getStoredDemoUser();
    if (storedDemo) {
      setUser(storedDemo);
      setLoading(false);
      return;
    }

    // 2. Si Firebase no está configurado, iniciar automáticamente como Cliente Demo para experiencia fluida
    if (!isFirebaseConfigured || !auth || !db) {
      const defaultDemo = authService.loginAsDemo('client');
      setUser(defaultDemo);
      setLoading(false);
      return;
    }

    // 3. Listener real de Firebase Auth
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const snap = await getDoc(doc(db!, 'users', firebaseUser.uid));
        const role: UserRole = snap.exists() ? (snap.data().role as UserRole) : 'client';
        setUser({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuario',
          email: firebaseUser.email || '',
          role,
        });
      } catch {
        setUser({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || 'Usuario',
          email: firebaseUser.email || '',
          role: 'client',
        });
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const loginAsDemo = (role: UserRole) => {
    const demoUser = authService.loginAsDemo(role);
    setUser(demoUser);
  };

  const loginWithEmail = async (email: string, password: string) => {
    const loggedUser = await authService.loginWithEmail(email, password);
    setUser(loggedUser);
  };

  const registerWithEmail = async (name: string, email: string, password: string) => {
    const createdUser = await authService.registerWithEmail(name, email, password);
    setUser(createdUser);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, loginAsDemo, loginWithEmail, registerWithEmail, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe utilizarse dentro de un AuthProvider');
  }
  return ctx;
}
