import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { ArrowRight, Award, CheckCircle2, Target, TrendingUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Link } from "wouter";

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
      toast.success("Welcome to Future Dawgs Foundation");
      setShowOnboarding(false);
      refetchProfile();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleOnboardingSubmit = () => {
    if (!dob || !dawgClass) {
      toast.error("Please complete all fields");
      return;
    }
    completeOnboarding.mutate({ dob, dawgClass });
  };

  const needsOnboarding = isAuthenticated && profile && !profile.fdfUser;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-2xl space-y-4">
          <div className="skeleton h-40 w-full"></div>
          <div className="skeleton h-32 w-full"></div>
          <div className="skeleton h-32 w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <div className="container max-w-4xl mx-auto space-y-8 pt-8 relative z-10">
        
        {/* Header Section */}
        <div className="glass-panel rounded-2xl p-8 text-left">
          <div className="flex items-start justify-between">
            <div className="space-y-3 flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet/20 border border-violet/30">
                <span className="w-2 h-2 rounded-full bg-violet animate-pulse"></span>
                <span className="text-xs font-semibold text-violet uppercase tracking-wide">Training Academy</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-primary">
                Future Dawgs<br />Foundation
              </h1>
              <p className="text-lg text-secondary max-w-xl">
                Start learning real money skills at <span className="text-cyan font-semibold">13</span>. 
                Graduate into the Vault at <span className="text-emerald font-semibold">18</span>.
              </p>
              <p className="text-sm text-tertiary">
                100% Free (Ages 13–17) • Sponsor-Funded • No Purchases
              </p>
            </div>
            
            {/* Mascot - Small Supporting Element */}
            <div className="hidden md:block w-24 h-24 opacity-60">
              <img 
                src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663182301791/rpQcvtVEZHGkTvGE.png" 
                alt="FDF Guide" 
                className="w-full h-full object-contain filter drop-shadow-lg"
              />
            </div>
          </div>

          {/* CTA Buttons */}
          {!isAuthenticated ? (
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <a href={getLoginUrl()} className="flex-1">
                <Button className="w-full bg-violet hover:bg-violet/90 text-white font-semibold h-12 rounded-lg shadow-lg transition-all">
                  Join FDF Academy
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </a>
              <Link href="/parents" className="flex-1">
                <Button variant="outline" className="w-full border-white/20 text-secondary hover:bg-white/10 hover:text-primary font-semibold h-12 rounded-lg transition-all">
                  Parents Info
                </Button>
              </Link>
            </div>
          ) : needsOnboarding ? (
            <Button 
              onClick={() => setShowOnboarding(true)}
              className="w-full sm:w-auto mt-6 bg-violet hover:bg-violet/90 text-white font-semibold h-12 px-8 rounded-lg shadow-lg transition-all"
            >
              Complete Setup
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : null}
        </div>

        {/* Dashboard Cards (Authenticated Users Only) */}
        {isAuthenticated && !needsOnboarding && (
          <div className="grid md:grid-cols-3 gap-4">
            
            {/* Daily Check-In Card */}
            <Card className="glass-panel p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald/20 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-emerald" />
                </div>
                <h3 className="text-lg font-semibold text-primary">Daily Check-In</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-primary">{profile?.progress?.streakDays || 0}</span>
                  <span className="text-sm text-tertiary">day streak</span>
                </div>
                <Button className="w-full bg-emerald hover:bg-emerald/90 text-white font-semibold h-10 rounded-lg transition-all">
                  Check In Today
                </Button>
              </div>
            </Card>

            {/* Missions Card */}
            <Link href="/missions">
              <Card className="glass-panel p-6 space-y-4 cursor-pointer hover:scale-[1.02] transition-transform">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan/20 flex items-center justify-center">
                    <Target className="h-5 w-5 text-cyan" />
                  </div>
                  <h3 className="text-lg font-semibold text-primary">Missions</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-primary">3</span>
                    <span className="text-sm text-tertiary">active</span>
                  </div>
                  <div className="text-sm text-secondary">Complete to earn XP & Gems</div>
                </div>
              </Card>
            </Link>

            {/* Progress Rank Card */}
            <Link href="/ranks">
              <Card className="glass-panel p-6 space-y-4 cursor-pointer hover:scale-[1.02] transition-transform">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber/20 flex items-center justify-center">
                    <Award className="h-5 w-5 text-amber" />
                  </div>
                  <h3 className="text-lg font-semibold text-primary">Progress Rank</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-primary">{profile?.progress?.rankName || "Pup"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-emerald" />
                    <span className="text-secondary">{profile?.progress?.xpTotal || 0} XP</span>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        )}

        {/* Quick Access Grid (Authenticated Users) */}
        {isAuthenticated && !needsOnboarding && (
          <div className="grid grid-cols-2 gap-4">
            <Link href="/rewards">
              <Card className="glass-panel p-6 text-center cursor-pointer hover:scale-[1.02] transition-transform">
                <div className="text-3xl mb-2">🎁</div>
                <h4 className="font-semibold text-primary">Rewards</h4>
                <p className="text-xs text-tertiary mt-1">Unlock with gems</p>
              </Card>
            </Link>
            
            <Link href="/graduation">
              <Card className="glass-panel p-6 text-center cursor-pointer hover:scale-[1.02] transition-transform">
                <div className="text-3xl mb-2">🎓</div>
                <h4 className="font-semibold text-primary">Graduation</h4>
                <p className="text-xs text-tertiary mt-1">Vault at 18</p>
              </Card>
            </Link>
          </div>
        )}

      </div>

      {/* Onboarding Dialog */}
      <Dialog open={showOnboarding} onOpenChange={setShowOnboarding}>
        <DialogContent className="glass-panel border-white/20">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary">Complete Your Setup</DialogTitle>
            <DialogDescription className="text-secondary">
              Tell us about yourself to get started with FDF Academy.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            <div className="space-y-2">
              <Label htmlFor="dob" className="text-sm font-semibold text-primary">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="bg-white/5 border-white/20 text-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dawgClass" className="text-sm font-semibold text-primary">Choose Your Path</Label>
              <Select value={dawgClass} onValueChange={(value: any) => setDawgClass(value)}>
                <SelectTrigger className="bg-white/5 border-white/20 text-primary">
                  <SelectValue placeholder="Select a path" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="builder">Builder Dawg</SelectItem>
                  <SelectItem value="creator">Creator Dawg</SelectItem>
                  <SelectItem value="tech">Tech Dawg</SelectItem>
                  <SelectItem value="money">Money Dawg</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleOnboardingSubmit}
              disabled={completeOnboarding.isPending}
              className="w-full bg-violet hover:bg-violet/90 text-white font-semibold h-12 rounded-lg transition-all"
            >
              {completeOnboarding.isPending ? "Setting up..." : "Start Training"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
