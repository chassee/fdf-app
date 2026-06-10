import { useParams, useLocation } from "wouter";
import { useFDF } from "@/contexts/FDFContext";
import { getMissionById } from "@/lib/missions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, Zap, CheckCircle } from "lucide-react";
import { useState } from "react";

export default function MissionDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { addXP, completeMission } = useFDF();
  const [isCompleting, setIsCompleting] = useState(false);
  const [completed, setCompleted] = useState(false);

  const mission = id ? getMissionById(id) : null;

  if (!mission) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-600">Mission not found</p>
        <Button onClick={() => navigate("/missions")} className="mt-4">
          Back to Missions
        </Button>
      </div>
    );
  }

  const handleCompleteMission = async () => {
    setIsCompleting(true);
    try {
      // Award XP
      addXP(mission.xpReward);
      completeMission(parseInt(mission.id.replace("mission_", "")), mission.xpReward, 0);
      setCompleted(true);

      // Show success for 2 seconds then redirect
      setTimeout(() => {
        navigate("/missions");
      }, 2000);
    } catch (error) {
      console.error("Error completing mission:", error);
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <button
          onClick={() => navigate("/missions")}
          className="flex items-center gap-2 mb-4 hover:opacity-80 transition"
        >
          <ChevronLeft size={20} />
          Back to Missions
        </button>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-blue-100 text-sm font-semibold mb-2">{mission.tier} Tier</p>
            <h1 className="text-4xl font-bold mb-2">{mission.title}</h1>
            <p className="text-blue-100">{mission.description}</p>
          </div>
          <div className="text-5xl">{mission.icon}</div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Mission Info */}
        <Card className="p-6 bg-white">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <p className="text-gray-600 text-sm font-semibold">TIME ESTIMATE</p>
              <p className="text-2xl font-bold text-gray-900">{mission.timeEstimate}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600 text-sm font-semibold">XP REWARD</p>
              <div className="flex items-center justify-center gap-1 text-2xl font-bold text-yellow-600">
                <Zap size={24} />
                +{mission.xpReward}
              </div>
            </div>
            <div className="text-center">
              <p className="text-gray-600 text-sm font-semibold">DIFFICULTY</p>
              <p className="text-2xl font-bold text-purple-600">
                {mission.xpReward < 100 ? "Easy" : mission.xpReward < 200 ? "Medium" : "Hard"}
              </p>
            </div>
          </div>
        </Card>

        {/* Lesson Content */}
        {!completed && (
          <Card className="p-6 bg-white">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">📚 Lesson</h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              {mission.id === "mission_1" && (
                <>
                  <p>
                    <strong>Daily Check-In</strong> is the foundation of financial success. Just like athletes warm up before competition, you need to check in with your finances daily.
                  </p>
                  <p>
                    When you check in, you're asking yourself: "How am I doing with money today? Did I spend wisely? Did I save? Am I on track with my goals?"
                  </p>
                  <p>
                    This simple habit builds awareness. Over time, you'll notice patterns in your spending and saving behavior. That awareness is the first step to mastery.
                  </p>
                </>
              )}
              {mission.id === "mission_2" && (
                <>
                  <p>
                    <strong>Saving</strong> is the act of setting aside money for the future instead of spending it today. It sounds simple, but it's one of the most powerful financial skills you can develop.
                  </p>
                  <p>
                    <strong>Compound Growth</strong> means your money earns money. If you save $100 and it earns 5% interest, you now have $105. Next year, that $105 earns 5%, giving you $110.25. Your money grows faster and faster over time.
                  </p>
                  <p>
                    Start small. Even $5 per week adds up to $260 per year. That's real money that can change your life.
                  </p>
                </>
              )}
              {mission.id === "mission_3" && (
                <>
                  <p>
                    <strong>Goals</strong> give your money direction. Without a goal, saving feels pointless. With a goal, every dollar saved feels like progress.
                  </p>
                  <p>
                    Good goals are specific. Instead of "save more money," try "save $200 for a new gaming console by June" or "save $500 for a trip with friends."
                  </p>
                  <p>
                    Write your goal down. Tell someone about it. Track your progress. You'll be amazed at how much faster you reach it.
                  </p>
                </>
              )}
              {!["mission_1", "mission_2", "mission_3"].includes(mission.id) && (
                <>
                  <p>
                    <strong>{mission.title}</strong> is an important step in your financial journey.
                  </p>
                  <p>{mission.description}</p>
                  <p>
                    Take your time with this mission. Read carefully, think deeply, and apply what you learn to your real life. That's how you build real financial intelligence.
                  </p>
                </>
              )}
            </div>
          </Card>
        )}

        {/* Activity */}
        {!completed && (
          <Card className="p-6 bg-white">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">✍️ Activity</h2>
            <div className="space-y-4">
              {mission.id === "mission_1" && (
                <div>
                  <p className="text-gray-700 mb-3">
                    <strong>Your Task:</strong> Spend 2 minutes checking in with your finances right now.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>How much money do you have right now?</li>
                    <li>Did you spend money today? On what?</li>
                    <li>Did you save any money today?</li>
                    <li>Are you on track with your goals?</li>
                  </ul>
                  <p className="text-gray-600 text-sm mt-3 italic">
                    Write your answers down or just think about them. The goal is awareness.
                  </p>
                </div>
              )}
              {mission.id === "mission_2" && (
                <div>
                  <p className="text-gray-700 mb-3">
                    <strong>Your Task:</strong> Calculate compound growth.
                  </p>
                  <p className="text-gray-700 mb-3">
                    If you save $10 per week for 1 year, and your savings earn 5% interest, how much will you have?
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
                    <li>$10/week × 52 weeks = $520 saved</li>
                    <li>$520 × 1.05 (5% interest) = $546</li>
                    <li>You earned $26 just by saving and waiting!</li>
                  </ul>
                  <p className="text-gray-600 text-sm mt-3 italic">
                    Now try with your own numbers. How much can you save per week?
                  </p>
                </div>
              )}
              {mission.id === "mission_3" && (
                <div>
                  <p className="text-gray-700 mb-3">
                    <strong>Your Task:</strong> Define your first financial goal.
                  </p>
                  <p className="text-gray-700 mb-3">Write down:</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>What do you want to save for?</li>
                    <li>How much money do you need?</li>
                    <li>When do you want to have it by?</li>
                    <li>How much can you save per week?</li>
                  </ul>
                  <p className="text-gray-600 text-sm mt-3 italic">
                    Example: "Save $100 for a new skateboard by August. I'll save $5 per week."
                  </p>
                </div>
              )}
              {!["mission_1", "mission_2", "mission_3"].includes(mission.id) && (
                <div>
                  <p className="text-gray-700 mb-3">
                    <strong>Your Task:</strong> Complete the activity for this mission.
                  </p>
                  <p className="text-gray-700">
                    Follow the instructions above and apply what you've learned. When you're done, click "Complete Mission" below.
                  </p>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Success State */}
        {completed && (
          <Card className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-500 text-center">
            <CheckCircle size={64} className="text-green-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-green-900 mb-2">Mission Complete! 🎉</h2>
            <p className="text-green-700 text-lg mb-4">
              You earned <span className="font-bold text-2xl">+{mission.xpReward} XP</span>
            </p>
            <p className="text-green-600 mb-6">
              Great work! You're building real financial intelligence. Keep going!
            </p>
            <Button
              onClick={() => navigate("/missions")}
              className="bg-green-600 hover:bg-green-700"
            >
              Back to Missions
            </Button>
          </Card>
        )}

        {/* Complete Button */}
        {!completed && (
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate("/missions")}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCompleteMission}
              disabled={isCompleting}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isCompleting ? "Completing..." : "Complete Mission"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
