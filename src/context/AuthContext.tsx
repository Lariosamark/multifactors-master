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
} from "firebase/firestore";

type Role = "admin" | "employee";

type Profile = {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: Role;
  approved: boolean; // employees require approval
  createdAt?: Timestamp; // <-- fixed type
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
    if (!u.email) return;

    const userRef = doc(db, "users", u.uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      setProfile(snap.data() as Profile);
      return;
    }

    const adminCheckRef = doc(collection(db, "admins"), u.email);
    const adminSnap = await getDoc(adminCheckRef);
    const isAdmin = adminSnap.exists();

    const newProfile: Profile = {
      uid: u.uid,
      email: u.email,
      displayName: u.displayName || u.email,
      photoURL: u.photoURL || undefined,
      role: isAdmin ? "admin" : "employee",
      approved: isAdmin ? true : false,
      createdAt: serverTimestamp(), // <-- still works
    };

    await setDoc(userRef, newProfile, { merge: true });
    setProfile(newProfile);
  };

  useEffect(() => {
    const handleRedirectResult = async () => {
      const result = await getRedirectResult(auth);
      if (result?.user) {
        await ensureProfile(result.user);
      }
    };

    handleRedirectResult();

    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) await ensureProfile(u);
      else setProfile(null);
      setLoading(false);
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
