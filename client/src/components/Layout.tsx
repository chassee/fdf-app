import { Link, useLocation } from "wouter";
import { Home, Trophy, Target, Gift, GraduationCap, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Trophy, label: "Ranks", path: "/ranks" },
    { icon: Target, label: "Missions", path: "/missions" },
    { icon: Gift, label: "Rewards", path: "/rewards" },
    { icon: GraduationCap, label: "Graduation", path: "/graduation" },
    { icon: Users, label: "Parents", path: "/parents" },
  ];

  return (
    <div className="min-h-screen flex flex-col pb-24 md:pb-0">
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-panel h-16 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-lime to-neon-cyan flex items-center justify-center font-display text-black text-xs">
            CD
          </div>
          <span className="font-display text-lg tracking-wider text-white">Crypdawgs</span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-black/40 rounded-full px-3 py-1 border border-white/10">
            <span className="text-neon-cyan text-xs font-bold">💎 120</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-gray-700 border-2 border-white/20 overflow-hidden">
            <img src="/images/paw-1.png" alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-20 px-4 container mx-auto max-w-md md:max-w-2xl lg:max-w-4xl">
        {children}
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-white/10 pb-safe">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map((item) => {
            const isActive = location === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <div className={cn(
                  "flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all duration-200",
                  isActive ? "bg-white/10 text-neon-lime scale-110" : "text-gray-400 hover:text-white"
                )}>
                  <item.icon size={20} strokeWidth={isActive ? 3 : 2} />
                  <span className="text-[10px] font-bold mt-1">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
