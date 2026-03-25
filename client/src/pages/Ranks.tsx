import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useState, useEffect } from "react";
import { CheckCircle2, Lock, ArrowRight, Flame, Zap, Shield } from "lucide-react";

// ── Rank definitions ──────────────────────────────────────────────────────────
const RANKS = [
  {
    id: "entry",
    title: "Entry",
    subtitle: "Welcome to the academy.",
    description: "You've joined the Future Dawgs Foundation. Your training begins here.",
    requirement: "Account created",
    xpRequired: 0,
    missionsRequired: 0,
    streakRequired: 0,
    ageRequired: null as number | null,
    color: "#64748b",
    gradientFrom: "#94a3b8",
    gradientTo: "#64748b",
    glowColor: "rgba(100,116,139,0.2)",
    unlocks: [
      "Access to core missions",
      "Daily Activation check-in",
      "XP and Gem tracking",
    ],
  },
  {
    id: "training",
    title: "Training",
    subtitle: "Build consistency and complete core missions.",
    description: "You're developing real habits. Keep completing missions and maintaining your streak.",
    requirement: "100 XP + 3 missions completed",
    xpRequired: 100,
    missionsRequired: 3,
    streakRequired: 0,
    ageRequired: null,
    color: "#3b82f6",
    gradientFrom: "#60a5fa",
    gradientTo: "#2563eb",
    glowColor: "rgba(59,130,246,0.2)",
    unlocks: [
      "Advanced mission modules",
      "Streak tracking unlocked",
      "Progress analytics",
    ],
  },
  {
    id: "development",
    title: "Development",
    subtitle: "Apply skills and show real progress.",
    description: "You're demonstrating consistency and applying real-world skills. Elite status is within reach.",
    requirement: "300 XP + 8 missions + 5-day streak",
    xpRequired: 300,
    missionsRequired: 8,
    streakRequired: 5,
    ageRequired: null,
    color: "#7c3aed",
    gradientFrom: "#a78bfa",
    gradientTo: "#6d28d9",
    glowColor: "rgba(124,58,237,0.2)",
    unlocks: [
      "Elite badge styling",
      "Milestone recognition",
      "Advanced curriculum modules",
      "Priority review status",
    ],
  },
  {
    id: "vault",
    title: "Vault Access",
    subtitle: "Final readiness tier. Unlocked at 18.",
    description: "The highest tier in the FDF system. Your transition path to the Crypdawgs Vault begins here.",
    requirement: "Age 18 — Aspirational target",
    xpRequired: 0,
    missionsRequired: 0,
    streakRequired: 0,
    ageRequired: 18,
    color: "#d97706",
    gradientFrom: "#fbbf24",
    gradientTo: "#b45309",
    glowColor: "rgba(217,119,6,0.25)",
    unlocks: [
      "Transition path to Crypdawgs Vault",
      "Full financial intelligence access",
      "Vault-tier network membership",
    ],
  },
] as const;

type RankId = typeof RANKS[number]["id"];

function getCurrentRank(xp: number, missions: number, streak: number): RankId {
  if (xp >= 300 && missions >= 8 && streak >= 5) return "development";
  if (xp >= 100 && missions >= 3) return "training";
  return "entry";
}

function getRankStatus(
  rankId: RankId,
  currentRankId: RankId
): "completed" | "active" | "locked" {
  const order: RankId[] = ["entry", "training", "development", "vault"];
  const currentIdx = order.indexOf(currentRankId);
  const rankIdx = order.indexOf(rankId);
  if (rankIdx < currentIdx) return "completed";
  if (rankIdx === currentIdx) return "active";
  return "locked";
}

// ── Animated progress bar ─────────────────────────────────────────────────────
function GradientProgressBar({
  value,
  from,
  to,
  height = 8,
}: {
  value: number;
  from: string;
  to: string;
  height?: number;
}) {
  const [anim, setAnim] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setAnim(Math.min(100, value)), 200);
    return () => clearTimeout(t);
  }, [value]);

  return (
    <div
      style={{
        height,
        borderRadius: height,
        background: "rgba(226,232,240,0.6)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "100%",
          borderRadius: height,
          background: `linear-gradient(90deg, ${from}, ${to})`,
          width: `${anim}%`,
          transition: "width 1s cubic-bezier(0.4,0,0.2,1)",
          boxShadow: `0 0 8px ${from}50`,
        }}
      />
    </div>
  );
}

