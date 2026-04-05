import { Link } from "wouter";
import { useState, useEffect } from "react";
import { CheckCircle2, Lock, ArrowRight, Flame, Zap } from "lucide-react";
import { useFDF, RANK_META, getLevelInfo, UNLOCK_XP, type RankId } from "@/contexts/FDFContext";

// ── Rank definitions (5-tier system) ─────────────────────────────────────────
const RANKS: Array<{
  id: RankId;
  title: string;
  subtitle: string;
  description: string;
  requirement: string;
  xpRequired: number;
  unlocks: string[];
}> = [
  {
    id: "rookie",
    title: "Rookie",
    subtitle: "Welcome to the academy.",
    description: "You've joined the Future Dawgs Foundation. Your training begins here. Complete your first missions to start climbing.",
    requirement: "0 XP — unlocked immediately",
    xpRequired: 0,
    unlocks: ["Access to core missions", "Daily Activation check-in", "XP and Gem tracking"],
  },
  {
    id: "starter",
    title: "Starter",
    subtitle: "You're building momentum.",
    description: "You've proven you can show up. Keep completing missions and maintaining your streak to push further.",
    requirement: "100 XP",
    xpRequired: 100,
    unlocks: ["Rewards shop unlocked", "Advanced mission modules", "Streak tracking"],
  },
  {
    id: "builder",
    title: "Builder",
    subtitle: "Apply skills and show real progress.",
    description: "You're demonstrating consistency and applying real-world skills. Elite status is within reach.",
    requirement: "250 XP",
    xpRequired: 250,
    unlocks: ["Ranks page unlocked", "Elite badge styling", "Milestone recognition"],
  },
  {
    id: "operator",
    title: "Operator",
    subtitle: "Operating at a high level.",
    description: "You've built the habits. You understand the system. Now you operate at a level most never reach.",
    requirement: "500 XP",
    xpRequired: 500,
    unlocks: ["Vault preview unlocked", "Priority review status", "Advanced curriculum"],
  },
  {
    id: "elite",
    title: "Elite",
    subtitle: "The highest tier in FDF.",
    description: "The highest tier in the FDF system. Your transition path to the Crypdawgs Vault begins here. Graduate at 18.",
    requirement: "1000 XP",
    xpRequired: 1000,
    unlocks: ["Vault Access at 18", "Full financial intelligence", "Vault-tier network membership"],
  },
];

const RANK_ORDER: RankId[] = ["rookie", "starter", "builder", "operator", "elite"];

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
function RankInsignia({ rankId, color, size = 36 }: { rankId: RankId; color: string; size?: number }) {
  const meta = RANK_META[rankId];
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `linear-gradient(135deg, ${meta.gradientFrom}, ${meta.gradientTo})`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.45, boxShadow: `0 2px 8px ${meta.glowColor}`,
      flexShrink: 0,
    }}>
      {meta.emoji}
    </div>
  );
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
function HeroRankCard({ rankId, xp, streak }: { rankId: RankId; xp: number; streak: number }) {
  const rank = RANKS.find(r => r.id === rankId)!;
  const meta = RANK_META[rankId];
  const nextRankDef = RANKS.find(r => r.id === RANK_ORDER[RANK_ORDER.indexOf(rankId) + 1]);
  const { level, pct: levelPct } = getLevelInfo(xp);

  const xpPct = nextRankDef
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
        <RankInsignia rankId={rankId} color={meta.color} size={52} />
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
        {[
          { label: "TOTAL XP",  value: xp.toLocaleString(), Icon: Zap },
          { label: "LEVEL",     value: `L${level}`,          Icon: CheckCircle2 },
          { label: "STREAK",    value: `${streak}d`,         Icon: Flame },
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

      {/* XP Progress to next rank */}
      {nextRankDef && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--text-sub)" }}>Progress to {nextRankDef.title}</span>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, color: meta.color }}>{xpPct}%</span>
          </div>
          <GradientProgressBar value={xpPct} from={meta.gradientFrom} to={meta.gradientTo} height={8} />
          <p style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: 5 }}>
            {nextRankDef.xpRequired - xp > 0 ? `${nextRankDef.xpRequired - xp} XP to ${nextRankDef.title}` : "Rank up ready!"}
          </p>
        </>
      )}

      {/* Level progress bar */}
      <div style={{ marginTop: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
          <span style={{ fontSize: "0.68rem", fontWeight: 600, color: "var(--text-sub)" }}>Level {level} progress</span>
          <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--text-muted)" }}>{levelPct}%</span>
        </div>
        <GradientProgressBar value={levelPct} from="#5b8cff" to="#7b5cff" height={5} />
      </div>
    </div>
  );
}

