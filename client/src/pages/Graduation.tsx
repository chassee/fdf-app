import { Link } from "wouter";
import { useState } from "react";
import { ArrowRight, CheckCircle2, Lock, Shield, ExternalLink } from "lucide-react";
import { useFDF, UNLOCK_XP } from "@/contexts/FDFContext";

// ── Graduation requirements ──────────────────────────────────────────────────
const GRAD_REQUIREMENTS = [
  { key: "dna",      label: "DNA Score",         target: 500, icon: "🧬" },
  { key: "missions", label: "Missions Completed", target: 5,   icon: "🎯" },
  { key: "streak",   label: "Day Streak",         target: 3,   icon: "🔥" },
] as const;

// ── Graduated Lock Screen ────────────────────────────────────────────────────
function GraduatedScreen({ name, graduatedAt }: { name: string; graduatedAt: string | null }) {
  const formattedDate = graduatedAt
    ? new Date(graduatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : null;

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 20px",
        background: "linear-gradient(160deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%)",
        textAlign: "center",
      }}
    >
      {/* Seal */}
      <div
        style={{
          width: 96,
          height: 96,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #f59e0b, #d97706)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "2.5rem",
          marginBottom: 24,
          boxShadow: "0 0 40px rgba(245,158,11,0.4)",
        }}
      >
        🎓
      </div>

      <h1
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "1.75rem",
          fontWeight: 900,
          color: "#f8fafc",
          letterSpacing: "-0.03em",
          marginBottom: 8,
        }}
      >
        Graduated
      </h1>

      {name && (
        <p style={{ fontSize: "1rem", color: "#f59e0b", fontWeight: 700, marginBottom: 4 }}>
          {name}
        </p>
      )}

      {formattedDate && (
        <p style={{ fontSize: "0.8125rem", color: "#94a3b8", marginBottom: 24 }}>
          Graduated on {formattedDate}
        </p>
      )}

      <p
        style={{
          fontSize: "0.9375rem",
          color: "#cbd5e1",
          lineHeight: 1.7,
          maxWidth: 280,
          marginBottom: 8,
        }}
      >
        You've moved beyond the Foundation.
      </p>
      <p
        style={{
          fontSize: "0.875rem",
          color: "#64748b",
          lineHeight: 1.6,
          maxWidth: 260,
          marginBottom: 36,
        }}
      >
        Your journey continues inside the Vault.
      </p>

      <a
        href="https://vault.crypdawgs.com"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: "linear-gradient(135deg, #f59e0b, #d97706)",
          color: "#000",
          fontWeight: 800,
          fontSize: "0.9375rem",
          padding: "14px 28px",
          borderRadius: 14,
          textDecoration: "none",
          boxShadow: "0 4px 20px rgba(245,158,11,0.35)",
        }}
      >
        Go to Vault
        <ExternalLink size={16} />
      </a>

      <div
        style={{
          marginTop: 40,
          padding: "12px 20px",
          background: "rgba(255,255,255,0.04)",
          borderRadius: 10,
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <p style={{ fontSize: "0.75rem", color: "#475569", lineHeight: 1.5 }}>
          FDF access has been permanently closed.<br />
          This transition is irreversible.
        </p>
      </div>
    </div>
  );
}

