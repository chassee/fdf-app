import { useFDF } from "@/contexts/FDFContext";
import { DNA_LEVEL_META } from "@/contexts/FDFContext";
import { Card } from "@/components/ui/card";
import { TrendingUp, Zap, Target, Lightbulb, Brain } from "lucide-react";

export default function DNA() {
  const { xp, dnaScore, dnaLevel, consistencyScore, disciplineScore, intelligenceScore } = useFDF();

  const traits = [
    {
      name: "Consistency",
      description: "Building habits and staying committed to your goals",
      score: consistencyScore,
      icon: <Zap className="text-yellow-500" size={24} />,
      color: "yellow",
    },
    {
      name: "Discipline",
      description: "Making tough choices and executing on your plans",
      score: disciplineScore,
      icon: <Target className="text-blue-500" size={24} />,
      color: "blue",
    },
    {
      name: "Intelligence",
      description: "Learning, adapting, and making smart decisions",
      score: intelligenceScore,
      icon: <Lightbulb className="text-purple-500" size={24} />,
      color: "purple",
    },
  ];

  const dnaMetadata = DNA_LEVEL_META[dnaLevel];
  const maxScore = 999;
  const dnaProgress = Math.round((dnaScore / maxScore) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 sticky top-0 z-10">
        <h1 className="text-3xl font-bold mb-2">Your Financial DNA</h1>
        <p className="text-blue-100">Track your growth across key traits</p>
      </div>

      {/* DNA Level Card */}
      <div className="p-6">
        <Card className="p-8 bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-2">YOUR DNA LEVEL</p>
              <h2 className="text-4xl font-bold text-gray-900">{dnaLevel}</h2>
              <p className="text-gray-600 mt-2">{dnaMetadata.tagline}</p>
            </div>
            <div className="text-6xl">{dnaMetadata.emoji}</div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-700">DNA Score</span>
              <span className="text-sm text-gray-600">
                {dnaScore} / {maxScore}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 bg-gradient-to-r ${
                  dnaLevel === "Elite"
                    ? "from-green-500 to-emerald-500"
                    : dnaLevel === "Operator"
                      ? "from-orange-500 to-yellow-500"
                      : dnaLevel === "Builder"
                        ? "from-purple-500 to-blue-500"
                        : dnaLevel === "Growth"
                          ? "from-green-500 to-blue-500"
                          : "from-gray-400 to-gray-500"
                }`}
                style={{ width: `${dnaProgress}%` }}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Trait Cards */}
      <div className="p-6 space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Traits</h2>

        {traits.map((trait, idx) => {
          const traitProgress = Math.min(100, Math.round((trait.score / 100) * 100));
          return (
            <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-gray-100 rounded-lg">{trait.icon}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">{trait.name}</h3>
                  <p className="text-sm text-gray-600">{trait.description}</p>
                  <p className="text-xs text-gray-500 mt-1">Score: {trait.score} / 999</p>
                </div>
              </div>
              <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 bg-gradient-to-r ${
                    trait.color === "yellow"
                      ? "from-yellow-400 to-yellow-600"
                      : trait.color === "blue"
                        ? "from-blue-400 to-blue-600"
                        : "from-purple-400 to-purple-600"
                  }`}
                  style={{ width: `${Math.min(100, traitProgress)}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">{Math.min(100, traitProgress)}% Developed</p>
            </Card>
          );
        })}
      </div>

      {/* How DNA Grows */}
      <div className="p-6">
        <Card className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Brain size={28} className="text-blue-600" />
            How Your DNA Grows
          </h2>
          <ul className="space-y-4 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold text-lg mt-1">1.</span>
              <div>
                <p className="font-semibold">Complete Missions</p>
                <p className="text-sm text-gray-600">Each mission builds your discipline and intelligence</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold text-lg mt-1">2.</span>
              <div>
                <p className="font-semibold">Daily Check-Ins</p>
                <p className="text-sm text-gray-600">Build consistency by checking in every day</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold text-lg mt-1">3.</span>
              <div>
                <p className="font-semibold">Level Up</p>
                <p className="text-sm text-gray-600">Reach new levels to unlock advanced traits</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold text-lg mt-1">4.</span>
              <div>
                <p className="font-semibold">Reach Elite Status</p>
                <p className="text-sm text-gray-600">Master all traits and become an Elite operator</p>
              </div>
            </li>
          </ul>
        </Card>
      </div>

      {/* DNA Levels Info */}
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">DNA Levels</h2>
        <div className="space-y-3">
          {Object.entries(DNA_LEVEL_META).map(([level, meta]) => (
            <Card key={level} className="p-4 border-l-4" style={{ borderLeftColor: meta.color }}>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{meta.emoji}</span>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{level}</h3>
                  <p className="text-sm text-gray-600">{meta.minScore} - {meta.maxScore} DNA Score</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
