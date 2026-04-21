import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronRight, Zap, Trophy, TrendingUp, Users, Shield, Sparkles } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              FDF
            </div>
            <div>
              <div className="font-bold text-gray-900">Future Dawgs</div>
              <div className="text-xs text-gray-500">FOUNDATION</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/signin">
              <Button variant="ghost" className="text-gray-700 hover:text-gray-900">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="mb-6 inline-block">
          <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
            <Sparkles size={16} />
            For Ages 13–17
          </span>
        </div>
        
        <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Build Real Financial <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Intelligence</span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Start early. Learn real money skills through missions, earn XP, climb ranks, and unlock the Vault. 100% free, sponsor-funded, and designed for teens.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link href="/signup">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6 h-auto">
              Create Free Account
              <ChevronRight size={20} />
            </Button>
          </Link>
          <Link href="/parents">
            <Button size="lg" variant="outline" className="text-gray-700 border-gray-300 hover:bg-gray-50 text-lg px-8 py-6 h-auto">
              Parent Information
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 max-w-md mx-auto">
          <div>✓ 100% Free</div>
          <div>✓ No Ads</div>
          <div>✓ Safe & Secure</div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">What You'll Build</h2>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            FDF teaches real financial skills through interactive missions, gamified learning, and community challenges.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Real Money Skills */}
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-8 border border-yellow-200">
              <div className="w-14 h-14 bg-yellow-400 rounded-lg flex items-center justify-center mb-4 text-2xl">
                💡
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Real Money Skills</h3>
              <p className="text-gray-700">
                Saving, investing, building income — not theory. Learn from real-world scenarios and practical challenges.
              </p>
            </div>

            {/* XP & Rank System */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-8 border border-purple-200">
              <div className="w-14 h-14 bg-purple-400 rounded-lg flex items-center justify-center mb-4 text-2xl">
                🏆
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">XP & Rank System</h3>
              <p className="text-gray-700">
                Complete missions, earn XP, climb ranks. Track your progress and unlock new challenges as you level up.
              </p>
            </div>

            {/* The Vault */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 border border-blue-200">
              <div className="w-14 h-14 bg-blue-400 rounded-lg flex items-center justify-center mb-4 text-2xl">
                🔐
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Unlock the Vault</h3>
              <p className="text-gray-700">
                Graduate from FDF and unlock the Vault — advanced training for teens ready to take control of their financial future.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-16 text-center">How It Works</h2>

          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex gap-8 items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white font-bold text-lg">
                  1
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Sign Up (Ages 13–17)</h3>
                <p className="text-gray-600">
                  Create your account and verify your age. We keep your data safe and never share it.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-8 items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white font-bold text-lg">
                  2
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Complete Missions</h3>
                <p className="text-gray-600">
                  Start with Mission 1: Daily Check-In. Each mission teaches real financial concepts and skills.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-8 items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white font-bold text-lg">
                  3
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Earn XP & Climb Ranks</h3>
                <p className="text-gray-600">
                  Earn XP for completing missions, build your Financial DNA score, and unlock new ranks.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-8 items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white font-bold text-lg">
                  4
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Graduate & Unlock the Vault</h3>
                <p className="text-gray-600">
                  Complete the Foundation and graduate. Unlock the Vault for advanced training and continued growth.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-50 py-20 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-16 text-center">Safe & Secure</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Age Verification</h3>
              <p className="text-gray-600">
                We verify ages 13–17 only. Under 13? We don't allow access.
              </p>
            </div>

            <div className="text-center">
              <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">No Social Features</h3>
              <p className="text-gray-600">
                No public profiles, no messaging, no social pressure. Just learning.
              </p>
            </div>

            <div className="text-center">
              <Zap className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Minimal Data</h3>
              <p className="text-gray-600">
                We collect only what's necessary. Your privacy is protected.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Build Your Financial Future?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Start your journey today. It's free, safe, and designed just for you.
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6 h-auto">
              Create Free Account
              <ChevronRight size={20} />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  FDF
                </div>
                <div>
                  <div className="font-bold text-white text-sm">Future Dawgs</div>
                  <div className="text-xs text-gray-500">Foundation</div>
                </div>
              </div>
              <p className="text-sm text-gray-400">
                Building financial intelligence for teens.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-bold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/"><span className="hover:text-white cursor-pointer">Home</span></Link></li>
                <li><Link href="/parents"><span className="hover:text-white cursor-pointer">Parent Info</span></Link></li>
                <li><a href="https://vault.crypdawgs.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">The Vault</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy"><span className="hover:text-white cursor-pointer">Privacy Policy</span></Link></li>
                <li><Link href="/terms"><span className="hover:text-white cursor-pointer">Terms of Use</span></Link></li>
                <li><Link href="/child-safety"><span className="hover:text-white cursor-pointer">Child Safety</span></Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-bold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/contact"><span className="hover:text-white cursor-pointer">Contact Us</span></Link></li>
                <li><a href="mailto:admin@crypdawgs.com" className="hover:text-white">admin@crypdawgs.com</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>© 2024 Future Dawgs Foundation. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
