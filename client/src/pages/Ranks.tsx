import { Card } from "@/components/ui/card";
import { Lock, Check } from "lucide-react";

export default function Ranks() {
  const ranks = [
    { name: "Pup", xp: 0, status: "completed" },
    { name: "Rookie", xp: 100, status: "completed" },
    { name: "Runner", xp: 300, status: "completed" },
    { name: "Builder", xp: 600, status: "current" },
    { name: "Operator", xp: 1000, status: "locked" },
    { name: "Vaultborn", xp: 2000, status: "locked" },
    { name: "Atlas Elite", xp: 5000, status: "locked" },
  ];

  return (
    <div className="space-y-6 pb-8">
      <div className="text-center space-y-2 pt-4">
        <h1 className="text-3xl font-display text-white drop-shadow-lg">Ranks</h1>
        <p className="text-gray-300 text-sm max-w-xs mx-auto">
          Climb the ladder to unlock <span className="text-neon-lime font-bold">Vault Access</span>!
        </p>
      </div>

      <div className="relative space-y-4 pl-8 before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-neon-lime before:via-neon-cyan before:to-gray-800">
        {ranks.map((rank, index) => (
          <div key={rank.name} className="relative">
            {/* Timeline Node */}
            <div className={`absolute -left-[23px] top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 flex items-center justify-center z-10 ${
              rank.status === 'completed' ? 'bg-neon-lime border-neon-lime text-black' :
              rank.status === 'current' ? 'bg-black border-neon-cyan text-neon-cyan shadow-[0_0_10px_rgba(0,255,255,0.5)]' :
              'bg-black border-gray-700 text-gray-700'
            }`}>
              {rank.status === 'completed' && <Check size={14} strokeWidth={4} />}
              {rank.status === 'current' && <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse" />}
              {rank.status === 'locked' && <Lock size={12} />}
            </div>

            <Card className={`glass-panel p-4 flex justify-between items-center transition-all ${
              rank.status === 'current' ? 'border-neon-cyan/50 bg-neon-cyan/10 scale-105' : 
              rank.status === 'locked' ? 'opacity-60 grayscale' : ''
            }`}>
              <div>
                <h3 className={`font-display text-lg ${
                  rank.status === 'current' ? 'text-neon-cyan' : 'text-white'
                }`}>{rank.name}</h3>
                <span className="text-xs text-gray-400 font-mono">{rank.xp} XP</span>
              </div>
              
              {rank.status === 'current' && (
                <div className="text-xs font-bold text-neon-cyan bg-neon-cyan/20 px-2 py-1 rounded border border-neon-cyan/30 animate-pulse">
                  CURRENT
                </div>
              )}
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
