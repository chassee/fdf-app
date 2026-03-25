import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  ChevronRight,
  GraduationCap,
  Lock,
  Shield,
  TrendingUp,
  Zap,
} from "lucide-react";

function getDaysUntil18(dobStr: string): number {
  const dob = new Date(dobStr);
  const eighteenth = new Date(dob.getFullYear() + 18, dob.getMonth(), dob.getDate());
  const today = new Date();
  const diff = eighteenth.getTime() - today.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function getAge(dobStr: string): number {
  const dob = new Date(dobStr);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
}

export default function Graduation() {
  const { data: profile } = trpc.fdf.getProfile.useQuery();

  const dob = profile?.fdfUser?.dob;
  const age = dob ? getAge(dob) : null;
  const daysUntil18 = dob ? getDaysUntil18(dob) : null;
  const isVaultReady = age !== null && age >= 18;
  const isEnrolled = !!profile?.fdfUser;

  const xp = profile?.progress?.xpTotal ?? 0;
  const rank = profile?.progress?.rankName ?? "Pup";

  // ── Loading State ──
  if (!profile) {
    return (
      <div className="container py-8 space-y-4 animate-fade-in">
        <div className="skeleton h-6 w-48 rounded-md" />
        <div className="skeleton h-40 w-full rounded-xl" />
        <div className="skeleton h-24 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-6 animate-fade-in">

      {/* ── Page Header ── */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-[oklch(0.50_0.04_280)] text-[11px] font-mono uppercase tracking-widest mb-2">
          <GraduationCap size={11} />
          <span>Training System</span>
          <ChevronRight size={10} />
          <span className="text-[oklch(0.70_0.08_280)]">Graduation</span>
        </div>
        <h1 className="text-white">Vault Graduation</h1>
        <p className="text-[oklch(0.55_0.04_280)] text-sm">
          Your path to Vault access. All progress carries forward at 18.
        </p>
      </div>

      {/* ── Vault Status Panel ── */}
      <div
        className={cn(
          "panel relative overflow-hidden",
          isVaultReady && "border-[oklch(0.78_0.14_85/0.5)]"
        )}
      >
        {isVaultReady && (
          <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.78_0.14_85/0.06)] to-transparent pointer-events-none" />
        )}

        <div className="relative flex items-start gap-4">
          <div
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
              isVaultReady
                ? "bg-[oklch(0.78_0.14_85/0.15)] border border-[oklch(0.78_0.14_85/0.3)]"
                : "bg-[oklch(0.20_0.04_280/0.6)] border border-[oklch(0.30_0.04_280/0.5)]"
            )}
          >
            {isVaultReady ? (
              <Shield size={24} className="text-[oklch(0.78_0.14_85)]" />
            ) : (
              <Lock size={24} className="text-[oklch(0.45_0.04_280)]" />
            )}
          </div>

          <div className="flex-1">
            <h2 className="text-base font-display font-700 text-white mb-1">
              {isVaultReady ? "Vault Access Unlocked" : "Vault Locked"}
            </h2>
            <p className="text-[11px] text-[oklch(0.50_0.04_280)] leading-relaxed">
              {isVaultReady
                ? "You have reached age 18. Your Crypdawgs Vault is now accessible. All FDF progress has been transferred."
                : isEnrolled
                  ? `${daysUntil18} days remaining until Vault activation. Keep building XP and completing missions.`
                  : "Complete your profile setup to begin tracking your path to Vault access."}
            </p>

            {isVaultReady && (
              <a
                href="https://crypdawgs.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold inline-flex mt-3 text-xs items-center gap-1.5"
              >
                Enter the Vault
                <ArrowRight size={13} />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ── Countdown (if enrolled and not yet 18) ── */}
      {isEnrolled && !isVaultReady && daysUntil18 !== null && (
        <div className="panel">
          <h2 className="text-[11px] font-mono font-500 text-[oklch(0.40_0.04_280)] uppercase tracking-widest mb-4">
            Vault Countdown
          </h2>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Days",   value: daysUntil18 },
              { label: "Months", value: Math.floor(daysUntil18 / 30) },
              { label: "Years",  value: (daysUntil18 / 365).toFixed(1) },
            ].map((item) => (
              <div
                key={item.label}
                className="p-4 rounded-lg bg-[oklch(0.14_0.03_280/0.6)] border border-[oklch(0.25_0.03_280/0.4)] text-center"
              >
                <div className="text-2xl font-display font-800 text-white mb-1">
                  {item.value}
                </div>
                <div className="text-[10px] font-mono text-[oklch(0.40_0.04_280)] uppercase tracking-wider">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Progress Summary ── */}
      {isEnrolled && (
        <div className="panel">
          <h2 className="text-[11px] font-mono font-500 text-[oklch(0.40_0.04_280)] uppercase tracking-widest mb-4">
            Progress Summary
          </h2>

          <div className="space-y-3">
            {[
              {
                label: "Current Rank",
                value: rank,
                icon: TrendingUp,
                color: "oklch(0.65_0.18_270)",
              },
              {
                label: "Total XP",
                value: xp.toLocaleString(),
                icon: Zap,
                color: "oklch(0.75_0.14_60)",
              },
              {
                label: "Vault Status",
                value: isVaultReady ? "Unlocked" : "Locked",
                icon: Shield,
                color: isVaultReady ? "oklch(0.78_0.14_85)" : "oklch(0.45_0.04_280)",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between py-2.5 border-b border-[oklch(0.25_0.03_280/0.4)] last:border-0"
              >
                <div className="flex items-center gap-2.5">
                  <item.icon size={13} style={{ color: item.color }} />
                  <span className="text-xs text-[oklch(0.55_0.04_280)]">{item.label}</span>
                </div>
                <span className="text-xs font-mono font-600" style={{ color: item.color }}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── What Transfers to Vault ── */}
      <div className="panel-sm">
        <h3 className="text-[11px] font-mono font-500 text-[oklch(0.40_0.04_280)] uppercase tracking-widest mb-3">
          What Transfers to the Vault
        </h3>
        <div className="space-y-2">
          {[
            "All accumulated XP and rank status",
            "Unlocked badges and stickers",
            "Mission completion history",
            "Dawg Class designation",
            "Streak and activity records",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[oklch(0.68_0.16_150)] shrink-0" />
              <span className="text-[11px] text-[oklch(0.55_0.04_280)]">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
