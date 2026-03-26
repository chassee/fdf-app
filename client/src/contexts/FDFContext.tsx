import React, { createContext, useContext, useMemo, useState, useEffect, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

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

  // Unlock flags
  unlockedSections: LocalFDFState["unlocked_sections"];

  // Setters / actions
  addXP: (amount: number) => void;
  completeMission: (missionId: number, xpReward: number, gemsReward: number) => void;
  doCheckIn: () => void;
  setLocalProfile: (profile: Partial<LocalFDFState>) => void;

  // Refetch backend
  refetch: () => void;
}

const FDFContext = createContext<FDFContextValue>({
  xp: 0, gems: 0, streak: 0, missionsCompleted: 0,
  lastCheckin: null, rankId: "rookie", level: 1, levelPct: 0,
  dawgClass: null, dob: null, isEnrolled: false, isLoading: false, yearTrack: 1,
  unlockedSections: { missions: false, rewards: false, ranks: false, vault: false },
  addXP: () => {}, completeMission: () => {}, doCheckIn: () => {}, setLocalProfile: () => {},
  refetch: () => {},
});

// ─────────────────────────────────────────────────────────────────────────────
// PROVIDER
// ─────────────────────────────────────────────────────────────────────────────

export function FDFProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();

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
      const updated: LocalFDFState = { ...next, rank, level, unlocked_sections, vault_progress };
      saveLocal(updated);
      return updated;
    });
  }, [isAuthenticated]);

  // ── Backend data ─────────────────────────────────────────────────────────
  const { data: profile, isLoading, refetch: refetchProfile } = trpc.fdf.getProfile.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: missionsData, refetch: refetchMissions } = trpc.fdf.getMissions.useQuery(undefined, {
    enabled: isAuthenticated && !!profile?.fdfUser,
  });

  // ── Sync backend → local state ───────────────────────────────────────────
  useEffect(() => {
    if (!profile?.fdfUser) return;
    const backendXp    = profile.progress?.xpTotal ?? 0;
    const backendGems  = profile.progress?.gemsTotal ?? 0;
    const backendStreak = profile.progress?.streakDays ?? 0;
    const backendCheckin = profile.progress?.lastCheckin ?? null;

    setLocal(prev => ({
      ...prev,
      name:       user?.name ?? prev.name,
      xp:         Math.max(prev.xp, backendXp),
      gems:       Math.max(prev.gems, backendGems),
      streak_days: Math.max(prev.streak_days, backendStreak),
      last_checkin: backendCheckin ?? prev.last_checkin,
      dawg_class:  profile.fdfUser?.dawgClass ?? prev.dawg_class,
      dob:         profile.fdfUser?.dob ?? prev.dob,
    }));
  }, [profile]);

  // Sync completed missions from backend
  useEffect(() => {
    if (!missionsData) return;
    const claimedIds = missionsData.completions
      .filter(c => c.status === "claimed")
      .map(c => c.missionId);
    setLocal(prev => ({
      ...prev,
      completed_missions: Array.from(new Set([...prev.completed_missions, ...claimedIds])),
    }));
  }, [missionsData]);

  // ── Actions ──────────────────────────────────────────────────────────────

  const addXP = useCallback((amount: number) => {
    setLocal(prev => ({ ...prev, xp: prev.xp + amount }));
  }, [setLocal]);

  const completeMission = useCallback((missionId: number, xpReward: number, gemsReward: number) => {
    setLocal(prev => ({
      ...prev,
      xp: prev.xp + xpReward,
      gems: prev.gems + gemsReward,
      completed_missions: prev.completed_missions.includes(missionId)
        ? prev.completed_missions
        : [...prev.completed_missions, missionId],
    }));
  }, [setLocal]);

  const doCheckIn = useCallback(() => {
    const today = new Date().toISOString().split("T")[0];
    setLocal(prev => {
      if (prev.last_checkin === today) return prev;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yStr = yesterday.toISOString().split("T")[0];
      const newStreak = prev.last_checkin === yStr ? prev.streak_days + 1 : 1;
      return {
        ...prev,
        last_checkin: today,
        streak_days: newStreak,
        gems: prev.gems + 5,
        xp: prev.xp + 5,
      };
    });
  }, [setLocal]);

  const setLocalProfile = useCallback((profile: Partial<LocalFDFState>) => {
    setLocal(prev => ({ ...prev, ...profile }));
  }, [setLocal]);

  const refetch = useCallback(() => {
    refetchProfile();
    refetchMissions();
  }, [refetchProfile, refetchMissions]);

  // ── Derived values ────────────────────────────────────────────────────────

  const xp             = local.xp;
  const gems           = local.gems;
  const streak         = local.streak_days;
  const lastCheckin    = local.last_checkin;
  const rankId         = local.rank;
  const dawgClass      = local.dawg_class;
  const dob            = local.dob;
  const isEnrolled     = !!profile?.fdfUser || local.dawg_class !== null;
  const yearTrack      = profile?.fdfUser?.yearTrack ?? 1;

  const missionsCompleted = useMemo(() => {
    const backendCount = missionsData
      ? missionsData.completions.filter(c => c.status === "claimed").length
      : 0;
    return Math.max(backendCount, local.completed_missions.length);
  }, [missionsData, local.completed_missions]);

  const { level, pct: levelPct } = useMemo(() => {
    const info = getLevelInfo(xp);
    return { level: info.level, pct: info.pct };
  }, [xp]);

  const unlockedSections = useMemo(
    () => computeUnlocks(xp, isAuthenticated),
    [xp, isAuthenticated]
  );

  const value: FDFContextValue = {
    xp, gems, streak, missionsCompleted,
    lastCheckin, rankId, level, levelPct,
    dawgClass, dob, isEnrolled, isLoading, yearTrack,
    unlockedSections,
    addXP, completeMission, doCheckIn, setLocalProfile,
    refetch,
  };

  return <FDFContext.Provider value={value}>{children}</FDFContext.Provider>;
}

export function useFDF() {
  return useContext(FDFContext);
}
