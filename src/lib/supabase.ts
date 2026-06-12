import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: "fdf-auth-token",
  },
});

// ── Types ─────────────────────────────────────────────────────────────────────

export interface FDFUserProfile {
  id: string;
  auth_user_id: string;
  email: string;
  name: string;
  age: number;
  xp: number;
  level: number;
  rank: string;
  streak_days: number;
  gems: number;
  vault_progress: number;
  completed_missions: number[];
  last_checkin: string | null;
  dob: string | null;
  dawg_class: string | null;
  created_at: string;
  updated_at: string;
}
