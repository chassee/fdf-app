import { useMemo, useRef, useEffect, useState } from "react";
import { useFDF, DNA_LEVEL_META, computeDNAScore, computeDNALevel } from "@/contexts/FDFContext";
import { useLocation } from "wouter";

// ─── Animated Counter ────────────────────────────────────────────────────────
function AnimatedNumber({ value, duration = 1200 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const prev = useRef(0);
  useEffect(() => {
    const start = prev.current;
    const diff = value - start;
    if (diff === 0) return;
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplay(Math.round(start + diff * eased));
      if (progress < 1) requestAnimationFrame(tick);
      else prev.current = value;
    };
    requestAnimationFrame(tick);
  }, [value, duration]);
  return <>{display}</>;
}

// ─── Trait Bar ───────────────────────────────────────────────────────────────
function TraitBar({
  label,
  score,
  color,
  gradientFrom,
  gradientTo,
  description,
  icon,
  delay = 0,
}: {
  label: string;
  score: number;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  description: string;
  icon: string;
  delay?: number;
}) {
  const [animated, setAnimated] = useState(false);
  const displayScore = Math.min(score, 100);
  const pct = displayScore;

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.9)",
        borderRadius: 16,
        padding: "18px 20px",
        border: "1.5px solid rgba(0,0,0,0.06)",
        boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: "1.375rem" }}>{icon}</span>
          <div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "0.9375rem", color: "#0f172a" }}>
              {label}
            </div>
            <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: 1 }}>{description}</div>
          </div>
        </div>
        <div
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 800,
            fontSize: "1.125rem",
            color,
          }}
        >
          {score}
        </div>
      </div>

      {/* Bar track */}
      <div
        style={{
          height: 8,
          borderRadius: 99,
          background: "rgba(0,0,0,0.06)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            borderRadius: 99,
            background: `linear-gradient(90deg, ${gradientFrom}, ${gradientTo})`,
            width: animated ? `${pct}%` : "0%",
            transition: "width 1s cubic-bezier(0.34, 1.56, 0.64, 1)",
            boxShadow: `0 0 8px ${gradientTo}60`,
          }}
        />
      </div>

      {/* Milestone markers */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
        {[25, 50, 75, 100].map(m => (
          <span
            key={m}
            style={{
              fontSize: "0.65rem",
              color: score >= m ? color : "#cbd5e1",
              fontWeight: score >= m ? 700 : 400,
              transition: "color 0.4s",
            }}
          >
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── DNA Helix Decoration ────────────────────────────────────────────────────
function DNAHelix({ color }: { color: string }) {
  return (
    <svg width="40" height="80" viewBox="0 0 40 80" fill="none" style={{ opacity: 0.15 }}>
      {[0, 10, 20, 30, 40, 50, 60, 70].map((y, i) => (
        <ellipse
          key={i}
          cx={i % 2 === 0 ? 10 : 30}
          cy={y + 5}
          rx={8}
          ry={3}
          fill={color}
        />
      ))}
      <line x1="10" y1="5" x2="30" y2="75" stroke={color} strokeWidth="1.5" strokeDasharray="3 3" />
      <line x1="30" y1="5" x2="10" y2="75" stroke={color} strokeWidth="1.5" strokeDasharray="3 3" />
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function DNA() {
  const { dnaScore, dnaLevel, consistencyScore, disciplineScore, intelligenceScore, xp, streak, isEnrolled } = useFDF();
  const [, navigate] = useLocation();

  const meta = DNA_LEVEL_META[dnaLevel];
  const nextLevel = dnaLevel === "Seed" ? "Growth" : dnaLevel === "Growth" ? "Builder" : dnaLevel === "Builder" ? "Operator" : dnaLevel === "Operator" ? "Elite" : null;
  const nextMeta = nextLevel ? DNA_LEVEL_META[nextLevel] : null;
  const progressToNext = nextMeta
    ? Math.min(100, Math.round(((dnaScore - meta.minScore) / (meta.maxScore - meta.minScore + 1)) * 100))
    : 100;

  // Total trait score (for overall "strength" display)
  const totalTraits = consistencyScore + disciplineScore + intelligenceScore;

  if (!isEnrolled) {
    return (
      <div
        style={{
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          background: "var(--bg-main)",
          textAlign: "center",
          gap: 16,
        }}
      >
        <div style={{ fontSize: "3rem" }}>🧬</div>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: "1.5rem", color: "#0f172a" }}>
          DNA Locked
        </h2>
        <p style={{ fontSize: "0.9rem", color: "#64748b", maxWidth: 280 }}>
          Complete your enrollment and start your first mission to begin forming your financial DNA.
        </p>
        <button
          onClick={() => navigate("/missions")}
          style={{
            padding: "12px 28px",
            borderRadius: 12,
            background: "linear-gradient(135deg, #5b8cff, #7c3aed)",
            color: "white",
            fontWeight: 700,
            fontSize: "0.9rem",
            border: "none",
            cursor: "pointer",
          }}
        >
          Start Training
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "var(--bg-main)",
        paddingBottom: 100,
      }}
    >
      {/* ── Hero Section ─────────────────────────────────────────────────── */}
      <div
        style={{
          background: `linear-gradient(160deg, ${meta.gradientFrom}22, ${meta.gradientTo}11)`,
          borderBottom: `1px solid ${meta.color}20`,
          padding: "32px 20px 28px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background helix decorations */}
        <div style={{ position: "absolute", top: 10, right: 16, opacity: 0.6 }}>
          <DNAHelix color={meta.color} />
        </div>
        <div style={{ position: "absolute", top: 20, left: 8, opacity: 0.4, transform: "scaleX(-1)" }}>
          <DNAHelix color={meta.color} />
        </div>

        {/* DNA Level Badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, position: "relative" }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              background: `linear-gradient(135deg, ${meta.gradientFrom}, ${meta.gradientTo})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.75rem",
              boxShadow: `0 8px 24px ${meta.color}40`,
              flexShrink: 0,
            }}
          >
            {meta.emoji}
          </div>
          <div>
            <div style={{ fontSize: "0.7rem", fontWeight: 700, color: meta.color, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              DNA Level
            </div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: "1.375rem", color: "#0f172a", lineHeight: 1.2 }}>
              {dnaLevel}
            </div>
          </div>
        </div>

        {/* DNA Score — large display */}
        <div style={{ position: "relative", marginBottom: 20 }}>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#64748b", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>
            Financial DNA Score
          </div>
          <div
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 900,
              fontSize: "4rem",
              lineHeight: 1,
              background: `linear-gradient(135deg, ${meta.gradientFrom}, ${meta.gradientTo})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.03em",
            }}
          >
            <AnimatedNumber value={dnaScore} />
          </div>
          <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: 6, fontStyle: "italic" }}>
            {meta.tagline}
          </div>
        </div>

        {/* Progress to next level */}
        {nextLevel && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 600 }}>
                Progress to {nextMeta?.emoji} {nextLevel}
              </span>
              <span style={{ fontSize: "0.72rem", color: meta.color, fontWeight: 700 }}>
                {dnaScore} / {meta.maxScore + 1}
              </span>
            </div>
            <div style={{ height: 6, borderRadius: 99, background: "rgba(0,0,0,0.08)", overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  borderRadius: 99,
                  background: `linear-gradient(90deg, ${meta.gradientFrom}, ${meta.gradientTo})`,
                  width: `${progressToNext}%`,
                  transition: "width 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  boxShadow: `0 0 8px ${meta.color}60`,
                }}
              />
            </div>
          </div>
        )}
        {!nextLevel && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: `${meta.color}15`,
              border: `1px solid ${meta.color}30`,
              borderRadius: 99,
              padding: "6px 14px",
              fontSize: "0.8rem",
              fontWeight: 700,
              color: meta.color,
            }}
          >
            🏆 Maximum DNA Level Achieved
          </div>
        )}
      </div>

      {/* ── Stats Row ────────────────────────────────────────────────────── */}
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {[
            { label: "XP Earned", value: xp, icon: "⚡", color: "#5b8cff" },
            { label: "Day Streak", value: streak, icon: "🔥", color: "#f59e0b" },
            { label: "Trait Power", value: totalTraits, icon: "🧬", color: meta.color },
          ].map(stat => (
            <div
              key={stat.label}
              style={{
                background: "rgba(255,255,255,0.9)",
                borderRadius: 14,
                padding: "14px 12px",
                textAlign: "center",
                border: "1.5px solid rgba(0,0,0,0.06)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              <div style={{ fontSize: "1.25rem", marginBottom: 4 }}>{stat.icon}</div>
              <div
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 800,
                  fontSize: "1.375rem",
                  color: stat.color,
                  lineHeight: 1,
                }}
              >
                <AnimatedNumber value={stat.value} />
              </div>
              <div style={{ fontSize: "0.65rem", color: "#94a3b8", fontWeight: 600, marginTop: 3, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Trait Bars ───────────────────────────────────────────────────── */}
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ marginBottom: 14 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: "1.125rem", color: "#0f172a", marginBottom: 2 }}>
            Your Financial Traits
          </h2>
          <p style={{ fontSize: "0.8rem", color: "#64748b" }}>
            Every action shapes who you are becoming.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <TraitBar
            label="Discipline"
            score={disciplineScore}
            color="#7c3aed"
            gradientFrom="#a78bfa"
            gradientTo="#6d28d9"
            description="Completing missions consistently"
            icon="🎯"
            delay={100}
          />
          <TraitBar
            label="Consistency"
            score={consistencyScore}
            color="#3b82f6"
            gradientFrom="#60a5fa"
            gradientTo="#2563eb"
            description="Daily logins and check-ins"
            icon="📅"
            delay={250}
          />
          <TraitBar
            label="Intelligence"
            score={intelligenceScore}
            color="#10b981"
            gradientFrom="#34d399"
            gradientTo="#059669"
            description="Learning financial concepts"
            icon="🧠"
            delay={400}
          />
        </div>
      </div>

      {/* ── DNA Level Ladder ─────────────────────────────────────────────── */}
      <div style={{ padding: "24px 20px 0" }}>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: "1.125rem", color: "#0f172a", marginBottom: 14 }}>
          DNA Progression
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {(Object.entries(DNA_LEVEL_META) as [string, typeof DNA_LEVEL_META[keyof typeof DNA_LEVEL_META]][]).map(([lvl, m]) => {
            const isActive = lvl === dnaLevel;
            const isPast = m.maxScore < meta.minScore;
            const isFuture = m.minScore > dnaScore;
            return (
              <div
                key={lvl}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 16px",
                  borderRadius: 14,
                  background: isActive ? `${m.color}12` : "rgba(255,255,255,0.7)",
                  border: isActive ? `2px solid ${m.color}40` : "1.5px solid rgba(0,0,0,0.06)",
                  opacity: isFuture ? 0.5 : 1,
                  transition: "all 0.3s",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: isFuture
                      ? "rgba(0,0,0,0.06)"
                      : `linear-gradient(135deg, ${m.gradientFrom}, ${m.gradientTo})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.25rem",
                    flexShrink: 0,
                    boxShadow: isActive ? `0 4px 12px ${m.color}40` : "none",
                  }}
                >
                  {isFuture ? "🔒" : m.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "0.9375rem", color: isActive ? m.color : "#0f172a" }}>
                      {lvl}
                    </span>
                    {isActive && (
                      <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "white", background: m.color, borderRadius: 99, padding: "2px 8px", letterSpacing: "0.04em" }}>
                        CURRENT
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: 1 }}>
                    {m.minScore}–{m.maxScore === 9999 ? "∞" : m.maxScore} DNA Score
                  </div>
                </div>
                {(isPast || isActive) && !isFuture && (
                  <div style={{ color: m.color, fontSize: "1rem" }}>✓</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Footer Tagline ───────────────────────────────────────────────── */}
      <div
        style={{
          margin: "24px 20px 0",
          padding: "18px 20px",
          borderRadius: 16,
          background: `linear-gradient(135deg, ${meta.gradientFrom}18, ${meta.gradientTo}10)`,
          border: `1px solid ${meta.color}20`,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "1.5rem", marginBottom: 8 }}>🧬</div>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "0.9375rem", color: "#0f172a", marginBottom: 4 }}>
          Your financial behavior is evolving daily.
        </p>
        <p style={{ fontSize: "0.8rem", color: "#64748b" }}>
          Every mission completed. Every day logged. Every decision made.
          <br />It all writes your DNA.
        </p>
      </div>

      <style>{`
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
