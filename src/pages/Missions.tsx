import { useLocation } from "wouter";
import { useFDF } from "@/contexts/FDFContext";
import { getAvailableMissions } from "@/lib/missions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Zap, Lock } from "lucide-react";
import { getMissionUnlockProgress } from "@/lib/missionUnlock";

export default function Missions() {
  const [, navigate] = useLocation();
  const { xp, level } = useFDF();

  const availableMissions = getAvailableMissions(level);
  const progressPercent = ((xp % 100) / 100) * 100;

  const getTierName = (tier: string) => {
    if (tier === "Foundation") return "Foundation Tier (Ages 13-14)";
    if (tier === "Builder") return "Builder Tier (Ages 14-16)";
    if (tier === "Operator") return "Operator Tier (Ages 16-17)";
    return tier;
  };

  const groupByTier = (missions: typeof availableMissions) => {
    const grouped: Record<string, typeof missions> = {};
    missions.forEach((m) => {
      if (!grouped[m.tier]) grouped[m.tier] = [];
      grouped[m.tier].push(m);
    });
    return grouped;
  };

  const availableByTier = groupByTier(availableMissions);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 sticky top-0 z-10">
        <h1 className="text-3xl font-bold mb-2">Missions</h1>
        <p className="text-blue-100">Level {level} • {xp} XP Total</p>
      </div>

      {/* Progress Bar */}
      <div className="p-6 bg-white border-b">
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-700">Progress to Level {level + 1}</span>
            <span className="text-sm text-gray-500">{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Available Missions */}
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Available Missions</h2>

        {availableMissions.length === 0 ? (
          <Card className="p-8 text-center bg-blue-50 border-blue-200">
            <p className="text-gray-600 mb-4">No missions available yet. Level up to unlock new ones!</p>
          </Card>
        ) : (
          Object.entries(availableByTier).map(([tier, missions]) => (
            <div key={tier} className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">{getTierName(tier)}</h3>
              <div className="space-y-3">
                {missions.map((mission) => (
                  <Card
                    key={mission.id}
                    className="p-4 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-blue-500"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{mission.icon}</span>
                          <div>
                            <h4 className="text-lg font-bold text-gray-900">{mission.title}</h4>
                            <p className="text-sm text-gray-500">Level {mission.level} • {mission.timeEstimate}</p>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-2 text-sm">{mission.description}</p>
                        <div className="flex flex-wrap gap-2 text-sm">
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-semibold flex items-center gap-1">
                            <Zap size={14} /> +{mission.xpReward} XP
                          </span>
                        </div>
                      </div>
                      <Button
                        onClick={() => navigate(`/mission/${mission.id}`)}
                        className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold whitespace-nowrap"
                      >
                        Start
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))
        )}

        {/* Locked Missions with Progress */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Upcoming Missions</h2>
          <div className="space-y-3">
            {getAvailableMissions(50)
              .filter((m) => m.level > level)
              .slice(0, 3)
              .map((mission) => {
                const { progressPercent: unlockProgress, xpNeeded } = getMissionUnlockProgress(mission, xp);
                return (
                  <Card key={mission.id} className="p-4 bg-gray-50 border-l-4 border-l-gray-300 opacity-75">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Lock size={20} className="text-gray-400" />
                          <div>
                            <h4 className="text-lg font-bold text-gray-700">{mission.title}</h4>
                            <p className="text-sm text-gray-500">Unlocks at Level {mission.level}</p>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-gray-600 font-semibold">Unlock Progress</span>
                            <span className="text-xs text-gray-600">{xpNeeded} XP needed</span>
                          </div>
                          <div className="w-full bg-gray-300 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-gray-400 to-gray-500 h-full transition-all duration-300"
                              style={{ width: `${unlockProgress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
