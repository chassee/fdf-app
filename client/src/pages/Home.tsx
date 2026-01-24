import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="space-y-8 pb-8">
      {/* Hero Section */}
      <section className="text-center space-y-4 pt-4">
        <div className="relative inline-block">
          <h1 className="text-4xl md:text-5xl font-display text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-300 drop-shadow-lg">
            Future Dawgs<br />Foundation
          </h1>
          <span className="absolute -top-4 -right-4 bg-neon-pink text-white text-xs font-bold px-2 py-1 rounded-full transform rotate-12 border border-white/20 shadow-lg shadow-neon-pink/50">
            FDF
          </span>
        </div>
        
        <p className="text-lg text-gray-300 font-medium max-w-xs mx-auto leading-relaxed">
          Start building at <span className="text-neon-lime font-bold">13</span>. 
          Graduate into the Vault at <span className="text-neon-cyan font-bold">18</span>.
        </p>

        <div className="flex flex-col gap-3 max-w-xs mx-auto pt-2">
          <Button className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black font-display text-lg h-12 rounded-xl shadow-lg shadow-orange-500/20 border-b-4 border-orange-700 active:border-b-0 active:translate-y-1 transition-all">
            Join FDF
          </Button>
          <Link href="/parents">
            <Button variant="outline" className="w-full bg-blue-600/20 border-blue-500/50 text-blue-200 hover:bg-blue-600/40 hover:text-white font-bold rounded-xl h-10">
              Parents Info
            </Button>
          </Link>
        </div>
      </section>

      {/* Mascots Preview */}
      <div className="relative h-48 w-full max-w-sm mx-auto mt-8">
        <img 
          src="/images/paw-1.png" 
          alt="Mascot 1" 
          className="absolute left-0 bottom-0 w-32 h-32 object-contain animate-bounce duration-[2000ms]" 
          style={{ animationDelay: '0ms' }}
        />
        <img 
          src="/images/paw-2.png" 
          alt="Mascot 2" 
          className="absolute right-0 bottom-4 w-36 h-36 object-contain animate-bounce duration-[2200ms]" 
          style={{ animationDelay: '500ms' }}
        />
      </div>

      {/* Weekly Mission Preview */}
      <Card className="glass-panel p-0 overflow-hidden rounded-2xl border-neon-lime/30">
        <div className="bg-gradient-to-r from-neon-lime/20 to-transparent p-3 border-b border-white/10 flex justify-between items-center">
          <span className="font-display text-neon-lime text-sm tracking-wide">THIS WEEK'S MISSION</span>
          <span className="bg-black/50 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">2 DAYS LEFT</span>
        </div>
        <div className="p-4 flex items-center gap-4">
          <div className="w-16 h-16 bg-purple-900/50 rounded-xl flex items-center justify-center border border-white/10 shrink-0">
            <span className="text-3xl">💰</span>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-white text-lg leading-tight">Save $5 this week</h3>
            <p className="text-gray-400 text-sm mt-1">Put it in a jar or savings account.</p>
          </div>
        </div>
      </Card>

      {/* Choose Your Class Teaser */}
      <section className="space-y-4">
        <div className="flex justify-between items-end px-2">
          <h2 className="text-2xl font-display text-white">Choose Class</h2>
          <Link href="/ranks" className="text-neon-cyan text-sm font-bold hover:underline">View All</Link>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: "Builder", color: "from-orange-400 to-red-500", img: "/images/paw-1.png" },
            { name: "Creator", color: "from-purple-400 to-pink-500", img: "/images/paw-2.png" },
            { name: "Tech", color: "from-blue-400 to-cyan-500", img: "/images/paw-3.png" },
            { name: "Money", color: "from-green-400 to-emerald-500", img: "/images/paw-4.png" },
          ].map((cls) => (
            <div key={cls.name} className="group relative bg-black/40 rounded-2xl p-3 border border-white/10 hover:border-white/30 transition-all overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-br ${cls.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
              <div className="relative z-10 flex flex-col items-center text-center">
                <img src={cls.img} alt={cls.name} className="w-20 h-20 object-contain mb-2 group-hover:scale-110 transition-transform" />
                <span className="font-display text-white tracking-wide">{cls.name} Dawg</span>
                <Button size="sm" className="mt-2 w-full h-8 text-xs bg-white/10 hover:bg-white/20 border border-white/10">
                  Pick Me
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      <div className="text-center pb-4">
        <span className="inline-block bg-white/5 border border-white/10 rounded-full px-3 py-1 text-[10px] text-gray-500 uppercase tracking-widest font-bold">
          Sponsor-Funded Program
        </span>
      </div>
    </div>
  );
}
