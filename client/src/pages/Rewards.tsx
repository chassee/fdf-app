import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Award, Lock, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";

export default function Rewards() {
  const { data: rewardsData, refetch } = trpc.fdf.getRewards.useQuery();
  const { data: profile, refetch: refetchProfile } = trpc.fdf.getProfile.useQuery();
  
  const unlockReward = trpc.fdf.unlockReward.useMutation({
    onSuccess: () => {
      toast.success("Reward unlocked!");
      refetch();
      refetchProfile();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleUnlock = (rewardId: number) => {
    unlockReward.mutate({ rewardId });
  };

  if (!rewardsData || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-2xl space-y-4">
          <div className="skeleton h-40 w-full"></div>
          <div className="skeleton h-32 w-full"></div>
          <div className="skeleton h-32 w-full"></div>
        </div>
      </div>
    );
  }

  const unlockedCount = rewardsData.userRewards?.length || 0;
  const totalCount = rewardsData.allRewards.length;

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 glass-panel border-b border-white/10">
        <div className="container max-w-4xl mx-auto flex items-center justify-between py-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-secondary hover:text-primary">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-primary">Achievement Rewards</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="container max-w-4xl mx-auto space-y-6 pt-6 relative z-10">
        
        {/* Progress Overview */}
        <Card className="glass-panel p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-amber/20 flex items-center justify-center">
              <Award className="h-6 w-6 text-amber" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-primary">Reward Progress</h2>
              <p className="text-sm text-secondary">Earn rewards by completing missions and building XP.</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{unlockedCount}</div>
              <div className="text-xs text-tertiary">Unlocked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan">{profile.progress?.gemsTotal || 0}</div>
              <div className="text-xs text-tertiary">Gems</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-tertiary">{totalCount - unlockedCount}</div>
              <div className="text-xs text-tertiary">Locked</div>
            </div>
          </div>
        </Card>

        {/* Rewards Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {rewardsData.allRewards.map((reward) => {
            const isUnlocked = rewardsData.userRewards?.some(ur => ur.rewardId === reward.id) || false;
            const canAfford = (profile.progress?.gemsTotal || 0) >= reward.costGems;
            
            return (
              <Card key={reward.id} className={`glass-panel p-6 ${!isUnlocked && !canAfford ? 'opacity-60' : ''}`}>
                <div className="space-y-4">
                  {/* Reward Header */}
                  <div className="flex items-start gap-4">
                    <div className={`w-16 h-16 rounded-lg flex items-center justify-center text-3xl ${
                      isUnlocked ? 'bg-emerald/20' : 'bg-white/5'
                    }`}>
                      {isUnlocked ? '✓' : '🏆'}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-primary mb-1">{reward.name}</h3>
                      <p className="text-sm text-secondary">{reward.type} • {reward.rarity}</p>
                    </div>
                  </div>

                  {/* Cost & Action */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-cyan" />
                      <span className="text-sm font-semibold text-primary">{reward.costGems} Gems</span>
                    </div>
                    
                    {isUnlocked ? (
                      <div className="flex items-center gap-2 text-sm text-emerald">
                        <Award className="h-4 w-4" />
                        <span className="font-semibold">Unlocked</span>
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleUnlock(reward.id)}
                        disabled={!canAfford || unlockReward.isPending}
                        className={`${
                          canAfford
                            ? 'bg-violet hover:bg-violet/90 text-white'
                            : 'bg-white/5 text-tertiary cursor-not-allowed'
                        } font-semibold h-9 px-4 rounded-lg transition-all`}
                      >
                        {canAfford ? (
                          <>
                            <Lock className="h-4 w-4 mr-1.5" />
                            Unlock
                          </>
                        ) : (
                          'Insufficient Gems'
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {rewardsData.allRewards.length === 0 && (
          <Card className="glass-panel p-12 text-center">
            <Award className="h-12 w-12 text-tertiary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-primary mb-2">No Rewards Available</h3>
            <p className="text-sm text-secondary">Complete missions to unlock rewards.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
