import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  Lock,
  Shield,
  TrendingUp,
  Zap,
} from "lucide-react";

const RANK_LADDER = [
  { name: "Pup",         minXp: 0,    color: "oklch(0.55_0.08_280)",  desc: "Entry level. Just getting started." },
  { name: "Scout",       minXp: 500,  color: "oklch(0.68_0.16_150)",  desc: "Completed first training modules." },
  { name: "Trainee",     minXp: 1500, color: "oklch(0.70_0.15_200)",  desc: "Consistent weekly mission completion." },
  { name: "Hunter",      minXp: 3000, color: "oklch(0.65_0.18_270)",  desc: "Demonstrated real-world skill application." },
  { name: "Builder",     minXp: 6000, color: "oklch(0.72_0.16_270)",  desc: "Launched a product, service, or project." },
  { name: "Operator",    minXp: 10000,color: "oklch(0.78_0.14_85)",   desc: "Running a functional operation." },
  { name: "Vault Ready", minXp: 15000,color: "oklch(0.78_0.14_85)",   desc: "Eligible for Vault access at age 18." },
];

export default function Ranks() {
  const { data: profile } = trpc.fdf.getProfile.useQuery();

  const currentXp = profile?.progress?.xpTotal ?? 0;
  const currentRank = profile?.progress?.rankName ?? "Pup";
  const isEnrolled = !!profile?.fdfUser;

  const currentRankIndex = RANK_LADDER.findIndex((r) => r.name === currentRank);
  const safeIndex = currentRankIndex >= 0 ? currentRankIndex : 0;
  const nextRank = RANK_LADDER[safeIndex + 1];
  const progressToNext = nextRank
    ? ((currentXp - RANK_LADDER[safeIndex].minXp) /
        (nextRank.minXp - RANK_LADDER[safeIndex].minXp)) *
      100
    : 100;

  // ── Loading State ──
  if (!profile) {
    return (
      <div className="container py-8 space-y-4 animate-fade-in">
        <div className="skeleton h-6 w-48 rounded-md" />
        <div className="skeleton h-28 w-full rounded-xl" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-6 animate-fade-in">

      {/* ── Page Header ── */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-[oklch(0.50_0.04_280)] text-[11px] font-mono uppercase tracking-widest mb-2">
          <TrendingUp size={11} />
          <span>Training System</span>
          <ChevronRight size={10} />
          <span className="text-[oklch(0.70_0.08_280)]">Ranks</span>
        </div>
        <h1 className="text-white">Progression Ranks</h1>
        <p className="text-[oklch(0.55_0.04_280)] text-sm">
          Advance through the FDF training tiers by completing missions and earning XP.
        </p>
      </div>

      {/* ── Current Status Panel ── */}
      {isEnrolled && (
        <div className="panel">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-sm font-display font-700 text-white uppercase tracking-widest">
                Current Status
              </h2>
              <p className="text-[11px] font-mono text-[oklch(0.45_0.04_280)] mt-0.5">
                {currentXp.toLocaleString()} XP accumulated
              </p>
            </div>
            <div
              className="px-3 py-1 rounded-md text-xs font-mono font-600 border"
              style={{
                color: RANK_LADDER[safeIndex].color,
                borderColor: `${RANK_LADDER[safeIndex].color}40`,
                background: `${RANK_LADDER[safeIndex].color}12`,
              }}
            >
              {currentRank}
            </div>
          </div>

          {nextRank && (
            <>
              <div className="progress-track mb-2">
                <div
                  className="progress-fill"
                  style={{ width: `${Math.min(100, Math.max(0, progressToNext))}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-[oklch(0.40_0.04_280)]">
                <span>{currentRank}</span>
                <span>
                  {(nextRank.minXp - currentXp).toLocaleString()} XP to {nextRank.name}
                </span>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Rank Ladder ── */}
      <div className="space-y-2">
        <h2 className="text-[11px] font-mono font-500 text-[oklch(0.40_0.04_280)] uppercase tracking-widest px-1">
          Rank Ladder
        </h2>

        {RANK_LADDER.map((rank, index) => {
          const isCurrentRank = rank.name === currentRank && isEnrolled;
          const isAchieved = isEnrolled && currentXp >= rank.minXp;
          const isLocked = !isEnrolled || currentXp < rank.minXp;

          return (
            <div
              key={rank.name}
              className={cn(
                "panel-sm flex items-center gap-4 transition-all duration-200",
                isCurrentRank &&
                  "border-[oklch(0.65_0.18_270/0.5)] bg-[oklch(0.65_0.18_270/0.06)]",
                isLocked && "opacity-45"
              )}
            >
              {/* Rank number */}
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-[11px] font-mono font-700"
                style={{
                  background: isAchieved
                    ? `${rank.color}18`
                    : "oklch(0.18 0.03 280 / 0.5)",
                  border: `1px solid ${
                    isAchieved
                      ? `${rank.color}35`
                      : "oklch(0.28 0.04 280 / 0.4)"
                  }`,
                  color: isAchieved ? rank.color : "oklch(0.40 0.04 280)",
                }}
              >
                {String(index + 1).padStart(2, "0")}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className="text-sm font-600"
                    style={{
                      color: isAchieved ? rank.color : "oklch(0.55 0.04 280)",
                    }}
                  >
                    {rank.name}
                  </span>
                  {isCurrentRank && (
                    <span className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-[oklch(0.65_0.18_270/0.15)] text-[oklch(0.72_0.16_270)] border border-[oklch(0.65_0.18_270/0.3)]">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[oklch(0.40_0.04_280)] mt-0.5 leading-tight">
                  {rank.desc}
                </p>
              </div>

              {/* XP requirement */}
              <div className="text-right shrink-0">
                <div className="flex items-center gap-1 justify-end">
                  {isLocked ? (
                    <Lock size={10} className="text-[oklch(0.35_0.04_280)]" />
                  ) : (
                    <Zap size={10} style={{ color: rank.color }} />
                  )}
                  <span
                    className="text-[11px] font-mono font-600"
                    style={{
                      color: isAchieved ? rank.color : "oklch(0.35 0.04 280)",
                    }}
                  >
                    {rank.minXp === 0 ? "Start" : `${rank.minXp.toLocaleString()} XP`}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Vault Info ── */}
      <div className="panel-sm flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-[oklch(0.78_0.14_85/0.15)] border border-[oklch(0.78_0.14_85/0.25)] flex items-center justify-center shrink-0">
          <Shield size={18} className="text-[oklch(0.78_0.14_85)]" />
        </div>
        <div>
          <h3 className="text-sm font-600 text-white mb-1">Vault Access</h3>
          <p className="text-[11px] text-[oklch(0.50_0.04_280)] leading-relaxed">
            Reaching{" "}
            <span className="text-[oklch(0.78_0.14_85)] font-600">Vault Ready</span> rank and
            turning 18 unlocks access to the Crypdawgs Vault — the next tier of the system. All
            XP and progress carries forward.
          </p>
        </div>
      </div>
    </div>
  );
}
