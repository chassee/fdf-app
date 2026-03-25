import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Gem,
  Lock,
  Shield,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Link } from "wouter";

const DAWG_CLASSES = [
  {
    id: "builder",
    label: "Builder Dawg",
    desc: "Build products, services, and systems",
    icon: "⚙️",
  },
  {
    id: "creator",
    label: "Creator Dawg",
    desc: "Create content, brands, and media",
    icon: "🎨",
  },
  {
    id: "tech",
    label: "Tech Dawg",
    desc: "Code, automate, and engineer solutions",
    icon: "💻",
  },
  {
    id: "money",
    label: "Money Dawg",
    desc: "Invest, trade, and grow capital",
    icon: "📈",
  },
];

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [dob, setDob] = useState("");
  const [dawgClass, setDawgClass] = useState<"builder" | "creator" | "tech" | "money" | "">("");

  const { data: profile, refetch: refetchProfile } = trpc.fdf.getProfile.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const completeOnboarding = trpc.fdf.completeOnboarding.useMutation({
    onSuccess: () => {
      toast.success("Access granted. Welcome to FDF.");
      setShowOnboarding(false);
      refetchProfile();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleOnboardingSubmit = () => {
    if (!dob || !dawgClass) {
      toast.error("Complete all fields to continue");
      return;
    }
    completeOnboarding.mutate({ dob, dawgClass });
  };

  const needsOnboarding = isAuthenticated && profile && !profile.fdfUser;
  const isEnrolled = isAuthenticated && profile?.fdfUser;
  const progress = profile?.progress;

  // ── Loading State ──
  if (loading) {
    return (
      <div className="container py-8 space-y-6 animate-fade-in">
        <div className="skeleton h-48 w-full rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="skeleton h-32 rounded-xl" />
          <div className="skeleton h-32 rounded-xl" />
          <div className="skeleton h-32 rounded-xl" />
        </div>
        <div className="skeleton h-20 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">

      {/* ══════════════════════════════════════════════
          SECTION 1 — HERO
          ══════════════════════════════════════════════ */}
      <section className="container pt-8 pb-6">
        <div className="panel relative overflow-hidden">
          {/* Background gradient accent */}
          <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.65_0.18_270/0.08)] via-transparent to-[oklch(0.70_0.15_200/0.05)] pointer-events-none" />

          <div className="relative flex items-start justify-between gap-6">
            {/* Left: Content */}
            <div className="flex-1 min-w-0 space-y-4">
              {/* System badge */}
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[oklch(0.20_0.04_280/0.8)] border border-[oklch(0.35_0.05_280/0.5)]">
                <span className="status-dot status-online" />
                <span className="text-[10px] font-mono font-500 text-[oklch(0.55_0.08_280)] uppercase tracking-widest">
                  Training Academy · Active
                </span>
              </div>

              <div>
                <h1 className="text-white mb-2">
                  Future Dawgs<br />
                  <span className="text-gradient">Foundation</span>
                </h1>
                <p className="text-[oklch(0.65_0.05_280)] text-sm leading-relaxed max-w-sm">
                  Start early. Build real financial intelligence.<br />
                  Enter the Vault prepared.
                </p>
              </div>

              {/* Trust line */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                {["100% Free · Ages 13–17", "Sponsor-Funded", "No Purchases"].map((item) => (
                  <span key={item} className="text-[11px] font-mono text-[oklch(0.50_0.06_280)] flex items-center gap-1">
                    <CheckCircle2 size={10} className="text-[oklch(0.68_0.16_150)]" />
                    {item}
                  </span>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-2 pt-1">
                {!isAuthenticated ? (
                  <>
                    <a href={getLoginUrl()}>
                      <button className="btn-primary">
                        Apply for Access
                        <ArrowRight size={14} />
                      </button>
                    </a>
                    <Link href="/parents">
                      <button className="btn-secondary">
                        Parent Information
                      </button>
                    </Link>
                  </>
                ) : needsOnboarding ? (
                  <button className="btn-primary" onClick={() => setShowOnboarding(true)}>
                    Complete Setup
                    <ArrowRight size={14} />
                  </button>
                ) : (
                  <Link href="/missions">
                    <button className="btn-primary">
                      View Missions
                      <ArrowRight size={14} />
                    </button>
                  </Link>
                )}
              </div>
            </div>

            {/* Right: Small mascot support visual */}
            <div className="hidden md:block w-20 h-20 shrink-0 mascot-support">
              <img
                src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663182301791/rpQcvtVEZHGkTvGE.png"
                alt="FDF Guide"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Enrolled user stats bar */}
          {isEnrolled && progress && (
            <div className="mt-5 pt-4 border-t border-[oklch(0.28_0.04_280/0.5)] flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Gem size={13} className="text-[oklch(0.72_0.16_270)]" />
                <span className="text-xs font-mono text-[oklch(0.70_0.08_280)]">
                  {progress.gemsTotal.toLocaleString()} <span className="text-[oklch(0.45_0.04_280)]">gems</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Zap size={13} className="text-[oklch(0.75_0.14_60)]" />
                <span className="text-xs font-mono text-[oklch(0.70_0.08_280)]">
                  {progress.xpTotal.toLocaleString()} <span className="text-[oklch(0.45_0.04_280)]">xp</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp size={13} className="text-[oklch(0.68_0.16_150)]" />
                <span className="text-xs font-mono text-[oklch(0.70_0.08_280)]">
                  {progress.rankName}
                </span>
              </div>
              {progress.streakDays > 0 && (
                <div className="flex items-center gap-2">
                  <Activity size={13} className="text-[oklch(0.70_0.15_200)]" />
                  <span className="text-xs font-mono text-[oklch(0.70_0.08_280)]">
                    {progress.streakDays}d <span className="text-[oklch(0.45_0.04_280)]">streak</span>
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 2 — SYSTEM OVERVIEW CARDS
          ══════════════════════════════════════════════ */}
      <section className="container pb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Card 1: Daily Check-In */}
          <Link href={isEnrolled ? "/missions" : "#"}>
            <div className={`panel-sm group cursor-pointer transition-all duration-200 hover:border-[oklch(0.50_0.10_270/0.5)] hover:bg-[oklch(0.18_0.04_280/0.9)] ${!isEnrolled ? "module-locked" : ""}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-8 h-8 rounded-lg bg-[oklch(0.68_0.16_150/0.15)] border border-[oklch(0.68_0.16_150/0.25)] flex items-center justify-center">
                  <CheckCircle2 size={16} className="text-[oklch(0.68_0.16_150)]" />
                </div>
                {isEnrolled ? (
                  <ChevronRight size={14} className="text-[oklch(0.40_0.04_280)] group-hover:text-[oklch(0.65_0.15_270)] transition-colors" />
                ) : (
                  <Lock size={12} className="text-[oklch(0.40_0.04_280)]" />
                )}
              </div>
              <h3 className="text-sm font-600 text-white mb-1">Daily Check-In</h3>
              <p className="text-[11px] text-[oklch(0.50_0.04_280)] leading-relaxed">
                Check in each day to maintain your streak and earn gems.
              </p>
              {isEnrolled && progress && (
                <div className="mt-3 flex items-center gap-2">
                  <span className="status-dot status-online" />
                  <span className="text-[10px] font-mono text-[oklch(0.55_0.08_280)]">
                    {progress.streakDays}d streak
                  </span>
                </div>
              )}
            </div>
          </Link>

          {/* Card 2: Missions */}
          <Link href="/missions">
            <div className="panel-sm group cursor-pointer transition-all duration-200 hover:border-[oklch(0.50_0.10_270/0.5)] hover:bg-[oklch(0.18_0.04_280/0.9)]">
              <div className="flex items-start justify-between mb-3">
                <div className="w-8 h-8 rounded-lg bg-[oklch(0.65_0.18_270/0.15)] border border-[oklch(0.65_0.18_270/0.25)] flex items-center justify-center">
                  <Target size={16} className="text-[oklch(0.72_0.16_270)]" />
                </div>
                <ChevronRight size={14} className="text-[oklch(0.40_0.04_280)] group-hover:text-[oklch(0.65_0.15_270)] transition-colors" />
              </div>
              <h3 className="text-sm font-600 text-white mb-1">Missions</h3>
              <p className="text-[11px] text-[oklch(0.50_0.04_280)] leading-relaxed">
                Complete weekly training modules to build real skills and earn XP.
              </p>
              {isEnrolled && (
                <div className="mt-3">
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: "40%" }} />
                  </div>
                  <span className="text-[10px] font-mono text-[oklch(0.45_0.04_280)] mt-1 block">2 / 5 this week</span>
                </div>
              )}
            </div>
          </Link>

          {/* Card 3: Progress Rank */}
          <Link href="/ranks">
            <div className="panel-sm group cursor-pointer transition-all duration-200 hover:border-[oklch(0.50_0.10_270/0.5)] hover:bg-[oklch(0.18_0.04_280/0.9)]">
              <div className="flex items-start justify-between mb-3">
                <div className="w-8 h-8 rounded-lg bg-[oklch(0.78_0.14_85/0.15)] border border-[oklch(0.78_0.14_85/0.25)] flex items-center justify-center">
                  <TrendingUp size={16} className="text-[oklch(0.78_0.14_85)]" />
                </div>
                <ChevronRight size={14} className="text-[oklch(0.40_0.04_280)] group-hover:text-[oklch(0.65_0.15_270)] transition-colors" />
              </div>
              <h3 className="text-sm font-600 text-white mb-1">Progress Rank</h3>
              <p className="text-[11px] text-[oklch(0.50_0.04_280)] leading-relaxed">
                Track your advancement through the FDF training tiers.
              </p>
              {isEnrolled && progress && (
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-[10px] font-mono font-600 text-[oklch(0.78_0.14_85)]">{progress.rankName}</span>
                  <span className="text-[oklch(0.35_0.04_280)] text-[10px]">·</span>
                  <span className="text-[10px] font-mono text-[oklch(0.45_0.04_280)]">{progress.xpTotal} XP</span>
                </div>
              )}
            </div>
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 3 — TRAINING PATH TIMELINE
          ══════════════════════════════════════════════ */}
      <section className="container pb-6">
        <div className="panel">
          <div className="mb-4">
            <h2 className="text-sm font-display font-700 text-white uppercase tracking-widest mb-1">Training Path</h2>
            <p className="text-[11px] text-[oklch(0.45_0.04_280)]">Your progression through the FDF system</p>
          </div>

          {/* Desktop: horizontal timeline */}
          <div className="hidden md:block relative">
            <div className="flex items-center justify-between relative py-6">
              {/* Connecting line */}
              <div className="timeline-line" />

              {[
                { label: "Entry",       sub: "Age 13–14",  color: "oklch(0.68_0.16_150)", active: true },
                { label: "Training",    sub: "Year 1–2",   color: "oklch(0.65_0.18_270)", active: isEnrolled },
                { label: "Development", sub: "Year 3–4",   color: "oklch(0.70_0.15_200)", active: false },
                { label: "Vault Access",sub: "Age 18",     color: "oklch(0.78_0.14_85)",  active: false },
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center gap-2 relative z-10">
                  <div
                    className="w-3 h-3 rounded-full border-2 border-[oklch(0.12_0.04_280)]"
                    style={{
                      background: step.active ? step.color : "oklch(0.25 0.04 280)",
                      boxShadow: step.active ? `0 0 10px ${step.color}` : "none",
                    }}
                  />
                  <span className="text-[11px] font-600 text-white whitespace-nowrap">{step.label}</span>
                  <span className="text-[10px] font-mono text-[oklch(0.45_0.04_280)] whitespace-nowrap">{step.sub}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile: vertical steps */}
          <div className="md:hidden space-y-3">
            {[
              { label: "Entry",       sub: "Age 13–14",  color: "oklch(0.68_0.16_150)", active: true },
              { label: "Training",    sub: "Year 1–2",   color: "oklch(0.65_0.18_270)", active: isEnrolled },
              { label: "Development", sub: "Year 3–4",   color: "oklch(0.70_0.15_200)", active: false },
              { label: "Vault Access",sub: "Age 18",     color: "oklch(0.78_0.14_85)",  active: false },
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{
                    background: step.active ? step.color : "oklch(0.25 0.04 280)",
                    boxShadow: step.active ? `0 0 8px ${step.color}` : "none",
                  }}
                />
                <span className="text-sm font-500 text-white">{step.label}</span>
                <span className="text-[11px] font-mono text-[oklch(0.45_0.04_280)] ml-auto">{step.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 4 — SYSTEM STATUS PANEL
          ══════════════════════════════════════════════ */}
      <section className="container pb-8">
        <div className="panel-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[11px] font-mono font-500 text-[oklch(0.45_0.04_280)] uppercase tracking-widest">
              System Status
            </h3>
            <Shield size={12} className="text-[oklch(0.50_0.08_280)]" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Network",  value: "Online",  dot: "status-online" },
              { label: "Status",   value: "Active",  dot: "status-online" },
              { label: "Tier",     value: "FDF",     dot: "status-pending" },
              { label: "Vault",    value: "Locked",  dot: "status-locked" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col gap-1.5 p-2.5 rounded-lg bg-[oklch(0.14_0.03_280/0.6)] border border-[oklch(0.25_0.03_280/0.4)]">
                <span className="text-[10px] font-mono text-[oklch(0.40_0.04_280)] uppercase tracking-wider">{item.label}</span>
                <div className="flex items-center gap-1.5">
                  <span className={`status-dot ${item.dot}`} />
                  <span className="text-xs font-mono font-600 text-[oklch(0.80_0.06_280)]">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          ONBOARDING DIALOG
          ══════════════════════════════════════════════ */}
      <Dialog open={showOnboarding || (needsOnboarding ?? false)} onOpenChange={(open) => {
        if (!open && !needsOnboarding) setShowOnboarding(false);
      }}>
        <DialogContent className="bg-[oklch(0.16_0.04_280)] border-[oklch(0.30_0.04_280/0.6)] text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display font-700 text-white">
              System Setup
            </DialogTitle>
            <p className="text-[oklch(0.55_0.04_280)] text-sm">
              Complete your profile to access the FDF training system.
            </p>
          </DialogHeader>

          <div className="space-y-5 pt-2">
            {/* Date of Birth */}
            <div className="space-y-1.5">
              <Label>Date of Birth</Label>
              <Input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
              />
              <p className="text-[11px] text-[oklch(0.45_0.04_280)]">Must be between 13 and 17 years old.</p>
            </div>

            {/* Dawg Class */}
            <div className="space-y-2">
              <Label>Select Your Class</Label>
              <div className="grid grid-cols-2 gap-2">
                {DAWG_CLASSES.map((cls) => (
                  <button
                    key={cls.id}
                    onClick={() => setDawgClass(cls.id as any)}
                    className={`p-3 rounded-lg border text-left transition-all duration-150 ${
                      dawgClass === cls.id
                        ? "border-[oklch(0.65_0.18_270/0.7)] bg-[oklch(0.65_0.18_270/0.12)]"
                        : "border-[oklch(0.28_0.04_280/0.5)] bg-[oklch(0.14_0.03_280/0.5)] hover:border-[oklch(0.40_0.06_280/0.6)]"
                    }`}
                  >
                    <div className="text-lg mb-1">{cls.icon}</div>
                    <div className="text-xs font-600 text-white">{cls.label}</div>
                    <div className="text-[10px] text-[oklch(0.45_0.04_280)] mt-0.5 leading-tight">{cls.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              className="btn-primary w-full justify-center"
              onClick={handleOnboardingSubmit}
              disabled={completeOnboarding.isPending}
            >
              {completeOnboarding.isPending ? "Processing..." : "Activate Access"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
