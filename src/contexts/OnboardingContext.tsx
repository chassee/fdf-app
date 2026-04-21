import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export interface UserProfile {
  id: string;
  auth_user_id: string;
  email: string;
  dob: string | null;
  username: string | null;
  onboarding_complete: boolean;
}

interface OnboardingContextType {
  user: any | null;
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  onboardingComplete: boolean;
  refetch: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextType>({
  user: null,
  profile: null,
  isLoading: true,
  error: null,
  isAuthenticated: false,
  onboardingComplete: false,
  refetch: async () => {},
});

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user and profile with timeout fallback
  const fetchUserAndProfile = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Set a 5-second timeout
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Profile fetch timeout")), 5000)
      );

      const fetchPromise = (async () => {
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (!session) {
          setUser(null);
          setProfile(null);
          setIsLoading(false);
          return;
        }

        setUser(session.user);

        // Fetch profile from fdf_users
        const { data: profileData, error: profileError } = await supabase
          .from("fdf_users")
          .select("*")
          .eq("auth_user_id", session.user.id)
          .maybeSingle();

        if (profileError && profileError.code !== "PGRST116") {
          throw profileError;
        }

        if (profileData) {
          setProfile(profileData);
        } else {
          // Create default profile if doesn't exist
          // Only insert required fields, name is nullable
          const { data: newProfile, error: createError } = await supabase
            .from("fdf_users")
            .insert({
              auth_user_id: session.user.id,
              email: session.user.email,
              onboarding_complete: false,
              name: null,
              username: null,
              dob: null,
            })
            .select()
            .single();

          if (createError) {
            console.error("[OnboardingContext] Profile creation error:", createError);
            throw createError;
          }

          setProfile(newProfile);
        }
      })();

      await Promise.race([fetchPromise, timeoutPromise]);
    } catch (err: any) {
      console.error("[OnboardingContext] Error:", err);
      setError(err.message || "Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchUserAndProfile();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session) {
        setUser(null);
        setProfile(null);
      } else {
        await fetchUserAndProfile();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const value: OnboardingContextType = {
    user,
    profile,
    isLoading,
    error,
    isAuthenticated: !!user,
    onboardingComplete: profile?.onboarding_complete ?? false,
    refetch: fetchUserAndProfile,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within OnboardingProvider");
  }
  return context;
}
