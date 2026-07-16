import { useState, useEffect } from "react";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { getProgressionState, ProgressionState } from "@/lib/progression";
import { getUserProgressionState } from "@/lib/supabaseClient";
import { ArrowRight, CheckCircle2, Lock, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// ── Static fallback rewards ───────────────────────────────────────────────────
const STATIC_REWARDS = [
  { id: 1,  name: "Builder Badge",     costGems: 100, type: "badge",   rarity: "common",    emoji: "🏗️", desc: "Awarded to builders who complete their first product mission.", unlocksAtLevel: 1 },
  { id: 2,  name: "Creator Badge",     costGems: 100, type: "badge",   rarity: "common",    emoji: "🎨", desc: "For creators who launch their first digital project.", unlocksAtLevel: 1 },
  { id: 3,  name: "Tech Badge",        costGems: 100, type: "badge",   rarity: "common",    emoji: "⚙️", desc: "Earned by tech dawgs who complete a code challenge.", unlocksAtLevel: 1 },
  { id: 4,  name: "Money Badge",       costGems: 100, type: "badge",   rarity: "common",    emoji: "💰", desc: "For money dawgs who hit their first savings milestone.", unlocksAtLevel: 1 },
  { id: 5,  name: "Streak Shield",     costGems: 150, type: "sticker", rarity: "uncommon",  emoji: "🔥", desc: "Protect a 7-day streak from breaking once.", unlocksAtLevel: 2 },
  { id: 6,  name: "Atlas Dawg",        costGems: 250, type: "badge",   rarity: "rare",      emoji: "🌍", desc: "Reserved for dawgs who complete all 8 core missions.", unlocksAtLevel: 3 },
  { id: 7,  name: "Vault Preview",     costGems: 300, type: "sticker", rarity: "rare",      emoji: "🔓", desc: "Early preview access to the Crypdawgs Vault interface.", unlocksAtLevel: 4 },
  { id: 8,  name: "Elite Frame",       costGems: 200, type: "frame",   rarity: "uncommon",  emoji: "🖼️", desc: "A premium profile frame for Development-rank members.", unlocksAtLevel: 3 },
  { id: 9,  name: "Founder's Mark",    costGems: 500, type: "badge",   rarity: "legendary", emoji: "⭐", desc: "Ultra-rare badge for the first 100 FDF graduates.", unlocksAtLevel: 5 },
  { id: 10, name: "Diamond Paw",       costGems: 400, type: "sticker", rarity: "legendary", emoji: "💎", desc: "The rarest sticker in the FDF collection.", unlocksAtLevel: 5 },
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
        <div style={{ fontSize: 64, marginBottom: 16 }}>{reward.emoji}</div>
        <h2 style={{ fontSize: 20, fontWeight: "bold", marginBottom: 8, color: "#0f172a" }}>{reward.name}</h2>
        <p style={{ fontSize: 13, color: "#64748b", marginBottom: 16 }}>{reward.desc}</p>
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          <div style={{ flex: 1, padding: 12, background: rarity.bg, borderRadius: 12, border: `1px solid ${rarity.border}` }}>
            <p style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>RARITY</p>
            <p style={{ fontSize: 14, fontWeight: "bold", color: rarity.color }}>{rarity.label}</p>
          </div>
          <div style={{ flex: 1, padding: 12, background: "#f0fdf4", borderRadius: 12, border: "1px solid rgba(34,197,94,0.2)" }}>
            <p style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>COST</p>
            <p style={{ fontSize: 14, fontWeight: "bold", color: "#22c55e" }}>{reward.costGems} 💎</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: "12px 16px", borderRadius: 10, border: "1px solid #e2e8f0",
              background: "#f8fafc", color: "#334155", fontWeight: 600, cursor: "pointer",
              fontSize: 14,
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!canAfford || loading}
            style={{
              flex: 1, padding: "12px 16px", borderRadius: 10, border: "none",
              background: canAfford ? "#3b82f6" : "#cbd5e1", color: "white", fontWeight: 600,
              cursor: canAfford && !loading ? "pointer" : "not-allowed", fontSize: 14,
            }}
          >
            {loading ? "Processing..." : "Confirm"}
          </button>
        </div>
        {!canAfford && (
          <p style={{ fontSize: 12, color: "#ef4444", marginTop: 12 }}>
            You need {reward.costGems - gems} more gems
          </p>
        )}
      </div>
    </div>
  );
}

