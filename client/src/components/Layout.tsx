import { useAuth } from "@/_core/hooks/useAuth";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc";
import {
  Home,
  Target,
  Trophy,
  Gift,
  GraduationCap,
  Users,
  ChevronRight,
  Gem,
} from "lucide-react";
import { useLocation, Link } from "wouter";

const navItems = [
  { icon: Home,           label: "Home",       path: "/" },
  { icon: Trophy,         label: "Ranks",      path: "/ranks" },
  { icon: Target,         label: "Missions",   path: "/missions" },
  { icon: Gift,           label: "Rewards",    path: "/rewards" },
  { icon: GraduationCap,  label: "Graduation", path: "/graduation" },
  { icon: Users,          label: "Parents",    path: "/parents" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();

  const { data: profile } = trpc.fdf.getProfile.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const gems = profile?.progress?.gemsTotal ?? 0;
  const xp   = profile?.progress?.xpTotal ?? 0;
  const rank  = profile?.progress?.rankName ?? "Applicant";

  return (
    <div className="min-h-dvh flex flex-col pb-20 md:pb-0">

      {/* ── Top Bar ── */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-strong h-14 border-b border-b-[oklch(0.28_0.04_280/0.5)]">
        <div className="container h-full flex items-center justify-between">

          {/* Brand */}
          <Link href="/">
            <div className="flex items-center gap-2.5 cursor-pointer">
              <div className="w-7 h-7 rounded-md bg-gradient-to-br from-[oklch(0.65_0.18_270)] to-[oklch(0.55_0.18_250)] flex items-center justify-center">
                <span className="text-white font-bold text-xs tracking-tight">FDF</span>
              </div>
              <div className="hidden sm:block">
                <span className="font-display font-700 text-sm text-white tracking-tight">Future Dawgs</span>
                <span className="text-[oklch(0.55_0.08_280)] text-xs ml-1.5 font-mono">FOUNDATION</span>
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location === item.path;
              return (
                <Link key={item.path} href={item.path}>
                  <div className={cn(
                    "px-3 py-1.5 rounded-md text-xs font-medium tracking-wide transition-all duration-150 cursor-pointer",
                    isActive
                      ? "bg-[oklch(0.65_0.18_270/0.15)] text-[oklch(0.75_0.15_270)] border border-[oklch(0.65_0.18_270/0.3)]"
                      : "text-[oklch(0.60_0.04_280)] hover:text-white hover:bg-[oklch(0.20_0.04_280/0.6)]"
                  )}>
                    {item.label}
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Right: Stats + Avatar */}
          <div className="flex items-center gap-2">
            {isAuthenticated && profile?.fdfUser && (
              <>
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[oklch(0.18_0.04_280/0.8)] border border-[oklch(0.30_0.04_280/0.5)]">
                  <Gem size={12} className="text-[oklch(0.72_0.16_270)]" />
                  <span className="text-xs font-mono font-600 text-[oklch(0.85_0.08_280)]">{gems.toLocaleString()}</span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[oklch(0.18_0.04_280/0.8)] border border-[oklch(0.30_0.04_280/0.5)]">
                  <span className="text-[10px] font-mono text-[oklch(0.55_0.08_280)] uppercase tracking-wider">XP</span>
                  <span className="text-xs font-mono font-600 text-[oklch(0.85_0.08_280)]">{xp.toLocaleString()}</span>
                </div>
              </>
            )}
            <div className="w-7 h-7 rounded-full bg-[oklch(0.22_0.06_270)] border border-[oklch(0.40_0.08_270/0.5)] flex items-center justify-center overflow-hidden">
              {user?.name ? (
                <span className="text-[10px] font-bold text-[oklch(0.80_0.10_270)] uppercase">
                  {user.name.slice(0, 2)}
                </span>
              ) : (
                <span className="text-[10px] font-bold text-[oklch(0.55_0.08_280)]">--</span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="flex-1 pt-14">
        {children}
      </main>

      {/* ── Bottom Navigation (Mobile) ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass-strong border-t border-t-[oklch(0.28_0.04_280/0.5)]">
        <div className="flex justify-around items-center h-16 px-1">
          {navItems.map((item) => {
            const isActive = location === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <div className={cn(
                  "flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-all duration-150 cursor-pointer",
                  isActive
                    ? "text-[oklch(0.75_0.15_270)]"
                    : "text-[oklch(0.45_0.04_280)] hover:text-[oklch(0.70_0.08_280)]"
                )}>
                  <item.icon size={18} strokeWidth={isActive ? 2.5 : 1.8} />
                  <span className={cn(
                    "text-[9px] mt-0.5 font-medium tracking-wide",
                    isActive ? "text-[oklch(0.75_0.15_270)]" : "text-[oklch(0.40_0.04_280)]"
                  )}>
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