// ── Graduation Ceremony Screen ────────────────────────────────────────────────
function GraduationReadyScreen({
  name,
  dnaScore,
  missionsCompleted,
  streak,
  onGraduate,
  isLoading,
}: {
  name: string;
  dnaScore: number;
  missionsCompleted: number;
  streak: number;
  onGraduate: () => void;
  isLoading: boolean;
}) {
  return (
    <div className="page-container animate-fade-in">
      {/* Hero */}
      <div
        style={{
          margin: "20px 0 20px",
          padding: "32px 24px",
          borderRadius: 20,
          background: "linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(251,191,36,0.06) 100%)",
          border: "1.5px solid rgba(245,158,11,0.3)",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "3rem", marginBottom: 16 }}>🎓</div>
        <h1
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "1.5rem",
            fontWeight: 900,
            color: "var(--text-main)",
            letterSpacing: "-0.03em",
            marginBottom: 8,
          }}
        >
          You're Ready to Graduate
        </h1>
        {name && (
          <p style={{ fontSize: "0.875rem", color: "#f59e0b", fontWeight: 700, marginBottom: 8 }}>
            {name}
          </p>
        )}
        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--text-sub)",
            lineHeight: 1.7,
            maxWidth: 280,
            margin: "0 auto 20px",
          }}
        >
          You've built the discipline, consistency, and intelligence required. The Vault is ready for you.
        </p>

        {/* Proof stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 24 }}>
          {[
            { label: "DNA Score", value: dnaScore, icon: "🧬", color: "#f59e0b" },
            { label: "Missions",  value: missionsCompleted, icon: "🎯", color: "var(--primary)" },
            { label: "Streak",    value: `${streak}d`, icon: "🔥", color: "#f97316" },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: "rgba(255,255,255,0.06)",
                borderRadius: 12,
                padding: "12px 8px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "1.1rem", marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: "1.1rem", fontWeight: 800, color: s.color, letterSpacing: "-0.02em" }}>
                {s.value}
              </div>
              <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onGraduate}
          disabled={isLoading}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: isLoading
              ? "rgba(245,158,11,0.4)"
              : "linear-gradient(135deg, #f59e0b, #d97706)",
            color: "#000",
            fontWeight: 800,
            fontSize: "1rem",
            padding: "14px 32px",
            borderRadius: 14,
            border: "none",
            cursor: isLoading ? "not-allowed" : "pointer",
            width: "100%",
            justifyContent: "center",
            boxShadow: isLoading ? "none" : "0 4px 20px rgba(245,158,11,0.35)",
            transition: "all 0.2s ease",
          }}
        >
          {isLoading ? "Entering Vault..." : "Enter the Vault"}
          {!isLoading && <ArrowRight size={18} />}
        </button>
      </div>

      {/* Warning */}
      <div
        style={{
          padding: "16px 18px",
          borderRadius: 14,
          background: "rgba(239,68,68,0.05)",
          border: "1px solid rgba(239,68,68,0.15)",
          marginBottom: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <Shield size={16} style={{ color: "#ef4444", flexShrink: 0, marginTop: 2 }} />
          <div>
            <p style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--text-main)", marginBottom: 4 }}>
              This is a permanent action
            </p>
            <p style={{ fontSize: "0.75rem", color: "var(--text-sub)", lineHeight: 1.6 }}>
              Once you enter the Vault, your FDF access will be permanently closed. Your progress snapshot will be stored and transferred.
            </p>
          </div>
        </div>
      </div>

      {/* What transfers */}
      <div
        className="academy-card"
        style={{
          background: "linear-gradient(135deg, rgba(16,185,129,0.05) 0%, rgba(5,150,105,0.05) 100%)",
          border: "1px solid rgba(16,185,129,0.15)",
          marginBottom: 20,
        }}
      >
        <p className="section-title" style={{ marginBottom: 12 }}>What Transfers to the Vault</p>
        {[
          "DNA Score snapshot",
          "All XP and rank status",
          "Mission completion history",
          "Dawg Class designation",
          "Streak and activity records",
        ].map((item) => (
          <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0" }}>
            <CheckCircle2 size={14} style={{ color: "#16a34a", flexShrink: 0 }} />
            <span style={{ fontSize: "0.8125rem", color: "var(--text-sub)" }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Graduation() {
  const {
    isAuthenticated,
    xp, streak, missionsCompleted, dnaScore, isLoading,
    unlockedSections, graduated, graduatedAt, graduate, isGraduationEligible,
    dob, isEnrolled,
  } = useFDF();

  const [graduating, setGraduating] = useState(false);
  const [graduateError, setGraduateError] = useState<string | null>(null);

  // ── Not authenticated ──────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="page-container animate-fade-in">
        <div style={{ paddingTop: 40, textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>🎓</div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-main)", marginBottom: 8 }}>
            Vault Access Locked
          </h2>
          <p style={{ fontSize: "0.875rem", color: "var(--text-sub)", marginBottom: 24 }}>
            Sign in to view your path to Vault access.
          </p>
          <Link href="/signin" className="btn-primary">
            Sign In to Continue
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="page-container">
        <div style={{ paddingTop: 24, display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="skeleton" style={{ height: 120, borderRadius: 18 }} />
          <div className="skeleton" style={{ height: 100, borderRadius: 18 }} />
          <div className="skeleton" style={{ height: 80, borderRadius: 18 }} />
        </div>
      </div>
    );
  }

  // ── GRADUATED: full account lock ──────────────────────────────────────────
  if (graduated) {
    return <GraduatedScreen name={""} graduatedAt={graduatedAt} />;
  }

  // ── XP-based vault unlock gate ────────────────────────────────────────────
  if (!unlockedSections.vault) {
    const needed = UNLOCK_XP.vault - xp;
    return (
      <div className="page-container animate-fade-in">
        <div style={{ paddingTop: 20, paddingBottom: 20 }}>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "var(--text-main)", letterSpacing: "-0.02em", marginBottom: 4 }}>
            Vault Graduation
          </h1>
        </div>
        <div
          className="academy-card"
          style={{
            textAlign: "center", padding: "40px 24px",
            background: "linear-gradient(135deg, rgba(123,92,255,0.05), rgba(91,140,255,0.04))",
            border: "1.5px solid rgba(123,92,255,0.2)",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: 16 }}>🔒</div>
          <p style={{ fontWeight: 800, fontSize: "1rem", color: "var(--text-main)", marginBottom: 6 }}>
            Vault Preview Unlocks at 500 XP
          </p>
          <p style={{ fontSize: "0.875rem", color: "var(--text-sub)", marginBottom: 20, lineHeight: 1.6 }}>
            Earn <strong style={{ color: "var(--accent)" }}>{needed} more XP</strong> to unlock your Vault graduation path.
          </p>
          <div style={{ background: "rgba(226,232,240,0.5)", borderRadius: 99, height: 8, overflow: "hidden", maxWidth: 240, margin: "0 auto 12px" }}>
            <div style={{ height: "100%", borderRadius: 99, background: "linear-gradient(90deg, #7b5cff, #5b8cff)", width: `${Math.min(100, Math.round((xp / UNLOCK_XP.vault) * 100))}%`, transition: "width 0.6s ease" }} />
          </div>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{xp} / {UNLOCK_XP.vault} XP</p>
        </div>
      </div>
    );
  }

  // ── GRADUATION READY ──────────────────────────────────────────────────────
  if (isGraduationEligible) {
    const handleGraduate = async () => {
      setGraduating(true);
      setGraduateError(null);
      try {
        await graduate();
      } catch (e: any) {
        setGraduateError(e?.message ?? "Something went wrong. Please try again.");
        setGraduating(false);
      }
    };

    return (
      <>
        <GraduationReadyScreen
          name={""}
          dnaScore={dnaScore}
          missionsCompleted={missionsCompleted}
          streak={streak}
          onGraduate={handleGraduate}
          isLoading={graduating}
        />
        {graduateError && (
          <div style={{ margin: "0 16px 16px", padding: "12px 16px", borderRadius: 12, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
            <p style={{ fontSize: "0.8125rem", color: "#ef4444" }}>{graduateError}</p>
          </div>
        )}
      </>
    );
  }

  // ── LOCKED: show progress toward graduation ───────────────────────────────
  const values: Record<string, number> = {
    dna:      dnaScore,
    missions: missionsCompleted,
    streak:   streak,
  };

  return (
    <div className="page-container animate-fade-in">

      {/* Header */}
      <div style={{ paddingTop: 20, paddingBottom: 20 }}>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "var(--text-main)", letterSpacing: "-0.02em", marginBottom: 4 }}>
          Vault Graduation
        </h1>
        <p style={{ fontSize: "0.875rem", color: "var(--text-sub)" }}>
          Meet all requirements to unlock your one-way transition to the Vault.
        </p>
      </div>

      {/* Vault Access Locked card */}
      <div
        className="academy-card"
        style={{
          marginBottom: 16,
          background: "linear-gradient(135deg, rgba(91,140,255,0.06) 0%, rgba(123,92,255,0.06) 100%)",
          border: "1.5px solid rgba(91,140,255,0.15)",
          textAlign: "center",
          padding: "28px 20px",
        }}
      >
        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 56, height: 56, borderRadius: 16, background: "rgba(91,140,255,0.1)", marginBottom: 12 }}>
          <Lock size={24} style={{ color: "var(--primary)" }} />
        </div>
        <p style={{ fontWeight: 800, fontSize: "1rem", color: "var(--text-main)", marginBottom: 6 }}>
          Vault Access Locked
        </p>
        <p style={{ fontSize: "0.8125rem", color: "var(--text-sub)", lineHeight: 1.6, maxWidth: 260, margin: "0 auto" }}>
          Complete all three requirements below to unlock your graduation ceremony.
        </p>
      </div>

      {/* Requirements */}
      <div className="academy-card" style={{ marginBottom: 16 }}>
        <p className="section-title" style={{ marginBottom: 16 }}>Graduation Requirements</p>
        {GRAD_REQUIREMENTS.map((req) => {
          const current = values[req.key] ?? 0;
          const pct = Math.min(100, Math.round((current / req.target) * 100));
          const done = current >= req.target;
          return (
            <div key={req.key} style={{ marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: "1rem" }}>{req.icon}</span>
                  <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-main)" }}>{req.label}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: done ? "#16a34a" : "var(--text-sub)" }}>
                    {current} / {req.target}
                  </span>
                  {done && <CheckCircle2 size={14} style={{ color: "#16a34a" }} />}
                </div>
              </div>
              <div style={{ background: "rgba(226,232,240,0.5)", borderRadius: 99, height: 7, overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    borderRadius: 99,
                    background: done
                      ? "linear-gradient(90deg, #16a34a, #22c55e)"
                      : "linear-gradient(90deg, var(--primary), var(--accent))",
                    width: `${pct}%`,
                    transition: "width 0.6s ease",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* What transfers */}
      <div
        className="academy-card"
        style={{
          background: "linear-gradient(135deg, rgba(16,185,129,0.05) 0%, rgba(5,150,105,0.05) 100%)",
          border: "1px solid rgba(16,185,129,0.15)",
          marginBottom: 20,
        }}
      >
        <p className="section-title" style={{ marginBottom: 12 }}>What Transfers to the Vault</p>
        {[
          "All accumulated XP and rank status",
          "Unlocked badges and stickers",
          "Mission completion history",
          "Dawg Class designation",
          "Streak and activity records",
        ].map((item) => (
          <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0" }}>
            <CheckCircle2 size={14} style={{ color: "#16a34a", flexShrink: 0 }} />
            <span style={{ fontSize: "0.8125rem", color: "var(--text-sub)" }}>{item}</span>
          </div>
        ))}
      </div>

    </div>
  );
}
