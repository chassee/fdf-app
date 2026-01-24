import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Rewards() {
  const rewards = [
    {
      id: 1,
      title: "Builder Badge",
      cost: 200,
      image: "/images/badge-builder.png",
      bg: "bg-gradient-to-b from-orange-500 to-red-600",
      status: "claimable"
    },
    {
      id: 2,
      title: "Atlas Dawg",
      cost: 300,
      image: "/images/badge-atlas.png",
      bg: "bg-gradient-to-b from-blue-500 to-indigo-600",
      tag: "NEW",
      status: "locked"
    },
    {
      id: 3,
      title: "Genesis Sticker",
      cost: 350,
      image: "/images/sticker-genesis.png",
      bg: "bg-gradient-to-b from-purple-500 to-pink-600",
      status: "locked"
    }
  ];

  return (
    <div className="space-y-6 pb-8">
      <div className="text-center space-y-2 pt-4">
        <h1 className="text-3xl font-display text-white drop-shadow-lg">Rewards</h1>
        <p className="text-gray-300 text-sm max-w-xs mx-auto">
          Collect loot and unlock badges with your <span className="text-neon-cyan font-bold">XP</span>!
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {rewards.map((reward) => (
          <Card key={reward.id} className="glass-panel border-0 overflow-hidden flex flex-col relative group">
            {/* Card Background */}
            <div className={`absolute inset-0 opacity-20 ${reward.bg}`} />
            
            {/* Content */}
            <div className="relative p-3 flex flex-col items-center flex-1">
              {reward.tag && (
                <span className="absolute top-2 right-2 bg-neon-pink text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-lg animate-pulse">
                  {reward.tag}
                </span>
              )}
              
              <div className="w-20 h-20 mb-3 relative drop-shadow-2xl group-hover:scale-110 transition-transform duration-300">
                <img src={reward.image} alt={reward.title} className="w-full h-full object-contain" />
              </div>
              
              <h3 className="font-display text-white text-sm text-center leading-tight mb-1">{reward.title}</h3>
              
              <div className="flex items-center gap-1 bg-black/40 rounded px-2 py-0.5 border border-white/5 mb-3">
                <span className="text-neon-cyan text-xs font-bold">💎 {reward.cost}</span>
              </div>

              <Button 
                className={`w-full h-8 text-xs font-bold rounded-lg shadow-lg mt-auto ${
                  reward.status === 'claimable'
                    ? 'bg-yellow-400 hover:bg-yellow-300 text-black border-b-4 border-yellow-600 active:border-b-0 active:translate-y-1'
                    : 'bg-gray-700/50 text-gray-400 cursor-not-allowed'
                }`}
                disabled={reward.status !== 'claimable'}
              >
                {reward.status === 'claimable' ? 'Claim' : 'Locked'}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* User Stats Bar */}
      <div className="glass-panel rounded-2xl p-4 flex items-center gap-4 border-neon-pink/30 shadow-[0_0_15px_rgba(255,0,255,0.15)]">
        <div className="w-12 h-12 rounded-full bg-black border-2 border-neon-pink overflow-hidden shrink-0">
          <img src="/images/paw-1.png" alt="Profile" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <h3 className="font-bold text-white">1 Hunter</h3>
            <div className="flex items-center gap-1 bg-yellow-500/20 px-2 py-0.5 rounded text-yellow-400 text-xs font-bold border border-yellow-500/30">
              <span>💰 660</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="text-neon-pink font-bold">XP 550</span>
            <div className="h-1.5 flex-1 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-neon-pink shadow-[0_0_5px_rgba(255,0,255,0.8)]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
