import { createContext, useContext, type ReactNode } from "react";
import { useSupabaseAuth, type SupabaseAuthState } from "@/hooks/useSupabaseAuth";

interface SupabaseAuthContextValue extends SupabaseAuthState {
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const SupabaseAuthContext = createContext<SupabaseAuthContextValue>({
  session: null,
  profile: null,
  loading: true,
  isAuthenticated: false,
  signOut: async () => {},
  refreshProfile: async () => {},
});

export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const auth = useSupabaseAuth();
  return (
    <SupabaseAuthContext.Provider value={auth}>
      {children}
    </SupabaseAuthContext.Provider>
  );
}

export function useSupabaseAuthContext() {
  return useContext(SupabaseAuthContext);
}
