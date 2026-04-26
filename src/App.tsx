import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { FDFProvider, useFDF } from "./contexts/FDFContext";
import { Layout } from "./components/Layout";
import { ExternalLink } from "lucide-react";
import { CelebrationOverlay } from "./components/CelebrationOverlay";
import { Toaster } from "sonner";
import { OnboardingProvider, useOnboarding } from "./contexts/OnboardingContext";

// Pages
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import Missions from "./pages/Missions";
import Rewards from "./pages/Rewards";
import Ranks from "./pages/Ranks";
import Graduation from "./pages/Graduation";
import Parents from "./pages/Parents";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ParentApproval from "./pages/ParentApproval";
import PendingApproval from "./pages/PendingApproval";
import OnboardingDOB from "./pages/OnboardingDOB";
import OnboardingUsername from "./pages/OnboardingUsername";
import DNA from "./pages/DNA";
import Leaderboard from "./pages/Leaderboard";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import ChildSafety from "./pages/ChildSafety";
import Contact from "./pages/Contact";
import ApprovalPending from "./pages/ApprovalPending";
import Approve from "./pages/Approve";

// Full-screen routes (no bottom nav / layout chrome)
const AUTH_ROUTES = ["/signup", "/signin", "/parent-approval", "/pending-approval", "/onboarding/dob", "/onboarding/username", "/approval-pending"];

// Public routes (visible to everyone, no layout)
const PUBLIC_ROUTES = ["/", "/privacy", "/terms", "/child-safety", "/parents", "/contact", "/approve"];

// ── Graduated Guard: block all app access if user has graduated ──────────────
function GraduatedGuard({ children }: { children: React.ReactNode }) {
  const { graduated, graduatedAt } = useFDF();
  const [location] = useLocation();

  if (graduated && location !== "/graduation") {
    const formattedDate = graduatedAt
      ? new Date(graduatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
      : null;
    return (
      <div
        style={{
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px 20px",
          background: "linear-gradient(160deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%)",
          textAlign: "center",
        }}
      >
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, #f59e0b, #d97706)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", marginBottom: 20, boxShadow: "0 0 40px rgba(245,158,11,0.4)" }}>
          🎓
        </div>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.625rem", fontWeight: 900, color: "#f8fafc", letterSpacing: "-0.03em", marginBottom: 8 }}>
          Graduated
        </h1>
        {formattedDate && (
          <p style={{ fontSize: "0.8125rem", color: "#94a3b8", marginBottom: 20 }}>Graduated on {formattedDate}</p>
        )}
        <p style={{ fontSize: "0.9375rem", color: "#cbd5e1", lineHeight: 1.7, maxWidth: 280, marginBottom: 6 }}>
          You've moved beyond the Foundation.
        </p>
        <p style={{ fontSize: "0.875rem", color: "#64748b", lineHeight: 1.6, maxWidth: 260, marginBottom: 32 }}>
          Your journey continues inside the Vault.
        </p>
        <a
          href="https://vault.crypdawgs.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "#000", fontWeight: 800, fontSize: "0.9375rem", padding: "14px 28px", borderRadius: 14, textDecoration: "none", boxShadow: "0 4px 20px rgba(245,158,11,0.35)" }}
        >
          Go to Vault
          <ExternalLink size={16} />
        </a>
      </div>
    );
  }

  return <>{children}</>;
}

// ── Onboarding Guard: SINGLE SOURCE OF TRUTH ──────────────────────────────────
// Uses onboarding_complete flag only. No stacked conditions.
function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const [location, navigate] = useLocation();
  const { isAuthenticated, onboardingComplete, isLoading, error } = useOnboarding();

  // Show loading screen while fetching
  if (isLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100dvh", background: "#f8f9fa" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid #e5e7eb", borderTopColor: "#3b82f6", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
          <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>Loading...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Show error screen if profile fetch failed
  if (error && isAuthenticated) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100dvh", background: "#f8f9fa" }}>
        <div style={{ textAlign: "center", padding: "20px" }}>
          <p style={{ color: "#dc2626", fontSize: "0.875rem", marginBottom: "16px" }}>Error loading profile: {error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{ padding: "8px 16px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ROUTING LOGIC: SINGLE SOURCE OF TRUTH
  // If authenticated but onboarding NOT complete → force onboarding
  if (isAuthenticated && !onboardingComplete) {
    if (!location.startsWith("/onboarding")) {
      navigate("/onboarding/dob");
      return null;
    }
    // Allow onboarding pages
    return <>{children}</>;
  }

  // If authenticated AND onboarding complete → block onboarding pages
  if (isAuthenticated && onboardingComplete) {
    if (location.startsWith("/onboarding")) {
      navigate("/");
      return null;
    }
    // Allow all other pages
    return <>{children}</>;
  }

  // If NOT authenticated → allow auth pages and public pages, block protected pages
  if (!isAuthenticated) {
    const isAuthRoute = AUTH_ROUTES.includes(location);
    const isPublicRoute = PUBLIC_ROUTES.includes(location);
    if (!isAuthRoute && !isPublicRoute) {
      navigate("/");
      return null;
    }
    return <>{children}</>;
  }

  return <>{children}</>;
}

function Router() {
  const [location] = useLocation();
  const { isAuthenticated } = useOnboarding();
  const isAuthRoute = AUTH_ROUTES.includes(location);
  const isPublicRoute = PUBLIC_ROUTES.includes(location);

  // Auth routes (signup, signin, onboarding) - no layout
  if (isAuthRoute) {
    return (
      <Switch>
        <Route path="/signup" component={SignUp} />
        <Route path="/signin" component={SignIn} />
        <Route path="/parent-approval" component={ParentApproval} />
        <Route path="/pending-approval" component={PendingApproval} />
        <Route path="/onboarding/dob" component={OnboardingDOB} />
        <Route path="/onboarding/username" component={OnboardingUsername} />
        <Route path="/approval-pending" component={ApprovalPending} />
      </Switch>
    );
  }

  // Public routes (landing, legal pages) - no layout, visible to everyone
  if (isPublicRoute && !isAuthenticated) {
    return (
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/terms" component={Terms} />
        <Route path="/child-safety" component={ChildSafety} />
        <Route path="/parents" component={Parents} />
        <Route path="/contact" component={Contact} />
        <Route path="/approve" component={Approve} />
      </Switch>
    );
  }

  // App routes (authenticated only) - with layout
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/missions" component={Missions} />
        <Route path="/rewards" component={Rewards} />
        <Route path="/ranks" component={Ranks} />
        <Route path="/graduation" component={Graduation} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/terms" component={Terms} />
        <Route path="/child-safety" component={ChildSafety} />
        <Route path="/parents" component={Parents} />
        <Route path="/contact" component={Contact} />
        <Route path="/dna" component={DNA} />
        <Route path="/leaderboard" component={Leaderboard} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Toaster />
        <OnboardingProvider>
          <FDFProvider>
            <CelebrationOverlay />
            <GraduatedGuard>
              <OnboardingGuard>
                <Router />
              </OnboardingGuard>
            </GraduatedGuard>
          </FDFProvider>
        </OnboardingProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
