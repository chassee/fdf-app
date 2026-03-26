import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { FDFProvider } from "./contexts/FDFContext";
import Layout from "./components/Layout";

// Pages
import Home from "./pages/Home";
import Missions from "./pages/Missions";
import Rewards from "./pages/Rewards";
import Ranks from "./pages/Ranks";
import Graduation from "./pages/Graduation";
import Parents from "./pages/Parents";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ParentApproval from "./pages/ParentApproval";
import PendingApproval from "./pages/PendingApproval";

// Full-screen routes (no bottom nav / layout chrome)
const AUTH_ROUTES = ["/signup", "/signin", "/parent-approval", "/pending-approval"];

function Router() {
  const [location] = useLocation();
  const isAuthRoute = AUTH_ROUTES.includes(location);

  if (isAuthRoute) {
    return (
      <Switch>
        <Route path="/signup" component={SignUp} />
        <Route path="/signin" component={SignIn} />
        <Route path="/parent-approval" component={ParentApproval} />
        <Route path="/pending-approval" component={PendingApproval} />
      </Switch>
    );
  }

  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/missions" component={Missions} />
        <Route path="/rewards" component={Rewards} />
        <Route path="/ranks" component={Ranks} />
        <Route path="/graduation" component={Graduation} />
        <Route path="/parents" component={Parents} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      {/* Light theme — premium academy interface */}
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <FDFProvider>
            <Router />
          </FDFProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
