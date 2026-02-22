import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import DashboardLayout from "@/components/DashboardLayout";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useAuth } from "@/_core/hooks/useAuth";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ICPArchitect from "./pages/ICPArchitect";
import OutreachExecution from "./pages/OutreachExecution";
import ReplyIntelligence from "./pages/ReplyIntelligence";
import RevenueDashboard from "./pages/RevenueDashboard";
import RevenueSprint from "./pages/RevenueSprint";
import AuthorityBuilder from "./pages/AuthorityBuilder";
import BehaviourMonitor from "./pages/BehaviourMonitor";

function Router() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/404"} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  return (
    <DashboardLayout>
      <Switch>
        <Route path={"/dashboard"} component={Dashboard} />
        <Route path={"/icp-architect"} component={ICPArchitect} />
        <Route path={"/outreach"} component={OutreachExecution} />
        <Route path={"/replies"} component={ReplyIntelligence} />
        <Route path={"/revenue-dashboard"} component={RevenueDashboard} />
        <Route path={"/sprint"} component={RevenueSprint} />
        <Route path={"/authority"} component={AuthorityBuilder} />
        <Route path={"/behaviour"} component={BehaviourMonitor} />
        <Route path={"/404"} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </DashboardLayout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
