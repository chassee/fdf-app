import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Zap, Trophy, TrendingUp, Lock, Sparkles } from "lucide-react";

export default function Landing() {
  const [, navigate] = useLocation();

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
            <button className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600">
              🌐
            </button>
            <Link href="/signin">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
            <Sparkles size={16} />
            FREE • AGES 13-17 • SPONSOR-FUNDED
          </div>
        </div>

        {/* Main Heading */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Future Dawgs <span className="text-blue-600">Foundation</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Start early. Build real financial intelligence.
          </p>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <div className="flex items-center gap-2 text-green-600 font-semibold">
            <span className="text-2xl">✓</span> 100% Free
          </div>
          <div className="flex items-center gap-2 text-green-600 font-semibold">
            <span className="text-2xl">✓</span> Ages 13-17
          </div>
          <div className="flex items-center gap-2 text-green-600 font-semibold">
            <span className="text-2xl">✓</span> Sponsor-Funded
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link href="/signup">
            <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-lg px-8 py-6 rounded-lg font-semibold">
              Create Free Account →
            </Button>
          </Link>
          <Link href="/signin">
            <Button variant="outline" className="w-full sm:w-auto border-2 border-blue-200 text-blue-600 hover:bg-blue-50 text-lg px-8 py-6 rounded-lg font-semibold">
              Sign In
            </Button>
          </Link>
        </div>

        {/* Secondary CTA */}
        <div className="text-center mb-12">
          <Link href="/parents">
            <button className="text-blue-600 hover:text-blue-700 font-semibold text-lg">
              Parent Information →
            </button>
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="text-center text-gray-600 text-sm">
          <p>🛡️ No purchases • No ads • 100% Free</p>
        </div>
      </section>

      {/* What You'll Build Section */}
      <section className="bg-white py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-12 text-center">
            What You'll Build
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Card 1 */}
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-8 border border-yellow-200">
              <div className="w-16 h-16 bg-yellow-300 rounded-2xl flex items-center justify-center text-3xl mb-4">
                💡
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Real Money Skills
              </h3>
              <p className="text-gray-700">
                Saving, investing, building income — not theory.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 border border-purple-200">
              <div className="w-16 h-16 bg-purple-300 rounded-2xl flex items-center justify-center text-3xl mb-4">
                🏆
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                XP & Rank System
              </h3>
              <p className="text-gray-700">
                Complete missions, earn XP, climb the ranks.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border border-blue-200">
              <div className="w-16 h-16 bg-blue-300 rounded-2xl flex items-center justify-center text-3xl mb-4">
                🧬
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                DNA Challenges
              </h3>
              <p className="text-gray-700">
                Unlock your financial DNA through real-world challenges.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 border border-green-200">
              <div className="w-16 h-16 bg-green-300 rounded-2xl flex items-center justify-center text-3xl mb-4">
                🎓
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Graduation Vault
              </h3>
              <p className="text-gray-700">
                Graduate at 18 with real financial skills and rewards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
          Ready to start building?
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Join thousands of young people learning real financial skills.
        </p>
        <Link href="/signup">
          <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-lg px-8 py-6 rounded-lg font-semibold">
            Create Free Account →
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
          <p>© 2026 Future Dawgs Foundation. All rights reserved.</p>
        </div>
      </footer>

      {/* Bottom Nav (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
        <div className="flex justify-around items-center py-3">
          <button className="flex flex-col items-center gap-1 text-blue-600 font-semibold text-xs">
            <span className="text-xl">🏠</span>
            Home
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-500 hover:text-gray-700 text-xs">
            <span className="text-xl">🎯</span>
            Train
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-500 hover:text-gray-700 text-xs">
            <span className="text-xl">🧬</span>
            DNA
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-500 hover:text-gray-700 text-xs">
            <span className="text-xl">📊</span>
            Ranks
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-500 hover:text-gray-700 text-xs">
            <span className="text-xl">🏆</span>
            Vault
          </button>
        </div>
      </nav>
    </div>
  );
}
