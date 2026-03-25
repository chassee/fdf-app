import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";
import { CheckCircle2, Target, ArrowRight, Zap } from "lucide-react";

const CATEGORY_META: Record<string, { icon: string; color: string; bg: string }> = {
  savings:   { icon: "💰", color: "#10b981", bg: "#d1fae5" },
  business:  { icon: "🏗️", color: "#f59e0b", bg: "#fef3c7" },
  design:    { icon: "🎨", color: "#8b5cf6", bg: "#ede9fe" },
  tech:      { icon: "⚙️", color: "#3b82f6", bg: "#eff6ff" },
  investing: { icon: "📈", color: "#06b6d4", bg: "#cffafe" },
  general:   { icon: "⚡", color: "#5b8cff", bg: "#e8efff" },
};

export default function Missions() {
  const { isAuthenticated } = useAuth();

  const { data: missionsData, isLoading, refetch } = trpc.fdf.getMissions.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: profile, refetch: refetchProfile } = trpc.fdf.getProfile.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const claimMission = trpc.fdf.claimMission.useMutation({
    onSuccess: () => {
      toast.success("Mission complete! XP + Gems added.");
      refetch();
      refetchProfile();
    },
    onError: (err) => toast.error(err.message),
  });

  if (!isAuthenticated) {
    return (
      <div className="page-container animate-fade-in">
        <div style={{ paddingTop: 40, textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>🎯</div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-main)", marginBottom: 8 }}>
            Missions Locked
          </h2>
          <p style={{ fontSize: "0.875rem", color: "var(--text-sub)", marginBottom: 24 }}>
            Sign in to access your weekly training missions.
          </p>
          <a href={getLoginUrl()} className="btn-primary">
            Sign In to Continue
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    );
  }

  if (!profile?.fdfUser) {
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

  if (isLoading || !missionsData) {
    return (
      <div className="page-container">
        <div style={{ paddingTop: 24, display: "flex", flexDirection: "column", gap: 10 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton" style={{ height: 88, borderRadius: 18 }} />
          ))}
        </div>
      </div>
    );
  }

  const missions = missionsData.missions ?? [];
  const completions = missionsData.completions ?? [];
  const claimedIds = new Set(completions.filter((c) => c.status === "claimed").map((c) => c.missionId));

  const activeMissions = missions.filter((m) => !claimedIds.has(m.id));
  const completedMissions = missions.filter((m) => claimedIds.has(m.id));

  const totalXpAvailable = activeMissions.reduce((sum, m) => sum + m.xpReward, 0);
  const totalGemsAvailable = activeMissions.reduce((sum, m) => sum + m.gemsReward, 0);
  const progressPct = missions.length > 0 ? (completedMissions.length / missions.length) * 100 : 0;

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
          Missions
        </h1>
        <p style={{ fontSize: "0.875rem", color: "var(--text-sub)" }}>
          Complete weekly missions to build real skills and earn XP.
        </p>
      </div>

      {/* ── Weekly Progress Card ── */}
      <div className="academy-card" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text-main)" }}>
            Weekly Progress
          </p>
          <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--primary)" }}>
            {completedMissions.length}/{missions.length}
          </span>
        </div>
        <div className="progress-track" style={{ marginBottom: 8 }}>
          <div className="progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[
            { label: "Active", value: activeMissions.length.toString(), color: "var(--primary)", bg: "var(--primary-light)" },
            { label: "XP Available", value: `+${totalXpAvailable}`, color: "#10b981", bg: "#d1fae5" },
            { label: "Gems", value: `+${totalGemsAvailable}`, color: "var(--accent)", bg: "var(--accent-light)" },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: s.bg,
                borderRadius: 10,
                padding: "8px 10px",
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: "0.9rem", fontWeight: 800, color: s.color, letterSpacing: "-0.02em" }}>
                {s.value}
              </p>
              <p style={{ fontSize: "0.6rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Active Missions ── */}
      {activeMissions.length > 0 && (
        <>
          <p className="section-title">Active This Week</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
            {activeMissions.map((mission) => {
              const meta = CATEGORY_META.general;
              const isPending = claimMission.isPending && claimMission.variables?.missionId === mission.id;

              return (
                <div key={mission.id} className="mission-card">
                  <div
                    className="mission-icon"
                    style={{ background: meta.bg }}
                  >
                    {meta.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        color: "var(--text-main)",
                        marginBottom: 4,
                        lineHeight: 1.3,
                      }}
                    >
                      {mission.title}
                    </p>
                    {mission.description && (
                      <p style={{ fontSize: "0.775rem", color: "var(--text-sub)", marginBottom: 6, lineHeight: 1.4 }}>
                        {mission.description}
                      </p>
                    )}
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span className="badge-pill blue" style={{ fontSize: "0.68rem" }}>
                        ⚡ +{mission.xpReward} XP
                      </span>
                      <span className="badge-pill purple" style={{ fontSize: "0.68rem" }}>
                        💎 +{mission.gemsReward}
                      </span>
                    </div>
                  </div>
                  <button
                    className="btn-primary"
                    style={{ padding: "8px 14px", fontSize: "0.8rem", flexShrink: 0 }}
                    disabled={isPending}
                    onClick={() => claimMission.mutate({ missionId: mission.id })}
                  >
                    {isPending ? "…" : "Collect"}
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ── Completed Missions ── */}
      {completedMissions.length > 0 && (
        <>
          <p className="section-title">Completed</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
            {completedMissions.map((mission) => (
              <div
                key={mission.id}
                className="mission-card"
                style={{ opacity: 0.55 }}
              >
                <div
                  className="mission-icon"
                  style={{ background: "#dcfce7" }}
                >
                  <CheckCircle2 size={22} style={{ color: "#16a34a" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      color: "var(--text-sub)",
                      textDecoration: "line-through",
                      marginBottom: 3,
                    }}
                  >
                    {mission.title}
                  </p>
                  <span className="badge-pill green" style={{ fontSize: "0.68rem" }}>
                    ✓ Collected
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Empty State ── */}
      {missions.length === 0 && (
        <div className="academy-card" style={{ textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: "2rem", marginBottom: 12 }}>📋</div>
          <p style={{ fontWeight: 700, color: "var(--text-main)", marginBottom: 6 }}>
            No missions yet
          </p>
          <p style={{ fontSize: "0.875rem", color: "var(--text-sub)" }}>
            New missions drop every Monday. Check back soon.
          </p>
        </div>
      )}

      {/* ── How It Works ── */}
      <div
        className="academy-card"
        style={{
          background: "linear-gradient(135deg, rgba(91,140,255,0.05) 0%, rgba(123,92,255,0.05) 100%)",
          border: "1px solid rgba(91,140,255,0.12)",
          marginBottom: 8,
        }}
      >
        <p className="section-title" style={{ marginBottom: 12 }}>How Missions Work</p>
        {[
          "Complete the real-world task described in the mission.",
          "Tap Collect to claim your XP and Gems.",
          "XP builds your rank. Gems unlock rewards.",
          "New missions drop every Monday.",
        ].map((step, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              marginBottom: i < 3 ? 10 : 0,
            }}
          >
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                background: "var(--primary-light)",
                color: "var(--primary-dark)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.7rem",
                fontWeight: 800,
                flexShrink: 0,
                marginTop: 1,
              }}
            >
              {i + 1}
            </div>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-sub)", lineHeight: 1.5 }}>
              {step}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
