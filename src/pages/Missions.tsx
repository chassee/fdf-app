import { Link } from "wouter";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useState, useEffect, useRef } from "react";
import { CheckCircle2, Lock, ArrowRight, Flame, Zap } from "lucide-react";
import { useFDF, getLevelInfo, UNLOCK_XP } from "@/contexts/FDFContext";

// ── Category config ──────────────────────────────────────────────────────────
const CATEGORIES = [
  { key: "money",   label: "Money Basics",  icon: "💰", color: "#10b981", bg: "#d1fae5" },
  { key: "mindset", label: "Mindset",        icon: "🧠", color: "#8b5cf6", bg: "#ede9fe" },
  { key: "build",   label: "Build & Create", icon: "🏗",  color: "#f59e0b", bg: "#fef3c7" },
  { key: "growth",  label: "Growth",         icon: "🚀", color: "#3b82f6", bg: "#eff6ff" },
] as const;
type Category = (typeof CATEGORIES)[number]["key"];

// No static fallback missions — all missions come from Supabase only

// ── Animated XP bar ───────────────────────────────────────────────────────────
function XPBar({ xp }: { xp: number }) {
  const { level, levelCeil, pct } = getLevelInfo(xp);
  const [animPct, setAnimPct] = useState(0);
  useEffect(() => { const t = setTimeout(() => setAnimPct(pct), 120); return () => clearTimeout(t); }, [pct]);

  return (
    <div className="academy-card" style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Zap size={14} style={{ color: "var(--primary)" }} />
          <span style={{ fontWeight: 800, fontSize: "0.9rem", color: "var(--text-main)", fontFamily: "'Space Grotesk', sans-serif" }}>
            Level {level}
          </span>
        </div>
        <span style={{ fontSize: "0.75rem", color: "var(--text-sub)", fontWeight: 600 }}>
          {xp.toLocaleString()} / {levelCeil.toLocaleString()} XP
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
      <p style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: 5, textAlign: "right" }}>
        {Math.max(0, levelCeil - xp)} XP to Level {level + 1}
      </p>
    </div>
  );
}

// ── 7-day streak indicator ────────────────────────────────────────────────────
function StreakBar({ streak }: { streak: number }) {
  const labels = ["M", "T", "W", "T", "F", "S", "S"];
  const todayDow = new Date().getDay();
  const todayIdx = todayDow === 0 ? 6 : todayDow - 1;

  return (
    <div className="academy-card" style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Flame size={18} color="#f97316" />
          <span style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--text-main)", fontFamily: "'Space Grotesk', sans-serif" }}>
            {streak} Day Streak
          </span>
        </div>
        <span style={{ fontSize: "0.72rem", color: "var(--text-sub)" }}>Stay consistent to level up faster</span>
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
                  transition: "all 0.2s ease", fontWeight: 700,
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
        marginBottom: 12,
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
          {done ? "Activated today ✓" : "+5 💎 · Keeps your streak alive"}
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
            { label: "XP",   value: `+${xpEarned}`,   icon: <Zap size={14} />,  bg: "#eff6ff", color: "#2563eb" },
            { label: "GEMS", value: `+${gemsEarned}`,  icon: "💎",               bg: "#ede8ff", color: "#7c3aed" },
          ].map((r) => (
            <div key={r.label}
              style={{
                background: r.bg, borderRadius: 12, padding: "12px 18px",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              }}
            >
              <div style={{ color: r.color, display: "flex", alignItems: "center" }}>
                {typeof r.icon === "string" ? <span>{r.icon}</span> : r.icon}
              </div>
              <p style={{ fontWeight: 800, fontSize: "1rem", color: r.color }}>{r.value}</p>
              <p style={{ fontSize: "0.6rem", fontWeight: 700, color: r.color, opacity: 0.7, letterSpacing: "0.06em" }}>{r.label}</p>
            </div>
          ))}
        </div>
        <button className="btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={onContinue}>
          Continue Training
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}

