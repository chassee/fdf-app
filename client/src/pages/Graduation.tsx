import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Lock } from "lucide-react";

export default function Graduation() {
  return (
    <div className="space-y-8 pb-8">
      <div className="text-center space-y-4 pt-8">
        <div className="inline-block p-4 rounded-full bg-black/50 border border-neon-pink/30 shadow-[0_0_30px_rgba(255,0,255,0.2)] mb-4">
          <Lock size={48} className="text-neon-pink" />
        </div>
        
        <h1 className="text-4xl font-display text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">
          The Vault
        </h1>
        
        <p className="text-xl text-white font-medium">
          At 18, you don't join... <br/>
          <span className="text-neon-pink font-bold text-2xl">you activate.</span>
        </p>
      </div>

      {/* Countdown Timer */}
      <Card className="glass-panel p-6 text-center border-neon-pink/30">
        <h3 className="text-gray-400 text-sm uppercase tracking-widest mb-4">Time Until Activation</h3>
        <div className="grid grid-cols-4 gap-2">
          {[
            { val: "04", label: "Years" },
            { val: "11", label: "Months" },
            { val: "23", label: "Days" },
            { val: "08", label: "Hours" },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center">
              <div className="bg-black/50 w-full py-3 rounded-lg border border-white/10 mb-1">
                <span className="text-2xl md:text-3xl font-mono font-bold text-white">{item.val}</span>
              </div>
              <span className="text-[10px] text-gray-500 uppercase">{item.label}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Unlocks List */}
      <div className="space-y-4">
        <h3 className="text-white font-display text-xl px-2">Unlocks at 18</h3>
        {[
          { title: "Home Country Vault Access", desc: "Physical access to local chapters." },
          { title: "Blueprint System", desc: "Advanced business building tools." },
          { title: "Atlas Node Activation", desc: "Run a node, earn real rewards." },
          { title: "Vault Citizen Status", desc: "Full voting rights in the DAO." },
        ].map((item) => (
          <div key={item.title} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
            <div className="mt-1 w-2 h-2 rounded-full bg-neon-pink shadow-[0_0_10px_rgba(255,0,255,0.8)]" />
            <div>
              <h4 className="text-white font-bold">{item.title}</h4>
              <p className="text-gray-400 text-sm">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4">
        <Button className="w-full bg-gray-800 text-gray-400 border border-gray-700 cursor-not-allowed h-12 font-bold text-lg">
          Locked Until Age 18
        </Button>
        <p className="text-center text-xs text-gray-500 mt-3">
          FDF accounts become read-only at age 18.
        </p>
      </div>
    </div>
  );
}
