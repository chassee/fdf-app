import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, CheckCircle2, Circle, Target } from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";

export default function Missions() {
  const { data: missionsData, refetch } = trpc.fdf.getMissions.useQuery();
  const { data: profile, refetch: refetchProfile } = trpc.fdf.getProfile.useQuery();
  
  const claimMission = trpc.fdf.claimMission.useMutation({
    onSuccess: () => {
      toast.success("Mission collected! XP & Gems added.");
      refetch();
      refetchProfile();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleClaim = (missionId: number) => {
    claimMission.mutate({ missionId });
  };

  if (!missionsData || !profile) {
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

  const completedCount = missionsData.completions?.filter(c => c.status === 'claimed').length || 0;
  const totalCount = missionsData.missions.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

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
          <h1 className="text-xl font-bold text-primary">Weekly Missions</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="container max-w-4xl mx-auto space-y-6 pt-6 relative z-10">
        
        {/* Progress Overview */}
        <Card className="glass-panel p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-cyan/20 flex items-center justify-center">
              <Target className="h-6 w-6 text-cyan" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-primary">Mission Progress</h2>
              <p className="text-sm text-secondary">Complete weekly missions to build real skills and earn XP.</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-secondary">{completedCount} of {totalCount} completed</span>
              <span className="text-primary font-semibold">{Math.round(progressPercent)}%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan to-violet transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Current Stats */}
          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{profile.progress?.xpTotal || 0}</div>
              <div className="text-xs text-tertiary">Total XP</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan">{profile.progress?.gemsTotal || 0}</div>
              <div className="text-xs text-tertiary">Gems</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald">{profile.progress?.rankName || "Pup"}</div>
              <div className="text-xs text-tertiary">Rank</div>
            </div>
          </div>
        </Card>

        {/* Mission List */}
        <div className="space-y-4">
          {missionsData.missions.map((mission) => {
            const isClaimed = missionsData.completions?.some(c => c.missionId === mission.id && c.status === 'claimed') || false;
            
            return (
              <Card key={mission.id} className="glass-panel p-6">
                <div className="flex items-start gap-4">
                  {/* Status Icon */}
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    isClaimed ? 'bg-emerald/20' : 'bg-white/5'
                  }`}>
                    {isClaimed ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald" />
                    ) : (
                      <Circle className="h-5 w-5 text-tertiary" />
                    )}
                  </div>

                  {/* Mission Content */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="text-lg font-semibold text-primary mb-1">{mission.title}</h3>
                      <p className="text-sm text-secondary leading-relaxed">{mission.description}</p>
                    </div>

                    {/* Rewards */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1.5">
                        <span className="text-violet font-semibold">+{mission.xpReward}</span>
                        <span className="text-tertiary">XP</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-cyan font-semibold">+{mission.gemsReward}</span>
                        <span className="text-tertiary">Gems</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      onClick={() => handleClaim(mission.id)}
                      disabled={isClaimed || claimMission.isPending}
                      className={`w-full sm:w-auto ${
                        isClaimed
                          ? 'bg-white/5 text-tertiary cursor-not-allowed'
                          : 'bg-violet hover:bg-violet/90 text-white'
                      } font-semibold h-10 px-6 rounded-lg transition-all`}
                    >
                      {isClaimed ? "Collected" : "Collect Reward"}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {missionsData.missions.length === 0 && (
          <Card className="glass-panel p-12 text-center">
            <Target className="h-12 w-12 text-tertiary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-primary mb-2">No Active Missions</h3>
            <p className="text-sm text-secondary">New missions will appear here weekly.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
