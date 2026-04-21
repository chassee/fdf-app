import { useOnboarding } from "@/contexts/OnboardingContext";
import { useFDF } from "@/contexts/FDFContext";
import { getLevelByXP, getProgressToNextLevel, getXPToNextLevel } from "@/lib/levels";
import { getAvailableMissions } from "@/lib/missions";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Zap, Trophy, Target, TrendingUp, Lock, ChevronRight, Flame } from "lucide-react";

export default function Home() {
  const { profile, isLoading } = useOnboarding();
  const { xp, gems } = useFDF();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const username = profile?.username || "Builder";
  const currentLevel = getLevelByXP(xp);
  const progressPercent = getProgressToNextLevel(xp);
  const xpToNext = getXPToNextLevel(xp);
  const availableMissions = getAvailableMissions(currentLevel.level);
  const isNewUser = xp === 0;

  return (
    <div className="space-y-8 pb-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl p-8 shadow-lg">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Welcome back, {username}! 👋</h1>
            <p className="text-blue-100 text-lg">
              {isNewUser 
                ? "Your financial journey starts now. Complete your first mission!"
                : "Keep building your financial DNA. You're crushing it!"}
            </p>
          </div>
          {!isNewUser && (
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
              <Flame size={20} className="text-orange-300" />
              <span className="font-bold">5 day streak</span>
            </div>
          )}
        </div>
      </section>

      {/* Level Progress Card */}
      <section className="grid md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-blue-600 font-semibold">LEVEL</p>
              <p className="text-4xl font-bold text-blue-900">{currentLevel.level}</p>
            </div>
            <Trophy className="text-blue-600" size={40} />
          </div>
          <p className="text-sm text-blue-700">{currentLevel.title}</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-purple-600 font-semibold">TOTAL XP</p>
              <p className="text-4xl font-bold text-purple-900">{xp}</p>
            </div>
            <Zap className="text-purple-600" size={40} />
          </div>
          <p className="text-sm text-purple-700">+{xpToNext} to next level</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-emerald-600 font-semibold">TIER</p>
              <p className="text-4xl font-bold text-emerald-900">{currentLevel.tier}</p>
            </div>
            <Target className="text-emerald-600" size={40} />
          </div>
          <p className="text-sm text-emerald-700">{currentLevel.description}</p>
        </Card>
      </section>

      {/* XP Progress Bar */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-gray-900">Progress to Level {currentLevel.level + 1}</h3>
          <span className="text-sm text-gray-600">{Math.round(progressPercent)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </section>

      {/* Available Missions */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Available Missions</h2>
          <Link href="/missions">
            <span className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer">View All →</span>
          </Link>
        </div>

        {availableMissions.length === 0 ? (
          <Card className="p-8 text-center">
            <Lock size={40} className="text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No missions available yet. Keep leveling up!</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {availableMissions.slice(0, 3).map((mission) => (
              <Card key={mission.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-2xl">{mission.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{mission.title}</h3>
                      <p className="text-sm text-gray-600">{mission.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-semibold">
                      <Zap size={14} />
                      +{mission.xpReward}
                    </span>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Start
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Next Unlock */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Next Unlock</h2>
        <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200">
          <div className="flex items-center gap-4 mb-4">
            <Trophy className="text-purple-600" size={32} />
            <div>
              <h3 className="font-bold text-gray-900">Level {currentLevel.level + 1}: {currentLevel.tier} Tier</h3>
              <p className="text-sm text-gray-600">Unlock new missions and features</p>
            </div>
          </div>
          <div className="bg-gray-200 rounded-full h-3 mb-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-sm text-gray-600">{xpToNext} XP remaining</p>
        </Card>
      </section>

      {/* Quick Links */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Link href="/missions">
            <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow h-full">
              <Target className="text-blue-600 mb-3" size={32} />
              <h3 className="font-bold text-gray-900 mb-2">Missions</h3>
              <p className="text-sm text-gray-600">Complete challenges and earn XP</p>
            </Card>
          </Link>

          <Link href="/dna">
            <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow h-full">
              <TrendingUp className="text-purple-600 mb-3" size={32} />
              <h3 className="font-bold text-gray-900 mb-2">Financial DNA</h3>
              <p className="text-sm text-gray-600">Track your financial growth</p>
            </Card>
          </Link>

          <Link href="/leaderboard">
            <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow h-full">
              <Trophy className="text-orange-600 mb-3" size={32} />
              <h3 className="font-bold text-gray-900 mb-2">Ranks</h3>
              <p className="text-sm text-gray-600">Climb the leaderboard</p>
            </Card>
          </Link>
        </div>
      </section>
    </div>
  );
}
