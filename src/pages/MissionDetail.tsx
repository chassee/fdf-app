import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { useOnboarding } from '@/_core/hooks/useOnboarding';
import { getProgressionState, ProgressionState } from '@/lib/progression';
import { getUserProgressionState, updateUserXp, saveMissionResponse } from '@/lib/supabaseClient';
import { getActivitySchema, ActivityResponse } from '@/lib/activitySchema';
import { MissionActivity } from '@/components/MissionActivity';
import { getMissionById } from '@/lib/missions';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function MissionDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { profile } = useOnboarding();

  const [progression, setProgression] = useState<ProgressionState>(getProgressionState(0));
  const [loadingProgression, setLoadingProgression] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mission = id ? getMissionById(id) : null;
  const activitySchema = id ? getActivitySchema(id) : undefined;

  // Fetch canonical progression state
  useEffect(() => {
    if (!profile?.id) return;

    const fetchProgression = async () => {
      setLoadingProgression(true);
      const state = await getUserProgressionState(profile.id);
      if (state) {
        setProgression(state);
      }
      setLoadingProgression(false);
    };

    fetchProgression();
  }, [profile?.id]);

  if (loadingProgression) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading mission...</p>
        </div>
      </div>
    );
  }

  if (!mission) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-600">Mission not found</p>
        <Button onClick={() => navigate('/missions')} className="mt-4">
          Back to Missions
        </Button>
      </div>
    );
  }

  const handleActivitySubmit = async (responses: ActivityResponse[]) => {
    if (!profile?.id) return;

    setSubmitting(true);
    setError(null);

    try {
      // Save mission response to database
      await saveMissionResponse({
        userId: profile.id,
        missionId: mission.id,
        missionTitle: mission.title,
        responses,
        xpEarned: mission.xpReward,
        dnaCategory: mission.dnaCategory || 'General',
        levelAtCompletion: progression.currentLevel,
        totalXpAfterCompletion: progression.totalXp + mission.xpReward,
      });

      // Update user XP in canonical state
      const newState = await updateUserXp(profile.id, mission.xpReward);
      if (newState) {
        setProgression(newState);
      }

      setCompleted(true);
      toast.success(`🎉 Mission completed! +${mission.xpReward} XP earned`);

      // Show completion screen for 2 seconds, then redirect
      setTimeout(() => {
        navigate('/missions');
      }, 2000);
    } catch (err) {
      console.error('Error completing mission:', err);
      const errorMsg = err instanceof Error ? err.message : 'Failed to complete mission';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <button
          onClick={() => navigate('/missions')}
          className="flex items-center gap-2 mb-4 hover:opacity-80 transition"
        >
          <ChevronLeft size={20} />
          Back to Missions
        </button>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-blue-100 text-sm font-semibold mb-2">{mission.tier} Tier</p>
            <h1 className="text-4xl font-bold mb-2">{mission.title}</h1>
            <p className="text-blue-100">Level {progression.currentLevel} • {progression.totalXp} XP Total</p>
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
                {mission.xpReward < 100 ? 'Easy' : mission.xpReward < 200 ? 'Medium' : 'Hard'}
              </p>
            </div>
          </div>
        </Card>

        {/* Lesson Content */}
        {!completed && (
          <Card className="p-6 bg-white">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">📚 Lesson</h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              {mission.id === 'mission_1' && (
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
              {mission.id === 'mission_2' && (
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
              {mission.id === 'mission_3' && (
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
              {!['mission_1', 'mission_2', 'mission_3'].includes(mission.id) && (
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

        {/* Activity Section */}
        {!completed && (
          <Card className="p-6 bg-white">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">✍️ Activity</h2>
            {activitySchema ? (
              <MissionActivity
                schema={activitySchema}
                onSubmit={handleActivitySubmit}
                isLoading={submitting}
              />
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">No interactive activity available for this mission.</p>
                <p className="text-gray-500 text-sm mb-6">Please complete the lesson and click "Complete Mission" when ready.</p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/missions')}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleActivitySubmit([])}
                    disabled={submitting}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {submitting ? 'Completing...' : 'Complete Mission'}
                  </Button>
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Error Message */}
        {!completed && error && (
          <Card className="p-4 bg-red-50 border-red-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-red-600 mt-0.5 shrink-0" size={20} />
              <p className="text-red-700">{error}</p>
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
              onClick={() => navigate('/missions')}
              className="bg-green-600 hover:bg-green-700"
            >
              Back to Missions
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
