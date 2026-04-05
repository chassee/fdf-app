import React, { createContext, useContext, useMemo, useState, useEffect, useCallback } from "react";

import { supabase } from "@/lib/supabase";

// ─────────────────────────────────────────────────────────────────────────────
// RANK SYSTEM
// ─────────────────────────────────────────────────────────────────────────────

export type RankId = "rookie" | "starter" | "builder" | "operator" | "elite";

/** Map XP → rank tier (Duolingo-style, 5 tiers) */
export function computeRank(xp: number): RankId {
  if (xp >= 1000) return "elite";
  if (xp >= 500)  return "operator";
  if (xp >= 250)  return "builder";
  if (xp >= 100)  return "starter";
  return "rookie";
}

export const RANK_META: Record<RankId, {
  label: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  glowColor: string;
  minXp: number;
  maxXp: number;
  emoji: string;
}> = {
  rookie:   { label: "Rookie",   color: "#64748b", gradientFrom: "#94a3b8", gradientTo: "#64748b", glowColor: "rgba(100,116,139,0.2)", minXp: 0,    maxXp: 99,   emoji: "🌱" },
  starter:  { label: "Starter",  color: "#3b82f6", gradientFrom: "#60a5fa", gradientTo: "#2563eb", glowColor: "rgba(59,130,246,0.2)",  minXp: 100,  maxXp: 249,  emoji: "⚡" },
  builder:  { label: "Builder",  color: "#7c3aed", gradientFrom: "#a78bfa", gradientTo: "#6d28d9", glowColor: "rgba(124,58,237,0.2)",  minXp: 250,  maxXp: 499,  emoji: "🏗️" },
  operator: { label: "Operator", color: "#f59e0b", gradientFrom: "#fbbf24", gradientTo: "#d97706", glowColor: "rgba(245,158,11,0.2)",  minXp: 500,  maxXp: 999,  emoji: "🔧" },
  elite:    { label: "Elite",    color: "#10b981", gradientFrom: "#34d399", gradientTo: "#059669", glowColor: "rgba(16,185,129,0.25)", minXp: 1000, maxXp: 9999, emoji: "💎" },
};

// ─────────────────────────────────────────────────────────────────────────────
// LEVEL SYSTEM  (level = floor(xp / 100), capped at 50)
// ─────────────────────────────────────────────────────────────────────────────

export function getLevelInfo(xp: number) {
  const level = Math.max(1, Math.floor(xp / 100) + 1);
  const levelFloor = (level - 1) * 100;
  const levelCeil  = level * 100;
  const pct = Math.min(100, Math.round(((xp - levelFloor) / 100) * 100));
  return { level, levelFloor, levelCeil, pct };
}

// ─────────────────────────────────────────────────────────────────────────────
// DNA SCORE SYSTEM
// ─────────────────────────────────────────────────────────────────────────────

export type DNALevel = "Seed" | "Growth" | "Builder" | "Operator" | "Elite";

export const DNA_LEVEL_META: Record<DNALevel, {
  emoji: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  minScore: number;
  maxScore: number;
  tagline: string;
}> = {
  Seed:     { emoji: "🌱", color: "#64748b", gradientFrom: "#94a3b8", gradientTo: "#64748b", minScore: 0,    maxScore: 99,   tagline: "Your financial DNA is just beginning to form." },
  Growth:   { emoji: "🌿", color: "#22c55e", gradientFrom: "#86efac", gradientTo: "#16a34a", minScore: 100,  maxScore: 249,  tagline: "You're building real financial instincts." },
  Builder:  { emoji: "🌳", color: "#7c3aed", gradientFrom: "#a78bfa", gradientTo: "#6d28d9", minScore: 250,  maxScore: 499,  tagline: "Your habits are becoming your identity." },
  Operator: { emoji: "🧬", color: "#f59e0b", gradientFrom: "#fbbf24", gradientTo: "#d97706", minScore: 500,  maxScore: 999,  tagline: "You operate with discipline and intelligence." },
  Elite:    { emoji: "🧠", color: "#10b981", gradientFrom: "#34d399", gradientTo: "#059669", minScore: 1000, maxScore: 9999, tagline: "Elite financial DNA. You are the system." },
};

