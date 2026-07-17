import { createContext, useContext, useEffect, useState } from "react";
import { neon } from "../lib/neon";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { data: session, isPending } = neon.auth.useSession();
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const user = session?.user ?? null;

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setProfileLoading(false);
      return;
    }

    let cancelled = false;
    setProfileLoading(true);

    neon
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          console.error("[useAuth] fetchProfile error:", error);
          setProfile(null);
        } else {
          setProfile(data);
        }
        setProfileLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  // ── Auth actions ──────────────────────────────────────────────────────────

  async function signInWithMagicLink(email) {
    const { error } = await neon.auth.signIn.magicLink({
      email,
      callbackURL: `${window.location.origin}/dashboard`,
    });
    return { error };
  }

  async function signOut() {
    setProfile(null);
    const { error } = await neon.auth.signOut();
    return { error };
  }

  // ── Role helpers ──────────────────────────────────────────────────────────

  const role = profile?.role ?? "client";
  const isAdmin = role === "admin";
  const isTherapist = role === "therapist";
  const isClient = role === "client";

  const value = {
    user,
    profile,
    role,
    isAdmin,
    isTherapist,
    isClient,
    loading: isPending || profileLoading,
    signInWithMagicLink,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuth must be used inside <AuthProvider>. Wrap your app in <AuthProvider>.",
    );
  }
  return context;
}
