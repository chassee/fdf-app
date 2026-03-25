import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";
import { ShieldCheck, Lock, ArrowRight, Trophy } from "lucide-react";

const REWARD_TYPE_META: Record<string, { icon: string; color: string; bg: string }> = {
  badge:   { icon: "🏅", color: "#f59e0b", bg: "#fef3c7" },
  sticker: { icon: "⭐", color: "#8b5cf6", bg: "#ede9fe" },
  title:   { icon: "🎖️", color: "#3b82f6", bg: "#eff6ff" },
  nft:     { icon: "🔷", color: "#06b6d4", bg: "#cffafe" },
};

export default function Rewards() {
  const { isAuthenticated } = useAuth();

  const { data: rewardsData, isLoading, refetch } = trpc.fdf.getRewards.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: profile, refetch: refetchProfile } = trpc.fdf.getProfile.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const unlockReward = trpc.fdf.unlockReward.useMutation({
    onSuccess: () => {
      toast.success("Reward unlocked and added to your profile.");
      refetch();
      refetchProfile();
    },
    onError: (err) => toast.error(err.message),
  });

  if (!isAuthenticated) {
    return (
      <div className="page-container animate-fade-in">
        <div style={{ paddingTop: 40, textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>🏆</div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-main)", marginBottom: 8 }}>
            Rewards Locked
          </h2>
          <p style={{ fontSize: "0.875rem", color: "var(--text-sub)", marginBottom: 24 }}>
            Sign in to access your rewards locker.
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
            Set up your FDF profile on the Home page to unlock rewards.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading || !rewardsData) {
    return (
      <div className="page-container">
        <div style={{ paddingTop: 24, display: "flex", flexDirection: "column", gap: 10 }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton" style={{ height: 88, borderRadius: 18 }} />
          ))}
        </div>
      </div>
    );
  }

  const allRewards = rewardsData.allRewards ?? [];
  const userRewards = rewardsData.userRewards ?? [];
  const gems = profile.progress?.gemsTotal ?? 0;

  const unlockedIds = new Set(userRewards.map((ur) => ur.rewardId));
  const unlockedRewards = allRewards.filter((r) => unlockedIds.has(r.id));
  const lockedRewards = allRewards.filter((r) => !unlockedIds.has(r.id));

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
          Rewards
        </h1>
        <p style={{ fontSize: "0.875rem", color: "var(--text-sub)" }}>
          Earn rewards by completing missions and building XP.
        </p>
      </div>

      {/* ── Gems Balance ── */}
      <div
        className="academy-card"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
          background: "linear-gradient(135deg, rgba(123,92,255,0.06) 0%, rgba(91,140,255,0.06) 100%)",
          border: "1.5px solid rgba(123,92,255,0.15)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "var(--accent-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.3rem",
            }}
          >
            💎
          </div>
          <div>
            <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 2 }}>
              Your Balance
            </p>
            <p style={{ fontSize: "1.375rem", fontWeight: 800, color: "var(--accent)", letterSpacing: "-0.03em" }}>
              {gems.toLocaleString()}
              <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-muted)", marginLeft: 4 }}>gems</span>
            </p>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 2 }}>
            Unlocked
          </p>
          <p style={{ fontSize: "1.125rem", fontWeight: 800, color: "var(--text-main)" }}>
            {unlockedRewards.length}<span style={{ color: "var(--text-muted)", fontWeight: 500 }}>/{allRewards.length}</span>
          </p>
        </div>
      </div>

      {/* ── Available Rewards ── */}
      {lockedRewards.length > 0 && (
        <>
          <p className="section-title">Available to Unlock</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
            {lockedRewards.map((reward) => {
              const meta = REWARD_TYPE_META[reward.type] ?? REWARD_TYPE_META.badge;
              const canAfford = gems >= reward.costGems;
              const isPending = unlockReward.isPending && unlockReward.variables?.rewardId === reward.id;
              const shortfall = reward.costGems - gems;

              return (
                <div
                  key={reward.id}
                  className="mission-card"
                  style={{ opacity: canAfford ? 1 : 0.65 }}
                >
                  <div
                    className="mission-icon"
                    style={{ background: meta.bg }}
                  >
                    {meta.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-main)" }}>
                        {reward.name}
                      </p>
                      <span
                        style={{
                          fontSize: "0.6rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                          padding: "2px 6px",
                          borderRadius: 6,
                          background: meta.bg,
                          color: meta.color,
                        }}
                      >
                        {reward.type}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span className="badge-pill purple" style={{ fontSize: "0.68rem" }}>
                        💎 {reward.costGems} gems
                      </span>
                      {!canAfford && (
                        <span style={{ fontSize: "0.7rem", color: "#ef4444", fontWeight: 600 }}>
                          Need {shortfall} more
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    className="btn-primary"
                    style={{
                      padding: "8px 14px",
                      fontSize: "0.8rem",
                      flexShrink: 0,
                      opacity: canAfford ? 1 : 0.4,
                      cursor: canAfford ? "pointer" : "not-allowed",
                      background: canAfford
                        ? "linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)"
                        : "var(--border)",
                    }}
                    disabled={!canAfford || isPending}
                    onClick={() => canAfford && unlockReward.mutate({ rewardId: reward.id })}
                  >
                    {isPending ? "…" : canAfford ? "Unlock" : <Lock size={14} />}
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ── Unlocked Rewards ── */}
      {unlockedRewards.length > 0 && (
        <>
          <p className="section-title">Your Collection</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
            {unlockedRewards.map((reward) => {
              const meta = REWARD_TYPE_META[reward.type] ?? REWARD_TYPE_META.badge;
              return (
                <div
                  key={reward.id}
                  className="mission-card"
                  style={{ background: "rgba(22,163,74,0.04)", border: "1.5px solid rgba(22,163,74,0.15)" }}
                >
                  <div
                    className="mission-icon"
                    style={{ background: "#dcfce7" }}
                  >
                    <ShieldCheck size={22} style={{ color: "#16a34a" }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text-main)", marginBottom: 3 }}>
                      {reward.name}
                    </p>
                    <span className="badge-pill green" style={{ fontSize: "0.68rem" }}>
                      ✓ Unlocked
                    </span>
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#16a34a", fontWeight: 700 }}>
                    {meta.icon}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ── Empty State ── */}
      {allRewards.length === 0 && (
        <div className="academy-card" style={{ textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: "2rem", marginBottom: 12 }}>🏆</div>
          <p style={{ fontWeight: 700, color: "var(--text-main)", marginBottom: 6 }}>
            No rewards yet
          </p>
          <p style={{ fontSize: "0.875rem", color: "var(--text-sub)" }}>
            Rewards will be added as you progress through the system.
          </p>
        </div>
      )}

      {/* ── How to Earn Gems ── */}
      <div
        className="academy-card"
        style={{
          background: "linear-gradient(135deg, rgba(91,140,255,0.05) 0%, rgba(123,92,255,0.05) 100%)",
          border: "1px solid rgba(91,140,255,0.12)",
        }}
      >
        <p className="section-title" style={{ marginBottom: 12 }}>How to Earn Gems</p>
        {[
          { icon: "📅", label: "Daily Check-In", value: "+5 💎 / day" },
          { icon: "🎯", label: "Complete Missions", value: "+10–50 💎" },
          { icon: "🔥", label: "Streak Bonus (7 days)", value: "+25 💎" },
          { icon: "⭐", label: "Level Up Rank", value: "+100 💎" },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom: "1px solid rgba(91,140,255,0.08)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: "0.9rem" }}>{item.icon}</span>
              <span style={{ fontSize: "0.8125rem", color: "var(--text-sub)", fontWeight: 500 }}>
                {item.label}
              </span>
            </div>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--accent)" }}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
