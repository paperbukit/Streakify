import { useApp } from "../../contexts/AppContext";
import { Button } from "../ui/button";
import { Menu, Bell } from "lucide-react";

export function MobileHeader() {
  const { setSidebarOpen, activeView } = useApp();

  const getPageTitle = () => {
    switch (activeView) {
      case 'tasks': return 'Tasks';
      case 'goals': return 'Daily Goals';
      case 'pomodoro': return 'Pomodoro';
      case 'streaks': return 'Streaks';
      case 'xp': return 'XP & Levels';
      case 'settings': return 'Settings';
      default: return 'Dashboard';
    }
  };

  return (
    <header className="lg:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </Button>
        <h1 className="text-lg font-bold text-gray-800 dark:text-white">
          {getPageTitle()}
        </h1>
        <Button
          variant="ghost"
          size="icon"
        >
          <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </Button>
      </div>
    </header>
  );
}
