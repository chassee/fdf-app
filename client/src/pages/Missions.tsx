import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  ChevronRight,
  Circle,
  Gem,
  Lock,
  Target,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

export default function Missions() {
  const { data: missionsData, refetch } = trpc.fdf.getMissions.useQuery();
  const { data: profile, refetch: refetchProfile } = trpc.fdf.getProfile.useQuery();

  const claimMission = trpc.fdf.claimMission.useMutation({
    onSuccess: () => {
      toast.success("Mission complete. XP & Gems added to your account.");
      refetch();
      refetchProfile();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // ── Loading State ──
  if (!missionsData || !profile) {
    return (
      <div className="container py-8 space-y-4 animate-fade-in">
        <div className="skeleton h-6 w-48 rounded-md" />
        <div className="skeleton h-24 w-full rounded-xl" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-28 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  const completions = missionsData.completions ?? [];
  const completedCount = completions.filter((c) => c.status === "claimed").length;
  const totalCount = missionsData.missions.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const isEnrolled = !!profile.fdfUser;

  return (
    <div className="container py-8 space-y-6 animate-fade-in">

      {/* ── Page Header ── */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-[oklch(0.50_0.04_280)] text-[11px] font-mono uppercase tracking-widest mb-2">
          <Target size={11} />
          <span>Training System</span>
          <ChevronRight size={10} />
          <span className="text-[oklch(0.70_0.08_280)]">Missions</span>
        </div>
        <h1 className="text-white">Weekly Missions</h1>
        <p className="text-[oklch(0.55_0.04_280)] text-sm">
          Complete training modules each week to build real skills and earn XP.
        </p>
      </div>

      {/* ── Progress Panel ── */}
      <div className="panel">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-sm font-display font-700 text-white uppercase tracking-widest">
              Weekly Progress
            </h2>
            <p className="text-[11px] font-mono text-[oklch(0.45_0.04_280)] mt-0.5">
              {completedCount} of {totalCount} modules completed
            </p>
          </div>
          <span className="text-xs font-mono font-600 text-[oklch(0.72_0.16_270)]">
            {Math.round(progressPercent)}%
          </span>
        </div>

        {/* Progress bar */}
        <div className="progress-track mb-5">
          <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total XP",  value: (profile.progress?.xpTotal ?? 0).toLocaleString(), color: "oklch(0.72_0.16_270)", icon: Zap },
            { label: "Gems",      value: (profile.progress?.gemsTotal ?? 0).toLocaleString(), color: "oklch(0.70_0.15_200)", icon: Gem },
            { label: "Rank",      value: profile.progress?.rankName ?? "Pup", color: "oklch(0.78_0.14_85)", icon: Target },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-3 rounded-lg bg-[oklch(0.14_0.03_280/0.6)] border border-[oklch(0.25_0.03_280/0.4)]"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <stat.icon size={11} style={{ color: stat.color }} />
                <span className="text-[10px] font-mono text-[oklch(0.40_0.04_280)] uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
              <span className="text-sm font-display font-700" style={{ color: stat.color }}>
                {stat.value}
              </span>
            </div>
          ))}
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
              Complete your profile setup on the Home page to unlock missions.
            </p>
          </div>
        </div>
      )}

      {/* ── Mission List ── */}
      {isEnrolled && (
        <div className="space-y-3">
          {missionsData.missions.length === 0 ? (
            <div className="panel text-center py-12">
              <Target size={32} className="text-[oklch(0.35_0.04_280)] mx-auto mb-3" />
              <h3 className="text-sm font-600 text-white mb-1">No Active Missions</h3>
              <p className="text-[11px] text-[oklch(0.45_0.04_280)]">
                New training modules will appear here weekly.
              </p>
            </div>
          ) : (
            missionsData.missions.map((mission, index) => {
              const isClaimed = completions.some(
                (c) => c.missionId === mission.id && c.status === "claimed"
              );

              return (
                <div
                  key={mission.id}
                  className={cn(
                    "panel-sm transition-all duration-200",
                    isClaimed
                      ? "module-complete opacity-70"
                      : "hover:border-[oklch(0.45_0.08_270/0.5)] hover:bg-[oklch(0.18_0.04_280/0.9)]"
                  )}
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <div className="flex items-start gap-4">
                    {/* Status indicator */}
                    <div
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                        isClaimed
                          ? "bg-[oklch(0.68_0.16_150/0.15)] border border-[oklch(0.68_0.16_150/0.3)]"
                          : "bg-[oklch(0.20_0.04_280/0.6)] border border-[oklch(0.30_0.04_280/0.5)]"
                      )}
                    >
                      {isClaimed ? (
                        <CheckCircle2 size={16} className="text-[oklch(0.68_0.16_150)]" />
                      ) : (
                        <Circle size={16} className="text-[oklch(0.40_0.04_280)]" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div>
                        <h3 className="text-sm font-600 text-white leading-tight">{mission.title}</h3>
                        <p className="text-[11px] text-[oklch(0.50_0.04_280)] mt-0.5 leading-relaxed">
                          {mission.description}
                        </p>
                      </div>

                      {/* Reward tags */}
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[oklch(0.65_0.18_270/0.12)] border border-[oklch(0.65_0.18_270/0.25)] text-[10px] font-mono text-[oklch(0.72_0.16_270)]">
                          <Zap size={9} />
                          +{mission.xpReward} XP
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[oklch(0.70_0.15_200/0.12)] border border-[oklch(0.70_0.15_200/0.25)] text-[10px] font-mono text-[oklch(0.70_0.15_200)]">
                          <Gem size={9} />
                          +{mission.gemsReward} Gems
                        </span>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="shrink-0">
                      {isClaimed ? (
                        <span className="text-[10px] font-mono text-[oklch(0.68_0.16_150)] uppercase tracking-wider">
                          Complete
                        </span>
                      ) : (
                        <button
                          className="btn-primary text-xs px-3 py-1.5"
                          onClick={() => claimMission.mutate({ missionId: mission.id })}
                          disabled={claimMission.isPending}
                        >
                          {claimMission.isPending ? "..." : "Collect"}
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
