import { useLocation } from "wouter";
import { Link } from "wouter";
import { Home, Zap, BarChart3, Trophy, Vault, Menu, X } from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/missions", label: "Missions", icon: Zap },
  { href: "/dna", label: "DNA", icon: BarChart3 },
  { href: "/leaderboard", label: "Ranks", icon: Trophy },
  { href: "/vault", label: "Vault", icon: Vault },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40 px-4 py-3 flex items-center justify-between">
        <div className="font-bold text-gray-900">FDF</div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 bg-white border-b border-gray-200 z-30">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 border-b border-gray-100 hover:bg-gray-50 ${
                  location === href ? "bg-blue-50 text-blue-600 font-semibold" : "text-gray-700"
                }`}
              >
                <Icon size={20} />
                {label}
              </button>
            </Link>
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="md:flex">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:bg-white md:border-r md:border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                FDF
              </div>
              <div>
                <div className="font-bold text-gray-900 text-sm">Future Dawgs</div>
                <div className="text-xs text-gray-500">Foundation</div>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}>
                <button
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                    location === href
                      ? "bg-blue-100 text-blue-600 font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={20} />
                  {label}
                </button>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <button className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
              Settings
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="md:ml-64 w-full">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 mt-16 md:mt-0">
            {children}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex items-center justify-around">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}>
              <button
                className={`flex-1 flex flex-col items-center gap-1 py-3 px-2 text-xs font-medium transition-colors ${
                  location === href
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon size={24} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
