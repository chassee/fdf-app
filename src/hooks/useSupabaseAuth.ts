import { useState, useEffect, useCallback } from "react";
import { supabase, type FDFUserProfile } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

export interface SupabaseAuthState {
  session: Session | null;
  profile: FDFUserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
}

const SESSION_KEY = "fdf-supabase-session";

export function useSupabaseAuth() {
  const [state, setState] = useState<SupabaseAuthState>({
    session: null,
    profile: null,
    loading: true,
    isAuthenticated: false,
  });

  const loadProfile = useCallback(async (userId: string): Promise<FDFUserProfile | null> => {
    const { data, error } = await supabase
      .from("fdf_users")
      .select("*")
      .eq("auth_user_id", userId)
      .maybeSingle();
    if (error || !data) return null;
    return data as FDFUserProfile;
  }, []);

  // On mount: restore session from Supabase
  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      if (session) {
        const profile = await loadProfile(session.user.id);
        setState({ session, profile, loading: false, isAuthenticated: true });
      } else {
        setState(prev => ({ ...prev, session: null, profile: null, loading: false, isAuthenticated: false }));
      }
    });

    // Listen for auth state changes (sign in / sign out)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      if (session) {
        const profile = await loadProfile(session.user.id);
        setState({ session, profile, loading: false, isAuthenticated: true });
        // Persist session info
        localStorage.setItem(SESSION_KEY, JSON.stringify({
          accessToken: session.access_token,
          refreshToken: session.refresh_token,
          expiresAt: session.expires_at,
          userId: session.user.id,
          email: session.user.email,
        }));
      } else {
        localStorage.removeItem(SESSION_KEY);
        setState({ session: null, profile: null, loading: false, isAuthenticated: false });
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    localStorage.removeItem(SESSION_KEY);
    setState({ session: null, profile: null, loading: false, isAuthenticated: false });
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!state.session) return;
    const profile = await loadProfile(state.session.user.id);
    setState(prev => ({ ...prev, profile }));
  }, [state.session, loadProfile]);

  return {
    ...state,
    signOut,
    refreshProfile,
  };
}
