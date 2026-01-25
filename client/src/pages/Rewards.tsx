import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Gem, Lock, Sparkles } from "lucide-react";
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

  if (!rewardsData || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-3">
          <div className="skeleton h-32 w-full max-w-md rounded-2xl"></div>
          <div className="skeleton h-24 w-full max-w-md rounded-2xl"></div>
        </div>
      </div>
    );
  }

  const { allRewards, userRewards } = rewardsData;
  const userGems = profile.progress?.gemsTotal || 0;

  const isUnlocked = (rewardId: number) => {
    return userRewards.some(ur => ur.rewardId === rewardId);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary": return "from-yellow-500 to-orange-500";
      case "rare": return "from-purple-500 to-pink-500";
      case "common": return "from-blue-500 to-cyan-500";
      default: return "from-gray-500 to-gray-600";
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 glass-panel border-b border-white/10">
        <div className="container max-w-md mx-auto flex items-center justify-between py-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-white">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="font-display text-xl text-white">Rewards</h1>
          <div className="flex items-center gap-1 text-neon-cyan font-bold">
            <Gem className="h-5 w-5" />
            {userGems}
          </div>
        </div>
      </div>

      <div className="container max-w-md mx-auto space-y-6 pt-6">
        {/* Header Section */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 text-neon-cyan" />
            <h2 className="font-display text-2xl text-white">Loot Locker</h2>
          </div>
          <p className="text-gray-400 text-sm">
            Earn rewards by completing missions and building XP.
          </p>
        </div>

        {/* Rewards Grid */}
        <div className="grid grid-cols-2 gap-4">
          {allRewards.map((reward) => {
            const unlocked = isUnlocked(reward.id);
            const canAfford = userGems >= reward.costGems;
            
            return (
              <Card key={reward.id} className={`glass-panel overflow-hidden ${unlocked ? 'border-neon-lime border-2' : ''}`}>
                <div className={`bg-gradient-to-br ${getRarityColor(reward.rarity)} p-3 relative`}>
                  {unlocked && (
                    <div className="absolute top-1 right-1 bg-green-600 rounded-full p-1">
                      <Sparkles className="h-3 w-3 text-white" />
                    </div>
                  )}
                  <div className="aspect-square bg-black/30 rounded-xl flex items-center justify-center">
                    {reward.imageUrl ? (
                      <img src={reward.imageUrl} alt={reward.name} className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <span className="text-4xl">
                        {reward.type === "badge" ? "🏆" : reward.type === "sticker" ? "⭐" : "🖼️"}
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-3 space-y-2">
                  <div>
                    <h3 className="font-bold text-white text-sm truncate">{reward.name}</h3>
                    <p className="text-xs text-gray-400 capitalize">{reward.type}</p>
                  </div>
                  
                  {unlocked ? (
                    <div className="bg-green-600/20 border border-green-600/50 rounded-lg py-2 text-center">
                      <span className="text-green-400 text-xs font-bold">UNLOCKED</span>
                    </div>
                  ) : (
                    <Button
                      onClick={() => unlockReward.mutate({ rewardId: reward.id })}
                      disabled={!canAfford || unlockReward.isPending}
                      className={`
                        w-full h-9 font-bold rounded-lg
                        ${canAfford
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black border-b-4 border-orange-700'
                          : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        }
                      `}
                    >
                      {canAfford ? (
                        <span className="flex items-center gap-1">
                          <Gem className="h-3 w-3" />
                          {reward.costGems}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <Lock className="h-3 w-3" />
                          {reward.costGems}
                        </span>
                      )}
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Collection Progress */}
        <Card className="glass-panel p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Collection Progress</span>
            <span className="text-white font-bold">{userRewards.length}/{allRewards.length}</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-neon-pink to-neon-cyan transition-all duration-500"
              style={{ width: `${(userRewards.length / allRewards.length) * 100}%` }}
            />
          </div>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 glass-panel border-t border-white/10">
        <div className="container max-w-md mx-auto flex justify-around py-3">
          {[
            { name: "Home", icon: "🏠", href: "/" },
            { name: "Ranks", icon: "👑", href: "/ranks" },
            { name: "Missions", icon: "🎯", href: "/missions" },
            { name: "Rewards", icon: "🎁", href: "/rewards", active: true },
            { name: "Graduation", icon: "🎓", href: "/graduation" },
          ].map((item) => (
            <Link key={item.name} href={item.href}>
              <button className={`flex flex-col items-center gap-1 ${item.active ? 'text-neon-cyan' : 'text-gray-400'}`}>
                <span className="text-xl">{item.icon}</span>
                <span className="text-[10px] font-bold">{item.name}</span>
              </button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
