import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useFDF, RANK_META, UNLOCK_XP } from "@/contexts/FDFContext";

function getDaysUntil18(dobStr: string): number {
  const dob = new Date(dobStr);
  const eighteenth = new Date(dob.getFullYear() + 18, dob.getMonth(), dob.getDate());
  const today = new Date();
  const diff = eighteenth.getTime() - today.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function getAge(dobStr: string): number {
  const dob = new Date(dobStr);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
}

export default function Graduation() {
  const { isAuthenticated } = useAuth();
  const { xp, streak, missionsCompleted, rankId, dob, isEnrolled, isLoading, unlockedSections } = useFDF();

  const age = dob ? getAge(dob) : null;
  const daysUntil18 = dob ? getDaysUntil18(dob) : null;
  const isVaultReady = age !== null && age >= 18;
  const rankMeta = RANK_META[rankId];

  if (!isAuthenticated) {
    return (
      <div className="page-container animate-fade-in">
        <div style={{ paddingTop: 40, textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>🎓</div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-main)", marginBottom: 8 }}>
            Graduation Locked
          </h2>
          <p style={{ fontSize: "0.875rem", color: "var(--text-sub)", marginBottom: 24 }}>
            Sign in to view your path to Vault access.
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
          <div className="skeleton" style={{ height: 120, borderRadius: 18 }} />
          <div className="skeleton" style={{ height: 100, borderRadius: 18 }} />
          <div className="skeleton" style={{ height: 80, borderRadius: 18 }} />
        </div>
      </div>
    );
  }

  // XP-based vault unlock gate
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
          <div style={{ fontSize: "3rem", marginBottom: 16 }}>🎓</div>
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
          <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 16, lineHeight: 1.6 }}>
            Keep completing missions on the Missions tab to earn XP.
          </p>
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
          Vault Graduation
        </h1>
        <p style={{ fontSize: "0.875rem", color: "var(--text-sub)" }}>
          Your path to Vault access. All progress carries forward at 18.
        </p>
      </div>

      {/* ── Vault Status ── */}
      <div
        className="academy-card"
        style={{
          marginBottom: 16,
          background: isVaultReady
            ? "linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(251,191,36,0.08) 100%)"
            : "linear-gradient(135deg, rgba(91,140,255,0.06) 0%, rgba(123,92,255,0.06) 100%)",
          border: isVaultReady
            ? "1.5px solid rgba(245,158,11,0.3)"
            : "1.5px solid rgba(91,140,255,0.15)",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          <div
            style={{
              width: 52, height: 52, borderRadius: 14,
              background: isVaultReady ? "#fef3c7" : "rgba(91,140,255,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.6rem", flexShrink: 0,
            }}
          >
            {isVaultReady ? "🔓" : "🔒"}
          </div>
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontWeight: 800, fontSize: "1rem",
                color: "var(--text-main)", marginBottom: 6, letterSpacing: "-0.01em",
              }}
            >
              {isVaultReady ? "Vault Access Unlocked" : "Vault Locked"}
            </p>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-sub)", lineHeight: 1.6, marginBottom: 12 }}>
              {isVaultReady
                ? "You have reached age 18. Your Crypdawgs Vault is now accessible. All FDF progress has been transferred."
                : isEnrolled
                  ? `${daysUntil18} days remaining until Vault activation. Keep building XP and completing missions.`
                  : "Complete your profile setup to begin tracking your path to Vault access."}
            </p>

            {isVaultReady && (
              <a
                href="https://crypdawgs.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ display: "inline-flex", fontSize: "0.875rem" }}
              >
                Enter the Vault
                <ArrowRight size={15} />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ── Countdown ── */}
      {isEnrolled && !isVaultReady && daysUntil18 !== null && (
        <div className="academy-card" style={{ marginBottom: 16 }}>
          <p className="section-title" style={{ marginBottom: 14 }}>Vault Countdown</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {[
              { label: "Days",   value: daysUntil18.toString(),                color: "var(--primary)", bg: "var(--primary-light)" },
              { label: "Months", value: Math.floor(daysUntil18 / 30).toString(), color: "var(--accent)",  bg: "var(--accent-light)"  },
              { label: "Years",  value: (daysUntil18 / 365).toFixed(1),         color: "#f59e0b",         bg: "#fef3c7"              },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  background: item.bg, borderRadius: 12,
                  padding: "14px 10px", textAlign: "center",
                }}
              >
                <p
                  style={{
                    fontSize: "1.75rem", fontWeight: 800, color: item.color,
                    letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 4,
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  {item.value}
                </p>
                <p
                  style={{
                    fontSize: "0.65rem", color: "var(--text-muted)",
                    fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em",
                  }}
                >
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Progress Summary ── */}
      {isEnrolled && (
        <div className="academy-card" style={{ marginBottom: 16 }}>
          <p className="section-title" style={{ marginBottom: 14 }}>Progress Summary</p>
          {[
            { label: "Current Rank",    value: rankMeta.label,                   icon: "🏆", color: rankMeta.color },
            { label: "Total XP",        value: xp.toLocaleString(),              icon: "⚡", color: "#f59e0b"     },
            { label: "Missions Done",   value: missionsCompleted.toString(),     icon: "🎯", color: "var(--primary)" },
            { label: "Streak",          value: `${streak} days`,                 icon: "🔥", color: "#f97316"     },
            { label: "Vault Status",    value: isVaultReady ? "Unlocked" : "Locked", icon: isVaultReady ? "🔓" : "🔒", color: isVaultReady ? "#16a34a" : "var(--text-muted)" },
          ].map((item, i) => (
            <div
              key={item.label}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "10px 0",
                borderBottom: i < 4 ? "1px solid rgba(91,140,255,0.08)" : "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: "0.9rem" }}>{item.icon}</span>
                <span style={{ fontSize: "0.8125rem", color: "var(--text-sub)" }}>{item.label}</span>
              </div>
              <span style={{ fontSize: "0.875rem", fontWeight: 700, color: item.color }}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ── What Transfers ── */}
      <div
        className="academy-card"
        style={{
          background: "linear-gradient(135deg, rgba(16,185,129,0.05) 0%, rgba(5,150,105,0.05) 100%)",
          border: "1px solid rgba(16,185,129,0.15)",
          marginBottom: 16,
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
          <div
            key={item}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0" }}
          >
            <CheckCircle2 size={14} style={{ color: "#16a34a", flexShrink: 0 }} />
            <span style={{ fontSize: "0.8125rem", color: "var(--text-sub)" }}>{item}</span>
          </div>
        ))}
      </div>

      {/* ── Not enrolled state ── */}
      {!isEnrolled && (
        <div className="academy-card" style={{ textAlign: "center", padding: 32, marginBottom: 16 }}>
          <div style={{ fontSize: "2rem", marginBottom: 12 }}>🔒</div>
          <p style={{ fontWeight: 700, color: "var(--text-main)", marginBottom: 6 }}>Complete Onboarding First</p>
          <p style={{ fontSize: "0.875rem", color: "var(--text-sub)" }}>
            Set up your FDF profile on the Home page to begin tracking your Vault graduation path.
          </p>
        </div>
      )}
    </div>
  );
}
