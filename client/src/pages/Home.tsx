import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";
import {
  ArrowRight,
  Target,
  Trophy,
  Zap,
  CheckCircle2,
  Lock,
  ChevronRight,
  Shield,
  Users,
  Star,
} from "lucide-react";

const DAWG_CLASSES = [
  {
    id: "builder",
    label: "Builder Dawg",
    icon: "🏗️",
    desc: "Build products, services & businesses",
    color: "#f59e0b",
    bg: "#fef3c7",
  },
  {
    id: "creator",
    label: "Creator Dawg",
    icon: "🎨",
    desc: "Create content, art & digital media",
    color: "#8b5cf6",
    bg: "#ede9fe",
  },
  {
    id: "tech",
    label: "Tech Dawg",
    icon: "⚙️",
    desc: "Code, engineer & build with technology",
    color: "#3b82f6",
    bg: "#eff6ff",
  },
  {
    id: "money",
    label: "Money Dawg",
    icon: "💰",
    desc: "Invest, trade & grow financial wealth",
    color: "#10b981",
    bg: "#d1fae5",
  },
];

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const { data: profile, isLoading, refetch } = trpc.fdf.getProfile.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const [onboardStep, setOnboardStep] = useState<"dob" | "class" | null>(null);
  const [dob, setDob] = useState("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const completeOnboarding = trpc.fdf.completeOnboarding.useMutation({
    onSuccess: () => {
      toast.success("Welcome to FDF! Your training begins now.");
      setOnboardStep(null);
      refetch();
    },
    onError: (err) => {
      toast.error(err.message);
      setIsSubmitting(false);
    },
  });

  const checkIn = trpc.fdf.checkIn.useMutation({
    onSuccess: (data) => {
      toast.success(`Day ${data.streak} streak! +${data.gemsEarned} 💎`);
      refetch();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleOnboardSubmit = () => {
    if (!dob || !selectedClass) return;
    setIsSubmitting(true);
    completeOnboarding.mutate({
      dob,
      dawgClass: selectedClass as "builder" | "creator" | "tech" | "money",
    });
  };

  const today = new Date().toISOString().split("T")[0];
  const checkedInToday = profile?.progress?.lastCheckin === today;

  // ── Not authenticated ──────────────────────────────────────────
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
              marginBottom: 12,
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
              marginBottom: 28,
              maxWidth: 340,
            }}
          >
            Start learning real money skills at{" "}
            <strong style={{ color: "var(--text-main)" }}>13</strong>.
            Graduate into the Vault at{" "}
            <strong style={{ color: "var(--text-main)" }}>18</strong>.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 320 }}>
            <a href={getLoginUrl()} className="btn-primary" style={{ justifyContent: "center" }}>
              Join FDF — It's Free
              <ArrowRight size={16} />
            </a>
            <Link href="/parents" className="btn-secondary" style={{ justifyContent: "center" }}>
              Parents Info
            </Link>
          </div>

          <p
            style={{
              marginTop: 16,
              fontSize: "0.75rem",
              color: "var(--text-muted)",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Shield size={12} />
            100% Free · No Purchases · No Ads · admin@crypdawgs.com
          </p>
        </div>

        {/* Feature Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
          <p className="section-title">What you'll build</p>
          {[
            {
              icon: "💡",
              title: "Real Money Skills",
              desc: "Saving, investing, building income — not theory.",
              color: "#f59e0b",
              bg: "#fef3c7",
            },
            {
              icon: "🏆",
              title: "XP & Rank System",
              desc: "Complete missions, earn XP, climb the ranks.",
              color: "#5b8cff",
              bg: "#e8efff",
            },
            {
              icon: "🔓",
              title: "Vault Access at 18",
              desc: "Graduate into the full CrypDawgs Vault.",
              color: "#7b5cff",
              bg: "#ede8ff",
            },
          ].map((f) => (
            <div key={f.title} className="academy-card" style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: f.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.25rem",
                  flexShrink: 0,
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

  // ── Loading ────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="page-container">
        <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingTop: 24 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton" style={{ height: 80, borderRadius: 18 }} />
          ))}
        </div>
      </div>
    );
  }

  // ── Onboarding — Step 1: DOB ───────────────────────────────────
  if (!profile?.fdfUser || onboardStep === "dob") {
    return (
      <div className="page-container animate-fade-in">
        <div style={{ paddingTop: 32, paddingBottom: 16 }}>
          <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: "var(--text-main)", letterSpacing: "-0.02em", marginBottom: 6 }}>
            Set Up Your Profile
          </h2>
          <p style={{ fontSize: "0.875rem", color: "var(--text-sub)", marginBottom: 28 }}>
            FDF is for ages 13–17. Enter your date of birth to continue.
          </p>

          <div className="academy-card" style={{ marginBottom: 16 }}>
            <label
              style={{
                display: "block",
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "var(--text-muted)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Date of Birth
            </label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 12,
                border: "1.5px solid rgba(91,140,255,0.2)",
                background: "rgba(91,140,255,0.04)",
                fontSize: "1rem",
                color: "var(--text-main)",
                outline: "none",
                fontFamily: "inherit",
              }}
            />
          </div>

          <button
            className="btn-primary"
            style={{ width: "100%", justifyContent: "center" }}
            disabled={!dob}
            onClick={() => setOnboardStep("class")}
          >
            Continue
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  // ── Onboarding — Step 2: Dawg Class ───────────────────────────
  if (onboardStep === "class") {
    return (
      <div className="page-container animate-fade-in">
        <div style={{ paddingTop: 24, paddingBottom: 16 }}>
          <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: "var(--text-main)", letterSpacing: "-0.02em", marginBottom: 6 }}>
            Choose Your Dawg Class
          </h2>
          <p style={{ fontSize: "0.875rem", color: "var(--text-sub)", marginBottom: 24 }}>
            Your class shapes your mission track. You can change it later.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
            {DAWG_CLASSES.map((dc) => (
              <button
                key={dc.id}
                onClick={() => setSelectedClass(dc.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 16px",
                  borderRadius: 16,
                  border: `2px solid ${selectedClass === dc.id ? dc.color : "rgba(91,140,255,0.12)"}`,
                  background: selectedClass === dc.id ? dc.bg : "rgba(255,255,255,0.8)",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.15s ease",
                  backdropFilter: "blur(12px)",
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: dc.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.3rem",
                    flexShrink: 0,
                    border: `1.5px solid ${dc.color}30`,
                  }}
                >
                  {dc.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-main)", marginBottom: 2 }}>
                    {dc.label}
                  </p>
                  <p style={{ fontSize: "0.775rem", color: "var(--text-sub)" }}>{dc.desc}</p>
                </div>
                {selectedClass === dc.id && (
                  <CheckCircle2 size={18} style={{ color: dc.color, flexShrink: 0 }} />
                )}
              </button>
            ))}
          </div>

          <button
            className="btn-primary"
            style={{ width: "100%", justifyContent: "center" }}
            disabled={!selectedClass || isSubmitting}
            onClick={handleOnboardSubmit}
          >
            {isSubmitting ? "Setting up…" : "Start Training"}
            {!isSubmitting && <ArrowRight size={16} />}
          </button>
        </div>
      </div>
    );
  }

  // ── Dashboard ──────────────────────────────────────────────────
  const progress = profile.progress;
  const fdfUser = profile.fdfUser;
  const xp = progress?.xpTotal ?? 0;
  const gems = progress?.gemsTotal ?? 0;
  const rankName = progress?.rankName ?? "Pup";
  const streak = progress?.streakDays ?? 0;
  const yearTrack = fdfUser?.yearTrack ?? 1;

  const RANK_XP_MAP: Record<string, number> = {
    Pup: 0, Hunter: 200, Builder: 500, Founder: 1000, Vault: 2000,
  };
  const RANK_ORDER = ["Pup", "Hunter", "Builder", "Founder", "Vault"];
  const currentIdx = RANK_ORDER.indexOf(rankName);
  const nextRank = RANK_ORDER[currentIdx + 1] ?? "Vault";
  const nextRankXp = RANK_XP_MAP[nextRank] ?? 2000;
  const currentRankXp = RANK_XP_MAP[rankName] ?? 0;
  const progressPct = Math.min(
    100,
    ((xp - currentRankXp) / (nextRankXp - currentRankXp)) * 100
  );

  const dawgClassInfo = DAWG_CLASSES.find((d) => d.id === fdfUser?.dawgClass) ?? DAWG_CLASSES[0];

  return (
    <div className="page-container animate-fade-in">

      {/* ── Welcome Row ── */}
      <div style={{ paddingTop: 20, paddingBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 4 }}>
            Welcome back
          </p>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-main)", letterSpacing: "-0.02em" }}>
            {user?.name?.split(" ")[0] ?? "Trainee"}
          </h2>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: dawgClassInfo.bg,
            color: dawgClassInfo.color,
            padding: "6px 12px",
            borderRadius: 10,
            fontSize: "0.75rem",
            fontWeight: 700,
            border: `1px solid ${dawgClassInfo.color}30`,
          }}
        >
          <span>{dawgClassInfo.icon}</span>
          <span>{dawgClassInfo.label}</span>
        </div>
      </div>

      {/* ── Rank Progress Card ── */}
      <div className="academy-card" style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div>
            <p className="section-title" style={{ marginBottom: 2 }}>Current Rank</p>
            <p style={{ fontSize: "1.125rem", fontWeight: 800, color: "var(--text-main)", letterSpacing: "-0.02em" }}>
              {rankName}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p className="section-title" style={{ marginBottom: 2 }}>Year Track</p>
            <p style={{ fontSize: "1.125rem", fontWeight: 800, color: "var(--primary)", letterSpacing: "-0.02em" }}>
              Year {yearTrack}
            </p>
          </div>
        </div>

        <div className="progress-track" style={{ marginBottom: 6 }}>
          <div className="progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            {xp.toLocaleString()} XP
          </span>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            {nextRankXp.toLocaleString()} XP → {nextRank}
          </span>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
        {[
          { label: "XP Total", value: xp.toLocaleString(), icon: "⚡", color: "#5b8cff", bg: "#e8efff" },
          { label: "Gems", value: gems.toString(), icon: "💎", color: "#7b5cff", bg: "#ede8ff" },
          { label: "Streak", value: `${streak}d`, icon: "🔥", color: "#f59e0b", bg: "#fef3c7" },
        ].map((s) => (
          <div
            key={s.label}
            className="academy-card"
            style={{ padding: "12px 10px", textAlign: "center" }}
          >
            <div style={{ fontSize: "1.1rem", marginBottom: 4 }}>{s.icon}</div>
            <p style={{ fontSize: "1rem", fontWeight: 800, color: "var(--text-main)", letterSpacing: "-0.02em", lineHeight: 1 }}>
              {s.value}
            </p>
            <p style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", marginTop: 2 }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* ── Daily Check-In ── */}
      <p className="section-title">Today's Actions</p>
      <div className="academy-card" style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: checkedInToday ? "#dcfce7" : "#e8efff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.4rem",
              flexShrink: 0,
            }}
          >
            {checkedInToday ? "✅" : "📅"}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-main)", marginBottom: 2 }}>
              Daily Check-In
            </p>
            <p style={{ fontSize: "0.775rem", color: "var(--text-sub)" }}>
              {checkedInToday
                ? `Streak: ${streak} day${streak !== 1 ? "s" : ""} 🔥`
                : `+5 💎 · Current streak: ${streak} day${streak !== 1 ? "s" : ""}`}
            </p>
          </div>
          {!checkedInToday ? (
            <button
              className="btn-primary"
              style={{ padding: "8px 16px", fontSize: "0.8125rem" }}
              onClick={() => checkIn.mutate()}
              disabled={checkIn.isPending}
            >
              {checkIn.isPending ? "…" : "Check In"}
            </button>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                color: "#16a34a",
                fontSize: "0.8rem",
                fontWeight: 700,
              }}
            >
              <CheckCircle2 size={16} />
              Done
            </div>
          )}
        </div>
      </div>

      {/* ── Quick Links ── */}
      <p className="section-title" style={{ marginTop: 20 }}>Training Modules</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
        {[
          { path: "/missions", icon: <Target size={18} />, label: "Weekly Missions", desc: "Complete tasks to earn XP", color: "#5b8cff", bg: "#e8efff" },
          { path: "/rewards", icon: <Trophy size={18} />, label: "Rewards Locker", desc: "Unlock badges & stickers", color: "#7b5cff", bg: "#ede8ff" },
          { path: "/ranks", icon: <Zap size={18} />, label: "Rank Progression", desc: "Track your training path", color: "#f59e0b", bg: "#fef3c7" },
        ].map((item) => (
          <Link key={item.path} href={item.path} style={{ textDecoration: "none" }}>
            <div
              className="academy-card"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 11,
                  background: item.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: item.color,
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text-main)", marginBottom: 1 }}>
                  {item.label}
                </p>
                <p style={{ fontSize: "0.775rem", color: "var(--text-sub)" }}>{item.desc}</p>
              </div>
              <ChevronRight size={16} style={{ color: "var(--text-muted)" }} />
            </div>
          </Link>
        ))}
      </div>

      {/* ── Graduation Teaser ── */}
      {yearTrack >= 3 && (
        <Link href="/graduation" style={{ textDecoration: "none" }}>
          <div
            className="academy-card"
            style={{
              background: "linear-gradient(135deg, rgba(91,140,255,0.08) 0%, rgba(123,92,255,0.08) 100%)",
              border: "1.5px solid rgba(91,140,255,0.2)",
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 24,
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "linear-gradient(135deg, #5b8cff, #7b5cff)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.25rem",
                flexShrink: 0,
              }}
            >
              🎓
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text-main)", marginBottom: 2 }}>
                Vault Activation Approaching
              </p>
              <p style={{ fontSize: "0.775rem", color: "var(--text-sub)" }}>
                Year {yearTrack} · Graduate at 18 → Full Vault Access
              </p>
            </div>
            <Lock size={16} style={{ color: "var(--primary)" }} />
          </div>
        </Link>
      )}

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
              fontSize: "0.7rem",
              color: "var(--text-muted)",
              textDecoration: "none",
              fontWeight: 600,
              letterSpacing: "0.02em",
            }}
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
