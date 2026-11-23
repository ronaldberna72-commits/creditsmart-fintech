import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../config/firebase';
import { AppUser, UserRole } from '../types/credit';

const DEMO_USER_STORAGE_KEY = 'creditsmart_demo_session_v2';

export const DEMO_ACCOUNTS: Record<UserRole, AppUser> = {
  client: {
    uid: 'demo-client-01',
    name: 'Ronald Martínez (Cliente)',
    email: 'ronald.demo@creditsmart.co',
    role: 'client',
    isDemo: true,
  },
  admin: {
    uid: 'demo-admin-01',
    name: 'Laura Gómez (Asesora Riesgo)',
    email: 'asesor.demo@creditsmart.co',
    role: 'admin',
    isDemo: true,
  },
};

export const authService = {
  getStoredDemoUser(): AppUser | null {
    const raw = localStorage.getItem(DEMO_USER_STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AppUser;
    } catch {
      return null;
    }
  },

  loginAsDemo(role: UserRole): AppUser {
    const user = DEMO_ACCOUNTS[role];
    localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(user));
    return user;
  },

  async loginWithEmail(email: string, password: string): Promise<AppUser> {
    if (!isFirebaseConfigured || !auth || !db) {
      // Fallback limpio si Firebase no está configurado
      const role: UserRole = email.toLowerCase().includes('admin') ? 'admin' : 'client';
      return this.loginAsDemo(role);
    }

    const credential = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, 'users', credential.user.uid));
    const role: UserRole = userDoc.exists() ? (userDoc.data().role as UserRole) : 'client';

    return {
      uid: credential.user.uid,
      name: credential.user.displayName || email.split('@')[0],
      email: credential.user.email || email,
      role,
    };
  },

  async registerWithEmail(name: string, email: string, password: string): Promise<AppUser> {
    if (!isFirebaseConfigured || !auth || !db) {
      const demoUser: AppUser = {
        uid: `demo-${Date.now()}`,
        name,
        email,
        role: 'client',
        isDemo: true,
      };
      localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(demoUser));
      return demoUser;
    }

    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, { displayName: name });
    await setDoc(doc(db, 'users', credential.user.uid), {
      name,
      email,
      role: 'client',
      createdAt: new Date().toISOString(),
    });

    return {
      uid: credential.user.uid,
      name,
      email,
      role: 'client',
    };
  },

  async logout(): Promise<void> {
    localStorage.removeItem(DEMO_USER_STORAGE_KEY);
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
    }
  },
};