// ── Rank card ─────────────────────────────────────────────────────────────────
function RankCard({ rank, status, xp }: {
  rank: typeof RANKS[number];
  status: "completed" | "active" | "locked";
  xp: number;
}) {
  const [expanded, setExpanded] = useState(status === "active");
  const meta = RANK_META[rank.id];
  const xpMet = xp >= rank.xpRequired;

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
        <RankInsignia rankId={rank.id} color={status === "locked" ? "#94a3b8" : meta.color} size={38} />
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

          {/* XP requirement */}
          {status !== "completed" && rank.xpRequired > 0 && (
            <div style={{ marginBottom: 12 }}>
              <p style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>
                Requirement
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 18, height: 18, borderRadius: "50%", background: xpMet ? "#dcfce7" : "rgba(226,232,240,0.6)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {xpMet ? <CheckCircle2 size={12} style={{ color: "#16a34a" }} /> : <Lock size={10} style={{ color: "#94a3b8" }} />}
                </div>
                <span style={{ fontSize: "0.78rem", color: xpMet ? "#16a34a" : "var(--text-sub)", fontWeight: xpMet ? 600 : 400 }}>
                  {rank.xpRequired} XP
                  {!xpMet && <span style={{ color: "var(--text-muted)", marginLeft: 4 }}>({xp} / {rank.xpRequired})</span>}
                </span>
              </div>
              {!xpMet && (
                <div style={{ marginTop: 8 }}>
                  <GradientProgressBar
                    value={Math.min(100, Math.round((xp / rank.xpRequired) * 100))}
                    from={meta.gradientFrom}
                    to={meta.gradientTo}
                    height={5}
                  />
                </div>
              )}
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
  const { isAuthenticated, xp, streak, rankId, isEnrolled, isLoading, unlockedSections } = useFDF();

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
          <Link href="/signin" className="btn-primary">
            Sign In to Continue
            <ArrowRight size={16} />
          </Link>
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

  // Progressive unlock gate
  if (!unlockedSections.ranks) {
    const needed = UNLOCK_XP.ranks - xp;
    return (
      <div className="page-container animate-fade-in">
        <div style={{ paddingTop: 20, paddingBottom: 20 }}>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "var(--text-main)", letterSpacing: "-0.02em", marginBottom: 4 }}>
            Ranks
          </h1>
        </div>
        <div
          className="academy-card"
          style={{
            textAlign: "center", padding: "40px 24px",
            background: "linear-gradient(135deg, rgba(91,140,255,0.04), rgba(123,92,255,0.04))",
            border: "1.5px solid rgba(91,140,255,0.15)",
          }}
        >
          <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>🔒</div>
          <p style={{ fontWeight: 800, fontSize: "1rem", color: "var(--text-main)", marginBottom: 6 }}>
            Ranks Unlock at 250 XP
          </p>
          <p style={{ fontSize: "0.875rem", color: "var(--text-sub)", marginBottom: 20 }}>
            You need <strong style={{ color: "var(--primary)" }}>{needed} more XP</strong> to unlock the full rank system.
          </p>
          <div style={{ background: "rgba(226,232,240,0.5)", borderRadius: 99, height: 8, overflow: "hidden", maxWidth: 240, margin: "0 auto 12px" }}>
            <div style={{ height: "100%", borderRadius: 99, background: "linear-gradient(90deg, #5b8cff, #7b5cff)", width: `${Math.min(100, Math.round((xp / 250) * 100))}%`, transition: "width 0.6s ease" }} />
          </div>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{xp} / 250 XP</p>
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
        <HeroRankCard rankId={rankId} xp={xp} streak={streak} />
      ) : (
        <div className="academy-card" style={{ marginBottom: 20, textAlign: "center", padding: 32 }}>
          <div style={{ fontSize: "2rem", marginBottom: 12 }}>🔒</div>
          <p style={{ fontWeight: 700, color: "var(--text-main)", marginBottom: 6 }}>Complete Onboarding First</p>
          <p style={{ fontSize: "0.875rem", color: "var(--text-sub)" }}>Set up your profile on the Home page to start tracking ranks.</p>
        </div>
      )}

      {/* ── Progression Ladder ── */}
      <p className="section-title" style={{ marginBottom: 12 }}>Progression Ladder</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {RANKS.map((rank) => {
          const status = getRankStatus(rank.id, rankId);
          return (
            <RankCard
              key={rank.id}
              rank={rank}
              status={status}
              xp={xp}
            />
          );
        })}
      </div>

      {/* ── Next Tier Callout ── */}
      {isEnrolled && rankId !== "elite" && (
        <div
          className="academy-card"
          style={{
            marginTop: 20,
            background: "linear-gradient(135deg, rgba(91,140,255,0.06) 0%, rgba(123,92,255,0.06) 100%)",
            border: "1.5px solid rgba(91,140,255,0.15)",
          }}
        >
          {(() => {
            const nextIdx = RANK_ORDER.indexOf(rankId) + 1;
            const nextRank = RANKS[nextIdx];
            if (!nextRank) return null;
            const meta = RANK_META[nextRank.id];
            const xpNeeded = Math.max(0, nextRank.xpRequired - xp);
            return (
              <>
                <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text-main)", marginBottom: 4 }}>
                  Next Rank: <span style={{ color: meta.color }}>{nextRank.title}</span>
                </p>
                <p style={{ fontSize: "0.8rem", color: "var(--text-sub)", marginBottom: 14 }}>
                  {xpNeeded > 0
                    ? `Earn ${xpNeeded} more XP to reach ${nextRank.title}.`
                    : `You're ready to rank up to ${nextRank.title}!`}
                </p>
                <GradientProgressBar
                  value={Math.min(100, Math.round(((xp - RANK_META[rankId].minXp) / (nextRank.xpRequired - RANK_META[rankId].minXp)) * 100))}
                  from={meta.gradientFrom}
                  to={meta.gradientTo}
                  height={6}
                />
              </>
            );
          })()}
        </div>
      )}

      {/* ── Unlock milestones ── */}
      <div className="academy-card" style={{ marginTop: 16, marginBottom: 16 }}>
        <p className="section-title" style={{ marginBottom: 12 }}>XP Unlock Milestones</p>
        {[
          { xp: UNLOCK_XP.missions, label: "Missions",  unlocked: unlockedSections.missions },
          { xp: UNLOCK_XP.rewards,  label: "Rewards",   unlocked: unlockedSections.rewards  },
          { xp: UNLOCK_XP.ranks,    label: "Ranks",     unlocked: unlockedSections.ranks    },
          { xp: UNLOCK_XP.vault,    label: "Vault Preview", unlocked: unlockedSections.vault },
        ].map((item, i) => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: i < 3 ? "1px solid rgba(91,140,255,0.07)" : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 18, height: 18, borderRadius: "50%", background: item.unlocked ? "#dcfce7" : "rgba(226,232,240,0.6)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {item.unlocked ? <CheckCircle2 size={11} style={{ color: "#16a34a" }} /> : <Lock size={9} style={{ color: "#94a3b8" }} />}
              </div>
              <span style={{ fontSize: "0.8rem", color: item.unlocked ? "var(--text-main)" : "var(--text-sub)", fontWeight: item.unlocked ? 600 : 400 }}>
                {item.label}
              </span>
            </div>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: item.unlocked ? "#16a34a" : "var(--text-muted)" }}>
              {item.unlocked ? "Unlocked" : `${item.xp} XP`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
