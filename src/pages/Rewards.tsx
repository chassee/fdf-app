import { Link } from "wouter";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { ArrowRight, CheckCircle2, Lock, ShieldCheck } from "lucide-react";
import { useFDF, UNLOCK_XP } from "@/contexts/FDFContext";

// ── Static fallback rewards ───────────────────────────────────────────────────
const STATIC_REWARDS = [
  { id: 1,  name: "Builder Badge",     costGems: 100, type: "badge",   rarity: "common",    emoji: "🏗️", desc: "Awarded to builders who complete their first product mission." },
  { id: 2,  name: "Creator Badge",     costGems: 100, type: "badge",   rarity: "common",    emoji: "🎨", desc: "For creators who launch their first digital project." },
  { id: 3,  name: "Tech Badge",        costGems: 100, type: "badge",   rarity: "common",    emoji: "⚙️", desc: "Earned by tech dawgs who complete a code challenge." },
  { id: 4,  name: "Money Badge",       costGems: 100, type: "badge",   rarity: "common",    emoji: "💰", desc: "For money dawgs who hit their first savings milestone." },
  { id: 5,  name: "Streak Shield",     costGems: 150, type: "sticker", rarity: "uncommon",  emoji: "🔥", desc: "Protect a 7-day streak from breaking once." },
  { id: 6,  name: "Atlas Dawg",        costGems: 250, type: "badge",   rarity: "rare",      emoji: "🌍", desc: "Reserved for dawgs who complete all 8 core missions." },
  { id: 7,  name: "Vault Preview",     costGems: 300, type: "sticker", rarity: "rare",      emoji: "🔓", desc: "Early preview access to the Crypdawgs Vault interface." },
  { id: 8,  name: "Elite Frame",       costGems: 200, type: "frame",   rarity: "uncommon",  emoji: "🖼️", desc: "A premium profile frame for Development-rank members." },
  { id: 9,  name: "Founder's Mark",    costGems: 500, type: "badge",   rarity: "legendary", emoji: "⭐", desc: "Ultra-rare badge for the first 100 FDF graduates." },
  { id: 10, name: "Diamond Paw",       costGems: 400, type: "sticker", rarity: "legendary", emoji: "💎", desc: "The rarest sticker in the FDF collection." },
];

const RARITY_CONFIG = {
  common:    { label: "Common",    color: "#64748b", bg: "#f1f5f9", border: "rgba(100,116,139,0.2)" },
  uncommon:  { label: "Uncommon",  color: "#16a34a", bg: "#dcfce7", border: "rgba(22,163,74,0.25)"  },
  rare:      { label: "Rare",      color: "#2563eb", bg: "#eff6ff", border: "rgba(37,99,235,0.25)"  },
  legendary: { label: "Legendary", color: "#d97706", bg: "#fef3c7", border: "rgba(217,119,6,0.35)"  },
} as const;

const TYPE_FILTERS = [
  { key: "all",     label: "All"      },
  { key: "badge",   label: "Badges"   },
  { key: "sticker", label: "Stickers" },
  { key: "frame",   label: "Frames"   },
] as const;

