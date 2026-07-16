import { useEffect, useState } from "react";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useFDF } from "@/contexts/FDFContext";
import { getProgressionState, ProgressionState } from "@/lib/progression";
import { getUserProgressionState } from "@/lib/supabaseClient";
import { getAvailableMissions } from "@/lib/missions";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Zap, Trophy, Target, TrendingUp, Lock, ChevronRight, Flame } from "lucide-react";

export default function Home() {
  const { profile, isLoading, user } = useOnboarding();
  const { gems } = useFDF();
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
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const username = profile?.username || "Builder";
  const currentLevel = progression.currentLevel;
  const progressPercent = progression.progressPercent;
  const xpToNext = progression.xpNeededForNextLevel;
  const availableMissions = getAvailableMissions(currentLevel);
  const isNewUser = progression.totalXp === 0;

  return (
    <div className="space-y-6 pb-20 px-4 md:px-0">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl p-6 md:p-8 shadow-lg">
        <div className="flex flex-col md:flex-row items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <h1 className="text-2xl md:text-4xl font-bold mb-2">Welcome back, {username}! 👋</h1>
            <p className="text-blue-100 text-sm md:text-lg">
              {isNewUser 
                ? "Your financial journey starts now. Complete your first mission!"
                : "Keep building your financial DNA. You're crushing it!"}
            </p>
          </div>
          {!isNewUser && (
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
              <Flame size={20} className="text-orange-300" />
              <span className="font-bold">{progression.currentStreak} day streak</span>
            </div>
          )}
        </div>
      </section>

      {/* Level Progress Card */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 md:p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs md:text-sm text-blue-600 font-semibold">LEVEL</p>
              <p className="text-3xl md:text-4xl font-bold text-blue-900">{currentLevel}</p>
            </div>
            <Trophy className="text-blue-600" size={40} />
          </div>
          <p className="text-sm text-blue-700">Financial {progression.tier}</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-purple-600 font-semibold">TOTAL XP</p>
              <p className="text-4xl font-bold text-purple-900">{progression.totalXp}</p>
            </div>
            <Zap className="text-purple-600" size={40} />
          </div>
          <p className="text-sm text-purple-700">+{xpToNext} to next level</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-emerald-600 font-semibold">TIER</p>
              <p className="text-4xl font-bold text-emerald-900">{progression.tier}</p>
            </div>
            <Target className="text-emerald-600" size={40} />
          </div>
          <p className="text-sm text-emerald-700">Unlock new missions</p>
        </Card>
      </section>

      {/* XP Progress Bar - FIXED: Now shows real progress */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-gray-900">Progress to Level {currentLevel + 1}</h3>
          <span className="text-sm text-gray-600">{progressPercent}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {progression.xpIntoCurrentLevel} / {progression.xpNeededForNextLevel} XP
        </p>
      </section>

      {/* Available Missions */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Available Missions</h2>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate("/missions")}
            className="text-blue-600 hover:text-blue-700"
          >
            View All <ChevronRight size={16} />
          </Button>
        </div>
        
        <div className="space-y-3">
          {availableMissions.slice(0, 3).map((mission) => (
            <Card key={mission.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{mission.icon}</span>
                    <h3 className="font-bold text-gray-900">{mission.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{mission.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>⏱ {mission.timeEstimate}</span>
                    <span>⚡ +{mission.xpReward} XP</span>
                  </div>
                </div>
                <Button 
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => navigate(`/mission/${mission.id}`)}
                >
                  Start
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* DNA Teaser */}
      <section className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900 mb-1">Financial DNA</h3>
            <p className="text-sm text-gray-600">Your in-app growth score (not a credit score)</p>
          </div>
          <Button 
            variant="outline"
            onClick={() => navigate("/dna")}
          >
            View <ChevronRight size={16} />
          </Button>
        </div>
      </section>
    </div>
  );
}
