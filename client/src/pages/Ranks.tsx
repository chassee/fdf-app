import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useState, useEffect } from "react";
import { CheckCircle2, Lock, ArrowRight, Flame, Zap, Shield } from "lucide-react";
import { useFDF, RANK_META, getLevelInfo, type RankId } from "@/contexts/FDFContext";

// ── Rank definitions ──────────────────────────────────────────────────────────
const RANKS = [
  {
    id: "entry" as RankId,
    title: "Entry",
    subtitle: "Welcome to the academy.",
    description: "You've joined the Future Dawgs Foundation. Your training begins here.",
    requirement: "Account created",
    xpRequired: 0,
    missionsRequired: 0,
    streakRequired: 0,
    ageRequired: null as number | null,
    unlocks: [
      "Access to core missions",
      "Daily Activation check-in",
      "XP and Gem tracking",
    ],
  },
  {
    id: "training" as RankId,
    title: "Training",
    subtitle: "Build consistency and complete core missions.",
    description: "You're developing real habits. Keep completing missions and maintaining your streak.",
    requirement: "100 XP + 3 missions completed",
    xpRequired: 100,
    missionsRequired: 3,
    streakRequired: 0,
    ageRequired: null,
    unlocks: [
      "Advanced mission modules",
      "Streak tracking unlocked",
      "Progress analytics",
    ],
  },
  {
    id: "development" as RankId,
    title: "Development",
    subtitle: "Apply skills and show real progress.",
    description: "You're demonstrating consistency and applying real-world skills. Elite status is within reach.",
    requirement: "300 XP + 8 missions + 5-day streak",
    xpRequired: 300,
    missionsRequired: 8,
    streakRequired: 5,
    ageRequired: null,
    unlocks: [
      "Elite badge styling",
      "Milestone recognition",
      "Advanced curriculum modules",
      "Priority review status",
    ],
  },
  {
    id: "vault" as RankId,
    title: "Vault Access",
    subtitle: "Final readiness tier. Unlocked at 18.",
    description: "The highest tier in the FDF system. Your transition path to the Crypdawgs Vault begins here.",
    requirement: "Age 18 — Aspirational target",
    xpRequired: 0,
    missionsRequired: 0,
    streakRequired: 0,
    ageRequired: 18,
    unlocks: [
      "Transition path to Crypdawgs Vault",
      "Full financial intelligence access",
      "Vault-tier network membership",
    ],
  },
];

const RANK_ORDER: RankId[] = ["entry", "training", "development", "vault"];

function getRankStatus(rankId: RankId, currentRankId: RankId): "completed" | "active" | "locked" {
  const currentIdx = RANK_ORDER.indexOf(currentRankId);
  const rankIdx = RANK_ORDER.indexOf(rankId);
  if (rankIdx < currentIdx) return "completed";
  if (rankIdx === currentIdx) return "active";
  return "locked";
}