// ── SVG Insignia ──────────────────────────────────────────────────────────────
function EntryInsignia({ color, size = 36 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="17" stroke={color} strokeWidth="2" fill={`${color}12`} />
      <circle cx="20" cy="20" r="9" fill={`${color}20`} stroke={color} strokeWidth="1.5" />
      <circle cx="20" cy="20" r="4" fill={color} />
    </svg>
  );
}

function TrainingInsignia({ color, size = 36 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="17" stroke={color} strokeWidth="2" fill={`${color}10`} />
      <circle cx="20" cy="20" r="12" stroke={color} strokeWidth="1.5" strokeDasharray="3 2" fill="none" />
      <circle cx="20" cy="20" r="6" fill={`${color}25`} stroke={color} strokeWidth="1.5" />
      <circle cx="20" cy="20" r="2.5" fill={color} />
    </svg>
  );
}

function DevelopmentInsignia({ color, size = 36 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path d="M20 3 L36 12 L36 28 L20 37 L4 28 L4 12 Z" stroke={color} strokeWidth="2" fill={`${color}10`} />
      <path d="M20 9 L30 14.5 L30 25.5 L20 31 L10 25.5 L10 14.5 Z" stroke={color} strokeWidth="1.5" fill={`${color}18`} />
      <path d="M20 15 L21.5 18.5 L25 19 L22.5 21.5 L23 25 L20 23 L17 25 L17.5 21.5 L15 19 L18.5 18.5 Z" fill={color} opacity="0.85" />
    </svg>
  );
}

function VaultInsignia({ color, size = 36 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path d="M20 2 L37 10.5 L37 29.5 L20 38 L3 29.5 L3 10.5 Z" stroke={color} strokeWidth="2" fill={`${color}10`} />
      <path d="M20 7 L32 13.5 L32 26.5 L20 33 L8 26.5 L8 13.5 Z" stroke={color} strokeWidth="1.5" fill={`${color}18`} />
      <rect x="15" y="17" width="10" height="8" rx="2" fill={color} opacity="0.85" />
      <rect x="17.5" y="14" width="5" height="5" rx="2.5" stroke={color} strokeWidth="1.5" fill="none" />
    </svg>
  );
}

function RankInsignia({ rankId, color, size }: { rankId: RankId; color: string; size?: number }) {
  if (rankId === "entry") return <EntryInsignia color={color} size={size} />;
  if (rankId === "training") return <TrainingInsignia color={color} size={size} />;
  if (rankId === "development") return <DevelopmentInsignia color={color} size={size} />;
  return <VaultInsignia color={color} size={size} />;
}

// ── Status chip ───────────────────────────────────────────────────────────────
function StatusChip({ status }: { status: "completed" | "active" | "locked" }) {
  const configs = {
    completed: { label: "COMPLETED", bg: "#d1fae5", color: "#065f46", dot: "#10b981" },
    active:    { label: "ACTIVE",    bg: "#eff6ff", color: "#1e40af", dot: "#3b82f6" },
    locked:    { label: "LOCKED",    bg: "#f1f5f9", color: "#64748b", dot: "#94a3b8" },
  };
  const c = configs[status];
  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        background: c.bg, color: c.color,
        padding: "2px 8px", borderRadius: 20,
        fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.05em",
      }}
    >
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: c.dot, display: "inline-block" }} />
      {c.label}
    </span>
  );
}

