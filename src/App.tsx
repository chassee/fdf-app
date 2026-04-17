import { Switch, Route, useLocation } from "wouter";
import { useFDF } from "@/contexts/FDFContext";
import { Toaster } from "sonner";
import { FDFProvider } from "@/contexts/FDFContext";
import Layout from "@/components/Layout";
import { useEffect } from "react";

// Pages
import Home from "@/pages/Home";
import Missions from "@/pages/Missions";
import Rewards from "@/pages/Rewards";
import Leaderboard from "@/pages/Leaderboard";
import Graduation from "@/pages/Graduation";
import DNA from "@/pages/DNA";
import Ranks from "@/pages/Ranks";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import OnboardingDOB from "@/pages/OnboardingDOB";
import OnboardingUsername from "@/pages/OnboardingUsername";
import PendingApproval from "@/pages/PendingApproval";
import ParentApproval from "@/pages/ParentApproval";
import Parents from "@/pages/Parents";
import NotFound from "@/pages/NotFound";
import Landing from "@/pages/Landing";

// Auth pages don't use the main Layout
const AUTH_PATHS = ["/signin", "/signup", "/onboarding/dob", "/onboarding/username", "/pending-approval", "/parent-approval", "/parents", "/forgot-password", "/reset-password", "/"];

function AppRoutes() {
  const { isAuthenticated, profileComplete, isLoading } = useFDF();
  const [location, navigate] = useLocation();

  // Global auth guard: runs on every route change
  useEffect(() => {
    if (isLoading) return; // Wait for auth state to load

    // If not authenticated, show landing page or allow auth pages
    if (!isAuthenticated) {
      if (location === "/" || location === "/landing") {
        return; // Allow landing page
      }
      if (!AUTH_PATHS.includes(location)) {
        navigate("/signin");
      }
      return;
    }

    // If authenticated but profile not complete, force onboarding
    if (!profileComplete) {
      if (location !== "/onboarding/dob" && location !== "/onboarding/username") {
        navigate("/onboarding/dob");
      }
      return;
    }

    // If profile complete, prevent access to onboarding routes
    if (location === "/onboarding/dob" || location === "/onboarding/username") {
      navigate("/");
    }
  }, [isAuthenticated, profileComplete, isLoading, location, navigate]);

  if (isLoading) {
    return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>Loading...</div>;
  }

  return (
    <Switch>
      {/* Landing page — shown to unauthenticated users */}
      <Route path="/" component={Landing} />
      <Route path="/landing" component={Landing} />

      {/* Auth / onboarding — no Layout wrapper */}
      <Route path="/signin" component={SignIn} />
      <Route path="/signup" component={SignUp} />
      <Route path="/onboarding/dob" component={OnboardingDOB} />
      <Route path="/onboarding/username" component={OnboardingUsername} />
      <Route path="/pending-approval" component={PendingApproval} />
      <Route path="/parent-approval" component={ParentApproval} />
      <Route path="/parents" component={Parents} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />

      {/* Main app — wrapped in Layout (authenticated users only) */}
      <Route path="/home" component={() => <Layout><Home /></Layout>} />
      <Route path="/train" component={() => <Layout><Missions /></Layout>} />
      <Route path="/missions" component={() => <Layout><Missions /></Layout>} />
      <Route path="/rewards" component={() => <Layout><Rewards /></Layout>} />
      <Route path="/leaderboard" component={() => <Layout><Leaderboard /></Layout>} />
      <Route path="/graduation" component={() => <Layout><Graduation /></Layout>} />
      <Route path="/dna" component={() => <Layout><DNA /></Layout>} />
      <Route path="/ranks" component={() => <Layout><Ranks /></Layout>} />
      <Route path="/vault" component={() => <Layout><Graduation /></Layout>} />

      {/* 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <FDFProvider>
      <AppRoutes />
      <Toaster position="top-center" richColors />
    </FDFProvider>
  );
}