// ── XP Pop Animation ────────────────────────────────────────────────────────
function XPPopAnimation({ amount, onDone }: { amount: number; onDone: () => void }) {
  const [visible, setVisible] = useState(true);
  const [pos, setPos] = useState({ y: 0, opacity: 1 });

  useEffect(() => {
    const t1 = setTimeout(() => setPos({ y: -60, opacity: 0 }), 50);
    const t2 = setTimeout(() => { setVisible(false); onDone(); }, 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: `translate(-50%, calc(-50% + ${pos.y}px))`,
        opacity: pos.opacity,
        transition: "transform 1.1s cubic-bezier(0.2, 0.8, 0.4, 1), opacity 1.1s ease",
        zIndex: 2000,
        pointerEvents: "none",
        background: "linear-gradient(135deg, #5b8cff, #7b5cff)",
        color: "white",
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 800,
        fontSize: "1.4rem",
        padding: "10px 22px",
        borderRadius: 99,
        boxShadow: "0 8px 32px rgba(91,140,255,0.45)",
        letterSpacing: "-0.01em",
        whiteSpace: "nowrap",
      }}
    >
      +{amount} XP ⚡
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Missions() {
  const { isAuthenticated, xp, streak, lastCheckin, isEnrolled, refetch, completeMission: localCompleteMission, doCheckIn: localCheckIn, unlockedSections } = useFDF();

  const [missionsData, setMissionsData] = useState<{ missions: any[]; completions: any[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [claimingId, setClaimingId] = useState<number | null>(null);
  const [checkingIn, setCheckingIn] = useState(false);

  const fetchMissions = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const userId = session.user.id;
    const [{ data: missions }, { data: completions }] = await Promise.all([
      supabase.from("missions").select("*").order("sort_order", { ascending: true }),
      supabase.from("mission_completions").select("*").eq("user_id", userId),
    ]);
    setMissionsData({ missions: missions ?? [], completions: completions ?? [] });
  };

  useEffect(() => {
    if (!isAuthenticated || !isEnrolled) return;
    setIsLoading(true);
    fetchMissions().finally(() => setIsLoading(false));
  }, [isAuthenticated, isEnrolled]);

  const checkIn = {
    mutate: async () => {
      setCheckingIn(true);
      try {
        localCheckIn();
        toast.success(`Checked in! +10 XP 🔥`);
        refetch();
      } finally {
        setCheckingIn(false);
      }
    },
    isPending: checkingIn,
  };

  const claimMission = {
    variables: { missionId: 0 } as { missionId: number },
    mutate: async (vars: { missionId: number }) => {
      claimMission.variables = vars;
      const mission = missionsData?.missions.find((m: any) => m.id === vars.missionId);
      if (!mission) return;
      setClaimingId(vars.missionId);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        await supabase.from("mission_completions").upsert({
          user_id: session.user.id,
          mission_id: vars.missionId,
          status: "claimed",
          claimed_at: new Date().toISOString(),
        }, { onConflict: "user_id,mission_id" });
        const xpEarned = mission.xp_reward ?? 50;
        const gemsEarned = mission.gems_reward ?? 10;
        localCompleteMission(vars.missionId, xpEarned, gemsEarned);
        setCompletionData({ xpEarned, gemsEarned, title: mission.title ?? "Mission" });
        setXpPop({ amount: xpEarned, key: Date.now() });
        refetch();
        await fetchMissions();
      } catch (e: any) {
        toast.error(e.message ?? "Failed to claim mission");
      } finally {
        setClaimingId(null);
      }
    },
    isPending: claimingId !== null,
  };

  const [completionData, setCompletionData] = useState<{ xpEarned: number; gemsEarned: number; title: string } | null>(null);
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set(["money"]));
  const [xpPop, setXpPop] = useState<{ amount: number; key: number } | null>(null);

  const toggleCategory = (key: string) => {
    setOpenCategories(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="page-container animate-fade-in">
        <div style={{ paddingTop: 40, textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>🎯</div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-main)", marginBottom: 8 }}>
            Missions Locked
          </h2>
          <p style={{ fontSize: "0.875rem", color: "var(--text-sub)", marginBottom: 24 }}>
            Sign in to access your training missions.
          </p>
          <Link href="/signin" className="btn-primary">
            Sign In to Continue
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  if (!isEnrolled) {
    return (
      <div className="page-container animate-fade-in">
        <div style={{ paddingTop: 40, textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>🔒</div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-main)", marginBottom: 8 }}>
            Complete Onboarding First
          </h2>
          <p style={{ fontSize: "0.875rem", color: "var(--text-sub)", marginBottom: 24 }}>
            Set up your FDF profile on the Home page to unlock missions.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="page-container">
        <div style={{ paddingTop: 24, display: "flex", flexDirection: "column", gap: 10 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton" style={{ height: 80, borderRadius: 18 }} />
          ))}
        </div>
      </div>
    );
  }

  const missions: any[] = missionsData?.missions ?? [];
  const completions: any[] = missionsData?.completions ?? [];
  const sortedMissions = [...missions].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  const claimedIds = new Set(
    completions.filter(c => c.status === "claimed").map(c => c.mission_id)
  );

  return (
    <div className="page-container animate-fade-in" style={{ position: "relative" }}>

      {/* ── XP Pop Animation ── */}
      {xpPop && (
        <XPPopAnimation
          key={xpPop.key}
          amount={xpPop.amount}
          onDone={() => setXpPop(null)}
        />
      )}

      {/* ── Header ── */}
      <div style={{ paddingTop: 20, paddingBottom: 16 }}>
        <h1
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "1.5rem", fontWeight: 800,
            color: "var(--text-main)", letterSpacing: "-0.02em", marginBottom: 4,
          }}
        >
          Missions
        </h1>
        <p style={{ fontSize: "0.875rem", color: "var(--text-sub)" }}>
          Complete missions to earn XP and build real skills.
        </p>
      </div>

      {/* ── XP Level Bar ── */}
      <XPBar xp={xp} />

      {/* ── Streak Bar ── */}
      <StreakBar streak={streak} />

      {/* ── Daily Activation ── */}
      <DailyActivation
        lastCheckin={lastCheckin}
        onCheckIn={() => checkIn.mutate()}
        loading={checkIn.isPending}
      />

      {/* ── Empty State ── */}
      {sortedMissions.length === 0 && (
        <div style={{
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(12px)",
          border: "1px solid var(--card-border)",
          borderRadius: 16,
          padding: "40px 24px",
          textAlign: "center",
          boxShadow: "var(--card-shadow)",
        }}>
          <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>🎯</div>
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.125rem", fontWeight: 700, color: "var(--text-main)", marginBottom: 8 }}>
            No missions available yet
          </h3>
          <p style={{ fontSize: "0.875rem", color: "var(--text-sub)", lineHeight: 1.6 }}>
            New missions are added regularly. Check back soon.
          </p>
        </div>
      )}

      {/* ── Mission Categories ── */}
      {CATEGORIES.map((cat) => {
        const catMissions = sortedMissions.filter(m => m.category === cat.key);
        if (catMissions.length === 0) return null;
        const isOpen = openCategories.has(cat.key);
        const completedCount = catMissions.filter(m => claimedIds.has(m.id)).length;

        return (
          <div key={cat.key} style={{ marginBottom: 12 }}>
            {/* Category Header */}
            <button
              onClick={() => toggleCategory(cat.key)}
              style={{
                width: "100%", display: "flex", alignItems: "center",
                justifyContent: "space-between", padding: "12px 16px",
                background: "rgba(255,255,255,0.85)",
                backdropFilter: "blur(12px)",
                border: "1px solid var(--card-border)",
                borderRadius: isOpen ? "14px 14px 0 0" : 14,
                cursor: "pointer",
                boxShadow: "var(--card-shadow)",
                transition: "border-radius 0.2s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 32, height: 32, borderRadius: 9,
                    background: cat.bg,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.9rem",
                  }}
                >
                  {cat.icon}
                </div>
                <div style={{ textAlign: "left" }}>
                  <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text-main)" }}>
                    {cat.label}
                  </p>
                  <p style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>
                    {completedCount}/{catMissions.length} completed
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {completedCount === catMissions.length && catMissions.length > 0 && (
                  <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#16a34a", background: "#dcfce7", padding: "2px 8px", borderRadius: 99 }}>
                    DONE
                  </span>
                )}
                <span style={{ color: "var(--text-muted)", fontSize: "0.75rem", transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s ease" }}>
                  ▾
                </span>
              </div>
            </button>

            {/* Mission Cards */}
            {isOpen && (
              <div
                style={{
                  background: "rgba(248,250,255,0.9)",
                  border: "1px solid var(--card-border)",
                  borderTop: "none",
                  borderRadius: "0 0 14px 14px",
                  overflow: "hidden",
                }}
              >
                {catMissions.map((mission, idx) => {
                  const globalIdx = sortedMissions.findIndex(m => m.id === mission.id);
                  const isClaimed = claimedIds.has(mission.id);
                  const isLocked = globalIdx > 0 && !claimedIds.has(sortedMissions[globalIdx - 1].id);
                  const isPending = claimingId === mission.id;

                  return (
                    <div
                      key={mission.id}
                      style={{
                        display: "flex", alignItems: "center", gap: 14,
                        padding: "14px 16px",
                        borderBottom: idx < catMissions.length - 1 ? "1px solid rgba(91,140,255,0.07)" : "none",
                        opacity: isLocked ? 0.5 : 1,
                        transition: "opacity 0.2s ease",
                      }}
                    >
                      {/* Icon */}
                      <div
                        style={{
                          width: 44, height: 44, borderRadius: 12,
                          background: isClaimed ? "#dcfce7" : isLocked ? "rgba(226,232,240,0.5)" : cat.bg,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "1.2rem", flexShrink: 0,
                        }}
                      >
                        {isClaimed ? "✅" : isLocked ? "🔒" : (mission.icon_emoji ?? mission.iconEmoji ?? "🎯")}
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 700, fontSize: "0.875rem", color: isClaimed ? "#16a34a" : isLocked ? "var(--text-muted)" : "var(--text-main)", marginBottom: 3 }}>
                          {mission.title}
                        </p>
                        <p style={{ fontSize: "0.75rem", color: "var(--text-sub)", lineHeight: 1.5, marginBottom: 6 }}>
                          {mission.description}
                        </p>
                        <div style={{ display: "flex", gap: 6 }}>
                          <span className="badge-pill blue" style={{ fontSize: "0.65rem" }}>
                            +{mission.xp_reward ?? mission.xpReward ?? 50} XP
                          </span>
                          <span className="badge-pill purple" style={{ fontSize: "0.65rem" }}>
                            +{mission.gems_reward ?? mission.gemsReward ?? 10} 💎
                          </span>
                        </div>
                      </div>

                      {/* Action */}
                      <div style={{ flexShrink: 0 }}>
                        {isClaimed ? (
                          <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#16a34a", fontSize: "0.75rem", fontWeight: 700 }}>
                            <CheckCircle2 size={16} />
                          </div>
                        ) : isLocked ? (
                          <Lock size={16} style={{ color: "var(--text-muted)" }} />
                        ) : (
                          <button
                            className="btn-primary"
                            style={{ padding: "8px 14px", fontSize: "0.78rem" }}
                            disabled={isPending}
                            onClick={() => claimMission.mutate({ missionId: mission.id as number })}
                          >
                            {isPending ? "…" : "Start"}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* Completion Overlay */}
      {completionData && (
        <CompletionOverlay
          xpEarned={completionData.xpEarned}
          gemsEarned={completionData.gemsEarned}
          title={completionData.title}
          onContinue={() => setCompletionData(null)}
        />
      )}
    </div>
  );
}