// ── Confirm modal ─────────────────────────────────────────────────────────────
function ConfirmModal({
  reward, gems, onConfirm, onCancel, loading,
}: {
  reward: typeof STATIC_REWARDS[number];
  gems: number;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const rarity = RARITY_CONFIG[reward.rarity as keyof typeof RARITY_CONFIG] ?? RARITY_CONFIG.common;
  const canAfford = gems >= reward.costGems;
  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(15,23,42,0.65)", backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.98)", borderRadius: 20, padding: "28px 24px",
          maxWidth: 340, width: "100%", textAlign: "center",
          boxShadow: "0 24px 64px rgba(91,140,255,0.2)",
        }}
      >
        <div
          style={{
            width: 64, height: 64, borderRadius: 18,
            background: rarity.bg, border: `2px solid ${rarity.border}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "2rem", margin: "0 auto 16px",
          }}
        >
          {reward.emoji}
        </div>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#0f172a", marginBottom: 4 }}>
          {reward.name}
        </p>
        <p style={{ fontSize: "0.78rem", color: "#64748b", lineHeight: 1.6, marginBottom: 18 }}>
          {reward.desc}
        </p>
        <div
          style={{
            background: "#f8faff", borderRadius: 12, padding: "12px 16px",
            marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center",
          }}
        >
          <span style={{ fontSize: "0.8rem", color: "#64748b" }}>Cost</span>
          <span style={{ fontWeight: 800, fontSize: "1rem", color: "#7c3aed" }}>
            {reward.costGems} 💎
          </span>
        </div>
        {!canAfford && (
          <p style={{ fontSize: "0.78rem", color: "#ef4444", marginBottom: 14, fontWeight: 600 }}>
            Not enough gems. You have {gems} 💎.
          </p>
        )}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onCancel}
            className="btn-secondary"
            style={{ flex: 1, justifyContent: "center" }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="btn-primary"
            style={{ flex: 1, justifyContent: "center" }}
            disabled={!canAfford || loading}
          >
            {loading ? "…" : "Unlock"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Rewards() {
  const { isAuthenticated, gems, xp, isEnrolled, refetch, unlockedSections } = useFDF();

  const [rewardsData, setRewardsData] = useState<{ allRewards: any[]; userRewards: any[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [unlockingId, setUnlockingId] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [confirmReward, setConfirmReward] = useState<typeof STATIC_REWARDS[number] | null>(null);

  const fetchRewards = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const [{ data: allRewards }, { data: userRewards }] = await Promise.all([
      supabase.from("rewards").select("*").order("gems_cost", { ascending: true }),
      supabase.from("user_rewards").select("*").eq("user_id", session.user.id),
    ]);
    setRewardsData({ allRewards: allRewards ?? [], userRewards: userRewards ?? [] });
  };

  useEffect(() => {
    if (!isAuthenticated || !isEnrolled) return;
    setIsLoading(true);
    fetchRewards().finally(() => setIsLoading(false));
  }, [isAuthenticated, isEnrolled]);

  const unlockReward = {
    mutate: async (vars: { rewardId: number }) => {
      const reward = (rewardsData?.allRewards?.length ? rewardsData.allRewards : STATIC_REWARDS).find((r: any) => r.id === vars.rewardId);
      if (!reward) return;
      const cost = reward.gems_cost ?? reward.costGems ?? 0;
      if (gems < cost) { toast.error("Not enough gems"); return; }
      setUnlockingId(vars.rewardId);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        await supabase.from("user_rewards").upsert({
          user_id: session.user.id,
          reward_id: vars.rewardId,
          unlocked_at: new Date().toISOString(),
        }, { onConflict: "user_id,reward_id" });
        await supabase.from("fdf_users")
          .update({ gems: gems - cost })
          .eq("auth_user_id", session.user.id);
        toast.success("Reward unlocked! 🎉");
        refetch();
        await fetchRewards();
        setConfirmReward(null);
      } catch (e: any) {
        toast.error(e.message ?? "Failed to unlock reward");
      } finally {
        setUnlockingId(null);
      }
    },
    isPending: unlockingId !== null,
  };

  if (!isAuthenticated) {
    return (
      <div className="page-container animate-fade-in">
        <div style={{ paddingTop: 40, textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>🎁</div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-main)", marginBottom: 8 }}>
            Rewards Locked
          </h2>
          <p style={{ fontSize: "0.875rem", color: "var(--text-sub)", marginBottom: 24 }}>
            Sign in to access the rewards shop.
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
            Set up your FDF profile on the Home page to access rewards.
          </p>
        </div>
      </div>
    );
  }

  // XP-based unlock gate
  if (!unlockedSections.rewards) {
    const needed = UNLOCK_XP.rewards - xp;
    return (
      <div className="page-container animate-fade-in">
        <div style={{ paddingTop: 40, textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: 16 }}>🎁</div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-main)", marginBottom: 8 }}>
            Rewards Locked
          </h2>
          <p style={{ fontSize: "0.875rem", color: "var(--text-sub)", marginBottom: 20, lineHeight: 1.6 }}>
            Earn <strong>{needed} more XP</strong> by completing missions to unlock the Rewards Shop.
          </p>
          <div
            style={{
              background: "var(--primary-light)", borderRadius: 14, padding: "14px 18px",
              display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 24,
            }}
          >
            <span style={{ fontSize: "1.1rem" }}>⚡</span>
            <div style={{ textAlign: "left" }}>
              <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--primary-dark)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Your Progress</p>
              <p style={{ fontSize: "0.875rem", fontWeight: 800, color: "var(--primary)" }}>{xp} / {UNLOCK_XP.rewards} XP</p>
            </div>
          </div>
          <div style={{ maxWidth: 240, margin: "0 auto" }}>
            <div className="progress-track" style={{ height: 8 }}>
              <div className="progress-fill" style={{ width: `${Math.min(100, (xp / UNLOCK_XP.rewards) * 100)}%`, transition: "width 0.8s ease" }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="page-container">
        <div style={{ paddingTop: 24, display: "flex", flexDirection: "column", gap: 10 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton" style={{ height: 90, borderRadius: 18 }} />
          ))}
        </div>
      </div>
    );
  }

  const allRewards = (rewardsData?.allRewards?.length ? rewardsData.allRewards : STATIC_REWARDS) as typeof STATIC_REWARDS;
  const userRewards = rewardsData?.userRewards ?? [];
  const unlockedIds = new Set((userRewards as any[]).map((ur) => ur.reward_id ?? ur.rewardId));

  const filtered = filter === "all" ? allRewards : allRewards.filter(r => r.type === filter);

  return (
    <div className="page-container animate-fade-in">

      {/* ── Header ── */}
      <div style={{ paddingTop: 20, paddingBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <h1
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "1.5rem", fontWeight: 800,
                color: "var(--text-main)", letterSpacing: "-0.02em", marginBottom: 4,
              }}
            >
              Rewards
            </h1>
            <p style={{ fontSize: "0.875rem", color: "var(--text-sub)" }}>
              Spend gems on badges, stickers, and frames.
            </p>
          </div>
          {/* Gem balance */}
          <div
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "linear-gradient(135deg, #ede8ff, #ddd6fe)",
              borderRadius: 12, padding: "8px 14px",
              border: "1.5px solid rgba(124,58,237,0.2)",
            }}
          >
            <span style={{ fontSize: "1.1rem" }}>💎</span>
            <div>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: "1rem", color: "#7c3aed", lineHeight: 1 }}>
                {gems}
              </p>
              <p style={{ fontSize: "0.6rem", fontWeight: 700, color: "#6d28d9", letterSpacing: "0.05em" }}>GEMS</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Unlocked count ── */}
      <div
        className="academy-card"
        style={{
          marginBottom: 14,
          display: "flex", alignItems: "center", gap: 12,
          background: "linear-gradient(135deg, rgba(16,185,129,0.06), rgba(5,150,105,0.04))",
          border: "1.5px solid rgba(16,185,129,0.2)",
        }}
      >
        <div style={{ width: 40, height: 40, borderRadius: 11, background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", flexShrink: 0 }}>
          🏆
        </div>
        <div>
          <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-main)" }}>
            {unlockedIds.size} / {allRewards.length} Unlocked
          </p>
          <p style={{ fontSize: "0.75rem", color: "var(--text-sub)" }}>
            Complete missions to earn more gems.
          </p>
        </div>
      </div>

      {/* ── Filter tabs ── */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14, overflowX: "auto", paddingBottom: 2 }}>
        {TYPE_FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              padding: "7px 14px", borderRadius: 99,
              border: filter === f.key ? "none" : "1.5px solid rgba(91,140,255,0.15)",
              background: filter === f.key
                ? "linear-gradient(135deg, var(--primary), var(--accent))"
                : "rgba(255,255,255,0.8)",
              color: filter === f.key ? "white" : "var(--text-sub)",
              fontWeight: 700, fontSize: "0.78rem", cursor: "pointer",
              flexShrink: 0,
              boxShadow: filter === f.key ? "0 4px 12px rgba(91,140,255,0.3)" : "none",
              transition: "all 0.15s ease",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ── Rewards grid ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          marginBottom: 24,
        }}
      >
        {filtered.map((reward) => {
          const rarity = RARITY_CONFIG[reward.rarity as keyof typeof RARITY_CONFIG] ?? RARITY_CONFIG.common;
          const isUnlocked = unlockedIds.has(reward.id);
          const canAfford = gems >= reward.costGems;

          return (
            <div
              key={reward.id}
              style={{
                borderRadius: 16, overflow: "hidden",
                border: isUnlocked
                  ? "2px solid rgba(16,185,129,0.35)"
                  : `1.5px solid ${rarity.border}`,
                background: isUnlocked ? "rgba(240,253,244,0.9)" : "rgba(255,255,255,0.95)",
                boxShadow: "var(--card-shadow)",
                opacity: !isUnlocked && !canAfford ? 0.7 : 1,
                transition: "all 0.2s ease",
              }}
            >
              {/* Emoji area */}
              <div
                style={{
                  background: isUnlocked ? "#dcfce7" : rarity.bg,
                  padding: "18px 12px 14px",
                  textAlign: "center",
                  position: "relative",
                }}
              >
                <span style={{ fontSize: "2.25rem" }}>{reward.emoji}</span>
                {isUnlocked && (
                  <div
                    style={{
                      position: "absolute", top: 8, right: 8,
                      width: 20, height: 20, borderRadius: "50%",
                      background: "#10b981",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <CheckCircle2 size={12} color="white" />
                  </div>
                )}
                <div style={{ marginTop: 8 }}>
                  <span
                    style={{
                      fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.05em",
                      color: rarity.color, background: rarity.bg,
                      padding: "2px 8px", borderRadius: 99,
                      border: `1px solid ${rarity.border}`,
                    }}
                  >
                    {rarity.label.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: "12px 12px 14px" }}>
                <p style={{ fontWeight: 700, fontSize: "0.82rem", color: "var(--text-main)", marginBottom: 4, lineHeight: 1.3 }}>
                  {reward.name}
                </p>
                <p style={{ fontSize: "0.7rem", color: "var(--text-sub)", lineHeight: 1.5, marginBottom: 10 }}>
                  {reward.desc}
                </p>

                {isUnlocked ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#16a34a", fontSize: "0.75rem", fontWeight: 700 }}>
                    <CheckCircle2 size={13} />
                    Unlocked
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmReward(reward)}
                    style={{
                      width: "100%", padding: "8px 0",
                      borderRadius: 10, border: "none",
                      background: canAfford
                        ? "linear-gradient(135deg, var(--primary), var(--accent))"
                        : "rgba(226,232,240,0.7)",
                      color: canAfford ? "white" : "var(--text-muted)",
                      fontWeight: 700, fontSize: "0.78rem", cursor: canAfford ? "pointer" : "not-allowed",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                      transition: "all 0.15s ease",
                    }}
                  >
                    {canAfford ? (
                      <>{reward.costGems} 💎 Unlock</>
                    ) : (
                      <><Lock size={12} /> {reward.costGems} 💎</>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── How to earn gems ── */}
      <div className="academy-card" style={{ marginBottom: 16 }}>
        <p className="section-title" style={{ marginBottom: 12 }}>How to Earn Gems</p>
        {[
          { icon: "📅", label: "Daily Activation", value: "+5 💎" },
          { icon: "🎯", label: "Complete a Mission", value: "+8–20 💎" },
          { icon: "🔥", label: "7-Day Streak Bonus", value: "+25 💎" },
        ].map((item, i) => (
          <div
            key={item.label}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "9px 0",
              borderBottom: i < 2 ? "1px solid rgba(91,140,255,0.08)" : "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: "1rem" }}>{item.icon}</span>
              <span style={{ fontSize: "0.8125rem", color: "var(--text-sub)" }}>{item.label}</span>
            </div>
            <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#7c3aed" }}>{item.value}</span>
          </div>
        ))}
      </div>

      {/* Confirm Modal */}
      {confirmReward && (
        <ConfirmModal
          reward={confirmReward}
          gems={gems}
          onConfirm={() => unlockReward.mutate({ rewardId: confirmReward.id })}
          onCancel={() => setConfirmReward(null)}
          loading={unlockReward.isPending}
        />
      )}
    </div>
  );
}
