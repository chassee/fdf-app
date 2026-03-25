import React, { createContext, useContext, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

// ── Rank computation ──────────────────────────────────────────────────────────
export type RankId = "entry" | "training" | "development" | "vault";

export function computeRank(xp: number, missions: number, streak: number): RankId {
  if (xp >= 300 && missions >= 8 && streak >= 5) return "development";
  if (xp >= 100 && missions >= 3) return "training";
  return "entry";
}

export const RANK_META: Record<RankId, { label: string; color: string; gradientFrom: string; gradientTo: string; glowColor: string }> = {
  entry:       { label: "Entry",        color: "#64748b", gradientFrom: "#94a3b8", gradientTo: "#64748b", glowColor: "rgba(100,116,139,0.2)" },
  training:    { label: "Training",     color: "#3b82f6", gradientFrom: "#60a5fa", gradientTo: "#2563eb", glowColor: "rgba(59,130,246,0.2)" },
  development: { label: "Development",  color: "#7c3aed", gradientFrom: "#a78bfa", gradientTo: "#6d28d9", glowColor: "rgba(124,58,237,0.2)" },
  vault:       { label: "Vault Access", color: "#d97706", gradientFrom: "#fbbf24", gradientTo: "#b45309", glowColor: "rgba(217,119,6,0.25)" },
};

// ── XP Levels ─────────────────────────────────────────────────────────────────
export const XP_LEVELS = [
  { level: 1, minXp: 0,    maxXp: 150  },
  { level: 2, minXp: 150,  maxXp: 350  },
  { level: 3, minXp: 350,  maxXp: 600  },
  { level: 4, minXp: 600,  maxXp: 900  },
  { level: 5, minXp: 900,  maxXp: 1200 },
  { level: 6, minXp: 1200, maxXp: 1600 },
  { level: 7, minXp: 1600, maxXp: 2100 },
  { level: 8, minXp: 2100, maxXp: 2700 },
  { level: 9, minXp: 2700, maxXp: 3400 },
  { level: 10, minXp: 3400, maxXp: 9_999_999 },
];

export function getLevelInfo(xp: number) {
  const idx = XP_LEVELS.findLastIndex(l => xp >= l.minXp);
  const current = XP_LEVELS[Math.max(0, idx)];
  const next = XP_LEVELS[idx + 1];
  const pct = next
    ? Math.min(100, Math.round(((xp - current.minXp) / (next.minXp - current.minXp)) * 100))
    : 100;
  return { current, next, pct };
}

// ── Context shape ─────────────────────────────────────────────────────────────
interface FDFContextValue {
  // Raw data
  xp: number;
  gems: number;
  streak: number;
  missionsCompleted: number;
  lastCheckin: string | null | undefined;
  rankId: RankId;
  level: number;
  levelPct: number;
  dawgClass: string | null | undefined;
  yearTrack: number;
  dob: string | null | undefined;
  isEnrolled: boolean;
  isLoading: boolean;
  // Refetch
  refetch: () => void;
}

const FDFContext = createContext<FDFContextValue>({
  xp: 0, gems: 0, streak: 0, missionsCompleted: 0,
  lastCheckin: null, rankId: "entry", level: 1, levelPct: 0,
  dawgClass: null, yearTrack: 1, dob: null, isEnrolled: false,
  isLoading: false, refetch: () => {},
});

export function FDFProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  const { data: profile, isLoading, refetch: refetchProfile } = trpc.fdf.getProfile.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: missionsData, refetch: refetchMissions } = trpc.fdf.getMissions.useQuery(undefined, {
    enabled: isAuthenticated && !!profile?.fdfUser,
  });

  const xp = profile?.progress?.xpTotal ?? 0;
  const gems = profile?.progress?.gemsTotal ?? 0;
  const streak = profile?.progress?.streakDays ?? 0;
  const lastCheckin = profile?.progress?.lastCheckin;
  const dawgClass = profile?.fdfUser?.dawgClass;
  const yearTrack = profile?.fdfUser?.yearTrack ?? 1;
  const dob = profile?.fdfUser?.dob;
  const isEnrolled = !!profile?.fdfUser;

  const missionsCompleted = useMemo(() => {
    if (!missionsData) return 0;
    return missionsData.completions.filter(c => c.status === "claimed").length;
  }, [missionsData]);

  const rankId = computeRank(xp, missionsCompleted, streak);
  const { current: lvl, pct: levelPct } = getLevelInfo(xp);

  const refetch = () => {
    refetchProfile();
    refetchMissions();
  };

  const value: FDFContextValue = {
    xp, gems, streak, missionsCompleted,
    lastCheckin, rankId, level: lvl.level, levelPct,
    dawgClass, yearTrack, dob, isEnrolled,
    isLoading, refetch,
  };

  return <FDFContext.Provider value={value}>{children}</FDFContext.Provider>;
}

export function useFDF() {
  return useContext(FDFContext);
}