export default function Rewards() {
  const { user, isLoading } = useOnboarding();
  const [progression, setProgression] = useState<ProgressionState>(getProgressionState(0));
  const [loadingProgression, setLoadingProgression] = useState(true);
  const [filter, setFilter] = useState<"all" | "badge" | "sticker" | "frame">("all");
  const [confirmingReward, setConfirmingReward] = useState<typeof STATIC_REWARDS[number] | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch canonical progression state from user_state table
  useEffect(() => {
    if (!user?.id) return;
    
    const fetchProgression = async () => {
      setLoadingProgression(true);
      const state = await getUserProgressionState(user.id);
      if (state) {
        setProgression(state);
      }
      setLoadingProgression(false);
    };
    
    fetchProgression();
  }, [user?.id]);

  if (isLoading || loadingProgression) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading rewards...</p>
        </div>
      </div>
    );
  }

  const handleRedeem = async (reward: typeof STATIC_REWARDS[number]) => {
    // Check if user has enough gems (for now, just use a placeholder)
    const userGems = 500; // TODO: Get from user_state
    
    if (userGems < reward.costGems) {
      toast.error(`You need ${reward.costGems - userGems} more gems`);
      return;
    }
    
    setConfirmingReward(reward);
  };

  const confirmRedeem = async () => {
    if (!confirmingReward) return;
    
    setLoading(true);
    try {
      // TODO: Call API to redeem reward
      toast.success(`Redeemed ${confirmingReward.name}!`);
      setConfirmingReward(null);
    } catch (err) {
      toast.error("Failed to redeem reward");
    } finally {
      setLoading(false);
    }
  };

  const filteredRewards = STATIC_REWARDS.filter((r) => {
    if (filter === "all") return true;
    return r.type === filter;
  });

  const unlockedRewards = filteredRewards.filter((r) => r.unlocksAtLevel <= progression.currentLevel);
  const lockedRewards = filteredRewards.filter((r) => r.unlocksAtLevel > progression.currentLevel);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 sticky top-0 z-10">
        <h1 className="text-3xl font-bold mb-2">Rewards Shop</h1>
        <p className="text-blue-100">Collect badges, stickers, and frames as you progress</p>
      </div>

      {/* Gems Info */}
      <div className="p-6 bg-white border-b">
        <Card className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-semibold">YOUR GEMS</p>
              <p className="text-3xl font-bold text-amber-600">500 💎</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 font-semibold">LEVEL {progression.currentLevel}</p>
              <p className="text-sm text-gray-700">Unlock more rewards by leveling up</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="p-6 border-b">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {TYPE_FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key as typeof filter)}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                border: "1px solid #e2e8f0",
                background: filter === f.key ? "#3b82f6" : "#f8fafc",
                color: filter === f.key ? "white" : "#334155",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: 14,
                whiteSpace: "nowrap",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Unlocked Rewards */}
      {unlockedRewards.length > 0 && (
        <div className="p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Available Rewards</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {unlockedRewards.map((reward) => {
              const rarity = RARITY_CONFIG[reward.rarity as keyof typeof RARITY_CONFIG];
              return (
                <Card
                  key={reward.id}
                  className="p-4 hover:shadow-lg transition-all cursor-pointer"
                  style={{ borderLeft: `4px solid ${rarity.color}` }}
                  onClick={() => handleRedeem(reward)}
                >
                  <div className="text-center">
                    <div style={{ fontSize: 48, marginBottom: 8 }}>{reward.emoji}</div>
                    <h3 className="font-bold text-gray-900 mb-1">{reward.name}</h3>
                    <p className="text-xs text-gray-600 mb-3">{reward.desc}</p>
                    <div className="flex items-center justify-between">
                      <span style={{ fontSize: 12, fontWeight: 600, color: rarity.color }}>
                        {rarity.label}
                      </span>
                      <span className="font-bold text-amber-600">{reward.costGems} 💎</span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Locked Rewards */}
      {lockedRewards.length > 0 && (
        <div className="p-6 border-t">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Locked Rewards</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 opacity-50">
            {lockedRewards.map((reward) => {
              const rarity = RARITY_CONFIG[reward.rarity as keyof typeof RARITY_CONFIG];
              return (
                <Card
                  key={reward.id}
                  className="p-4"
                  style={{ borderLeft: `4px solid ${rarity.color}` }}
                >
                  <div className="text-center">
                    <div style={{ fontSize: 48, marginBottom: 8, opacity: 0.5 }}>{reward.emoji}</div>
                    <h3 className="font-bold text-gray-900 mb-1">{reward.name}</h3>
                    <p className="text-xs text-gray-600 mb-3">{reward.desc}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-gray-500">
                        <Lock size={14} />
                        <span className="text-xs font-semibold">Level {reward.unlocksAtLevel}</span>
                      </div>
                      <span className="font-bold text-amber-600">{reward.costGems} 💎</span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {confirmingReward && (
        <ConfirmModal
          reward={confirmingReward}
          gems={500}
          onConfirm={confirmRedeem}
          onCancel={() => setConfirmingReward(null)}
          loading={loading}
        />
      )}
    </div>
  );
}
