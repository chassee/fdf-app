import {
  Home,
  Target,
  Trophy,
  Gift,
  GraduationCap,
  LogOut,
  Dna,
  BarChart3,
} from "lucide-react";
import { useLocation, Link } from "wouter";
import { useFDF } from "@/contexts/FDFContext";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import ThemeSwitcher from "@/components/ThemeSwitcher";

const NAV_TABS = [
  { icon: Home,          label: "Home",    path: "/" },
  { icon: Target,        label: "Train",   path: "/missions" },
  { icon: Dna,           label: "DNA",     path: "/dna" },
  { icon: BarChart3,     label: "Ranks",   path: "/leaderboard" },
  { icon: GraduationCap, label: "Vault",   path: "/graduation" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { xp, gems, isAuthenticated } = useFDF();
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) setDisplayName(session.user.email.split("@")[0]);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setDisplayName(session?.user?.email ? session.user.email.split("@")[0] : null);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    localStorage.removeItem("fdf-supabase-session");
    window.location.href = "/";
  }

  function isActive(path: string) {
    return path === "/" ? location === "/" : location.startsWith(path);
  }

  return (
    <div style={{ minHeight: "100dvh", background: "var(--bg-main)" }}>

      {/* ── Desktop Sidebar (1024px+) ── */}
      {isDesktop && (
        <aside className="desktop-sidebar">
          {/* Brand */}
          <div className="desktop-sidebar-brand">
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: "linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.65rem", fontWeight: 800, color: "white", letterSpacing: "-0.01em",
              flexShrink: 0, boxShadow: "0 4px 12px rgba(91,140,255,0.3)",
            }}>
              FDF
            </div>
            <div style={{ lineHeight: 1.1 }}>
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 800, fontSize: "0.875rem",
                color: "var(--text-main)", letterSpacing: "-0.02em",
              }}>Future Dawgs</div>
              <div style={{
                fontSize: "0.6rem", fontWeight: 600,
                color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase",
              }}>Foundation</div>
            </div>
          </div>

          {/* Nav items */}
          <nav className="desktop-sidebar-nav">
            {NAV_TABS.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                href={path}
                className={`desktop-nav-item${isActive(path) ? " active" : ""}`}
                style={{ textDecoration: "none" }}
              >
                <Icon size={18} strokeWidth={isActive(path) ? 2.5 : 1.8} />
                {label}
              </Link>
            ))}
          </nav>

          {/* Bottom: stats + sign out */}
          <div style={{ borderTop: "1px solid var(--card-border)", paddingTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            {isAuthenticated && (
              <div style={{ display: "flex", gap: 6, padding: "0 4px" }}>
                <div className="stat-chip" style={{ fontSize: "0.7rem", padding: "4px 10px", flex: 1, justifyContent: "center" }}>
                  <span style={{ opacity: 0.65, fontSize: "0.65rem" }}>XP</span>
                  <span style={{ fontWeight: 700 }}>{xp.toLocaleString()}</span>
                </div>
                <div className="stat-chip" style={{
                  fontSize: "0.7rem", padding: "4px 10px", flex: 1, justifyContent: "center",
                  background: "var(--accent-light)", color: "var(--accent)",
                }}>
                  <span>💎</span>
                  <span style={{ fontWeight: 700 }}>{gems}</span>
                </div>
              </div>
            )}
            {isAuthenticated ? (
              <button
                onClick={handleSignOut}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "8px 14px", borderRadius: 10,
                  background: "none", border: "none", cursor: "pointer",
                  color: "var(--text-muted)", fontSize: "0.875rem", fontWeight: 600,
                  transition: "all 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--danger)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
              >
                <LogOut size={16} />
                Sign Out
              </button>
            ) : (
              <Link href="/signin" style={{ textDecoration: "none" }}>
                <div style={{
                  padding: "8px 14px", borderRadius: 10,
                  background: "linear-gradient(135deg, var(--primary), var(--accent))",
                  color: "white", fontSize: "0.8rem", fontWeight: 700,
                  textAlign: "center",
                }}>
                  Sign In
                </div>
              </Link>
            )}
          </div>
        </aside>
      )}

      {/* ── Top Bar ── */}
      <header className="top-bar" style={isDesktop ? { marginLeft: 220 } : {}}>
        <div
          className="top-bar-inner"
          style={{
            maxWidth: isDesktop ? 960 : 480,
            margin: "0 auto",
            padding: isDesktop ? "0 32px" : "0 16px",
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Brand (mobile only — desktop has sidebar) */}
          {!isDesktop && (
            <Link href="/">
              <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", textDecoration: "none" }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 9,
                  background: "linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.65rem", fontWeight: 800, color: "white",
                  letterSpacing: "-0.01em", flexShrink: 0,
                }}>
                  FDF
                </div>
                <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
                  <span style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700, fontSize: "0.875rem",
                    color: "var(--text-main)", letterSpacing: "-0.02em",
                  }}>Future Dawgs</span>
                  <span style={{
                    fontSize: "0.6rem", fontWeight: 600,
                    color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase",
                  }}>Foundation</span>
                </div>
              </div>
            </Link>
          )}

          {/* Desktop: page title area */}
          {isDesktop && <div />}

          {/* Right: Stats + Theme + Avatar */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {isAuthenticated && (
              <>
                <div className="stat-chip" style={{ fontSize: "0.7rem", padding: "4px 10px" }}>
                  <span style={{ opacity: 0.65, fontSize: "0.65rem" }}>XP</span>
                  <span style={{ fontWeight: 700 }}>{xp.toLocaleString()}</span>
                </div>
                <div className="stat-chip" style={{
                  fontSize: "0.7rem", padding: "4px 10px",
                  background: "var(--accent-light)", color: "var(--accent)",
                }}>
                  <span>💎</span>
                  <span style={{ fontWeight: 700 }}>{gems}</span>
                </div>
              </>
            )}

            {/* Theme switcher */}
            <ThemeSwitcher />

            {/* Avatar / Sign-out (mobile only — desktop has sidebar) */}
            {!isDesktop && (
              isAuthenticated ? (
                <button
                  onClick={handleSignOut}
                  title="Sign out"
                  style={{
                    width: 30, height: 30, borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--primary-light), var(--accent-light))",
                    border: "2px solid rgba(91,140,255,0.25)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.65rem", fontWeight: 700, color: "var(--primary)",
                    cursor: "pointer",
                  }}
                >
                  {displayName ? displayName.slice(0, 2).toUpperCase() : <LogOut size={12} />}
                </button>
              ) : (
                <Link href="/signin" style={{ textDecoration: "none" }}>
                  <div style={{
                    padding: "5px 12px", borderRadius: 99,
                    background: "linear-gradient(135deg, var(--primary), var(--accent))",
                    color: "white", fontSize: "0.72rem", fontWeight: 700, cursor: "pointer",
                  }}>
                    Sign In
                  </div>
                </Link>
              )
            )}
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main style={{
        paddingBottom: isDesktop ? 40 : 72,
        marginLeft: isDesktop ? 220 : 0,
      }}>
        {children}
      </main>

      {/* ── Bottom Navigation (mobile/tablet only) ── */}
      {!isDesktop && (
        <nav className="bottom-nav">
          <div className="bottom-nav-inner">
            {NAV_TABS.map(({ path, label, icon: Icon }) => {
              const active = isActive(path);
              return (
                <Link
                  key={path}
                  href={path}
                  className={`nav-tab${active ? " active" : ""}`}
                  style={{ textDecoration: "none" }}
                >
                  <div className="nav-icon-wrap">
                    <Icon
                      size={20}
                      strokeWidth={active ? 2.5 : 1.8}
                      style={{ color: active ? "var(--primary)" : "var(--text-muted)", transition: "color 0.15s ease" }}
                    />
                  </div>
                  <span
                    className="nav-tab-label"
                    style={{ color: active ? "var(--primary)" : "var(--text-muted)", fontWeight: active ? 700 : 500 }}
                  >
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
