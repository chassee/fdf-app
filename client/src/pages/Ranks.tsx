import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Lock, Zap, ArrowRight, CheckCircle2 } from "lucide-react";

const RANK_LADDER = [
  { name: "Pup",         minXp: 0,     icon: "🐾", color: "#94a3b8", bg: "#f1f5f9", desc: "Entry level. Just getting started." },
  { name: "Scout",       minXp: 500,   icon: "🔍", color: "#10b981", bg: "#d1fae5", desc: "Completed first training modules." },
  { name: "Trainee",     minXp: 1500,  icon: "📚", color: "#3b82f6", bg: "#eff6ff", desc: "Consistent weekly mission completion." },
  { name: "Hunter",      minXp: 3000,  icon: "🎯", color: "#8b5cf6", bg: "#ede9fe", desc: "Demonstrated real-world skill application." },
  { name: "Builder",     minXp: 6000,  icon: "🏗️", color: "#f59e0b", bg: "#fef3c7", desc: "Launched a product, service, or project." },
  { name: "Operator",    minXp: 10000, icon: "⚙️", color: "#5b8cff", bg: "#e8efff", desc: "Running a functional operation." },
  { name: "Vault Ready", minXp: 15000, icon: "🔓", color: "#7b5cff", bg: "#ede8ff", desc: "Eligible for Vault access at age 18." },
];

export default function Ranks() {
  const { isAuthenticated } = useAuth();
  const { data: profile, isLoading } = trpc.fdf.getProfile.useQuery(undefined, {
    enabled: isAuthenticated,
  });

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

  if (isLoading || !profile) {
    return (
      <div className="page-container">
        <div style={{ paddingTop: 24, display: "flex", flexDirection: "column", gap: 10 }}>
          <div className="skeleton" style={{ height: 100, borderRadius: 18 }} />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="skeleton" style={{ height: 64, borderRadius: 14 }} />
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
            fontSize: "1.5rem",
            fontWeight: 800,
            color: "var(--text-main)",
            letterSpacing: "-0.02em",
            marginBottom: 4,
          }}
        >
          Rank Progression
        </h1>
        <p style={{ fontSize: "0.875rem", color: "var(--text-sub)" }}>
          Advance through FDF training tiers by completing missions and earning XP.
        </p>
      </div>

      {/* ── Current Status ── */}
      {isEnrolled && (
        <div className="academy-card" style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div>
              <p className="section-title" style={{ marginBottom: 3 }}>Current Rank</p>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: "1.3rem" }}>{RANK_LADDER[safeIndex].icon}</span>
                <span
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: 800,
                    color: RANK_LADDER[safeIndex].color,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {currentRank}
                </span>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <p className="section-title" style={{ marginBottom: 3 }}>Total XP</p>
              <p style={{ fontSize: "1.125rem", fontWeight: 800, color: "var(--primary)", letterSpacing: "-0.02em" }}>
                {currentXp.toLocaleString()}
              </p>
            </div>
          </div>

          {nextRank && (
            <>
              <div className="progress-track" style={{ marginBottom: 6 }}>
                <div
                  className="progress-fill"
                  style={{ width: `${Math.min(100, Math.max(0, progressToNext))}%` }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600 }}>
                  {currentRank}
                </span>
                <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600 }}>
                  {(nextRank.minXp - currentXp).toLocaleString()} XP → {nextRank.name}
                </span>
              </div>
            </>
          )}

          {!nextRank && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                color: "#16a34a",
                fontSize: "0.8rem",
                fontWeight: 700,
              }}
            >
              <CheckCircle2 size={16} />
              Maximum rank achieved — Vault Ready!
            </div>
          )}
        </div>
      )}

      {/* ── Rank Ladder ── */}
      <p className="section-title">Training Ladder</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
        {RANK_LADDER.map((rank, index) => {
          const isCurrentRank = rank.name === currentRank && isEnrolled;
          const isAchieved = isEnrolled && currentXp >= rank.minXp;
          const isLocked = !isEnrolled || currentXp < rank.minXp;

          return (
            <div
              key={rank.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 16px",
                borderRadius: 14,
                background: isCurrentRank
                  ? rank.bg
                  : "rgba(255,255,255,0.7)",
                border: `1.5px solid ${isCurrentRank ? rank.color + "40" : "rgba(91,140,255,0.1)"}`,
                opacity: isLocked ? 0.45 : 1,
                backdropFilter: "blur(12px)",
                transition: "all 0.15s ease",
              }}
            >
              {/* Rank number */}
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  background: isAchieved ? rank.bg : "rgba(91,140,255,0.06)",
                  border: `1.5px solid ${isAchieved ? rank.color + "40" : "rgba(91,140,255,0.1)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.7rem",
                  fontWeight: 800,
                  color: isAchieved ? rank.color : "var(--text-muted)",
                  flexShrink: 0,
                }}
              >
                {String(index + 1).padStart(2, "0")}
              </div>

              {/* Icon */}
              <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>{rank.icon}</span>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                  <span
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 700,
                      color: isAchieved ? rank.color : "var(--text-sub)",
                    }}
                  >
                    {rank.name}
                  </span>
                  {isCurrentRank && (
                    <span
                      style={{
                        fontSize: "0.6rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        padding: "2px 6px",
                        borderRadius: 6,
                        background: rank.bg,
                        color: rank.color,
                        border: `1px solid ${rank.color}30`,
                      }}
                    >
                      Current
                    </span>
                  )}
                </div>
                <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
                  {rank.desc}
                </p>
              </div>

              {/* XP requirement */}
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end" }}>
                  {isLocked ? (
                    <Lock size={10} style={{ color: "var(--text-muted)" }} />
                  ) : isAchieved ? (
                    <CheckCircle2 size={10} style={{ color: rank.color }} />
                  ) : (
                    <Zap size={10} style={{ color: rank.color }} />
                  )}
                  <span
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      color: isAchieved ? rank.color : "var(--text-muted)",
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
      <div
        className="academy-card"
        style={{
          background: "linear-gradient(135deg, rgba(123,92,255,0.06) 0%, rgba(91,140,255,0.06) 100%)",
          border: "1.5px solid rgba(123,92,255,0.15)",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "var(--accent-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.25rem",
              flexShrink: 0,
            }}
          >
            🔓
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-main)", marginBottom: 4 }}>
              Vault Access
            </p>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-sub)", lineHeight: 1.6 }}>
              Reaching{" "}
              <strong style={{ color: "var(--accent)" }}>Vault Ready</strong> rank and turning 18
              unlocks access to the Crypdawgs Vault — the next tier of the system. All XP and
              progress carries forward.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
