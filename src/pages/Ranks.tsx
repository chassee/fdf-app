import { useState, useEffect } from "react";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { getProgressionState, ProgressionState, getTierFromLevel } from "@/lib/progression";
import { getUserProgressionState } from "@/lib/supabaseClient";
import { CheckCircle2, Lock, ArrowRight, Flame, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";

// ── Tier definitions ─────────────────────────────────────────────────────────
const TIERS: Array<{
  id: string;
  title: string;
  subtitle: string;
  description: string;
  requirement: string;
  xpRequired: number;
  unlocks: string[];
  color: string;
}> = [
  {
    id: "foundation",
    title: "Foundation",
    subtitle: "Welcome to the academy.",
    description: "You've joined the Future Dawgs Foundation. Your training begins here. Complete your first missions to start climbing.",
    requirement: "Level 1-2 (0-300 XP)",
    xpRequired: 0,
    unlocks: ["Access to core missions", "Daily check-in", "XP tracking"],
    color: "from-blue-500 to-blue-600",
  },
  {
    id: "builder",
    title: "Builder",
    subtitle: "You're building momentum.",
    description: "You've proven you can show up. Keep completing missions and maintaining your streak to push further.",
    requirement: "Level 3-4 (300-600 XP)",
    xpRequired: 300,
    unlocks: ["Rewards shop unlocked", "Advanced missions", "Streak tracking"],
    color: "from-purple-500 to-purple-600",
  },
  {
    id: "operator",
    title: "Operator",
    subtitle: "Operating at a high level.",
    description: "You've built the habits. You understand the system. Now you operate at a level most never reach.",
    requirement: "Level 5+ (600+ XP)",
    xpRequired: 600,
    unlocks: ["Vault preview unlocked", "Priority status", "Advanced curriculum"],
    color: "from-emerald-500 to-emerald-600",
  },
];

const TIER_ORDER: string[] = ["foundation", "builder", "operator"];

function getTierStatus(tierId: string, currentTier: string): "completed" | "active" | "locked" {
  const currentIdx = TIER_ORDER.indexOf(currentTier.toLowerCase());
  const tierIdx = TIER_ORDER.indexOf(tierId);
  if (tierIdx < currentIdx) return "completed";
  if (tierIdx === currentIdx) return "active";
  return "locked";
}

// ── Animated progress bar ─────────────────────────────────────────────────────
function GradientProgressBar({ value, from, to, height = 8 }: { value: number; from: string; to: string; height?: number }) {
  const [anim, setAnim] = useState(0);
  useEffect(() => { const t = setTimeout(() => setAnim(Math.min(100, value)), 200); return () => clearTimeout(t); }, [value]);
  return (
    <div style={{ height, borderRadius: height, background: "rgba(226,232,240,0.6)", overflow: "hidden" }}>
      <div
        style={{
          height: "100%",
          width: `${anim}%`,
          background: `linear-gradient(90deg, ${from}, ${to})`,
          transition: "width 1s cubic-bezier(0.34, 1.56, 0.64, 1)",
          borderRadius: height,
        }}
      />
    </div>
  );
}

export default function Ranks() {
  const { user, isLoading } = useOnboarding();
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
          <p className="text-gray-600">Loading ranks...</p>
        </div>
      </div>
    );
  }

  const currentTier = progression.tier;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 sticky top-0 z-10">
        <h1 className="text-3xl font-bold mb-2">Progression Tiers</h1>
        <p className="text-blue-100">Your current tier: <span className="font-bold">{currentTier}</span></p>
      </div>

      {/* Current Status Card */}
      <div className="p-6">
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 font-semibold">CURRENT PROGRESS</p>
              <p className="text-3xl font-bold text-gray-900">{progression.totalXp} XP</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 font-semibold">LEVEL</p>
              <p className="text-3xl font-bold text-gray-900">{progression.currentLevel}</p>
            </div>
          </div>
          <GradientProgressBar
            value={progression.progressPercent}
            from="#3b82f6"
            to="#a855f7"
            height={12}
          />
          <p className="text-xs text-gray-600 mt-2">
            {progression.xpIntoCurrentLevel} / {progression.xpNeededForNextLevel} XP to next level
          </p>
        </Card>
      </div>

      {/* Tier Progression */}
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Your Journey</h2>
        <div className="space-y-4">
          {TIERS.map((tier, idx) => {
            const status = getTierStatus(tier.id, currentTier);
            const isActive = status === "active";
            const isCompleted = status === "completed";

            return (
              <div key={tier.id}>
                <Card
                  className={`p-6 transition-all ${
                    isActive
                      ? "ring-2 ring-blue-500 shadow-lg"
                      : isCompleted
                      ? "bg-gray-50"
                      : "opacity-60"
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {isCompleted && <CheckCircle2 className="text-green-500" size={24} />}
                        {isActive && <Zap className="text-blue-500" size={24} />}
                        {!isCompleted && !isActive && <Lock className="text-gray-400" size={24} />}
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{tier.title}</h3>
                          <p className="text-sm text-gray-600">{tier.subtitle}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">{tier.description}</p>
                      <p className="text-xs font-semibold text-gray-600 mb-3">REQUIREMENT: {tier.requirement}</p>
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-gray-600">UNLOCKS:</p>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {tier.unlocks.map((unlock, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <ArrowRight size={12} />
                              {unlock}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    {isActive && (
                      <div className="ml-4">
                        <div className={`bg-gradient-to-br ${tier.color} text-white px-4 py-2 rounded-lg text-center`}>
                          <p className="text-xs font-semibold">ACTIVE</p>
                          <p className="text-sm font-bold">{progression.progressPercent}%</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {isActive && (
                    <div className="mt-4 pt-4 border-t">
                      <GradientProgressBar
                        value={progression.progressPercent}
                        from="#3b82f6"
                        to="#a855f7"
                        height={8}
                      />
                      <p className="text-xs text-gray-600 mt-2">
                        {progression.xpNeededForNextLevel - progression.xpIntoCurrentLevel} XP until next tier
                      </p>
                    </div>
                  )}
                </Card>

                {idx < TIERS.length - 1 && (
                  <div className="flex justify-center py-2">
                    <ArrowRight className="text-gray-300 rotate-90" size={20} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Graduation Info */}
      <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-t">
        <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Flame size={20} className="text-orange-500" />
          Graduation Path
        </h3>
        <p className="text-sm text-gray-700">
          Reach the Operator tier and turn 18 to graduate and access the Crypdawgs Vault. Continue your financial education at the next level!
        </p>
      </div>
    </div>
  );
}