// ── Animated progress bar ─────────────────────────────────────────────────────
function GradientProgressBar({ value, from, to, height = 8 }: { value: number; from: string; to: string; height?: number }) {
  const [anim, setAnim] = useState(0);
  useEffect(() => { const t = setTimeout(() => setAnim(Math.min(100, value)), 200); return () => clearTimeout(t); }, [value]);
  return (
    <div style={{ height, borderRadius: height, background: "rgba(226,232,240,0.6)", overflow: "hidden" }}>
      <div
        style={{
          height: "100%", borderRadius: height,
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
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: c.bg, color: c.color, padding: "2px 8px", borderRadius: 20, fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.05em" }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: c.dot, display: "inline-block" }} />
      {c.label}
    </span>
  );
}

// ── Hero card ─────────────────────────────────────────────────────────────────
function HeroRankCard({ rankId, xp, missions, streak }: { rankId: RankId; xp: number; missions: number; streak: number }) {
  const rank = RANKS.find(r => r.id === rankId)!;
  const meta = RANK_META[rankId];
  const nextRankDef = RANKS.find(r => r.id === RANK_ORDER[RANK_ORDER.indexOf(rankId) + 1]);
  const { current: lvl, pct: levelPct } = getLevelInfo(xp);

  const xpPct = nextRankDef && nextRankDef.xpRequired > rank.xpRequired
    ? Math.min(100, Math.round(((xp - rank.xpRequired) / (nextRankDef.xpRequired - rank.xpRequired)) * 100))
    : 100;

  return (
    <div
      style={{
        borderRadius: 18, padding: "20px 18px", marginBottom: 20,
        background: "rgba(255,255,255,0.95)",
        border: `2px solid ${meta.color}28`,
        boxShadow: `0 8px 32px ${meta.glowColor}, 0 2px 8px rgba(91,140,255,0.06)`,
        position: "relative", overflow: "hidden",
      }}
    >
      {/* Background radial accent */}
      <div style={{ position: "absolute", top: -40, right: -40, width: 130, height: 130, borderRadius: "50%", background: `radial-gradient(circle, ${meta.color}14, transparent 70%)`, pointerEvents: "none" }} />

      {/* Top row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
        <div>
          <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", marginBottom: 3 }}>CURRENT RANK</p>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.55rem", fontWeight: 800, color: "var(--text-main)", letterSpacing: "-0.02em", marginBottom: 2 }}>
            {rank.title}
          </h2>
          <p style={{ fontSize: "0.77rem", color: "var(--text-sub)", fontStyle: "italic" }}>{rank.subtitle}</p>
        </div>
        <div style={{ flexShrink: 0, marginTop: 2 }}>
          <RankInsignia rankId={rankId} color={meta.color} size={52} />
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
        {[
          { label: "TOTAL XP",  value: xp.toLocaleString(), Icon: Zap },
          { label: "MISSIONS",  value: missions.toString(), Icon: CheckCircle2 },
          { label: "STREAK",    value: `${streak}d`,        Icon: Flame },
        ].map(s => (
          <div key={s.label} style={{ background: "rgba(241,245,249,0.8)", borderRadius: 10, padding: "10px 8px", textAlign: "center" }}>
            <s.Icon size={14} style={{ color: meta.color, margin: "0 auto 4px" }} />
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: "1rem", color: "var(--text-main)", letterSpacing: "-0.02em" }}>
              {s.value}
            </p>
            <p style={{ fontSize: "0.6rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.05em" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* XP Progress */}
      {nextRankDef && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--text-sub)" }}>Progress to {nextRankDef.title}</span>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, color: meta.color }}>{xpPct}%</span>
          </div>
          <GradientProgressBar value={xpPct} from={meta.gradientFrom} to={meta.gradientTo} height={8} />
          <p style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: 5 }}>
            {nextRankDef.requirement}
          </p>
        </>
      )}
    </div>
  );
}

