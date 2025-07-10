import { useApp } from "../contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { calculateLevel, getLevelProgress, LEVEL_XP_REQUIREMENTS } from "@shared/schema";
import { xpService } from "../services/xpService";
import { Star, Trophy, Zap, Target, Award, Crown } from "lucide-react";
import { format, subDays } from "date-fns";

export default function XPLevels() {
  const { profile, tasks, dailyGoals, pomodoroSessions } = useApp();

  const totalXP = profile?.totalXP || 0;
  const currentLevel = calculateLevel(totalXP);
  const levelProgress = getLevelProgress(totalXP);
  const levelTitle = xpService.getLevelTitle(currentLevel);

  // Calculate XP sources
  const getXPBreakdown = () => {
    const completedTasks = tasks.filter(task => task.isCompleted);
    const completedGoals = dailyGoals.filter(goal => goal.isCompleted);
    
    const taskXP = completedTasks.reduce((total, task) => total + task.xpReward, 0);
    const goalXP = completedGoals.reduce((total, goal) => total + goal.xpReward, 0);
    const pomodoroXP = pomodoroSessions.reduce((total, session) => total + session.xpEarned, 0);
    const streakXP = (profile?.currentStreak || 0) * 5; // 5 XP per streak day

    return {
      tasks: { xp: taskXP, count: completedTasks.length },
      goals: { xp: goalXP, count: completedGoals.length },
      pomodoros: { xp: pomodoroXP, count: pomodoroSessions.length },
      streaks: { xp: streakXP, count: profile?.currentStreak || 0 },
    };
  };

  const xpBreakdown = getXPBreakdown();

  // Get recent XP activities (last 7 days)
  const getRecentXPActivities = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date;
    }).reverse();

    return last7Days.map(date => {
      const dayTasks = tasks.filter(task => 
        task.completedAt && task.completedAt.toDateString() === date.toDateString()
      );
      const dayGoals = dailyGoals.filter(goal => 
        goal.completedAt && goal.completedAt.toDateString() === date.toDateString()
      );
      const dayPomodoros = pomodoroSessions.filter(session => 
        session.completedAt.toDateString() === date.toDateString()
      );

      const dayXP = [
        ...dayTasks.map(task => task.xpReward),
        ...dayGoals.map(goal => goal.xpReward),
        ...dayPomodoros.map(session => session.xpEarned)
      ].reduce((total, xp) => total + xp, 0);

      return {
        date,
        xp: dayXP,
        activities: dayTasks.length + dayGoals.length + dayPomodoros.length
      };
    });
  };

  const recentXPActivities = getRecentXPActivities();
  const maxDailyXP = Math.max(...recentXPActivities.map(day => day.xp), 1);

  // Get achievements
  const getAchievements = () => {
    const achievements = [
      {
        id: 'first-task',
        title: 'First Steps',
        description: 'Complete your first task',
        icon: Target,
        unlocked: tasks.some(task => task.isCompleted),
        xpReward: 10,
      },
      {
        id: 'task-master-10',
        title: 'Task Master',
        description: 'Complete 10 tasks',
        icon: Trophy,
        unlocked: tasks.filter(task => task.isCompleted).length >= 10,
        xpReward: 50,
      },
      {
        id: 'goal-achiever',
        title: 'Goal Achiever',
        description: 'Complete your first daily goal',
        icon: Award,
        unlocked: dailyGoals.some(goal => goal.isCompleted),
        xpReward: 25,
      },
      {
        id: 'focus-master',
        title: 'Focus Master',
        description: 'Complete 5 Pomodoro sessions',
        icon: Zap,
        unlocked: pomodoroSessions.length >= 5,
        xpReward: 40,
      },
      {
        id: 'streak-starter',
        title: 'Streak Starter',
        description: 'Maintain a 7-day streak',
        icon: Star,
        unlocked: (profile?.currentStreak || 0) >= 7,
        xpReward: 75,
      },
      {
        id: 'level-up-5',
        title: 'Rising Star',
        description: 'Reach level 5',
        icon: Crown,
        unlocked: currentLevel >= 5,
        xpReward: 100,
      },
    ];

    return achievements;
  };

  const achievements = getAchievements();
  const unlockedAchievements = achievements.filter(a => a.unlocked);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">XP & Levels</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your progress and unlock achievements
          </p>
        </div>
      </div>

      {/* Level Overview */}
      <Card className="card-hover border-aqua-200 dark:border-gray-700">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-aqua-400 to-aqua-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              Level {currentLevel}
            </h2>
            <Badge className="bg-aqua-100 text-aqua-700 dark:bg-aqua-900/20 dark:text-aqua-400 text-lg px-4 py-1">
              {levelTitle}
            </Badge>
          </div>

          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400">
                Level Progress
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                {levelProgress.current.toLocaleString()} / {levelProgress.total.toLocaleString()} XP
              </span>
            </div>
            <Progress value={levelProgress.percentage} className="h-3 mb-4" />
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {totalXP.toLocaleString()} XP
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Experience Points
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* XP Breakdown and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* XP Sources */}
        <Card className="card-hover border-aqua-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
              XP Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">Tasks</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {xpBreakdown.tasks.count} completed
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                  {xpBreakdown.tasks.xp.toLocaleString()} XP
                </Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">Daily Goals</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {xpBreakdown.goals.count} completed
                    </p>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                  {xpBreakdown.goals.xp.toLocaleString()} XP
                </Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">Pomodoros</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {xpBreakdown.pomodoros.count} sessions
                    </p>
                  </div>
                </div>
                <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
                  {xpBreakdown.pomodoros.xp.toLocaleString()} XP
                </Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">Streak Bonus</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {xpBreakdown.streaks.count} day streak
                    </p>
                  </div>
                </div>
                <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400">
                  {xpBreakdown.streaks.xp.toLocaleString()} XP
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent XP Activity */}
        <Card className="card-hover border-aqua-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
              Last 7 Days
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentXPActivities.map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-16">
                      {format(day.date, 'MMM dd')}
                    </span>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 min-w-[120px]">
                      <div
                        className="level-progress h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(day.xp / maxDailyXP) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      {day.xp} XP
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      ({day.activities} activities)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card className="card-hover border-aqua-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
            Achievements ({unlockedAchievements.length}/{achievements.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => {
              const IconComponent = achievement.icon;
              
              return (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-xl border ${
                    achievement.unlocked
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                      : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-60'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      achievement.unlocked
                        ? 'bg-green-500'
                        : 'bg-gray-400'
                    }`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-medium ${
                        achievement.unlocked
                          ? 'text-green-700 dark:text-green-400'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {achievement.title}
                      </h4>
                      {achievement.unlocked && (
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 text-xs">
                          +{achievement.xpReward} XP
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {achievement.description}
                  </p>
                  {achievement.unlocked && (
                    <div className="flex items-center justify-center mt-3">
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                        ✓ Unlocked
                      </Badge>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
