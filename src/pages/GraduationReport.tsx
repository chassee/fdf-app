import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Award, TrendingUp, Target, Zap } from "lucide-react";
import { useOnboarding } from "@/contexts/OnboardingContext";

interface MissionCompletion {
  missionId: string;
  missionTitle: string;
  studentAnswers: Record<string, string>;
  xpEarned: number;
  dnaCategory: string;
  completionDate: string;
  level: number;
  totalXp: number;
}

export default function GraduationReport() {
  const [, navigate] = useLocation();
  const { profile } = useOnboarding();
  const [completions, setCompletions] = useState<MissionCompletion[]>([]);
  const [dnaStats, setDnaStats] = useState<Record<string, number>>({});

  useEffect(() => {
    // Load completions from localStorage
    const saved = localStorage.getItem("mission_completions");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setCompletions(data);

        // Calculate DNA stats
        const stats: Record<string, number> = {};
        data.forEach((completion: MissionCompletion) => {
          stats[completion.dnaCategory] = (stats[completion.dnaCategory] || 0) + 1;
        });
        setDnaStats(stats);
      } catch (error) {
        console.error("Error loading completions:", error);
      }
    }
  }, []);

  const totalXp = completions.reduce((sum, c) => sum + c.xpEarned, 0);
  const isGraduating = totalXp >= 500 || (profile?.dob && new Date().getFullYear() - new Date(profile.dob).getFullYear() >= 18);
  const dnaCategories = Object.entries(dnaStats).sort(([, a], [, b]) => b - a);

  const getStrengthLevel = (count: number) => {
    if (count >= 5) return "Expert";
    if (count >= 3) return "Advanced";
    if (count >= 1) return "Developing";
    return "Beginner";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-6 sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="text-white hover:bg-white/20"
          >
            <ChevronLeft size={20} />
          </Button>
          <h1 className="text-3xl font-bold">🎓 Graduation Report</h1>
        </div>
        <p className="text-amber-100">Your financial growth journey summary</p>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Graduation Status */}
        {isGraduating ? (
          <Card className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-500 text-center">
            <Award size={64} className="text-green-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-green-900 mb-2">🎉 Congratulations!</h2>
            <p className="text-green-700 text-lg mb-4">
              You've completed your financial education journey and are ready to graduate!
            </p>
            <p className="text-green-600 mb-6">
              {profile?.dob && new Date().getFullYear() - new Date(profile.dob).getFullYear() >= 18
                ? "You've reached age 18 and are ready for the Vault."
                : `You've earned ${totalXp} XP and demonstrated mastery of financial intelligence.`}
            </p>
            <Button
              onClick={() => navigate("/vault")}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-lg font-bold"
            >
              Enter the Vault →
            </Button>
          </Card>
        ) : (
          <Card className="p-6 bg-white">
            <div className="text-center">
              <p className="text-gray-600 text-sm font-semibold mb-2">PROGRESS TO GRADUATION</p>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <div
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-4 rounded-full transition-all"
                  style={{ width: `${Math.min((totalXp / 500) * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-gray-700 font-semibold">
                {totalXp} / 500 XP ({Math.round((totalXp / 500) * 100)}%)
              </p>
              <p className="text-gray-600 text-sm mt-2">
                {500 - totalXp} XP remaining to graduate
              </p>
            </div>
          </Card>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 bg-white">
            <div className="text-center">
              <Zap className="text-blue-600 mx-auto mb-2" size={32} />
              <p className="text-gray-600 text-sm font-semibold mb-2">TOTAL XP EARNED</p>
              <p className="text-4xl font-bold text-blue-600">{totalXp}</p>
            </div>
          </Card>
          <Card className="p-6 bg-white">
            <div className="text-center">
              <Target className="text-purple-600 mx-auto mb-2" size={32} />
              <p className="text-gray-600 text-sm font-semibold mb-2">MISSIONS COMPLETED</p>
              <p className="text-4xl font-bold text-purple-600">{completions.length}</p>
            </div>
          </Card>
          <Card className="p-6 bg-white">
            <div className="text-center">
              <TrendingUp className="text-green-600 mx-auto mb-2" size={32} />
              <p className="text-gray-600 text-sm font-semibold mb-2">DNA TRAITS</p>
              <p className="text-4xl font-bold text-green-600">{dnaCategories.length}</p>
            </div>
          </Card>
        </div>

        {/* DNA Trait Analysis */}
        {dnaCategories.length > 0 && (
          <Card className="p-6 bg-white">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🧬 Financial DNA Profile</h2>
            <div className="space-y-4">
              {dnaCategories.map(([trait, count]) => (
                <div key={trait} className="border-b pb-4 last:border-b-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900">{trait}</h3>
                      <p className="text-sm text-gray-600">{getStrengthLevel(count)} Level</p>
                    </div>
                    <span className="text-2xl font-bold text-purple-600">{count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                      style={{ width: `${Math.min((count / 5) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Strongest Skills */}
        {dnaCategories.length > 0 && (
          <Card className="p-6 bg-white">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">⭐ Strongest Skills</h2>
            <div className="space-y-2">
              {dnaCategories.slice(0, 3).map(([trait], index) => (
                <div key={trait} className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-yellow-500">#{index + 1}</span>
                  <span className="font-semibold text-gray-900">{trait}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Areas for Growth */}
        {dnaCategories.length > 0 && (
          <Card className="p-6 bg-white">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">📈 Areas for Growth</h2>
            <div className="space-y-2">
              {dnaCategories.slice(-Math.min(3, dnaCategories.length)).map(([trait]) => (
                <div key={trait} className="flex items-center gap-3">
                  <span className="text-2xl">🎯</span>
                  <span className="font-semibold text-gray-900">{trait}</span>
                </div>
              ))}
            </div>
            <p className="text-gray-600 text-sm mt-4">
              Continue completing missions in these areas to develop well-rounded financial intelligence.
            </p>
          </Card>
        )}

        {/* Next Steps */}
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🚀 Next Steps</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-xl">✓</span>
              <span className="text-gray-700">
                {isGraduating
                  ? "You're ready to graduate! Visit the Vault for advanced financial education."
                  : "Continue completing missions to reach 500 XP and graduate."}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-xl">✓</span>
              <span className="text-gray-700">
                Practice the skills you've learned in real-world situations.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-xl">✓</span>
              <span className="text-gray-700">
                Share your progress with parents and mentors for guidance.
              </span>
            </li>
          </ul>
        </Card>

        {/* Back Button */}
        <div className="text-center">
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="px-8 py-2 border-2 border-gray-300 hover:bg-gray-100"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
