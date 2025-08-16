"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { auth, db, googleProvider } from "@/lib/firebase";
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  User as FirebaseUser,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  Timestamp,
  FieldValue,
} from "firebase/firestore";

type Role = "admin" | "employee";

/**
 * What we keep in React state.
 * Note: Firebase can return nulls for email/displayName/photoURL.
 */
type Profile = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  role: Role;
  approved: boolean;
  /**
   * When read back from Firestore, this will be a `Timestamp`.
   * During the initial write, we may temporarily hold a `FieldValue`,
   * but we immediately re-read the doc so state ends up with a Timestamp.
   */
  createdAt?: Timestamp | FieldValue;
};

type AuthState = {
  user: FirebaseUser | null;
  profile: Profile | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Create/merge Firestore profile on first login
  const ensureProfile = async (u: FirebaseUser) => {
    if (!u.email) return; // we use email as admin doc id guard

    const userRef = doc(db, "users", u.uid);
    const existing = await getDoc(userRef);

    if (existing.exists()) {
      setProfile(existing.data() as Profile);
      return;
    }

    // Check if this email is listed as an admin
    const adminCheckRef = doc(collection(db, "admins"), u.email);
    const adminSnap = await getDoc(adminCheckRef);
    const isAdmin = adminSnap.exists();

    // Write initial profile (createdAt as server timestamp)
    const newProfile: Omit<Profile, "createdAt"> & { createdAt: FieldValue } = {
      uid: u.uid,
      email: u.email,
      displayName: u.displayName ?? u.email ?? null,
      photoURL: u.photoURL ?? null,
      role: isAdmin ? "admin" : "employee",
      approved: isAdmin ? true : false,
      createdAt: serverTimestamp(),
    };

    await setDoc(userRef, newProfile, { merge: true });

    // Re-read the document so state holds a real Firestore Timestamp
    const fresh = await getDoc(userRef);
    setProfile(fresh.data() as Profile);
  };

  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          await ensureProfile(result.user);
        }
      } catch {
        // swallow errors or add toast/log here
      }
    };

    handleRedirectResult();

    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        try {
          await ensureProfile(u);
        } finally {
          setLoading(false);
        }
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  const loginWithGoogle = async () => {
    if (process.env.NODE_ENV === "production") {
      await signInWithRedirect(auth, googleProvider);
    } else {
      await signInWithPopup(auth, googleProvider);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
