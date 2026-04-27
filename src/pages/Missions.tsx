import { useState, useEffect } from "react";
import { ALL_MISSIONS } from "@/lib/comprehensive-missions";
import { getAvailableMissions, getLockedMissions, getLevelByXP, getProgressToNextLevel } from "@/lib/mission-unlock-logic";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Missions() {
  const [userProgress, setUserProgress] = useState({
    user_id: "demo-user",
    completed_missions: ["f1w1m1", "f1w2m1", "f1w3m1"],
    current_tier: "foundation" as const,
    current_month: 1,
    total_xp: 450,
    date_of_birth: "2010-05-15",
  });

  const allMissionsArray = Object.values(ALL_MISSIONS).flat();
  const availableMissions = getAvailableMissions(userProgress, allMissionsArray);
  const lockedMissions = getLockedMissions(userProgress, allMissionsArray);

  const currentLevel = getLevelByXP(userProgress.total_xp);
  const progressToNext = getProgressToNextLevel(userProgress.total_xp, currentLevel);

  const tierNames = {
    foundation: "Foundation (Age 13)",
    builder: "Builder (Age 14)",
    operator: "Operator (Age 15)",
    vault_prep: "Vault Prep (Age 16-17)",
  };

  const groupByMonth = (missions: typeof availableMissions) => {
    const grouped: Record<number, typeof missions> = {};
    missions.forEach((m) => {
      if (!grouped[m.month]) grouped[m.month] = [];
      grouped[m.month].push(m);
    });
    return grouped;
  };

  const availableByMonth = groupByMonth(availableMissions);
  const lockedByMonth = groupByMonth(lockedMissions);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 sticky top-0 z-10">
        <h1 className="text-3xl font-bold mb-2">Missions</h1>
        <p className="text-blue-100">{tierNames[userProgress.current_tier]}</p>
      </div>

      {/* Progress Bar */}
      <div className="p-6 bg-white border-b">
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-700">Level {currentLevel}</span>
            <span className="text-sm text-gray-500">{userProgress.total_xp} XP</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-300"
              style={{ width: `${progressToNext}%` }}
            />
          </div>
        </div>
      </div>

      {/* Available Missions */}
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Available Missions</h2>

        {Object.entries(availableByMonth).length === 0 ? (
          <Card className="p-8 text-center bg-blue-50 border-blue-200">
            <p className="text-gray-600 mb-4">No missions available yet. Complete more missions to unlock new ones!</p>
          </Card>
        ) : (
          Object.entries(availableByMonth).map(([month, missions]) => (
            <div key={month} className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Month {month}</h3>
              <div className="space-y-4">
                {missions.map((mission) => (
                  <Card
                    key={mission.id}
                    className="p-4 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-blue-500"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-3xl">{mission.icon}</span>
                          <div>
                            <h4 className="text-lg font-bold text-gray-900">{mission.title}</h4>
                            <p className="text-sm text-gray-500">
                              {userProgress.current_tier} • Level {currentLevel}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-3">{mission.description}</p>
                        <div className="flex flex-wrap gap-3 text-sm">
                          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-semibold">
                            ⚡ +{mission.xp} XP
                          </span>
                          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                            ⏱️ {mission.estimated_time_minutes} min
                          </span>
                          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full capitalize">
                            {mission.difficulty}
                          </span>
                        </div>
                      </div>
                      <Button className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold">
                        Start
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Locked Missions */}
      {Object.entries(lockedByMonth).length > 0 && (
        <div className="p-6 border-t">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Locked Missions</h2>
          <div className="space-y-4">
            {Object.entries(lockedByMonth).map(([month, missions]) => (
              <div key={`locked-${month}`}>
                <h3 className="text-lg font-semibold text-gray-600 mb-3 opacity-60">Month {month}</h3>
                <div className="space-y-3">
                  {missions.map((mission) => (
                    <Card
                      key={mission.id}
                      className="p-4 bg-gray-50 border-l-4 border-l-gray-300 opacity-60"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-3xl opacity-50">🔒</span>
                            <div>
                              <h4 className="text-lg font-bold text-gray-600">{mission.title}</h4>
                              <p className="text-sm text-gray-500">Complete previous missions to unlock</p>
                            </div>
                          </div>
                        </div>
                        <span className="text-gray-400 font-semibold">Locked</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
