import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, CheckCircle2, Clock, Gem, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";

export default function Missions() {
  const { data: missionsData, refetch } = trpc.fdf.getMissions.useQuery();
  const { data: profile, refetch: refetchProfile } = trpc.fdf.getProfile.useQuery();
  
  const claimMission = trpc.fdf.claimMission.useMutation({
    onSuccess: () => {
      toast.success("Mission collected! XP & Gems added!");
      refetch();
      refetchProfile();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  if (!missionsData || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-lime"></div>
      </div>
    );
  }

  const { missions, completions } = missionsData;

  const getMissionStatus = (missionId: number) => {
    const completion = completions.find(c => c.missionId === missionId);
    return completion?.status || "available";
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
          <h1 className="font-display text-xl text-white">Missions</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="container max-w-md mx-auto space-y-6 pt-6">
        {/* Header Section */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 text-neon-lime" />
            <h2 className="font-display text-2xl text-white">Weekly Missions</h2>
          </div>
          <p className="text-gray-400 text-sm">
            Complete weekly missions to build real skills and earn XP.
          </p>
        </div>

        {/* Progress Bar */}
        <Card className="glass-panel p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Your Progress</span>
            <span className="text-neon-lime font-bold">{profile.progress?.rankName || "Pup"}</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-neon-lime to-neon-cyan transition-all duration-500"
              style={{ width: `${Math.min((profile.progress?.xpTotal || 0) / 1000 * 100, 100)}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-500">XP: {profile.progress?.xpTotal || 0}</span>
            <span className="text-xs text-neon-cyan flex items-center gap-1">
              <Gem className="h-3 w-3" />
              {profile.progress?.gemsTotal || 0}
            </span>
          </div>
        </Card>

        {/* Missions List */}
        <div className="space-y-4">
          {missions.length === 0 ? (
            <Card className="glass-panel p-6 text-center">
              <Clock className="h-12 w-12 text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400">No missions available right now.</p>
              <p className="text-sm text-gray-500 mt-1">Check back soon!</p>
            </Card>
          ) : (
            missions.map((mission) => {
              const status = getMissionStatus(mission.id);
              const isClaimed = status === "claimed";
              
              return (
                <Card key={mission.id} className={`glass-panel overflow-hidden ${isClaimed ? 'opacity-60' : ''}`}>
                  <div className="bg-gradient-to-r from-purple-600/20 to-transparent p-3 border-b border-white/10 flex justify-between items-center">
                    <span className="font-display text-neon-lime text-xs tracking-wide">
                      YEAR {mission.yearTrack} MISSION
                    </span>
                    {isClaimed && (
                      <span className="bg-green-600/50 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        CLAIMED
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-white text-lg leading-tight mb-2">
                      {mission.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">{mission.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex gap-3">
                        <div className="flex items-center gap-1">
                          <Sparkles className="h-4 w-4 text-neon-lime" />
                          <span className="text-white font-bold text-sm">{mission.xpReward}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Gem className="h-4 w-4 text-neon-cyan" />
                          <span className="text-white font-bold text-sm">{mission.gemsReward}</span>
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => claimMission.mutate({ missionId: mission.id })}
                        disabled={isClaimed || claimMission.isPending}
                        className={`
                          ${isClaimed 
                            ? 'bg-gray-700 text-gray-400' 
                            : 'bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black'
                          }
                          font-bold rounded-xl h-9 px-6 border-b-4 
                          ${isClaimed ? 'border-gray-800' : 'border-blue-700'}
                          active:border-b-0 active:translate-y-1 transition-all
                        `}
                      >
                        {isClaimed ? "Collected" : "Collect"}
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 glass-panel border-t border-white/10">
        <div className="container max-w-md mx-auto flex justify-around py-3">
          {[
            { name: "Home", icon: "🏠", href: "/" },
            { name: "Ranks", icon: "👑", href: "/ranks" },
            { name: "Missions", icon: "🎯", href: "/missions", active: true },
            { name: "Rewards", icon: "🎁", href: "/rewards" },
            { name: "Graduation", icon: "🎓", href: "/graduation" },
          ].map((item) => (
            <Link key={item.name} href={item.href}>
              <button className={`flex flex-col items-center gap-1 ${item.active ? 'text-neon-lime' : 'text-gray-400'}`}>
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
