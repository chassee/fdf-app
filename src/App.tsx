import { Switch, Route } from "wouter";
import { Toaster } from "sonner";
import { FDFProvider } from "@/contexts/FDFContext";
import Layout from "@/components/Layout";

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
import OnboardingDOB from "@/pages/OnboardingDOB";
import OnboardingUsername from "@/pages/OnboardingUsername";
import PendingApproval from "@/pages/PendingApproval";
import ParentApproval from "@/pages/ParentApproval";
import Parents from "@/pages/Parents";
import NotFound from "@/pages/NotFound";

// Auth pages don't use the main Layout
const AUTH_PATHS = ["/signin", "/signup", "/onboarding/dob", "/onboarding/username", "/pending-approval", "/parent-approval", "/parents"];

function AppRoutes() {
  return (
    <Switch>
      {/* Auth / onboarding — no Layout wrapper */}
      <Route path="/signin" component={SignIn} />
      <Route path="/signup" component={SignUp} />
      <Route path="/onboarding/dob" component={OnboardingDOB} />
      <Route path="/onboarding/username" component={OnboardingUsername} />
      <Route path="/pending-approval" component={PendingApproval} />
      <Route path="/parent-approval" component={ParentApproval} />
      <Route path="/parents" component={Parents} />

      {/* Main app — wrapped in Layout */}
      <Route>
        {(params) => (
          <Layout>
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/missions" component={Missions} />
              <Route path="/rewards" component={Rewards} />
              <Route path="/leaderboard" component={Leaderboard} />
              <Route path="/graduation" component={Graduation} />
              <Route path="/dna" component={DNA} />
              <Route path="/ranks" component={Ranks} />
              <Route component={NotFound} />
            </Switch>
          </Layout>
        )}
      </Route>
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