// ── Rank card ─────────────────────────────────────────────────────────────────
function RankCard({ rank, status, xp, missions, streak }: {
  rank: typeof RANKS[number];
  status: "completed" | "active" | "locked";
  xp: number; missions: number; streak: number;
}) {
  const [expanded, setExpanded] = useState(status === "active");
  const meta = RANK_META[rank.id];

  const xpMet = xp >= rank.xpRequired;
  const missionsMet = missions >= rank.missionsRequired;
  const streakMet = rank.streakRequired === 0 || streak >= rank.streakRequired;

  return (
    <div
      style={{
        borderRadius: 14, overflow: "hidden",
        border: status === "active" ? `2px solid ${meta.color}40` : "1.5px solid rgba(91,140,255,0.1)",
        background: status === "locked" ? "rgba(248,250,255,0.6)" : "rgba(255,255,255,0.95)",
        boxShadow: status === "active" ? `0 4px 20px ${meta.glowColor}` : "var(--card-shadow)",
        opacity: status === "locked" ? 0.7 : 1,
        transition: "all 0.2s ease",
      }}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(e => !e)}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: 12,
          padding: "14px 16px", background: "none", border: "none", cursor: "pointer",
          textAlign: "left",
        }}
      >
        <div style={{ flexShrink: 0 }}>
          <RankInsignia rankId={rank.id} color={status === "locked" ? "#94a3b8" : meta.color} size={38} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
            <p style={{ fontWeight: 700, fontSize: "0.9rem", color: status === "locked" ? "var(--text-muted)" : "var(--text-main)" }}>
              {rank.title}
            </p>
            <StatusChip status={status} />
          </div>
          <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{rank.requirement}</p>
        </div>
        <span style={{ color: "var(--text-muted)", fontSize: "0.75rem", transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s ease", flexShrink: 0 }}>
          ▾
        </span>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div style={{ padding: "0 16px 16px", borderTop: "1px solid rgba(91,140,255,0.08)" }}>
          <p style={{ fontSize: "0.8rem", color: "var(--text-sub)", lineHeight: 1.6, marginBottom: 14, marginTop: 12 }}>
            {rank.description}
          </p>

          {/* Requirements */}
          {status !== "completed" && rank.xpRequired > 0 && (
            <div style={{ marginBottom: 12 }}>
              <p style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>
                Requirements
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  { label: `${rank.xpRequired} XP`, met: xpMet, current: xp },
                  ...(rank.missionsRequired > 0 ? [{ label: `${rank.missionsRequired} missions`, met: missionsMet, current: missions }] : []),
                  ...(rank.streakRequired > 0 ? [{ label: `${rank.streakRequired}-day streak`, met: streakMet, current: streak }] : []),
                ].map((req) => (
                  <div key={req.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 18, height: 18, borderRadius: "50%", background: req.met ? "#dcfce7" : "rgba(226,232,240,0.6)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {req.met ? <CheckCircle2 size={12} style={{ color: "#16a34a" }} /> : <Lock size={10} style={{ color: "#94a3b8" }} />}
                    </div>
                    <span style={{ fontSize: "0.78rem", color: req.met ? "#16a34a" : "var(--text-sub)", fontWeight: req.met ? 600 : 400 }}>
                      {req.label}
                      {!req.met && <span style={{ color: "var(--text-muted)", marginLeft: 4 }}>({req.current} / {req.label.split(" ")[0]})</span>}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Unlocks */}
          <div>
            <p style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>
              Unlocks
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {rank.unlocks.map((u) => (
                <div key={u} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: meta.color, flexShrink: 0 }} />
                  <span style={{ fontSize: "0.78rem", color: "var(--text-sub)" }}>{u}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Ranks() {
  const { isAuthenticated } = useAuth();
  const { xp, streak, missionsCompleted, rankId, isEnrolled, isLoading } = useFDF();

  if (!isAuthenticated) {
    return (
      <div className="page-container animate-fade-in">
        <div style={{ paddingTop: 40, textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>🏆</div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-main)", marginBottom: 8 }}>
            Ranks Locked
          </h2>
          <p style={{ fontSize: "0.875rem", color: "var(--text-sub)", marginBottom: 24 }}>
            Sign in to view your rank progression.
          </p>
          <a href={getLoginUrl()} className="btn-primary">
            Sign In to Continue
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="page-container">
        <div style={{ paddingTop: 24, display: "flex", flexDirection: "column", gap: 12 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton" style={{ height: 80, borderRadius: 18 }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="page-container animate-fade-in">

      {/* ── Header ── */}
      <div style={{ paddingTop: 20, paddingBottom: 20 }}>
        <h1
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "1.5rem", fontWeight: 800,
            color: "var(--text-main)", letterSpacing: "-0.02em", marginBottom: 4,
          }}
        >
          Ranks
        </h1>
        <p style={{ fontSize: "0.875rem", color: "var(--text-sub)" }}>
          Your progression through the FDF training system.
        </p>
      </div>

      {/* ── Hero Rank Card ── */}
      {isEnrolled ? (
        <HeroRankCard rankId={rankId} xp={xp} missions={missionsCompleted} streak={streak} />
      ) : (
        <div className="academy-card" style={{ marginBottom: 20, textAlign: "center", padding: 32 }}>
          <div style={{ fontSize: "2rem", marginBottom: 12 }}>🔒</div>
          <p style={{ fontWeight: 700, color: "var(--text-main)", marginBottom: 6 }}>Complete Onboarding First</p>
          <p style={{ fontSize: "0.875rem", color: "var(--text-sub)" }}>Set up your profile on the Home page to start tracking ranks.</p>
        </div>
      )}

      {/* ── Progression Ladder ── */}
      <p className="section-title" style={{ marginBottom: 12 }}>Progression Ladder</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 0, position: "relative" }}>
        {/* Connecting rail */}
        <div
          style={{
            position: "absolute",
            left: 35, top: 52, bottom: 52,
            width: 2,
            background: "linear-gradient(180deg, rgba(91,140,255,0.25), rgba(123,92,255,0.1))",
            zIndex: 0,
          }}
        />

        {RANKS.map((rank, i) => {
          const status = getRankStatus(rank.id, rankId);
          return (
            <div key={rank.id} style={{ position: "relative", zIndex: 1, marginBottom: i < RANKS.length - 1 ? 8 : 0 }}>
              <RankCard
                rank={rank}
                status={status}
                xp={xp}
                missions={missionsCompleted}
                streak={streak}
              />
            </div>
          );
        })}
      </div>

      {/* ── Next Tier Callout ── */}
      {isEnrolled && rankId !== "vault" && (
        <div
          className="academy-card"
          style={{
            marginTop: 20,
            background: "linear-gradient(135deg, rgba(91,140,255,0.06) 0%, rgba(123,92,255,0.06) 100%)",
            border: "1.5px solid rgba(91,140,255,0.15)",
          }}
        >
          <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text-main)", marginBottom: 4 }}>
            Next Tier Requirements
          </p>
          {(() => {
            const nextIdx = RANK_ORDER.indexOf(rankId) + 1;
            const nextRank = RANKS.find(r => r.id === RANK_ORDER[nextIdx]);
            if (!nextRank) return null;
            const meta = RANK_META[nextRank.id];
            return (
              <>
                <p style={{ fontSize: "0.8rem", color: "var(--text-sub)", marginBottom: 14 }}>
                  To reach <strong style={{ color: meta.color }}>{nextRank.title}</strong>: {nextRank.requirement}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {nextRank.xpRequired > 0 && (
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: "0.72rem", color: "var(--text-sub)" }}>XP Progress</span>
                        <span style={{ fontSize: "0.72rem", fontWeight: 700, color: meta.color }}>
                          {Math.min(xp, nextRank.xpRequired)} / {nextRank.xpRequired}
                        </span>
                      </div>
                      <GradientProgressBar
                        value={Math.min(100, Math.round((xp / nextRank.xpRequired) * 100))}
                        from={meta.gradientFrom}
                        to={meta.gradientTo}
                        height={6}
                      />
                    </div>
                  )}
                  {nextRank.missionsRequired > 0 && (
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: "0.72rem", color: "var(--text-sub)" }}>Missions</span>
                        <span style={{ fontSize: "0.72rem", fontWeight: 700, color: meta.color }}>
                          {Math.min(missionsCompleted, nextRank.missionsRequired)} / {nextRank.missionsRequired}
                        </span>
                      </div>
                      <GradientProgressBar
                        value={Math.min(100, Math.round((missionsCompleted / nextRank.missionsRequired) * 100))}
                        from={meta.gradientFrom}
                        to={meta.gradientTo}
                        height={6}
                      />
                    </div>
                  )}
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}
