import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL ?? "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const anonKey = process.env.VITE_SUPABASE_ANON_KEY ?? "";

if (!supabaseUrl || !serviceRoleKey) {
  console.warn("[Supabase] Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY — auth features will be unavailable");
}
if (!anonKey) {
  console.warn("[Supabase] Missing VITE_SUPABASE_ANON_KEY — signup via anon client will be unavailable");
}

// Admin client bypasses RLS — only use server-side
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Anon client — used for standard auth flows (signUp, signIn) to avoid admin API cross-project collisions
export const supabaseAnon = createClient(supabaseUrl, anonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
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
  dna_score: number;
  discipline_score: number;
  consistency_score: number;
  intelligence_score: number;
  approval_status: string;
  graduated: boolean;
  graduated_at: string | null;
  created_at: string;
  updated_at: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export async function getFDFProfile(authUserId: string): Promise<FDFUserProfile | null> {
  const { data, error } = await supabaseAdmin
    .from("fdf_users")
    .select("*")
    .eq("auth_user_id", authUserId)
    .single();
  if (error || !data) return null;
  return data as FDFUserProfile;
}

export async function createFDFProfile(profile: {
  auth_user_id: string;
  email: string;
  name: string;
  age: number;
}): Promise<FDFUserProfile> {
  const { data, error } = await supabaseAdmin
    .from("fdf_users")
    .insert({
      auth_user_id: profile.auth_user_id,
      email: profile.email,
      name: profile.name,
      age: profile.age,
    })
    .select("*")
    .single();
  if (error || !data) throw new Error(error?.message ?? "Failed to create FDF profile");
  return data as FDFUserProfile;
}

export async function updateFDFProfile(
  authUserId: string,
  updates: Partial<Pick<FDFUserProfile, "xp" | "level" | "rank" | "streak_days" | "gems" | "vault_progress" | "completed_missions" | "last_checkin" | "dob" | "dawg_class" | "dna_score" | "discipline_score" | "consistency_score" | "intelligence_score" | "graduated" | "graduated_at">>
): Promise<FDFUserProfile> {
  const { data, error } = await supabaseAdmin
    .from("fdf_users")
    .update(updates)
    .eq("auth_user_id", authUserId)
    .select("*")
    .single();
  if (error || !data) throw new Error(error?.message ?? "Failed to update FDF profile");
  return data as FDFUserProfile;
}

export async function verifySupabaseToken(token: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) return null;
  return data.user.id;
}
