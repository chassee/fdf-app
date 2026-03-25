import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import {
  Home,
  Target,
  Trophy,
  Gift,
  GraduationCap,
  Users,
} from "lucide-react";
import { useLocation, Link } from "wouter";

const NAV_TABS = [
  { icon: Home,          label: "Home",     path: "/" },
  { icon: Trophy,        label: "Ranks",    path: "/ranks" },
  { icon: Target,        label: "Missions", path: "/missions" },
  { icon: Gift,          label: "Rewards",  path: "/rewards" },
  { icon: GraduationCap, label: "Vault",    path: "/graduation" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();

  const { data: profile } = trpc.fdf.getProfile.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const gems = profile?.progress?.gemsTotal ?? 0;
  const xp   = profile?.progress?.xpTotal ?? 0;

  return (
    <div style={{ minHeight: "100dvh", background: "var(--bg-main)" }}>

      {/* ── Top Bar ── */}
      <header className="top-bar">
        <div
          style={{
            maxWidth: 480,
            margin: "0 auto",
            padding: "0 16px",
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Brand */}
          <Link href="/">
            <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", textDecoration: "none" }}>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 9,
                  background: "linear-gradient(135deg, #5b8cff 0%, #7b5cff 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.65rem",
                  fontWeight: 800,
                  color: "white",
                  letterSpacing: "-0.01em",
                  flexShrink: 0,
                }}
              >
                FDF
              </div>
              <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
                <span
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    color: "var(--text-main)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Future Dawgs
                </span>
                <span
                  style={{
                    fontSize: "0.6rem",
                    fontWeight: 600,
                    color: "var(--text-muted)",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  Foundation
                </span>
              </div>
            </div>
          </Link>

          {/* Right: Stats */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {isAuthenticated && profile?.fdfUser && (
              <>
                <div className="stat-chip" style={{ fontSize: "0.7rem", padding: "4px 10px" }}>
                  <span style={{ opacity: 0.65, fontSize: "0.65rem" }}>XP</span>
                  <span style={{ fontWeight: 700 }}>{xp.toLocaleString()}</span>
                </div>
                <div
                  className="stat-chip"
                  style={{
                    fontSize: "0.7rem",
                    padding: "4px 10px",
                    background: "var(--accent-light)",
                    color: "var(--accent)",
                  }}
                >
                  <span>💎</span>
                  <span style={{ fontWeight: 700 }}>{gems}</span>
                </div>
              </>
            )}
            {/* Avatar */}
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--primary-light), var(--accent-light))",
                border: "2px solid rgba(91,140,255,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.65rem",
                fontWeight: 700,
                color: "var(--primary)",
              }}
            >
              {user?.name ? user.name.slice(0, 2).toUpperCase() : "?"}
            </div>
          </div>
        </div>

        {/* Desktop nav */}
        <div
          style={{
            maxWidth: 480,
            margin: "0 auto",
            padding: "0 16px 8px",
            display: "none",
          }}
          className="desktop-subnav"
        />
      </header>

      {/* ── Main Content ── */}
      <main style={{ paddingBottom: 72 }}>{children}</main>

      {/* ── Bottom Navigation ── */}
      <nav className="bottom-nav">
        <div className="bottom-nav-inner">
          {NAV_TABS.map(({ path, label, icon: Icon }) => {
            const isActive = path === "/" ? location === "/" : location.startsWith(path);
            return (
              <Link
                key={path}
                href={path}
                className={`nav-tab${isActive ? " active" : ""}`}
                style={{ textDecoration: "none" }}
              >
                <div className="nav-icon-wrap">
                  <Icon
                    size={20}
                    strokeWidth={isActive ? 2.5 : 1.8}
                    style={{
                      color: isActive ? "var(--primary)" : "var(--text-muted)",
                      transition: "color 0.15s ease",
                    }}
                  />
                </div>
                <span
                  className="nav-tab-label"
                  style={{
                    color: isActive ? "var(--primary)" : "var(--text-muted)",
                    fontWeight: isActive ? 700 : 500,
                  }}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
