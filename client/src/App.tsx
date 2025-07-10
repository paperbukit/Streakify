import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "./contexts/AppContext";
import { Sidebar } from "./components/layout/Sidebar";
import { MobileHeader } from "./components/layout/MobileHeader";
import { NotificationToast } from "./components/ui/NotificationToast";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import DailyGoals from "./pages/DailyGoals";
import Pomodoro from "./pages/Pomodoro";
import Streaks from "./pages/Streaks";
import XPLevels from "./pages/XPLevels";
import Settings from "./pages/Settings";
import NotFound from "./pages/not-found";
import { useEffect } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/tasks" component={Tasks} />
      <Route path="/goals" component={DailyGoals} />
      <Route path="/pomodoro" component={Pomodoro} />
      <Route path="/streaks" component={Streaks} />
      <Route path="/xp" component={XPLevels} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered: ', registration);
        })
        .catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppProvider>
          <div className="flex h-screen overflow-hidden bg-white dark:bg-gray-900">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <MobileHeader />
              <main className="flex-1 overflow-y-auto bg-aqua-50 dark:bg-gray-800 p-4 lg:p-8">
                <Router />
              </main>
            </div>
            <NotificationToast />
            <Toaster />
          </div>
        </AppProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
