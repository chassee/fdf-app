import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
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
      toast.success("Welcome to FDF!");
      setShowOnboarding(false);
      refetchProfile();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleOnboardingSubmit = () => {
    if (!dob || !dawgClass) {
      toast.error("Please fill all fields");
      return;
    }
    completeOnboarding.mutate({ dob, dawgClass });
  };

  // Show onboarding if logged in but no FDF profile
  const needsOnboarding = isAuthenticated && profile && !profile.fdfUser;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-3">
          <div className="skeleton h-32 w-full max-w-md rounded-2xl"></div>
          <div className="skeleton h-24 w-full max-w-md rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-black">
      <div className="container max-w-md mx-auto space-y-8 pb-8">
        {/* Hero Section */}
        <section className="text-center space-y-4 pt-8">
          <div className="relative inline-block">
            <h1 className="text-4xl md:text-5xl font-display text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-300 drop-shadow-lg">
              Future Dawgs<br />Foundation
            </h1>
            <span className="absolute -top-4 -right-4 bg-neon-pink text-white text-xs font-bold px-2 py-1 rounded-full transform rotate-12 border border-white/20 shadow-lg shadow-neon-pink/50">
              FDF
            </span>
          </div>
          
          <p className="text-lg text-gray-300 font-medium max-w-xs mx-auto leading-relaxed">
            Start learning real money skills at <span className="text-neon-lime font-bold">13</span>. 
            Graduate into the Vault at <span className="text-neon-cyan font-bold">18</span>.
          </p>

          {!isAuthenticated ? (
            <div className="flex flex-col gap-3 max-w-xs mx-auto pt-2">
              <a href={getLoginUrl()}>
                <Button className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black font-display text-lg h-12 rounded-xl shadow-lg shadow-orange-500/20 border-b-4 border-orange-700 active:border-b-0 active:translate-y-1 transition-all">
                  Join FDF
                </Button>
              </a>
              <p className="text-xs text-gray-400 text-center">
                100% Free (Ages 13–17) • Sponsor-Funded • No Purchases
              </p>
              <Link href="/parents">
                <Button variant="outline" className="w-full bg-blue-600/20 border-blue-500/50 text-blue-200 hover:bg-blue-600/40 hover:text-white font-bold rounded-xl h-10">
                  Parents Info
                </Button>
              </Link>
            </div>
          ) : needsOnboarding ? (
            <Button 
              onClick={() => setShowOnboarding(true)}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black font-display text-lg h-12 rounded-xl shadow-lg shadow-orange-500/20 border-b-4 border-orange-700"
            >
              Complete Setup
            </Button>
          ) : (
            <div className="glass-panel rounded-2xl p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Rank</span>
                <span className="text-neon-lime font-bold">{profile?.progress?.rankName || "Pup"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">XP</span>
                <span className="text-white font-bold">{profile?.progress?.xpTotal || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Gems</span>
                <span className="text-neon-cyan font-bold">💎 {profile?.progress?.gemsTotal || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Streak</span>
                <span className="text-neon-pink font-bold">🔥 {profile?.progress?.streakDays || 0} days</span>
              </div>
            </div>
          )}
        </section>

        {/* Mascots Preview */}
        <div className="relative h-48 w-full max-w-sm mx-auto">
          <img 
            src="/images/mascot-friendly-1.png" 
            alt="Mascot 1" 
            className="absolute left-0 bottom-0 w-32 h-32 object-contain animate-bounce duration-[2000ms]" 
            style={{ animationDelay: '0ms' }}
          />
          <img 
            src="/images/mascot-friendly-2.png" 
            alt="Mascot 2" 
            className="absolute right-0 bottom-4 w-36 h-36 object-contain animate-bounce duration-[2200ms]" 
            style={{ animationDelay: '500ms' }}
          />
        </div>

        {/* Navigation Cards */}
        {isAuthenticated && !needsOnboarding && (
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: "Missions", icon: "🎯", href: "/missions", color: "from-purple-500 to-pink-500" },
              { name: "Rewards", icon: "🎁", href: "/rewards", color: "from-blue-500 to-cyan-500" },
              { name: "Ranks", icon: "👑", href: "/ranks", color: "from-yellow-500 to-orange-500" },
              { name: "Graduation", icon: "🎓", href: "/graduation", color: "from-green-500 to-emerald-500" },
            ].map((item) => (
              <Link key={item.name} href={item.href}>
                <Card className="glass-panel hover:scale-105 transition-transform cursor-pointer p-4 text-center">
                  <div className="text-4xl mb-2">{item.icon}</div>
                  <div className="font-display text-white text-sm">{item.name}</div>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Onboarding Dialog */}
        <Dialog open={showOnboarding} onOpenChange={setShowOnboarding}>
          <DialogContent className="bg-card text-card-foreground">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">Welcome to FDF!</DialogTitle>
              <DialogDescription>
                Let's get you set up. This will only take a moment.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="dawgClass">Choose Your Dawg Class</Label>
                <Select value={dawgClass} onValueChange={(v) => setDawgClass(v as any)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="builder">🔨 Builder Dawg</SelectItem>
                    <SelectItem value="creator">🎨 Creator Dawg</SelectItem>
                    <SelectItem value="tech">💻 Tech Dawg</SelectItem>
                    <SelectItem value="money">💰 Money Dawg</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleOnboardingSubmit}
                disabled={completeOnboarding.isPending}
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black font-bold"
              >
                {completeOnboarding.isPending ? "Setting up..." : "Let's Go!"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
