import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";
import { useFDF, RANK_META, getLevelInfo, DNA_LEVEL_META } from "@/contexts/FDFContext";
import {
  Target,
  Trophy,
  Zap,
  Lock,
  ChevronRight,
  Shield,
  Star,
  Flame,
  BookOpen,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const DAWG_CLASSES = [
  { id: "builder", label: "Builder Dawg",  icon: "🏗️", desc: "Build products, services & businesses", color: "#f59e0b", bg: "#fef3c7" },
  { id: "creator", label: "Creator Dawg",  icon: "🎨", desc: "Create content, art & digital media",   color: "#8b5cf6", bg: "#ede9fe" },
  { id: "tech",    label: "Tech Dawg",     icon: "⚙️", desc: "Code, engineer & build with technology", color: "#3b82f6", bg: "#eff6ff" },
  { id: "money",   label: "Money Dawg",    icon: "💰", desc: "Invest, trade & grow financial wealth",  color: "#10b981", bg: "#d1fae5" },
];

const TRAINING_PATH = [
  { step: 1, label: "Entry",       desc: "Account created",              status: "completed" },
  { step: 2, label: "Training",    desc: "100 XP + 3 missions",          status: "active"    },
  { step: 3, label: "Development", desc: "300 XP + 8 missions + streak", status: "locked"    },
  { step: 4, label: "Vault Access","desc": "Age 18 — aspirational",      status: "locked"    },
];

export default function Home() {
  const { xp, gems, streak, missionsCompleted, lastCheckin, rankId, level, levelPct, isEnrolled, isLoading, refetch, dnaScore, dnaLevel, disciplineScore, consistencyScore, intelligenceScore, isAuthenticated } = useFDF();



  const handleCheckIn = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const today2 = new Date().toISOString().split("T")[0];
      await supabase.from("fdf_users")
        .update({ last_checkin: today2, streak_days: streak + 1, gems: gems + 5 })
        .eq("auth_user_id", session.user.id);
      toast.success(`Day ${streak + 1} streak! +5 💎`);
      refetch();
    } catch (e: any) {
      toast.error(e.message ?? "Check-in failed");
    }
  };

  const today = new Date().toISOString().split("T")[0];
  const checkedInToday = lastCheckin === today;
  const rankMeta = RANK_META[rankId];

  // ── Not authenticated ──────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="page-container animate-fade-in">
        {/* Hero */}
        <div style={{ paddingTop: 32, paddingBottom: 24 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "var(--primary-light)",
              color: "var(--primary-dark)",
              fontSize: "0.7rem",
              fontWeight: 700,
              padding: "4px 12px",
              borderRadius: 99,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            <Star size={10} />
            Free · Ages 13–17 · Sponsor-Funded
          </div>

          <h1
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(1.75rem, 6vw, 2.25rem)",
              fontWeight: 800,
              color: "var(--text-main)",
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              marginBottom: 10,
            }}
          >
            Future Dawgs<br />
            <span className="text-gradient">Foundation</span>
          </h1>

          <p
            style={{
              fontSize: "0.9375rem",
              color: "var(--text-sub)",
              lineHeight: 1.6,
              marginBottom: 16,
              maxWidth: 340,
            }}
          >
            Start early. Build real financial intelligence.
          </p>

          {/* Trust line */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginBottom: 24,
            }}
          >
            {["✔ 100% Free", "✔ Ages 13–17", "✔ Sponsor-Funded"].map((t) => (
              <span
                key={t}
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "#16a34a",
                  background: "#dcfce7",
                  padding: "4px 10px",
                  borderRadius: 99,
                  letterSpacing: "0.01em",
                }}
              >
                {t}
              </span>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 320 }}>
            <Link href="/signup" className="btn-primary" style={{ justifyContent: "center" }}>
              Create Free Account
              <ArrowRight size={16} />
            </Link>
            <Link href="/signin" className="btn-secondary" style={{ justifyContent: "center" }}>
              Sign In
            </Link>
            <Link href="/parents" style={{ textAlign: "center", fontSize: "0.8rem", color: "var(--text-muted)", textDecoration: "none", marginTop: 4 }}>
              Parent Information →
            </Link>
          </div>

          <p
            style={{
              marginTop: 14,
              fontSize: "0.72rem",
              color: "var(--text-muted)",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Shield size={11} />
            No purchases · No ads · 100% Free
          </p>
        </div>

        {/* Feature Cards */}
        <p className="section-title">What you'll build</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
          {[
            { icon: "💡", title: "Real Money Skills",     desc: "Saving, investing, building income — not theory.",          color: "#f59e0b", bg: "#fef3c7" },
            { icon: "🏆", title: "XP & Rank System",      desc: "Complete missions, earn XP, climb the ranks.",              color: "#5b8cff", bg: "#e8efff" },
            { icon: "🔓", title: "Vault Access at 18",    desc: "Graduate into the full CrypDawgs Vault.",                   color: "#7b5cff", bg: "#ede8ff" },
            { icon: "🧠", title: "Mindset Training",      desc: "Build the habits and thinking of successful entrepreneurs.", color: "#10b981", bg: "#d1fae5" },
          ].map((f) => (
            <div key={f.title} className="academy-card" style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: f.bg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.25rem", flexShrink: 0,
                }}
              >
                {f.icon}
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-main)", marginBottom: 2 }}>
                  {f.title}
                </p>
                <p style={{ fontSize: "0.8125rem", color: "var(--text-sub)" }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="page-container">
        <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingTop: 24 }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton" style={{ height: 80, borderRadius: 18 }} />
          ))}
        </div>
      </div>
    );
  }



  // ── Dashboard (enrolled) ───────────────────────────────────────────────────
  return (
    <div className="page-container animate-fade-in">

      {/* ── Welcome Header ── */}
      <div style={{ paddingTop: 20, paddingBottom: 16 }}>
        <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>
          Welcome back
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <h1
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "1.5rem", fontWeight: 800,
              color: "var(--text-main)", letterSpacing: "-0.02em",
            }}
          >
            {"Dawg"}
          </h1>
          {/* Rank badge */}
          <div
            style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              background: `linear-gradient(135deg, ${rankMeta.gradientFrom}, ${rankMeta.gradientTo})`,
              color: "white",
              fontSize: "0.7rem", fontWeight: 800,
              padding: "5px 12px", borderRadius: 99,
              letterSpacing: "0.04em", textTransform: "uppercase",
              boxShadow: `0 4px 12px ${rankMeta.gradientFrom}44`,
            }}
          >
            <span style={{ fontSize: "0.85rem" }}>{rankMeta.emoji}</span>
            {rankMeta.label}
          </div>
        </div>

        {/* XP progress bar */}
        <div style={{ marginBottom: 6 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--primary)" }}>Level {level}</span>
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{xp.toLocaleString()} / {getLevelInfo(xp).levelCeil.toLocaleString()} XP</span>
          </div>
          <div className="progress-track" style={{ height: 8 }}>
            <div
              className="progress-fill"
              style={{ width: `${levelPct}%`, transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)", boxShadow: "0 0 8px rgba(91,140,255,0.4)" }}
            />
          </div>
        </div>

        {/* Daily streak line */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Flame size={13} style={{ color: streak > 0 ? "#f97316" : "var(--text-muted)" }} />
          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: streak > 0 ? "#f97316" : "var(--text-muted)" }}>
            Daily Streak: {streak} day{streak !== 1 ? "s" : ""}
          </span>
          {streak >= 3 && <span style={{ fontSize: "0.7rem" }}>🔥</span>}
        </div>
      </div>

      {/* ── Continue Mission CTA ── */}
      <Link href="/missions" style={{ textDecoration: "none" }}>
        <div
          style={{
            marginBottom: 12,
            background: "linear-gradient(135deg, var(--primary), var(--accent))",
            borderRadius: 18,
            padding: "16px 18px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            boxShadow: "0 8px 24px rgba(91,140,255,0.3)",
            cursor: "pointer",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem" }}>
              🎯
            </div>
            <div>
              <p style={{ fontWeight: 800, fontSize: "0.9375rem", color: "white", marginBottom: 2, fontFamily: "'Space Grotesk', sans-serif" }}>
                Continue Training
              </p>
              <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.8)" }}>
                {missionsCompleted} mission{missionsCompleted !== 1 ? "s" : ""} completed · Earn more XP
              </p>
            </div>
          </div>
          <ArrowRight size={20} style={{ color: "white", flexShrink: 0 }} />
        </div>
      </Link>

      {/* ── Daily Activation Card ── */}
      <div
        className="academy-card"
        style={{
          marginBottom: 12,
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
          background: checkedInToday
            ? "linear-gradient(135deg, rgba(16,185,129,0.06), rgba(5,150,105,0.04))"
            : "linear-gradient(135deg, rgba(91,140,255,0.06), rgba(123,92,255,0.04))",
          border: checkedInToday ? "1.5px solid rgba(16,185,129,0.25)" : "1.5px solid rgba(91,140,255,0.15)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 44, height: 44, borderRadius: 12,
              background: checkedInToday ? "#dcfce7" : "var(--primary-light)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.3rem", flexShrink: 0,
            }}
          >
            {checkedInToday ? "✅" : "📅"}
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-main)", marginBottom: 2 }}>
              Daily Activation
            </p>
            <p style={{ fontSize: "0.75rem", color: "var(--text-sub)" }}>
              {checkedInToday
                ? `Streak: ${streak} day${streak !== 1 ? "s" : ""} 🔥`
                : `+5 💎 · Current streak: ${streak} day${streak !== 1 ? "s" : ""}`}
            </p>
          </div>
        </div>
        {!checkedInToday ? (
          <button
            className="btn-primary"
            style={{ padding: "8px 16px", fontSize: "0.8125rem", flexShrink: 0 }}
            onClick={handleCheckIn}
            disabled={checkedInToday}
          >
            {checkedInToday ? "Done ✓" : "Check In"}
          </button>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#16a34a", fontSize: "0.8rem", fontWeight: 700, flexShrink: 0 }}>
            <CheckCircle2 size={16} />
            Done
          </div>
        )}
      </div>

      {/* ── DNA Score Widget ── */}
      <Link href="/dna" style={{ textDecoration: "none" }}>
        <div
          className="academy-card"
          style={{
            marginBottom: 12, cursor: "pointer",
            background: `linear-gradient(135deg, ${DNA_LEVEL_META[dnaLevel].gradientFrom}12, ${DNA_LEVEL_META[dnaLevel].gradientTo}08)`,
            border: `1.5px solid ${DNA_LEVEL_META[dnaLevel].color}28`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: `linear-gradient(135deg, ${DNA_LEVEL_META[dnaLevel].gradientFrom}, ${DNA_LEVEL_META[dnaLevel].gradientTo})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.1rem",
                  boxShadow: `0 4px 10px ${DNA_LEVEL_META[dnaLevel].color}30`,
                }}
              >
                🧬
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text-main)" }}>Financial DNA</p>
                <p style={{ fontSize: "0.72rem", color: DNA_LEVEL_META[dnaLevel].color, fontWeight: 700 }}>
                  {DNA_LEVEL_META[dnaLevel].emoji} {dnaLevel} Level
                </p>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 900, fontSize: "1.375rem",
                background: `linear-gradient(135deg, ${DNA_LEVEL_META[dnaLevel].gradientFrom}, ${DNA_LEVEL_META[dnaLevel].gradientTo})`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                {dnaScore}
              </div>
              <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontWeight: 600 }}>DNA Score</div>
            </div>
          </div>
          {/* Trait mini-bars */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
            {[
              { label: "Discipline",   score: disciplineScore,   color: "#7c3aed" },
              { label: "Consistency",  score: consistencyScore,  color: "#3b82f6" },
              { label: "Intelligence", score: intelligenceScore, color: "#10b981" },
            ].map(t => (
              <div key={t.label}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", fontWeight: 600 }}>{t.label.slice(0,4)}</span>
                  <span style={{ fontSize: "0.6rem", color: t.color, fontWeight: 700 }}>{t.score}</span>
                </div>
                <div style={{ height: 4, borderRadius: 99, background: "rgba(0,0,0,0.06)", overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 99, background: t.color, width: `${Math.min(100, t.score)}%`, transition: "width 0.8s ease" }} />
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: 8, fontStyle: "italic" }}>
            Your DNA is evolving daily →
          </p>
        </div>
      </Link>

      {/* ── Missions Preview Card ── */}
      <Link href="/missions" style={{ textDecoration: "none" }}>
        <div
          className="academy-card"
          style={{
            marginBottom: 12, cursor: "pointer",
            background: "linear-gradient(135deg, rgba(91,140,255,0.06), rgba(123,92,255,0.04))",
            border: "1.5px solid rgba(91,140,255,0.15)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Target size={18} style={{ color: "var(--primary)" }} />
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text-main)" }}>Missions</p>
                <p style={{ fontSize: "0.72rem", color: "var(--text-sub)" }}>
                  {missionsCompleted} completed
                </p>
              </div>
            </div>
            <ChevronRight size={16} style={{ color: "var(--text-muted)" }} />
          </div>
          {/* Mini progress bar */}
          <div className="progress-track" style={{ height: 5 }}>
            <div
              className="progress-fill"
              style={{ width: `${Math.min(100, (missionsCompleted / 8) * 100)}%` }}
            />
          </div>
          <p style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: 5 }}>
            {Math.max(0, 8 - missionsCompleted)} missions to Development rank
          </p>
        </div>
      </Link>

      {/* ── Rank Progress Card ── */}
      <Link href="/ranks" style={{ textDecoration: "none" }}>
        <div
          className="academy-card"
          style={{
            marginBottom: 12, cursor: "pointer",
            border: `1.5px solid ${rankMeta.color}28`,
            background: "rgba(255,255,255,0.95)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: `linear-gradient(135deg, ${rankMeta.gradientFrom}, ${rankMeta.gradientTo})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <Trophy size={18} style={{ color: "white" }} />
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text-main)" }}>
                  {rankMeta.label} Rank
                </p>
                <p style={{ fontSize: "0.72rem", color: "var(--text-sub)" }}>
                  Level {level} · {xp.toLocaleString()} XP
                </p>
              </div>
            </div>
            <ChevronRight size={16} style={{ color: "var(--text-muted)" }} />
          </div>
          <div className="progress-track" style={{ height: 5 }}>
            <div
              style={{
                height: "100%", borderRadius: 99,
                background: `linear-gradient(90deg, ${rankMeta.gradientFrom}, ${rankMeta.gradientTo})`,
                width: `${levelPct}%`,
                transition: "width 0.6s ease",
              }}
            />
          </div>
          <p style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: 5 }}>
            {levelPct}% to Level {level + 1}
          </p>
        </div>
      </Link>

      {/* ── Training Path Card ── */}
      <div className="academy-card" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text-main)" }}>Training Path</p>
          <Link href="/ranks" style={{ fontSize: "0.72rem", color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}>
            View all →
          </Link>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {TRAINING_PATH.map((step, i) => {
            const rankOrder = ["entry", "training", "development", "vault"];
            const currentRankIdx = rankOrder.indexOf(rankId);
            const stepStatus = i < currentRankIdx ? "completed" : i === currentRankIdx ? "active" : "locked";

            return (
              <div key={step.step}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 32, height: 32, borderRadius: "50%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.7rem", fontWeight: 700, flexShrink: 0,
                      background: stepStatus === "active"
                        ? "linear-gradient(135deg, var(--primary), var(--accent))"
                        : stepStatus === "completed"
                          ? "#dcfce7"
                          : "rgba(148,163,184,0.12)",
                      color: stepStatus === "active"
                        ? "white"
                        : stepStatus === "completed"
                          ? "#16a34a"
                          : "var(--text-muted)",
                      border: stepStatus === "active"
                        ? "none"
                        : stepStatus === "completed"
                          ? "1.5px solid #22c55e"
                          : "1.5px solid rgba(148,163,184,0.3)",
                      boxShadow: stepStatus === "active" ? "0 4px 12px rgba(91,140,255,0.35)" : "none",
                    }}
                  >
                    {stepStatus === "completed" ? "✓" : step.step}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontWeight: stepStatus === "active" ? 700 : 600,
                        fontSize: "0.8125rem",
                        color: stepStatus === "locked" ? "var(--text-muted)" : "var(--text-main)",
                        marginBottom: 1,
                      }}
                    >
                      {step.label}
                      {stepStatus === "active" && (
                        <span
                          style={{
                            marginLeft: 6, fontSize: "0.6rem", fontWeight: 700,
                            background: "var(--primary-light)", color: "var(--primary-dark)",
                            padding: "2px 6px", borderRadius: 99, letterSpacing: "0.04em",
                          }}
                        >
                          CURRENT
                        </span>
                      )}
                    </p>
                    <p style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{step.desc}</p>
                  </div>
                  {stepStatus === "locked" && <Lock size={13} style={{ color: "var(--text-muted)", flexShrink: 0 }} />}
                </div>
                {i < TRAINING_PATH.length - 1 && (
                  <div style={{ width: 2, height: 16, marginLeft: 15, background: "rgba(91,140,255,0.15)" }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Quick Stats ── */}
      <div
        style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
          gap: 8, marginBottom: 24,
        }}
      >
        {[
          { label: "XP",       value: xp.toLocaleString(),       icon: <Zap size={14} />,   color: "var(--primary)",  bg: "var(--primary-light)" },
          { label: "Streak",   value: `${streak}d`,               icon: <Flame size={14} />, color: "#f97316",         bg: "#fff7ed" },
          { label: "Gems",     value: gems.toLocaleString(),      icon: "💎",                color: "var(--accent)",   bg: "var(--accent-light)" },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              background: stat.bg, borderRadius: 14, padding: "12px 10px",
              textAlign: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, color: stat.color, marginBottom: 4 }}>
              {typeof stat.icon === "string" ? <span style={{ fontSize: "0.875rem" }}>{stat.icon}</span> : stat.icon}
            </div>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: "1.1rem", color: stat.color, letterSpacing: "-0.02em", lineHeight: 1 }}>
              {stat.value}
            </p>
            <p style={{ fontSize: "0.62rem", fontWeight: 700, color: stat.color, opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.04em", marginTop: 2 }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* ── Vault Progress Card ── */}
      <Link href="/graduation" style={{ textDecoration: "none" }}>
        <div
          className="academy-card"
          style={{
            marginBottom: 24, cursor: "pointer",
            background: "linear-gradient(135deg, rgba(123,92,255,0.06), rgba(91,140,255,0.04))",
            border: "1.5px solid rgba(123,92,255,0.18)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #7b5cff, #5b8cff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem" }}>
                🔐
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text-main)" }}>Vault Progress</p>
                <p style={{ fontSize: "0.72rem", color: "var(--text-sub)" }}>DNA 500 required to graduate</p>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#7b5cff" }}>
                {Math.min(100, Math.round((dnaScore / 500) * 100))}%
              </span>
            </div>
          </div>
          <div className="progress-track" style={{ height: 6 }}>
            <div
              style={{
                height: "100%", borderRadius: 99,
                background: "linear-gradient(90deg, #7b5cff, #5b8cff)",
                width: `${Math.min(100, Math.round((dnaScore / 500) * 100))}%`,
                transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)",
                boxShadow: "0 0 8px rgba(123,92,255,0.4)",
              }}
            />
          </div>
          <p style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: 5 }}>
            {dnaScore >= 500 ? "✅ Eligible to graduate" : `${500 - dnaScore} DNA points to unlock Vault`}
          </p>
        </div>
      </Link>

      {/* ── Footer ── */}
      <div
        style={{
          borderTop: "1px solid rgba(91,140,255,0.1)",
          paddingTop: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        {["Privacy Policy", "Terms", "Safety", "Parents"].map((label) => (
          <Link
            key={label}
            href={label === "Parents" ? "/parents" : "#"}
            style={{
              fontSize: "0.7rem", color: "var(--text-muted)",
              textDecoration: "none", fontWeight: 600, letterSpacing: "0.02em",
            }}
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
