import { useApp } from "../../contexts/AppContext";
import { Flame, Zap } from "lucide-react";

export function WelcomeCard() {
  const { profile } = useApp();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-aqua-200 dark:border-gray-700 p-6 card-hover">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {getGreeting()}, {profile?.name || 'Student'}! 👋
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Ready to crush your goals today?
          </p>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <div className="text-center">
            <div className="streak-flame text-2xl">
              <Flame className="w-8 h-8 text-orange-500 mx-auto" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {profile?.currentStreak || 0} Day Streak
            </p>
          </div>
          <div className="text-center">
            <div className="text-2xl">
              <Zap className="w-8 h-8 text-yellow-500 mx-auto" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {profile?.totalXP || 0} Total XP
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
