import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  Gem,
  Gift,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

export default function Rewards() {
  const { data: rewardsData, refetch } = trpc.fdf.getRewards.useQuery();
  const { data: profile, refetch: refetchProfile } = trpc.fdf.getProfile.useQuery();

  const unlockReward = trpc.fdf.unlockReward.useMutation({
    onSuccess: () => {
      toast.success("Reward unlocked and added to your profile.");
      refetch();
      refetchProfile();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // ── Loading State ──
  if (!rewardsData || !profile) {
    return (
      <div className="container py-8 space-y-4 animate-fade-in">
        <div className="skeleton h-6 w-48 rounded-md" />
        <div className="skeleton h-20 w-full rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-32 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const userRewards = rewardsData.userRewards ?? [];
  const allRewards = rewardsData.allRewards ?? [];
  const gems = profile.progress?.gemsTotal ?? 0;
  const isEnrolled = !!profile.fdfUser;

  return (
    <div className="container py-8 space-y-6 animate-fade-in">

      {/* ── Page Header ── */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-[oklch(0.50_0.04_280)] text-[11px] font-mono uppercase tracking-widest mb-2">
          <Gift size={11} />
          <span>Training System</span>
          <ChevronRight size={10} />
          <span className="text-[oklch(0.70_0.08_280)]">Rewards</span>
        </div>
        <h1 className="text-white">Rewards</h1>
        <p className="text-[oklch(0.55_0.04_280)] text-sm">
          Earn rewards by completing missions and building XP.
        </p>
      </div>

      {/* ── Gems Balance Panel ── */}
      <div className="panel-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[oklch(0.70_0.15_200/0.15)] border border-[oklch(0.70_0.15_200/0.25)] flex items-center justify-center">
            <Gem size={16} className="text-[oklch(0.70_0.15_200)]" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-[oklch(0.40_0.04_280)] uppercase tracking-wider block">
              Available Balance
            </span>
            <span className="text-lg font-display font-700 text-[oklch(0.70_0.15_200)]">
              {gems.toLocaleString()}{" "}
              <span className="text-xs text-[oklch(0.45_0.04_280)] font-400">gems</span>
            </span>
          </div>
        </div>
        <div className="text-[11px] font-mono text-[oklch(0.45_0.04_280)]">
          {userRewards.length} / {allRewards.length} unlocked
        </div>
      </div>

      {/* ── Not Enrolled Gate ── */}
      {!isEnrolled && (
        <div className="panel flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-[oklch(0.62_0.18_20/0.15)] border border-[oklch(0.62_0.18_20/0.25)] flex items-center justify-center shrink-0">
            <Lock size={18} className="text-[oklch(0.62_0.18_20)]" />
          </div>
          <div>
            <h3 className="text-sm font-600 text-white">Access Restricted</h3>
            <p className="text-[11px] text-[oklch(0.50_0.04_280)] mt-0.5">
              Complete your profile setup on the Home page to access rewards.
            </p>
          </div>
        </div>
      )}

      {/* ── Rewards Grid ── */}
      {isEnrolled && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allRewards.length === 0 ? (
            <div className="col-span-2 panel text-center py-12">
              <Gift size={32} className="text-[oklch(0.35_0.04_280)] mx-auto mb-3" />
              <h3 className="text-sm font-600 text-white mb-1">No Rewards Available</h3>
              <p className="text-[11px] text-[oklch(0.45_0.04_280)]">
                Rewards will be added as you progress through the system.
              </p>
            </div>
          ) : (
            allRewards.map((reward) => {
              const isUnlocked = userRewards.some((ur) => ur.rewardId === reward.id);
              const canAfford = gems >= reward.costGems;

              return (
                <div
                  key={reward.id}
                  className={cn(
                    "panel-sm transition-all duration-200",
                    isUnlocked
                      ? "module-complete opacity-80"
                      : canAfford
                        ? "hover:border-[oklch(0.45_0.08_270/0.5)] hover:bg-[oklch(0.18_0.04_280/0.9)]"
                        : "opacity-55"
                  )}
                >
                  <div className="flex items-start gap-4">
                    {/* Reward icon */}
                    <div
                      className={cn(
                        "w-12 h-12 rounded-lg flex items-center justify-center shrink-0 text-xl overflow-hidden",
                        isUnlocked
                          ? "bg-[oklch(0.68_0.16_150/0.15)] border border-[oklch(0.68_0.16_150/0.3)]"
                          : "bg-[oklch(0.20_0.04_280/0.6)] border border-[oklch(0.30_0.04_280/0.5)]"
                      )}
                    >
                      {isUnlocked ? (
                        <ShieldCheck size={22} className="text-[oklch(0.68_0.16_150)]" />
                      ) : (
                        <span>
                          {reward.type === "badge"
                            ? "🏅"
                            : reward.type === "sticker"
                              ? "⭐"
                              : "🎖️"}
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-600 text-white leading-tight">
                            {reward.name}
                          </h3>
                          {reward.type && (
                            <span className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-[oklch(0.20_0.04_280)] text-[oklch(0.45_0.04_280)] border border-[oklch(0.28_0.04_280/0.5)]">
                              {reward.type}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Cost */}
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[oklch(0.70_0.15_200)]">
                          <Gem size={9} />
                          {reward.costGems} gems
                        </span>
                        {!canAfford && !isUnlocked && (
                          <span className="text-[10px] font-mono text-[oklch(0.62_0.18_20/0.8)]">
                            · Need {(reward.costGems - gems).toLocaleString()} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action */}
                    <div className="shrink-0">
                      {isUnlocked ? (
                        <span className="text-[10px] font-mono text-[oklch(0.68_0.16_150)] uppercase tracking-wider">
                          Owned
                        </span>
                      ) : (
                        <button
                          className={cn(
                            "text-xs px-3 py-1.5 rounded-md font-600 transition-all duration-150",
                            canAfford
                              ? "btn-primary"
                              : "bg-[oklch(0.20_0.04_280)] text-[oklch(0.40_0.04_280)] border border-[oklch(0.28_0.04_280/0.5)] cursor-not-allowed"
                          )}
                          onClick={() =>
                            canAfford && unlockReward.mutate({ rewardId: reward.id })
                          }
                          disabled={!canAfford || unlockReward.isPending}
                        >
                          {unlockReward.isPending ? "..." : "Unlock"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
