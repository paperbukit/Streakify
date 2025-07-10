import { useApp } from "../contexts/AppContext";
import { WelcomeCard } from "../components/dashboard/WelcomeCard";
import { StatsCard } from "../components/dashboard/StatsCard";
import { PomodoroTimer } from "../components/timer/PomodoroTimer";
import { DailyGoalCard } from "../components/goals/DailyGoalCard";
import { TaskCard } from "../components/tasks/TaskCard";
import { StreakCalendar } from "../components/streaks/StreakCalendar";
import { calculateLevel, getLevelProgress } from "@shared/schema";
import { 
  Star, 
  Flame, 
  CheckSquare, 
  Clock, 
  Plus 
} from "lucide-react";
import { Button } from "../components/ui/button";

export default function Dashboard() {
  const { profile, tasks, dailyGoals, pomodoroSessions, setActiveView } = useApp();

  const totalXP = profile?.totalXP || 0;
  const currentLevel = calculateLevel(totalXP);
  const levelProgress = getLevelProgress(totalXP);

  const todaysTasks = tasks.filter(task => {
    const today = new Date().toDateString();
    return task.createdAt.toDateString() === today;
  });

  const completedTasks = todaysTasks.filter(task => task.isCompleted);
  const todaysPomodoros = pomodoroSessions.filter(session => {
    const today = new Date().toDateString();
    return session.completedAt.toDateString() === today;
  });

  const recentTasks = tasks.slice(-6);
  const activeGoals = dailyGoals.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Section */}
      <WelcomeCard />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total XP"
          value={totalXP.toLocaleString()}
          icon={Star}
          subtitle={`Level ${currentLevel}`}
          progress={levelProgress}
        />
        <StatsCard
          title="Current Streak"
          value={profile?.currentStreak || 0}
          icon={Flame}
          subtitle="🔥 Keep it up!"
          iconColor="from-orange-400 to-red-500"
        />
        <StatsCard
          title="Tasks Today"
          value={`${completedTasks.length}/${todaysTasks.length}`}
          icon={CheckSquare}
          subtitle={`${todaysTasks.length ? Math.round((completedTasks.length / todaysTasks.length) * 100) : 0}% Complete`}
          iconColor="from-green-400 to-green-600"
        />
        <StatsCard
          title="Pomodoros"
          value={todaysPomodoros.length}
          icon={Clock}
          subtitle={`${todaysPomodoros.length * 25} min focused`}
          iconColor="from-purple-400 to-purple-600"
        />
      </div>

      {/* Quick Actions & Active Timer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PomodoroTimer />
        
        {/* Daily Goals Progress */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-aqua-200 dark:border-gray-700 p-6 card-hover">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Daily Goals
            </h3>
            <Button
              onClick={() => setActiveView('goals')}
              className="bg-aqua-100 dark:bg-aqua-900/20 text-aqua-700 dark:text-aqua-400 hover:bg-aqua-200 dark:hover:bg-aqua-900/30"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Goal
            </Button>
          </div>
          
          <div className="space-y-4">
            {activeGoals.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  No daily goals set yet
                </p>
                <Button
                  onClick={() => setActiveView('goals')}
                  className="bg-aqua-500 hover:bg-aqua-600 text-white"
                >
                  Create Your First Goal
                </Button>
              </div>
            ) : (
              activeGoals.map((goal) => (
                <DailyGoalCard key={goal.id} goal={goal} />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-aqua-200 dark:border-gray-700 p-6 card-hover">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Recent Tasks
          </h3>
          <Button
            onClick={() => setActiveView('tasks')}
            className="bg-aqua-100 dark:bg-aqua-900/20 text-aqua-700 dark:text-aqua-400 hover:bg-aqua-200 dark:hover:bg-aqua-900/30"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentTasks.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No tasks created yet
              </p>
              <Button
                onClick={() => setActiveView('tasks')}
                className="bg-aqua-500 hover:bg-aqua-600 text-white"
              >
                Create Your First Task
              </Button>
            </div>
          ) : (
            recentTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))
          )}
        </div>
      </div>

      {/* Streak Calendar */}
      <StreakCalendar />
    </div>
  );
}
