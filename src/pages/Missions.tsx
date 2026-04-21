import { getAvailableMissions, getStarterMissions } from "@/lib/missions";
import { getLevelByXP } from "@/lib/levels";
import { useFDF } from "@/contexts/FDFContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Lock, CheckCircle } from "lucide-react";

export default function Missions() {
  const { xp } = useFDF();
  const currentLevel = getLevelByXP(xp);
  const availableMissions = getAvailableMissions(currentLevel.level);
  const starterMissions = getStarterMissions();

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <section>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Missions</h1>
        <p className="text-gray-600">
          Complete missions to earn XP, level up, and unlock new challenges.
        </p>
      </section>

      {/* Current Level Info */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <p className="text-blue-100 text-sm mb-1">CURRENT LEVEL</p>
            <p className="text-4xl font-bold">{currentLevel.level}</p>
            <p className="text-blue-100 text-sm mt-1">{currentLevel.title}</p>
          </div>
          <div>
            <p className="text-blue-100 text-sm mb-1">TOTAL XP</p>
            <p className="text-4xl font-bold">{xp}</p>
          </div>
          <div>
            <p className="text-blue-100 text-sm mb-1">TIER</p>
            <p className="text-4xl font-bold">{currentLevel.tier}</p>
          </div>
        </div>
      </section>

      {/* Available Missions */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Missions</h2>
        {availableMissions.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-600">No missions available yet. Keep leveling up!</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {availableMissions.map((mission) => (
              <Card key={mission.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{mission.icon}</span>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{mission.title}</h3>
                        <p className="text-sm text-gray-500">
                          {mission.tier} • Level {mission.level}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">{mission.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-semibold">
                        <Zap size={14} />
                        +{mission.xpReward} XP
                      </span>
                      <span className="text-gray-600">⏱️ {mission.timeEstimate}</span>
                    </div>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap">
                    Start
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Locked Missions */}
      {currentLevel.level < 50 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Locked Missions</h2>
          <Card className="p-6 text-center opacity-60">
            <Lock size={32} className="text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">
              Level up to unlock more missions and challenges!
            </p>
          </Card>
        </section>
      )}

      {/* Completed Missions */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Completed Missions</h2>
        <Card className="p-8 text-center">
          <CheckCircle size={32} className="text-green-500 mx-auto mb-3" />
          <p className="text-gray-600">
            No completed missions yet. Start your first mission to begin!
          </p>
        </Card>
      </section>
    </div>
  );
}
