import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { CheckCircle2, Lock, ArrowRight, Flame, Zap, Gem } from "lucide-react";

// ── XP level thresholds ──────────────────────────────────────────────────────
const LEVELS = [
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

function getLevelInfo(xp: number) {
  const idx = LEVELS.findLastIndex(l => xp >= l.minXp);
  const current = LEVELS[Math.max(0, idx)];
  const next = LEVELS[idx + 1];
  const pct = next
    ? Math.min(100, Math.round(((xp - current.minXp) / (next.minXp - current.minXp)) * 100))
    : 100;
  return { current, next, pct };
}

// ── Category config ──────────────────────────────────────────────────────────
const CATEGORIES = [
  { key: "money",   label: "Money Basics",  icon: "💰", color: "#10b981", bg: "#d1fae5" },
  { key: "mindset", label: "Mindset",        icon: "🧠", color: "#8b5cf6", bg: "#ede9fe" },
  { key: "build",   label: "Build & Create", icon: "🏗",  color: "#f59e0b", bg: "#fef3c7" },
  { key: "growth",  label: "Growth",         icon: "🚀", color: "#3b82f6", bg: "#eff6ff" },
] as const;
type Category = (typeof CATEGORIES)[number]["key"];

// ── Static fallback missions ──────────────────────────────────────────────────
const STATIC_MISSIONS = [
  { id: 1, title: "Save $5 This Week",       description: "Put $5 into a savings jar or account and track it.",         xpReward: 50,  gemsReward: 10, category: "money"   as Category, sortOrder: 0, iconEmoji: "💰" },
  { id: 2, title: "Write Your Money Goal",   description: "Write down one clear financial goal for this month.",         xpReward: 40,  gemsReward: 8,  category: "mindset" as Category, sortOrder: 1, iconEmoji: "🧠" },
  { id: 3, title: "Sell Something for $10",  description: "Sell a product, service, or skill for at least $10.",         xpReward: 100, gemsReward: 20, category: "build"   as Category, sortOrder: 2, iconEmoji: "🏗"  },
  { id: 4, title: "Complete a Logo Design",  description: "Design a simple logo for a real or imaginary brand.",         xpReward: 80,  gemsReward: 15, category: "build"   as Category, sortOrder: 3, iconEmoji: "🎨" },
  { id: 5, title: "Research One Investment", description: "Learn about one investment type (stocks, crypto, bonds).",    xpReward: 60,  gemsReward: 12, category: "money"   as Category, sortOrder: 4, iconEmoji: "📈" },
  { id: 6, title: "Build a Morning Routine", description: "Follow a consistent morning routine for 3 days straight.",   xpReward: 70,  gemsReward: 14, category: "mindset" as Category, sortOrder: 5, iconEmoji: "⏰" },
  { id: 7, title: "Launch a Social Post",    description: "Post about a skill or project you're currently working on.", xpReward: 90,  gemsReward: 18, category: "growth"  as Category, sortOrder: 6, iconEmoji: "🚀" },
  { id: 8, title: "Read for 20 Minutes",     description: "Read any book about business, money, or self-development.",  xpReward: 45,  gemsReward: 9,  category: "mindset" as Category, sortOrder: 7, iconEmoji: "📚" },
];

// ── Animated XP bar ───────────────────────────────────────────────────────────
function XPBar({ xp }: { xp: number }) {
  const { current, next, pct } = getLevelInfo(xp);
  const [animPct, setAnimPct] = useState(0);
  useEffect(() => { const t = setTimeout(() => setAnimPct(pct), 120); return () => clearTimeout(t); }, [pct]);

  return (
    <div className="academy-card" style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontWeight: 800, fontSize: "0.9rem", color: "var(--text-main)", fontFamily: "'Space Grotesk', sans-serif" }}>
          Level {current.level}
        </span>
        <span style={{ fontSize: "0.75rem", color: "var(--text-sub)", fontWeight: 600 }}>
          {xp.toLocaleString()} {next ? `/ ${next.minXp.toLocaleString()} XP` : "XP — Max"}
        </span>
      </div>
      <div className="progress-track" style={{ height: 10 }}>
        <div
          className="progress-fill"
          style={{
            width: `${animPct}%`,
            transition: "width 0.9s cubic-bezier(0.4,0,0.2,1)",
            boxShadow: "0 0 8px rgba(91,140,255,0.45)",
          }}
        />
      </div>
      {next && (
        <p style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: 5, textAlign: "right" }}>
          {next.minXp - xp} XP to Level {next.level}
        </p>
      )}
    </div>
  );
}