// ── Hero card ─────────────────────────────────────────────────────────────────
function HeroRankCard({
  rank, xp, missions, streak, nextRank,
}: {
  rank: typeof RANKS[number];
  xp: number; missions: number; streak: number;
  nextRank: typeof RANKS[number] | null;
}) {
  const xpPct = nextRank && nextRank.xpRequired > rank.xpRequired
    ? Math.min(100, Math.round(((xp - rank.xpRequired) / (nextRank.xpRequired - rank.xpRequired)) * 100))
    : 100;

  return (
    <div
      style={{
        borderRadius: 18, padding: "20px 18px", marginBottom: 20,
        background: "rgba(255,255,255,0.95)",
        border: `2px solid ${rank.color}28`,
        boxShadow: `0 8px 32px ${rank.glowColor}, 0 2px 8px rgba(91,140,255,0.06)`,
        position: "relative", overflow: "hidden",
      }}
    >
      {/* Background radial accent */}
      <div style={{
        position: "absolute", top: -40, right: -40, width: 130, height: 130,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${rank.color}14, transparent 70%)`,
        pointerEvents: "none",
      }} />

      {/* Top row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
        <div>
          <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", marginBottom: 3 }}>
            CURRENT RANK
          </p>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "1.55rem", fontWeight: 800, color: "var(--text-main)",
            letterSpacing: "-0.02em", marginBottom: 2,
          }}>
            {rank.title}
          </h2>
          <p style={{ fontSize: "0.77rem", color: "var(--text-sub)", fontStyle: "italic" }}>
            {rank.subtitle}
          </p>
        </div>
        <div style={{ flexShrink: 0, marginTop: 2 }}>
          <RankInsignia rankId={rank.id} color={rank.color} size={52} />
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
        {[
          { label: "TOTAL XP", value: xp.toLocaleString(), Icon: Zap },
          { label: "MISSIONS", value: missions.toString(), Icon: CheckCircle2 },
          { label: "STREAK", value: `${streak}d`, Icon: Flame },
        ].map(s => (
          <div key={s.label} style={{
            background: "rgba(241,245,249,0.7)", borderRadius: 10,
            padding: "9px 6px", textAlign: "center",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 3, color: rank.color, marginBottom: 2 }}>
              <s.Icon size={12} />
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: "0.95rem" }}>
                {s.value}
              </span>
            </div>
            <p style={{ fontSize: "0.6rem", color: "#94a3b8", fontWeight: 700, letterSpacing: "0.04em" }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Progress to next rank */}
      {nextRank ? (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-sub)" }}>
              Progress to {nextRank.title}
            </span>
            <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>
              {xp} / {nextRank.xpRequired} XP
            </span>
          </div>
          <GradientProgressBar value={xpPct} from={rank.gradientFrom} to={rank.gradientTo} height={7} />
          <p style={{ fontSize: "0.65rem", color: "#94a3b8", marginTop: 4 }}>
            {nextRank.requirement}
          </p>
        </div>
      ) : (
        <div style={{
          background: `${rank.color}10`, borderRadius: 10, padding: "9px 12px",
          border: `1px solid ${rank.color}20`,
        }}>
          <p style={{ fontSize: "0.78rem", fontWeight: 700, color: rank.color }}>
            Maximum rank achieved
          </p>
        </div>
      )}
    </div>
  );
}

// ── Next requirement callout ──────────────────────────────────────────────────
function NextRequirementCard({
  nextRank, xp, missions, streak,
}: {
  nextRank: typeof RANKS[number];
  xp: number; missions: number; streak: number;
}) {
  if (nextRank.id === "vault") return null;

  const reqs = [
    nextRank.xpRequired > 0
      ? { label: "XP", current: xp, target: nextRank.xpRequired, unit: "XP", met: xp >= nextRank.xpRequired }
      : null,
    nextRank.missionsRequired > 0
      ? { label: "Missions", current: missions, target: nextRank.missionsRequired, unit: "", met: missions >= nextRank.missionsRequired }
      : null,
    nextRank.streakRequired > 0
      ? { label: "Streak", current: streak, target: nextRank.streakRequired, unit: "days", met: streak >= nextRank.streakRequired }
      : null,
  ].filter(Boolean) as { label: string; current: number; target: number; unit: string; met: boolean }[];

  if (reqs.length === 0) return null;

  return (
    <div
      style={{
        borderRadius: 16, padding: "16px 18px", marginBottom: 20,
        background: "rgba(255,255,255,0.9)",
        border: `1.5px solid ${nextRank.color}20`,
        boxShadow: "0 2px 8px rgba(91,140,255,0.06)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
        <ArrowRight size={15} color={nextRank.color} />
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "0.88rem", color: "var(--text-main)" }}>
          Next tier: <span style={{ color: nextRank.color }}>{nextRank.title}</span>
        </p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {reqs.map(r => (
          <div key={r.label}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: "0.72rem", fontWeight: 600, color: r.met ? "#10b981" : "var(--text-sub)" }}>
                {r.met ? "✓ " : ""}{r.label}
              </span>
              <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
                {r.current} / {r.target} {r.unit}
              </span>
            </div>
            <GradientProgressBar
              value={Math.min(100, Math.round((r.current / r.target) * 100))}
              from={r.met ? "#10b981" : nextRank.gradientFrom}
              to={r.met ? "#059669" : nextRank.gradientTo}
              height={6}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Rank ladder card ──────────────────────────────────────────────────────────
function RankLadderCard({
  rank, status, isLast,
}: {
  rank: typeof RANKS[number];
  status: "completed" | "active" | "locked";
  isLast: boolean;
}) {
  const [expanded, setExpanded] = useState(status === "active");

  return (
    <div style={{ position: "relative" }}>
      {/* Connecting rail */}
      {!isLast && (
        <div style={{
          position: "absolute", left: 27, top: 68, bottom: -12,
          width: 2,
          background: status === "completed"
            ? `linear-gradient(to bottom, ${rank.color}50, ${rank.color}15)`
            : "rgba(226,232,240,0.5)",
          zIndex: 0,
        }} />
      )}

      <div
        onClick={() => setExpanded(e => !e)}
        style={{
          background: status === "locked"
            ? "rgba(248,250,252,0.55)"
            : status === "active"
            ? "rgba(255,255,255,0.97)"
            : "rgba(255,255,255,0.82)",
          borderRadius: 16,
          border: status === "active"
            ? `2px solid ${rank.color}35`
            : status === "completed"
            ? `1.5px solid ${rank.color}20`
            : "1.5px solid rgba(226,232,240,0.45)",
          boxShadow: status === "active"
            ? `0 4px 20px ${rank.glowColor}, 0 1px 4px rgba(0,0,0,0.03)`
            : "0 1px 4px rgba(0,0,0,0.03)",
          marginBottom: 12, padding: "14px 16px",
          opacity: status === "locked" ? 0.6 : 1,
          transition: "all 0.2s ease",
          position: "relative", zIndex: 1,
          cursor: "pointer",
        }}
      >
        {/* Active glow ring */}
        {status === "active" && (
          <div style={{
            position: "absolute", inset: -2, borderRadius: 18,
            border: `2px solid ${rank.color}18`,
            animation: "pulse-glow 2.5s ease-in-out infinite",
            pointerEvents: "none",
          }} />
        )}

        {/* Header row */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Insignia */}
          <div style={{
            width: 44, height: 44, borderRadius: 12, flexShrink: 0,
            background: status === "locked" ? "#f1f5f9" : `${rank.color}10`,
            border: `1.5px solid ${status === "locked" ? "#e2e8f0" : rank.color + "25"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {status === "locked"
              ? <Lock size={16} color="#94a3b8" />
              : <RankInsignia rankId={rank.id} color={rank.color} size={28} />
            }
          </div>

          {/* Title + status */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 2, flexWrap: "wrap" }}>
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 800, fontSize: "0.95rem",
                color: status === "locked" ? "#94a3b8" : "var(--text-main)",
              }}>
                {rank.title}
              </span>
              <StatusChip status={status} />
            </div>
            <p style={{ fontSize: "0.73rem", color: status === "locked" ? "#94a3b8" : "var(--text-sub)", lineHeight: 1.4 }}>
              {rank.subtitle}
            </p>
          </div>

          {/* Chevron */}
          <span style={{
            color: "#94a3b8", fontSize: "0.7rem", flexShrink: 0,
            transform: expanded ? "rotate(180deg)" : "none",
            transition: "transform 0.2s",
          }}>▼</span>
        </div>

        {/* Expanded content */}
        {expanded && (
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(226,232,240,0.5)" }}>
            <p style={{ fontSize: "0.78rem", color: "var(--text-sub)", marginBottom: 10, lineHeight: 1.55 }}>
              {rank.description}
            </p>

            {/* Requirement */}
            <div style={{
              background: status === "locked" ? "#f8fafc" : `${rank.color}07`,
              border: `1px solid ${status === "locked" ? "#e2e8f0" : rank.color + "18"}`,
              borderRadius: 10, padding: "9px 12px", marginBottom: 10,
            }}>
              <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.06em", marginBottom: 2 }}>
                REQUIREMENT
              </p>
              <p style={{ fontSize: "0.78rem", fontWeight: 600, color: status === "locked" ? "#64748b" : rank.color }}>
                {rank.requirement}
              </p>
            </div>

            {/* Unlocks */}
            <div>
              <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.06em", marginBottom: 7 }}>
                UNLOCKS
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {rank.unlocks.map((u, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{
                      width: 14, height: 14, borderRadius: "50%", flexShrink: 0,
                      background: status === "locked" ? "#f1f5f9" : `${rank.color}15`,
                      border: `1px solid ${status === "locked" ? "#e2e8f0" : rank.color + "28"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <span style={{ width: 4, height: 4, borderRadius: "50%", background: status === "locked" ? "#cbd5e1" : rank.color, display: "block" }} />
                    </div>
                    <span style={{ fontSize: "0.76rem", color: status === "locked" ? "#94a3b8" : "var(--text-sub)" }}>
                      {u}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function Ranks() {
  const { isAuthenticated } = useAuth();
  const { data: profile, isLoading } = trpc.fdf.getProfile.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: missionsData } = trpc.fdf.getMissions.useQuery(undefined, {
    enabled: isAuthenticated && !!profile?.fdfUser,
  });

  const xp = profile?.progress?.xpTotal ?? 0;
  const streak = profile?.progress?.streakDays ?? 0;
  const completedMissions =
    missionsData?.completions?.filter((c) => c.status === "claimed").length ?? 0;

  const currentRankId = getCurrentRank(xp, completedMissions, streak);
  const currentRankDef = RANKS.find((r) => r.id === currentRankId)!;
  const order: RankId[] = ["entry", "training", "development", "vault"];
  const currentIdx = order.indexOf(currentRankId);
  const nextRankDef = currentIdx < order.length - 1 ? RANKS[currentIdx + 1] : null;

  // ── Unauthenticated ──
  if (!isAuthenticated) {
    return (
      <div className="page-container animate-fade-in">
        <div style={{ paddingTop: 48, textAlign: "center" }}>
          <div style={{ marginBottom: 14, display: "flex", justifyContent: "center" }}>
            <Shield size={38} color="#5b8cff" />
          </div>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-main)", marginBottom: 8 }}>
            Rank System Locked
          </h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-sub)", marginBottom: 24 }}>
            Sign in to view your academy rank and progression.
          </p>
          <a href={getLoginUrl()} className="btn-primary" style={{ display: "inline-flex" }}>
            Sign In to Continue <ArrowRight size={15} style={{ marginLeft: 6 }} />
          </a>
        </div>
      </div>
    );
  }

  if (!profile?.fdfUser) {
    return (
      <div className="page-container animate-fade-in">
        <div style={{ paddingTop: 48, textAlign: "center" }}>
          <div style={{ marginBottom: 14, display: "flex", justifyContent: "center" }}>
            <Lock size={38} color="#94a3b8" />
          </div>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-main)", marginBottom: 8 }}>
            Complete Onboarding First
          </h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-sub)" }}>
            Set up your FDF profile on the Home page to access the rank system.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container animate-fade-in">
      {/* Header */}
      <div style={{ paddingTop: 20, paddingBottom: 16 }}>
        <h1 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "1.5rem", fontWeight: 800, color: "var(--text-main)",
          letterSpacing: "-0.02em", marginBottom: 3,
        }}>
          Progress Rank
        </h1>
        <p style={{ fontSize: "0.82rem", color: "var(--text-sub)" }}>
          Track your advancement through the FDF academy.
        </p>
      </div>

      {/* Loading skeleton */}
      {isLoading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="skeleton" style={{ height: 200, borderRadius: 18 }} />
          <div className="skeleton" style={{ height: 90, borderRadius: 16 }} />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton" style={{ height: 70, borderRadius: 16 }} />
          ))}
        </div>
      ) : (
        <>
          {/* Hero rank card */}
          <HeroRankCard
            rank={currentRankDef}
            xp={xp}
            missions={completedMissions}
            streak={streak}
            nextRank={nextRankDef ?? null}
          />

          {/* Next requirement callout */}
          {nextRankDef && (
            <NextRequirementCard
              nextRank={nextRankDef}
              xp={xp}
              missions={completedMissions}
              streak={streak}
            />
          )}

          {/* Rank ladder */}
          <div style={{ marginBottom: 8 }}>
            <p style={{
              fontSize: "0.65rem", fontWeight: 700, color: "#94a3b8",
              letterSpacing: "0.08em", marginBottom: 12,
            }}>
              ACADEMY PROGRESSION LADDER
            </p>
            {RANKS.map((rank, i) => (
              <RankLadderCard
                key={rank.id}
                rank={rank}
                status={getRankStatus(rank.id, currentRankId)}
                isLast={i === RANKS.length - 1}
              />
            ))}
          </div>

          {/* Footer */}
          <div style={{
            borderRadius: 16, padding: "16px 18px", textAlign: "center",
            background: "linear-gradient(135deg, rgba(91,140,255,0.05), rgba(123,92,255,0.04))",
            border: "1.5px solid rgba(91,140,255,0.12)",
          }}>
            <p style={{ fontSize: "0.83rem", fontWeight: 700, color: "var(--text-main)", marginBottom: 3 }}>
              Maintain momentum to unlock the next level.
            </p>
            <p style={{ fontSize: "0.73rem", color: "var(--text-sub)" }}>
              Complete missions daily and keep your streak alive.
            </p>
          </div>
        </>
      )}

      <style>{`
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