export function computeDNAScore(xp: number, streakDays: number): number {
  return xp + (streakDays * 5);
}

export function computeDNALevel(dnaScore: number): DNALevel {
  if (dnaScore >= 1000) return "Elite";
  if (dnaScore >= 500)  return "Operator";
  if (dnaScore >= 250)  return "Builder";
  if (dnaScore >= 100)  return "Growth";
  return "Seed";
}

// ─────────────────────────────────────────────────────────────────────────────
// UNLOCK THRESHOLDS
// ─────────────────────────────────────────────────────────────────────────────

export const UNLOCK_XP = {
  missions: 0,    // always unlocked after sign-in
  rewards:  100,
  ranks:    250,
  vault:    500,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// LOCAL STATE (persisted to localStorage)
// ─────────────────────────────────────────────────────────────────────────────

export interface LocalFDFState {
  name: string;
  age: number;
  xp: number;
  level: number;
  rank: RankId;
  completed_missions: number[];
  streak_days: number;
  vault_progress: number;
  last_checkin: string | null;
  gems: number;
  dawg_class: string | null;
  dob: string | null;
  // DNA Score System
  dna_score: number;
  dna_level: DNALevel;
  consistency_score: number;
  discipline_score: number;
  intelligence_score: number;
  // Graduation
  graduated: boolean;
  graduated_at: string | null;
  unlocked_sections: {
    missions: boolean;
    rewards: boolean;
    ranks: boolean;
    vault: boolean;
  };
}

const DEFAULT_LOCAL_STATE: LocalFDFState = {
  name: "",
  age: 0,
  xp: 0,
  level: 1,
  rank: "rookie",
  completed_missions: [],
  streak_days: 0,
  vault_progress: 0,
  last_checkin: null,
  gems: 0,
  dawg_class: null,
  dob: null,
  dna_score: 0,
  dna_level: "Seed",
  consistency_score: 0,
  discipline_score: 0,
  intelligence_score: 0,
  graduated: false,
  graduated_at: null,
  unlocked_sections: {
    missions: false,
    rewards: false,
    ranks: false,
    vault: false,
  },
};

const LS_KEY = "fdf_state_v3";

function loadLocal(): LocalFDFState {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return { ...DEFAULT_LOCAL_STATE };
    return { ...DEFAULT_LOCAL_STATE, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_LOCAL_STATE };
  }
}

function saveLocal(state: LocalFDFState) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch {}
}

