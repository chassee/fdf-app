import { useOnboarding } from "@/contexts/OnboardingContext";
import { useFDF } from "@/contexts/FDFContext";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Zap, Trophy, Target, TrendingUp, Lock, ChevronRight } from "lucide-react";

export default function Home() {
  const { profile, isLoading } = useOnboarding();
  const { xp, gems, level } = useFDF();

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
  const isNewUser = xp === 0;

  return (
    <div className="space-y-8 pb-8">
      {/* Personalized Greeting */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8 shadow-lg">
        <h1 className="text-4xl font-bold mb-2">Welcome back, {username}! 👋</h1>
        <p className="text-blue-100 text-lg">
          {isNewUser 
            ? "Let's start your financial journey. Your first mission is ready."
            : "Keep building your financial DNA. You're on a great streak!"}
        </p>
      </section>

      {/* Quick Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">{level || 1}</div>
          <p className="text-sm text-gray-600">Current Level</p>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">{xp}</div>
          <p className="text-sm text-gray-600">Total XP</p>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-emerald-600 mb-2">{gems}</div>
          <p className="text-sm text-gray-600">Gems</p>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-orange-600 mb-2">
            {isNewUser ? "0" : "5"}
          </div>
          <p className="text-sm text-gray-600">Day Streak</p>
        </Card>
      </section>

      {/* Current Mission or Getting Started */}
      {isNewUser ? (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Getting Started Checklist</h2>
          <div className="space-y-4">
            {/* Mission 1 */}
            <Card className="p-6 border-2 border-blue-200 bg-blue-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold">
                      1
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Daily Check-In</h3>
                  </div>
                  <p className="text-gray-700 mb-4">
                    Start your day by checking in. This is your first step to building a consistent financial habit.
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full font-semibold">+50 XP</span>
                    <span className="text-gray-600">~2 min</span>
                  </div>
                </div>
                <Link href="/missions">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Start
                    <ChevronRight size={16} />
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Mission 2 */}
            <Card className="p-6 opacity-60">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gray-300 text-gray-600 rounded-lg flex items-center justify-center font-bold">
                      2
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Saving Basics</h3>
                  </div>
                  <p className="text-gray-700 mb-4">
                    Learn the fundamentals of saving money. Unlock after completing Mission 1.
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full font-semibold">+100 XP</span>
                    <span className="text-gray-600">~5 min</span>
                  </div>
                </div>
                <Lock size={24} className="text-gray-400" />
              </div>
            </Card>

            {/* Mission 3 */}
            <Card className="p-6 opacity-60">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gray-300 text-gray-600 rounded-lg flex items-center justify-center font-bold">
                      3
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Brand Idea</h3>
                  </div>
                  <p className="text-gray-700 mb-4">
                    Think of a product or service you'd want to build. Unlock after Mission 2.
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full font-semibold">+100 XP</span>
                    <span className="text-gray-600">~10 min</span>
                  </div>
                </div>
                <Lock size={24} className="text-gray-400" />
              </div>
            </Card>
          </div>
        </section>
      ) : (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Current Progress</h2>
          <Card className="p-8 text-center">
            <Zap size={48} className="text-yellow-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Keep the Momentum Going!</h3>
            <p className="text-gray-600 mb-6">
              You're making great progress. Check out your next mission to earn more XP and climb the ranks.
            </p>
            <Link href="/missions">
              <Button className="bg-blue-600 hover:bg-blue-700">
                View Missions
                <ChevronRight size={16} />
              </Button>
            </Link>
          </Card>
        </section>
      )}

      {/* Next Unlock Target */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Next Unlock Target</h2>
        <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Trophy className="text-purple-600" size={32} />
              <div>
                <h3 className="text-lg font-bold text-gray-900">Level 2: Financial Starter</h3>
                <p className="text-sm text-gray-600">Unlock DNA page & advanced missions</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-200 rounded-full h-3 mb-2">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full" style={{ width: `${Math.min((xp / 500) * 100, 100)}%` }} />
          </div>
          <p className="text-sm text-gray-600">
            {Math.max(500 - xp, 0)} XP to go
          </p>
        </Card>
      </section>

      {/* Quick Links */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Link href="/missions">
            <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow">
              <Target className="text-blue-600 mb-3" size={32} />
              <h3 className="font-bold text-gray-900 mb-2">Missions</h3>
              <p className="text-sm text-gray-600">Complete challenges and earn XP</p>
            </Card>
          </Link>

          <Link href="/dna">
            <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow">
              <TrendingUp className="text-purple-600 mb-3" size={32} />
              <h3 className="font-bold text-gray-900 mb-2">Financial DNA</h3>
              <p className="text-sm text-gray-600">Track your financial growth</p>
            </Card>
          </Link>

          <Link href="/leaderboard">
            <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow">
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
