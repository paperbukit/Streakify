import { useState } from "react";
import { useLocation } from "wouter";
import { useApp } from "../../contexts/AppContext";
import { cn } from "../../lib/utils";
import { 
  BarChart3, 
  CheckSquare, 
  Target, 
  Clock, 
  Calendar, 
  Trophy, 
  Settings,
  Flame,
  User,
  Moon,
  Sun,
  X,
  Menu
} from "lucide-react";
import { Button } from "../ui/button";

const navItems = [
  { path: "/", icon: BarChart3, label: "Dashboard" },
  { path: "/tasks", icon: CheckSquare, label: "Tasks" },
  { path: "/goals", icon: Target, label: "Daily Goals" },
  { path: "/pomodoro", icon: Clock, label: "Pomodoro" },
  { path: "/streaks", icon: Calendar, label: "Streaks" },
  { path: "/xp", icon: Trophy, label: "XP & Levels" },
  { path: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const [location, setLocation] = useLocation();
  const { 
    profile, 
    theme, 
    sidebarOpen, 
    setSidebarOpen, 
    updateSettings 
  } = useApp();

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    updateSettings({ theme: newTheme });
  };

  const handleNavClick = (path: string) => {
    setLocation(path);
    setSidebarOpen(false); // Close sidebar on mobile after navigation
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "sidebar-transition aqua-100 dark:bg-gray-800 border-r border-aqua-200 dark:border-gray-700 flex flex-col w-80 fixed lg:relative h-full z-50",
        "lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-aqua-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-aqua-400 to-aqua-600 rounded-xl flex items-center justify-center">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">Streakify</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Stay Productive</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={cn(
                  "w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors",
                  isActive 
                    ? "aqua-200 dark:bg-aqua-600 text-aqua-700 dark:text-white font-medium" 
                    : "text-gray-700 dark:text-gray-300 hover:bg-aqua-200 dark:hover:bg-gray-700 hover:text-aqua-700 dark:hover:text-white"
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Profile & Theme Toggle */}
        <div className="p-4 border-t border-aqua-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-aqua-400 to-aqua-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 dark:text-white">
                  {profile?.name || 'Student'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Level {profile?.level || 1}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="hover:bg-aqua-200 dark:hover:bg-gray-700"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
