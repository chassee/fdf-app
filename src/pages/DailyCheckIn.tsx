import { useState, useEffect } from "react";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { getUserProgressionState, getUserState, recordDailyCheckin } from "@/lib/supabaseClient";
import { ProgressionState, getProgressionState } from "@/lib/progression";
import { Flame, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function DailyCheckIn() {
  const { user, profile, isLoading } = useOnboarding();
  const [progression, setProgression] = useState<ProgressionState>(getProgressionState(0));
  const [checkedInToday, setCheckedInToday] = useState(false);
  const [lastCheckinDate, setLastCheckinDate] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user progression state on mount
  useEffect(() => {
    if (!user?.id) return;

    const fetchProgression = async () => {
      const progressionState = await getUserProgressionState(user.id);
      const userState = await getUserState(user.id);
      
      if (progressionState && userState) {
        setProgression(progressionState);
        setStreak(progressionState.currentStreak);
        setLastCheckinDate(userState.last_checkin_date || null);

        // Check if already checked in today
        const today = new Date().toISOString().split("T")[0];
        setCheckedInToday(userState.last_checkin_date === today);
      }
    };

    fetchProgression();
  }, [user?.id]);

  const handleDailyCheckIn = async () => {
    if (!user?.id || !profile?.id) {
      setError("User not authenticated");
      return;
    }

    setIsCheckingIn(true);
    setError(null);

    try {
      // Check if already checked in today
      const today = new Date().toISOString().split("T")[0];
      if (checkedInToday) {
        toast.error("You've already checked in today! Come back tomorrow.");
        setIsCheckingIn(false);
        return;
      }

      // Calculate new streak
      let newStreak = streak + 1;
      if (lastCheckinDate) {
        const lastDate = new Date(lastCheckinDate);
        const todayDate = new Date();
        const daysDiff = Math.floor(
          (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        // If more than 1 day has passed, reset streak
        if (daysDiff > 1) {
          newStreak = 1;
        }
      }

      // Record daily check-in
      const success = await recordDailyCheckin(user.id, newStreak);

      if (success) {
        // Update progression state
        const updatedState = await getUserProgressionState(user.id);
        if (updatedState) {
          setProgression(updatedState);
          setStreak(newStreak);
          setLastCheckinDate(today);
          setCheckedInToday(true);

          // Award XP for check-in
          const xpReward = 10 + Math.min(newStreak * 2, 50); // Bonus XP for streaks
          toast.success(
            `✅ Check-in complete! +${xpReward} XP (${newStreak} day streak!)`
          );
        }
      } else {
        setError("Failed to record check-in. Please try again.");
        toast.error("Failed to record check-in");
      }
    } catch (err) {
      console.error("Error during check-in:", err);
      setError("An error occurred during check-in");
      toast.error("An error occurred");
    } finally {
      setIsCheckingIn(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 sticky top-0 z-10">
        <h1 className="text-3xl font-bold mb-2">Daily Check-In</h1>
        <p className="text-orange-100">Build your streak and earn bonus XP</p>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Streak Display */}
        <Card className="p-8 bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Flame size={40} className="text-orange-500" />
              <div className="text-5xl font-bold text-orange-600">{streak}</div>
            </div>
            <p className="text-lg font-semibold text-gray-800">Day Streak</p>
            <p className="text-sm text-gray-600 mt-2">
              {checkedInToday
                ? "You've already checked in today!"
                : "Check in daily to build your streak"}
            </p>
          </div>
        </Card>

        {/* Check-In Button */}
        <div className="space-y-4">
          <Button
            onClick={handleDailyCheckIn}
            disabled={checkedInToday || isCheckingIn}
            className={`w-full py-6 text-lg font-bold rounded-xl transition-all ${
              checkedInToday
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg"
            }`}
          >
            {isCheckingIn ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Checking In...
              </span>
            ) : checkedInToday ? (
              <span className="flex items-center gap-2">
                <CheckCircle2 size={20} />
                Already Checked In Today
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <CheckCircle2 size={20} />
                Check In Now
              </span>
            )}
          </Button>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Streak Bonus Info */}
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Flame size={20} className="text-orange-500" />
            Streak Bonuses
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100">
              <span className="text-sm font-semibold text-gray-700">Daily Check-In</span>
              <span className="text-sm font-bold text-orange-600">+10 XP</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100">
              <span className="text-sm font-semibold text-gray-700">3-Day Streak Bonus</span>
              <span className="text-sm font-bold text-orange-600">+6 XP</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100">
              <span className="text-sm font-semibold text-gray-700">7-Day Streak Bonus</span>
              <span className="text-sm font-bold text-orange-600">+14 XP</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100">
              <span className="text-sm font-semibold text-gray-700">30-Day Streak Bonus</span>
              <span className="text-sm font-bold text-orange-600">+60 XP</span>
            </div>
          </div>
        </Card>

        {/* Anti-Farm Info */}
        <Card className="p-6 bg-purple-50 border-purple-200">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Clock size={20} className="text-purple-600" />
            How It Works
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">•</span>
              <span>Check in once per day to build your streak</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">•</span>
              <span>Miss a day and your streak resets to 0</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">•</span>
              <span>Earn bonus XP for maintaining streaks</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">•</span>
              <span>Check-ins are time-locked to prevent farming</span>
            </li>
          </ul>
        </Card>

        {/* Last Check-In Info */}
        {lastCheckinDate && (
          <Card className="p-4 bg-gray-50 border-gray-200">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Last Check-In:</span> {new Date(lastCheckinDate).toLocaleDateString()}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
