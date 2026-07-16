import { useState, useEffect } from "react";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { getProgressionState, ProgressionState, isMissionUnlocked } from "@/lib/progression";
import { getUserProgressionState } from "@/lib/supabaseClient";
import { getAvailableMissions } from "@/lib/missions";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Zap, Lock } from "lucide-react";

export default function Missions() {
  const { user, isLoading } = useOnboarding();
  const [, navigate] = useLocation();
  const [progression, setProgression] = useState<ProgressionState>(getProgressionState(0));
  const [loadingProgression, setLoadingProgression] = useState(true);

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
          <p className="text-gray-600">Loading missions...</p>
        </div>
      </div>
    );
  }

  const availableMissions = getAvailableMissions(progression.currentLevel);

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
        <p className="text-blue-100">Level {progression.currentLevel} • {progression.totalXp} XP Total</p>
      </div>

      {/* Progress Bar - FIXED: Now shows real XP-into-level */}
      <div className="p-6 bg-white border-b">
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-700">Progress to Level {progression.currentLevel + 1}</span>
            <span className="text-sm text-gray-500">{progression.progressPercent}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-300"
              style={{ width: `${progression.progressPercent}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {progression.xpIntoCurrentLevel} / {progression.xpNeededForNextLevel} XP
          </p>
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
                {missions.map((mission) => {
                  const isUnlocked = isMissionUnlocked(mission.level, progression.currentLevel);
                  
                  return (
                    <Card
                      key={mission.id}
                      className={`p-4 transition-all ${
                        isUnlocked
                          ? "hover:shadow-lg cursor-pointer border-l-4 border-l-blue-500"
                          : "opacity-60 border-l-4 border-l-gray-300"
                      }`}
                      onClick={() => isUnlocked && navigate(`/mission/${mission.id}`)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">{mission.icon}</span>
                            <div>
                              <h4 className="font-bold text-gray-900">{mission.title}</h4>
                              <p className="text-sm text-gray-600">{mission.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                            <span>⏱ {mission.timeEstimate}</span>
                            <span>⚡ +{mission.xpReward} XP</span>
                            <span>📊 {mission.tier}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {isUnlocked ? (
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/mission/${mission.id}`);
                              }}
                            >
                              Start
                            </Button>
                          ) : (
                            <div className="flex items-center gap-1 text-gray-500">
                              <Lock size={16} />
                              <span className="text-xs">Level {mission.level}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Locked Missions Info */}
      {availableMissions.length > 0 && (
        <div className="p-6 bg-blue-50 border-t">
          <h3 className="font-semibold text-gray-900 mb-2">Unlock More Missions</h3>
          <p className="text-sm text-gray-600">
            Complete missions and earn XP to level up and unlock new challenges. Each level unlocks new financial skills!
          </p>
        </div>
      )}
    </div>
  );
}