// ── 7-day streak indicator ────────────────────────────────────────────────────
function StreakBar({ streak }: { streak: number }) {
  const labels = ["M", "T", "W", "T", "F", "S", "S"];
  const todayDow = new Date().getDay(); // 0=Sun
  const todayIdx = todayDow === 0 ? 6 : todayDow - 1; // Mon=0

  return (
    <div className="academy-card" style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Flame size={18} color="#f97316" />
          <span style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--text-main)", fontFamily: "'Space Grotesk', sans-serif" }}>
            {streak} Day Streak
          </span>
        </div>
        <span style={{ fontSize: "0.75rem", color: "var(--text-sub)" }}>Stay consistent to level up faster</span>
      </div>
      <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
        {labels.map((lbl, i) => {
          const filled = i <= todayIdx && streak > (todayIdx - i);
          const isToday = i === todayIdx;
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
              <div
                style={{
                  width: 34, height: 34, borderRadius: "50%",
                  background: filled ? "linear-gradient(135deg, #f97316, #ef4444)" : "rgba(226,232,240,0.7)",
                  border: isToday ? "2px solid #f97316" : "2px solid transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.75rem", color: filled ? "white" : "#94a3b8",
                  boxShadow: filled ? "0 0 10px rgba(249,115,22,0.35)" : "none",
                  transition: "all 0.2s ease",
                  fontWeight: 700,
                }}
              >
                {filled ? "✓" : ""}
              </div>
              <span style={{ fontSize: "0.58rem", color: isToday ? "#f97316" : "#94a3b8", fontWeight: isToday ? 700 : 500 }}>
                {lbl}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Daily Activation ──────────────────────────────────────────────────────────
function DailyActivation({ lastCheckin, onCheckIn, loading }: { lastCheckin?: string | null; onCheckIn: () => void; loading: boolean }) {
  const today = new Date().toISOString().split("T")[0];
  const done = lastCheckin === today;
  return (
    <div
      className="academy-card"
      style={{
        marginBottom: 20,
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
        background: done ? "linear-gradient(135deg, rgba(16,185,129,0.06), rgba(5,150,105,0.04))" : undefined,
        border: done ? "1.5px solid rgba(16,185,129,0.25)" : undefined,
      }}
    >
      <div>
        <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-main)", marginBottom: 2 }}>
          Daily Activation
        </p>
        <p style={{ fontSize: "0.75rem", color: "var(--text-sub)" }}>
          {done ? "Activated today ✓" : "+5 XP · Keeps your streak alive"}
        </p>
      </div>
      <button
        onClick={onCheckIn}
        disabled={done || loading}
        className={done ? "" : "btn-primary"}
        style={{
          padding: "9px 18px", flexShrink: 0, fontSize: "0.82rem",
          ...(done ? {
            background: "rgba(16,185,129,0.12)", color: "#10b981",
            border: "none", borderRadius: 10, fontWeight: 700, cursor: "default",
          } : {}),
        }}
      >
        {done ? "Done ✓" : loading ? "…" : "Check In →"}
      </button>
    </div>
  );
}

// ── Completion overlay ────────────────────────────────────────────────────────
function CompletionOverlay({ xpEarned, gemsEarned, title, onContinue }: {
  xpEarned: number; gemsEarned: number; title: string; onContinue: () => void;
}) {
  const [vis, setVis] = useState(false);
  useEffect(() => { requestAnimationFrame(() => setVis(true)); }, []);
  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(15,23,42,0.7)", backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
        opacity: vis ? 1 : 0, transition: "opacity 0.25s ease",
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.98)", borderRadius: 20, padding: "36px 28px",
          maxWidth: 340, width: "100%", textAlign: "center",
          transform: vis ? "scale(1)" : "scale(0.85)",
          transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          boxShadow: "0 24px 64px rgba(91,140,255,0.22), 0 0 0 1px rgba(91,140,255,0.12)",
        }}
      >
        <div
          style={{
            width: 60, height: 60, borderRadius: "50%",
            background: "linear-gradient(135deg, #10b981, #059669)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 18px",
            boxShadow: "0 0 24px rgba(16,185,129,0.4)",
          }}
        >
          <CheckCircle2 size={28} color="white" />
        </div>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: "1.2rem", color: "#0f172a", marginBottom: 4 }}>
          Mission Complete
        </p>
        <p style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: 22 }}>{title}</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 24 }}>
          {[
            { label: "XP", value: `+${xpEarned}`, icon: <Zap size={14} />, bg: "#eff6ff", color: "#2563eb" },
            { label: "GEMS", value: `+${gemsEarned}`, icon: <Gem size={14} />, bg: "#f0fdf4", color: "#16a34a" },
          ].map(r => (
            <div key={r.label} style={{ background: r.bg, borderRadius: 12, padding: "10px 20px", textAlign: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "center", color: r.color, fontWeight: 800, fontSize: "1rem", fontFamily: "'Space Grotesk', sans-serif" }}>
                {r.icon}{r.value}
              </div>
              <p style={{ fontSize: "0.65rem", color: "#64748b", fontWeight: 600, letterSpacing: "0.05em", marginTop: 2 }}>{r.label}</p>
            </div>
          ))}
        </div>
        <button
          onClick={onContinue}
          className="btn-primary"
          style={{ width: "100%", justifyContent: "center" }}
        >
          Continue →
        </button>
      </div>
    </div>
  );
}

