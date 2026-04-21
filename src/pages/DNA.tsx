import { useFDF } from "@/contexts/FDFContext";
import { getLevelByXP } from "@/lib/levels";
import { Card } from "@/components/ui/card";
import { TrendingUp, Zap, Target, Lightbulb } from "lucide-react";

export default function DNA() {
  const { xp } = useFDF();
  const currentLevel = getLevelByXP(xp);

  const traits = [
    {
      name: "Financial Awareness",
      level: "Foundation",
      description: "Understanding where your money goes and basic budgeting",
      progress: currentLevel.level >= 1 ? 100 : 0,
      icon: <Zap className="text-yellow-500" size={24} />,
    },
    {
      name: "Entrepreneurial Mindset",
      level: "Builder",
      description: "Thinking like a business owner and identifying opportunities",
      progress: currentLevel.level >= 11 ? 100 : currentLevel.level >= 5 ? 50 : 0,
      icon: <Lightbulb className="text-purple-500" size={24} />,
    },
    {
      name: "Systems Thinking",
      level: "Operator",
      description: "Understanding how systems work and optimizing them",
      progress: currentLevel.level >= 26 ? 100 : currentLevel.level >= 15 ? 50 : 0,
      icon: <Target className="text-blue-500" size={24} />,
    },
    {
      name: "Strategic Planning",
      level: "Operator",
      description: "Long-term thinking and strategic decision making",
      progress: currentLevel.level >= 30 ? 100 : currentLevel.level >= 20 ? 50 : 0,
      icon: <TrendingUp className="text-green-500" size={24} />,
    },
  ];

  return (
    <div className="space-y-8 pb-8">
      <section>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Financial DNA</h1>
        <p className="text-gray-600">
          Track your growth across key financial and entrepreneurial traits.
        </p>
      </section>

      <div className="space-y-4">
        {traits.map((trait, idx) => (
          <Card key={idx} className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-gray-100 rounded-lg">{trait.icon}</div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">{trait.name}</h3>
                <p className="text-sm text-gray-600">{trait.description}</p>
                <p className="text-xs text-gray-500 mt-1">{trait.level} Tier</p>
              </div>
            </div>
            <div className="bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all"
                style={{ width: `${trait.progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">{trait.progress}% Unlocked</p>
          </Card>
        ))}
      </div>

      <section className="bg-blue-50 rounded-xl p-8 border border-blue-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">How Your DNA Grows</h2>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-start gap-3">
            <span className="text-blue-600 font-bold mt-1">1.</span>
            <span>Complete missions to earn XP</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-600 font-bold mt-1">2.</span>
            <span>Level up through the three tiers</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-600 font-bold mt-1">3.</span>
            <span>Unlock new traits and capabilities</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-600 font-bold mt-1">4.</span>
            <span>Master your financial and entrepreneurial DNA</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