function computeUnlocks(xp: number, isSignedIn: boolean): LocalFDFState["unlocked_sections"] {
  return {
    missions: isSignedIn,
    rewards:  isSignedIn && xp >= UNLOCK_XP.rewards,
    ranks:    isSignedIn && xp >= UNLOCK_XP.ranks,
    vault:    isSignedIn && xp >= UNLOCK_XP.vault,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTEXT SHAPE
// ─────────────────────────────────────────────────────────────────────────────

interface FDFContextValue {
  // Computed state
  xp: number;
  gems: number;
  streak: number;
  missionsCompleted: number;
  lastCheckin: string | null;
  rankId: RankId;
  level: number;
  levelPct: number;
  dawgClass: string | null;
  dob: string | null;
  isEnrolled: boolean;
  isLoading: boolean;
  yearTrack: number;

  // DNA Score System
  dnaScore: number;
  dnaLevel: DNALevel;
  consistencyScore: number;
  disciplineScore: number;
  intelligenceScore: number;

  // Graduation
  graduated: boolean;
  graduatedAt: string | null;
  graduate: () => Promise<void>;
  isGraduationEligible: boolean;

  // Unlock flags
  unlockedSections: LocalFDFState["unlocked_sections"];

  // Setters / actions
  addXP: (amount: number) => void;
  completeMission: (missionId: number, xpReward: number, gemsReward: number) => void;
  doCheckIn: () => void;
  setLocalProfile: (profile: Partial<LocalFDFState>) => void;

  // Auth state (Supabase)
  isAuthenticated: boolean;

  // Refetch backend
  refetch: () => void;
}

const FDFContext = createContext<FDFContextValue>({
  xp: 0, gems: 0, streak: 0, missionsCompleted: 0,
  lastCheckin: null, rankId: "rookie", level: 1, levelPct: 0,
  dawgClass: null, dob: null, isEnrolled: false, isLoading: false, yearTrack: 1,
  dnaScore: 0, dnaLevel: "Seed", consistencyScore: 0, disciplineScore: 0, intelligenceScore: 0,
  graduated: false, graduatedAt: null, graduate: async () => {}, isGraduationEligible: false,
  unlockedSections: { missions: false, rewards: false, ranks: false, vault: false },
  isAuthenticated: false,
  addXP: () => {}, completeMission: () => {}, doCheckIn: () => {}, setLocalProfile: () => {},
  refetch: () => {},
});

// ─────────────────────────────────────────────────────────────────────────────
// PROVIDER
// ─────────────────────────────────────────────────────────────────────────────

export function FDFProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [supabaseUser, setSupabaseUser] = useState<{ id: string; email?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsAuthenticated(true);
        setSupabaseUser({ id: session.user.id, email: session.user.email });
      }
      setIsLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsAuthenticated(true);
        setSupabaseUser({ id: session.user.id, email: session.user.email });
      } else {
        setIsAuthenticated(false);
        setSupabaseUser(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  // ── Local state ──────────────────────────────────────────────────────────
  const [local, setLocalRaw] = useState<LocalFDFState>(() => loadLocal());

  const setLocal = useCallback((updater: (prev: LocalFDFState) => LocalFDFState) => {
    setLocalRaw(prev => {
      const next = updater(prev);
      // Recompute derived fields
      const rank = computeRank(next.xp);
      const { level } = getLevelInfo(next.xp);
      const unlocked_sections = computeUnlocks(next.xp, isAuthenticated);
      const vault_progress = Math.min(100, Math.round((next.xp / 500) * 100));
      // Recompute DNA
      const dna_score = computeDNAScore(next.xp, next.streak_days);
      const dna_level = computeDNALevel(dna_score);
      const updated: LocalFDFState = { ...next, rank, level, unlocked_sections, vault_progress, dna_score, dna_level };
      saveLocal(updated);
      return updated;
    });
  }, [isAuthenticated]);

  // ── Sync Supabase profile → local state ────────────────────────────────────
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    if (!supabaseUser) return;
    supabase
      .from("fdf_users")
      .select("*")
      .eq("auth_user_id", supabaseUser.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) return;
        setIsEnrolled(!!data.dawg_class);
        setLocal(prev => ({
          ...prev,
          name:               data.name ?? prev.name,
          xp:                 Math.max(prev.xp, data.xp ?? 0),
          gems:               Math.max(prev.gems, data.gems ?? 0),
          streak_days:        Math.max(prev.streak_days, data.streak_days ?? 0),
          last_checkin:       data.last_checkin ?? prev.last_checkin,
          completed_missions: Array.from(new Set([...prev.completed_missions, ...(data.completed_missions ?? [])])),
          dob:                data.dob ?? prev.dob,
          dawg_class:         data.dawg_class ?? prev.dawg_class,
          graduated:          data.graduated ?? prev.graduated,
          graduated_at:       data.graduated_at ?? prev.graduated_at,
          dna_score:          data.dna_score ?? prev.dna_score,
          consistency_score:  data.consistency_score ?? prev.consistency_score,
          discipline_score:   data.discipline_score ?? prev.discipline_score,
          intelligence_score: data.intelligence_score ?? prev.intelligence_score,
        }));
      });
  }, [supabaseUser]);

  // ── Supabase sync helper ─────────────────────────────────────────────────
  const syncToSupabase = useCallback((updates: {
    xp?: number; gems?: number; streak_days?: number;
    completed_missions?: number[]; last_checkin?: string | null;
    vault_progress?: number; rank?: string; level?: number;
    dna_score?: number; dna_level?: string;
    consistency_score?: number; discipline_score?: number; intelligence_score?: number;
  }) => {
    if (!supabaseUser) return;
    // Fire-and-forget: update fdf_users row in Supabase
    supabase
      .from("fdf_users")
      .update(updates)
      .eq("auth_user_id", supabaseUser.id)
      .then(({ error }) => {
        if (error) console.warn("[FDF] Supabase sync failed:", error.message);
      });
  }, [supabaseUser]);

  // ── Actions ──────────────────────────────────────────────────────────────

  const addXP = useCallback((amount: number) => {
    setLocal(prev => {
      const newXp = prev.xp + amount;
      const rank = computeRank(newXp);
      const { level } = getLevelInfo(newXp);
      syncToSupabase({ xp: newXp, rank: rank, level });
      return { ...prev, xp: newXp };
    });
  }, [setLocal, syncToSupabase]);

  const completeMission = useCallback((missionId: number, xpReward: number, gemsReward: number) => {
    setLocal(prev => {
      const newXp = prev.xp + xpReward;
      const newGems = prev.gems + gemsReward;
      const newMissions = prev.completed_missions.includes(missionId)
        ? prev.completed_missions
        : [...prev.completed_missions, missionId];
      const rank = computeRank(newXp);
      const { level } = getLevelInfo(newXp);
      const vault_progress = Math.min(100, Math.round((newXp / 500) * 100));
      // DNA updates: mission completion → +discipline +intelligence
      const newDiscipline = Math.min(999, prev.discipline_score + 10);
      const newIntelligence = Math.min(999, prev.intelligence_score + 10);
      const newDnaScore = computeDNAScore(newXp, prev.streak_days);
      const newDnaLevel = computeDNALevel(newDnaScore);
      syncToSupabase({
        xp: newXp, gems: newGems, completed_missions: newMissions, rank: rank, level, vault_progress,
        dna_score: newDnaScore, dna_level: newDnaLevel,
        discipline_score: newDiscipline, intelligence_score: newIntelligence,
      });
      return {
        ...prev, xp: newXp, gems: newGems, completed_missions: newMissions,
        discipline_score: newDiscipline, intelligence_score: newIntelligence,
      };
    });
  }, [setLocal, syncToSupabase]);

  const doCheckIn = useCallback(() => {
    const today = new Date().toISOString().split("T")[0];
    setLocal(prev => {
      if (prev.last_checkin === today) return prev;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yStr = yesterday.toISOString().split("T")[0];
      const newStreak = prev.last_checkin === yStr ? prev.streak_days + 1 : 1;
      const newXp = prev.xp + 5;
      const newGems = prev.gems + 5;
      // DNA updates: daily login → +consistency
      const newConsistency = Math.min(999, prev.consistency_score + 5);
      const newDnaScore = computeDNAScore(newXp, newStreak);
      const newDnaLevel = computeDNALevel(newDnaScore);
      syncToSupabase({
        xp: newXp, gems: newGems, streak_days: newStreak, last_checkin: today,
        dna_score: newDnaScore, dna_level: newDnaLevel, consistency_score: newConsistency,
      });
      return {
        ...prev,
        last_checkin: today,
        streak_days: newStreak,
        gems: newGems,
        xp: newXp,
        consistency_score: newConsistency,
      };
    });
  }, [setLocal, syncToSupabase]);

  const setLocalProfile = useCallback((profile: Partial<LocalFDFState>) => {
    setLocal(prev => ({ ...prev, ...profile }));
  }, [setLocal]);

  // ── Graduation action ─────────────────────────────────────────────────────
  const graduate = useCallback(async () => {
    if (!supabaseUser) return;
    try {
      const dnaScore = computeDNAScore(local.xp, local.streak_days);
      const { level } = getLevelInfo(local.xp);
      // Call server to verify eligibility and mark graduated
      const now = new Date().toISOString();
      const { error } = await supabase
        .from("fdf_users")
        .update({
          graduated: true,
          graduated_at: now,
          dna_score: dnaScore,
          level,
          discipline_score: local.discipline_score,
          consistency_score: local.consistency_score,
          intelligence_score: local.intelligence_score,
        })
        .eq("auth_user_id", supabaseUser.id);
      if (error) throw error;
      setLocal(prev => ({
        ...prev,
        graduated: true,
        graduated_at: now,
      }));
      window.location.href = "https://vault.crypdawgs.com";
    } catch (e) {
      console.error("[FDF] Graduation error:", e);
      throw e;
    }
  }, [supabaseUser, local, setLocal]);

  const refetch = useCallback(() => {
    if (!supabaseUser) return;
    supabase
      .from("fdf_users")
      .select("*")
      .eq("auth_user_id", supabaseUser.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) return;
        setIsEnrolled(!!data.dawg_class);
        setLocal(prev => ({
          ...prev,
          xp:    Math.max(prev.xp, data.xp ?? 0),
          gems:  Math.max(prev.gems, data.gems ?? 0),
          streak_days: Math.max(prev.streak_days, data.streak_days ?? 0),
          last_checkin: data.last_checkin ?? prev.last_checkin,
          completed_missions: Array.from(new Set([...prev.completed_missions, ...(data.completed_missions ?? [])])),
          graduated: data.graduated ?? prev.graduated,
          graduated_at: data.graduated_at ?? prev.graduated_at,
        }));
      });
  }, [supabaseUser, setLocal]);

  // ── Derived values ────────────────────────────────────────────────────────

  const xp             = local.xp;
  const gems           = local.gems;
  const streak         = local.streak_days;
  const lastCheckin    = local.last_checkin;
  const rankId         = local.rank;
  const dawgClass      = local.dawg_class;
  const dob            = local.dob;
  // isEnrolled is set from Supabase profile fetch above
  const yearTrack      = 1;

  const missionsCompleted = useMemo(() => local.completed_missions.length, [local.completed_missions]);

  const { level, pct: levelPct } = useMemo(() => {
    const info = getLevelInfo(xp);
    return { level: info.level, pct: info.pct };
  }, [xp]);

  const unlockedSections = useMemo(
    () => computeUnlocks(xp, isAuthenticated),
    [xp, isAuthenticated]
  );

  // DNA derived values
  const dnaScore        = local.dna_score;
  const dnaLevel        = local.dna_level;
  const consistencyScore = local.consistency_score;
  const disciplineScore  = local.discipline_score;
  const intelligenceScore = local.intelligence_score;

  // Graduation derived values
  const graduated       = local.graduated;
  const graduatedAt     = local.graduated_at;
  // Eligibility: DNA >= 500, missions >= 5, streak >= 3
  const isGraduationEligible = dnaScore >= 500 && missionsCompleted >= 5 && streak >= 3;

  // Also sync graduated state from Supabase on login
  useEffect(() => {
    if (!supabaseUser) return;
    supabase
      .from("fdf_users")
      .select("graduated, graduated_at")
      .eq("auth_user_id", supabaseUser.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.graduated) {
          setLocal(prev => ({
            ...prev,
            graduated: true,
            graduated_at: data.graduated_at ?? null,
          }));
        }
      });
  }, [supabaseUser]);

  const value: FDFContextValue = {
    xp, gems, streak, missionsCompleted,
    lastCheckin, rankId, level, levelPct,
    dawgClass, dob, isEnrolled: isEnrolled || local.dawg_class !== null, isLoading, yearTrack,
    dnaScore, dnaLevel, consistencyScore, disciplineScore, intelligenceScore,
    graduated, graduatedAt, graduate, isGraduationEligible,
    unlockedSections,
    isAuthenticated,
    addXP, completeMission, doCheckIn, setLocalProfile,
    refetch,
  };

  return <FDFContext.Provider value={value}>{children}</FDFContext.Provider>;
}

export function useFDF() {
  return useContext(FDFContext);
}