// ── Mission card ──────────────────────────────────────────────────────────────
function MissionCard({
  mission, isLocked, isClaimed, onClaim, isLoading,
}: {
  mission: typeof STATIC_MISSIONS[0];
  isLocked: boolean; isClaimed: boolean;
  onClaim: (id: number) => void; isLoading: boolean;
}) {
  const [hov, setHov] = useState(false);
  const cat = CATEGORIES.find(c => c.key === mission.category) ?? CATEGORIES[0];

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: isLocked ? "rgba(248,250,252,0.55)" : "rgba(255,255,255,0.88)",
        backdropFilter: "blur(12px)",
        borderRadius: 16, padding: "16px 18px", marginBottom: 10,
        border: isClaimed
          ? "1.5px solid rgba(16,185,129,0.35)"
          : isLocked
          ? "1px solid rgba(226,232,240,0.5)"
          : `1.5px solid ${hov ? cat.color + "55" : "rgba(91,140,255,0.12)"}`,
        boxShadow: hov && !isLocked ? `0 6px 24px rgba(91,140,255,0.12)` : "0 2px 8px rgba(91,140,255,0.05)",
        transform: hov && !isLocked ? "translateY(-2px)" : "none",
        transition: "all 0.18s ease",
        opacity: isLocked ? 0.55 : 1,
        position: "relative", overflow: "hidden",
      }}
    >
      {/* Top accent line on hover */}
      {hov && !isLocked && !isClaimed && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, ${cat.color}, transparent)`,
        }} />
      )}

      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        {/* Icon */}
        <div style={{
          width: 42, height: 42, borderRadius: 11, flexShrink: 0,
          background: isLocked ? "#f1f5f9" : cat.bg,
          border: `1px solid ${isLocked ? "#e2e8f0" : cat.color + "30"}`,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem",
        }}>
          {isLocked ? <Lock size={16} color="#94a3b8" /> : mission.iconEmoji}
        </div>

        {/* Body */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "0.9rem",
              color: isLocked ? "#94a3b8" : "var(--text-main)",
            }}>
              {mission.title}
            </span>
            {isClaimed && (
              <span className="badge-pill green" style={{ fontSize: "0.62rem" }}>DONE</span>
            )}
          </div>
          <p style={{ fontSize: "0.775rem", color: isLocked ? "#94a3b8" : "var(--text-sub)", marginBottom: 10, lineHeight: 1.5 }}>
            {isLocked ? "Complete previous mission to unlock" : mission.description}
          </p>

          {!isLocked && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
              <div style={{ display: "flex", gap: 6 }}>
                <span className="badge-pill blue" style={{ fontSize: "0.68rem" }}>
                  <Zap size={10} style={{ marginRight: 2 }} />+{mission.xpReward} XP
                </span>
                <span className="badge-pill purple" style={{ fontSize: "0.68rem" }}>
                  💎 +{mission.gemsReward}
                </span>
              </div>
              {!isClaimed && (
                <button
                  onClick={() => onClaim(mission.id)}
                  disabled={isLoading}
                  style={{
                    padding: "7px 16px",
                    background: isLoading ? "#e2e8f0" : `linear-gradient(135deg, ${cat.color}, ${cat.color}cc)`,
                    color: isLoading ? "#94a3b8" : "white",
                    border: "none", borderRadius: 9,
                    fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "0.78rem",
                    cursor: isLoading ? "not-allowed" : "pointer",
                    boxShadow: isLoading ? "none" : `0 3px 10px ${cat.color}40`,
                    transition: "all 0.15s ease",
                  }}
                >
                  {isLoading ? "…" : "Collect →"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Category section ──────────────────────────────────────────────────────────
function CategorySection({ category, missions, completedIds, lockedIds, onClaim, loadingId }: {
  category: typeof CATEGORIES[number];
  missions: typeof STATIC_MISSIONS;
  completedIds: Set<number>; lockedIds: Set<number>;
  onClaim: (id: number) => void; loadingId: number | null;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const done = missions.filter(m => completedIds.has(m.id)).length;

  return (
    <div style={{ marginBottom: 20 }}>
      <button
        onClick={() => setCollapsed(c => !c)}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "none", border: "none", cursor: "pointer", padding: "0 0 10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: category.bg, border: `1px solid ${category.color}30`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem",
          }}>
            {category.icon}
          </div>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "var(--text-main)" }}>
            {category.label}
          </span>
          <span className="badge-pill" style={{ fontSize: "0.65rem", background: "#f1f5f9", color: "#64748b" }}>
            {done}/{missions.length}
          </span>
        </div>
        <span style={{ color: "#94a3b8", fontSize: "0.75rem", transform: collapsed ? "rotate(-90deg)" : "none", transition: "transform 0.2s" }}>▼</span>
      </button>

      {!collapsed && missions.map(m => (
        <MissionCard
          key={m.id}
          mission={m}
          isLocked={lockedIds.has(m.id)}
          isClaimed={completedIds.has(m.id)}
          onClaim={onClaim}
          isLoading={loadingId === m.id}
        />
      ))}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function Missions() {
  const { isAuthenticated } = useAuth();
  const utils = trpc.useUtils();

  const { data: profile } = trpc.fdf.getProfile.useQuery(undefined, { enabled: isAuthenticated });
  const { data: missionsData, isLoading } = trpc.fdf.getMissions.useQuery(undefined, {
    enabled: isAuthenticated && !!profile?.fdfUser,
  });

  const [overlay, setOverlay] = useState<{ xpEarned: number; gemsEarned: number; title: string } | null>(null);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const claimMutation = trpc.fdf.claimMission.useMutation({
    onSuccess: (data) => {
      setOverlay({ xpEarned: data.xpEarned, gemsEarned: data.gemsEarned, title: data.missionTitle });
      utils.fdf.getMissions.invalidate();
      utils.fdf.getProfile.invalidate();
      setLoadingId(null);
    },
    onError: (err) => { toast.error(err.message); setLoadingId(null); },
  });

  const checkInMutation = trpc.fdf.checkIn.useMutation({
    onSuccess: () => { utils.fdf.getProfile.invalidate(); toast.success("+5 XP — Activated!"); },
    onError: (err) => toast.error(err.message),
  });

  // Build mission list
  const rawMissions = missionsData?.missions?.length
    ? missionsData.missions.map(m => ({
        id: m.id,
        title: m.title,
        description: m.description ?? "",
        xpReward: m.xpReward,
        gemsReward: m.gemsReward,
        category: (m.category ?? "money") as Category,
        sortOrder: m.sortOrder ?? 0,
        iconEmoji: m.iconEmoji ?? "📋",
      }))
    : STATIC_MISSIONS;

  const completions = missionsData?.completions ?? [];
  const completedIds = new Set(completions.filter(c => c.status === "claimed").map(c => c.missionId));

  // Build locked set: lock all missions after the first uncompleted one
  const sorted = [...rawMissions].sort((a, b) => a.sortOrder - b.sortOrder);
  const lockedIds = new Set<number>();
  let foundUnlocked = false;
  for (let i = 0; i < sorted.length; i++) {
    if (foundUnlocked) { lockedIds.add(sorted[i].id); continue; }
    if (!completedIds.has(sorted[i].id)) {
      foundUnlocked = true;
      // first uncompleted is unlocked; everything after is locked
    }
  }

  const progress = profile?.progress;
  const xp = progress?.xpTotal ?? 0;
  const streak = progress?.streakDays ?? 0;

  // Group by category
  const byCategory = CATEGORIES.map(cat => ({
    category: cat,
    missions: rawMissions.filter(m => m.category === cat.key),
  })).filter(g => g.missions.length > 0);

  // ── Unauthenticated ──
  if (!isAuthenticated) {
    return (
      <div className="page-container animate-fade-in">
        <div style={{ paddingTop: 48, textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>🎯</div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-main)", marginBottom: 8 }}>Missions Locked</h2>
          <p style={{ fontSize: "0.875rem", color: "var(--text-sub)", marginBottom: 24 }}>Sign in to access your weekly training missions.</p>
          <a href={getLoginUrl()} className="btn-primary" style={{ display: "inline-flex" }}>
            Sign In to Continue <ArrowRight size={16} style={{ marginLeft: 6 }} />
          </a>
        </div>
      </div>
    );
  }

  if (!profile?.fdfUser) {
    return (
      <div className="page-container animate-fade-in">
        <div style={{ paddingTop: 48, textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>🔒</div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-main)", marginBottom: 8 }}>Complete Onboarding First</h2>
          <p style={{ fontSize: "0.875rem", color: "var(--text-sub)" }}>Set up your FDF profile on the Home page to unlock missions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container animate-fade-in">
      {/* Header */}
      <div style={{ paddingTop: 20, paddingBottom: 16 }}>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "var(--text-main)", letterSpacing: "-0.02em", marginBottom: 3 }}>
          Missions
        </h1>
        <p style={{ fontSize: "0.82rem", color: "var(--text-sub)" }}>
          Complete weekly missions to build real skills and earn XP.
        </p>
      </div>

      {/* XP Level Bar */}
      <XPBar xp={xp} />

      {/* Streak */}
      <StreakBar streak={streak} />

      {/* Daily Activation */}
      <DailyActivation
        lastCheckin={progress?.lastCheckin}
        onCheckIn={() => checkInMutation.mutate()}
        loading={checkInMutation.isPending}
      />

      {/* Missions by category */}
      {isLoading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 90, borderRadius: 16 }} />)}
        </div>
      ) : (
        byCategory.map(({ category, missions: catMissions }) => (
          <CategorySection
            key={category.key}
            category={category}
            missions={catMissions}
            completedIds={completedIds}
            lockedIds={lockedIds}
            onClaim={(id) => { setLoadingId(id); claimMutation.mutate({ missionId: id }); }}
            loadingId={loadingId}
          />
        ))
      )}

      {/* Completion overlay */}
      {overlay && (
        <CompletionOverlay
          xpEarned={overlay.xpEarned}
          gemsEarned={overlay.gemsEarned}
          title={overlay.title}
          onContinue={() => setOverlay(null)}
        />
      )}
    </div>
  );
}
