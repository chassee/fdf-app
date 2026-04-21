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
            Multi-Year Progression Platform
          </span>
        </div>
        
        <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Build Real Financial <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Intelligence</span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          FDF is a multi-year progression system designed for ages 13–17. Complete missions, earn XP, level up through three tiers, and build real financial and entrepreneurial skills over time.
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

      {/* Progression Path */}
      <section className="bg-white py-20 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">Your Progression Path</h2>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            FDF is structured as a multi-year journey with three distinct tiers. Progress through levels, unlock new missions, and build mastery.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Foundation Tier */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 border border-blue-200">
              <div className="w-14 h-14 bg-blue-400 rounded-lg flex items-center justify-center mb-4 text-2xl">
                🏗️
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Foundation Tier</h3>
              <p className="text-gray-700 mb-4">Levels 1–10 (Ages 13–14)</p>
              <p className="text-gray-700 mb-4">
                Master the fundamentals: saving, budgeting, goal-setting, and basic financial awareness.
              </p>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>✓ Financial Basics</li>
                <li>✓ Saving & Budgeting</li>
                <li>✓ Goal Setting</li>
                <li>✓ Money Awareness</li>
              </ul>
            </div>

            {/* Builder Tier */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-8 border border-purple-200">
              <div className="w-14 h-14 bg-purple-400 rounded-lg flex items-center justify-center mb-4 text-2xl">
                🚀
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Builder Tier</h3>
              <p className="text-gray-700 mb-4">Levels 11–25 (Ages 14–16)</p>
              <p className="text-gray-700 mb-4">
                Build your first business: ideation, market research, MVP creation, and sales fundamentals.
              </p>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>✓ Entrepreneurship</li>
                <li>✓ Product Development</li>
                <li>✓ Customer Acquisition</li>
                <li>✓ Business Growth</li>
              </ul>
            </div>

            {/* Operator Tier */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-8 border border-orange-200">
              <div className="w-14 h-14 bg-orange-400 rounded-lg flex items-center justify-center mb-4 text-2xl">
                ⚙️
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Operator Tier</h3>
              <p className="text-gray-700 mb-4">Levels 26–50 (Ages 16–17)</p>
              <p className="text-gray-700 mb-4">
                Master operations: scaling, systems thinking, team leadership, and advanced strategy.
              </p>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>✓ Systems Thinking</li>
                <li>✓ Team Leadership</li>
                <li>✓ Strategic Planning</li>
                <li>✓ Vault Access</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Starter Missions */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">Starter Missions</h2>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            Begin your journey with these Foundation Tier missions. Available immediately after onboarding.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Mission 1 */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-3">📅</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Daily Check-In</h3>
              <p className="text-gray-600 text-sm mb-4">Start your day by checking in. Build a consistent financial habit.</p>
              <div className="flex items-center gap-2 text-sm">
                <Zap size={14} className="text-yellow-500" />
                <span className="font-semibold">+50 XP</span>
              </div>
            </div>

            {/* Mission 2 */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-3">💰</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Saving Basics</h3>
              <p className="text-gray-600 text-sm mb-4">Learn the fundamentals of saving money and compound growth.</p>
              <div className="flex items-center gap-2 text-sm">
                <Zap size={14} className="text-yellow-500" />
                <span className="font-semibold">+100 XP</span>
              </div>
            </div>

            {/* Mission 3 */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Set Your First Goal</h3>
              <p className="text-gray-600 text-sm mb-4">Define a financial goal for the next 3 months.</p>
              <div className="flex items-center gap-2 text-sm">
                <Zap size={14} className="text-yellow-500" />
                <span className="font-semibold">+100 XP</span>
              </div>
            </div>

            {/* Mission 4 */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-3">🛠️</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Identify a Skill</h3>
              <p className="text-gray-600 text-sm mb-4">Think about a skill you have. How could you monetize it?</p>
              <div className="flex items-center gap-2 text-sm">
                <Zap size={14} className="text-yellow-500" />
                <span className="font-semibold">+75 XP</span>
              </div>
            </div>

            {/* Mission 5 */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Money Awareness</h3>
              <p className="text-gray-600 text-sm mb-4">Track your spending for one day. Where does your money go?</p>
              <div className="flex items-center gap-2 text-sm">
                <Zap size={14} className="text-yellow-500" />
                <span className="font-semibold">+75 XP</span>
              </div>
            </div>

            {/* Mission 6 */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-3">📋</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Create Your Budget</h3>
              <p className="text-gray-600 text-sm mb-4">Build a simple budget for the next month.</p>
              <div className="flex items-center gap-2 text-sm">
                <Zap size={14} className="text-yellow-500" />
                <span className="font-semibold">+150 XP</span>
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
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of teens building real financial and entrepreneurial skills.
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
                Multi-year progression platform for ages 13–17.
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
