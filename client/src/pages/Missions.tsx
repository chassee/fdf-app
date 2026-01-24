import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Lock } from "lucide-react";

export default function Missions() {
  const missions = [
    {
      id: 1,
      title: "Save $5 this week",
      desc: "Put it in a jar or savings account.",
      xp: 120,
      icon: "💰",
      color: "from-purple-500 to-indigo-600",
      status: "active"
    },
    {
      id: 2,
      title: "Sell a product for $10",
      desc: "Lemonade, old toys, or digital art.",
      xp: 200,
      icon: "🏷️",
      color: "from-pink-500 to-rose-600",
      status: "active"
    },
    {
      id: 3,
      title: "Complete a logo design",
      desc: "Draw a logo for your future business.",
      xp: 250,
      icon: "🎨",
      color: "from-orange-500 to-amber-600",
      status: "locked"
    }
  ];

  return (
    <div className="space-y-6 pb-8">
      <div className="text-center space-y-2 pt-4">
        <h1 className="text-3xl font-display text-white drop-shadow-lg">Missions</h1>
        <p className="text-gray-300 text-sm max-w-xs mx-auto">
          Complete fun missions every week to earn <span className="text-neon-cyan font-bold">XP</span> and <span className="text-neon-pink font-bold">FDF ranks</span>!
        </p>
      </div>

      <div className="space-y-4">
        {missions.map((mission) => (
          <Card key={mission.id} className="glass-panel border-0 overflow-hidden relative group">
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-r ${mission.color} opacity-20`} />
            
            <div className="relative p-4 flex items-center gap-4">
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-black/30 border border-white/10 flex items-center justify-center text-3xl shadow-inner">
                {mission.icon}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white text-lg truncate">{mission.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1 bg-black/40 rounded px-1.5 py-0.5 border border-white/5">
                    <span className="text-neon-cyan text-xs font-bold">💎 {mission.xp}</span>
                  </div>
                  {mission.status === 'locked' && (
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Lock size={10} /> Locked
                    </span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <Button 
                className={`h-10 px-6 font-bold rounded-xl shadow-lg transition-all ${
                  mission.status === 'locked' 
                    ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-neon-cyan to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black border-b-4 border-blue-700 active:border-b-0 active:translate-y-1'
                }`}
                disabled={mission.status === 'locked'}
              >
                {mission.status === 'locked' ? <Lock size={16} /> : 'Claim'}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Progress Section */}
      <div className="glass-panel rounded-2xl p-4 space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400 font-bold">Weekly Progress</span>
          <span className="text-white font-bold">2/5 Completed</span>
        </div>
        <div className="h-3 bg-black/50 rounded-full overflow-hidden border border-white/5">
          <div className="h-full w-2/5 bg-gradient-to-r from-neon-lime to-green-500 shadow-[0_0_10px_rgba(57,255,20,0.5)]" />
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>Resets in 2 days</span>
          <span className="text-neon-lime">Next Reward: Sticker Pack</span>
        </div>
      </div>
    </div>
  );
}
