import { useState, useEffect } from "react";
import { useApp } from "../contexts/AppContext";
import { StreakCalendar } from "../components/streaks/StreakCalendar";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Flame, Calendar, Trophy, Target, TrendingUp } from "lucide-react";
import { formatDistanceToNow, format, startOfDay, endOfDay, subDays } from "date-fns";

export default function Streaks() {
  const { profile, tasks, dailyGoals, pomodoroSessions, streakEntries } = useApp();

  const currentStreak = profile?.currentStreak || 0;
  const longestStreak = profile?.longestStreak || 0;

  // Calculate streak statistics
  const getStreakStats = () => {
    const today = new Date();
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date;
    }).reverse();

    const streakDays = last30Days.filter(date => {
      const dayEntry = streakEntries.find(entry => 
        entry.date.toDateString() === date.toDateString()
      );
      return dayEntry?.hasActivity;
    });

    return {
      activeDays: streakDays.length,
      percentage: (streakDays.length / 30) * 100,
      last30Days: last30Days.map(date => {
        const dayEntry = streakEntries.find(entry => 
          entry.date.toDateString() === date.toDateString()
        );
        return {
          date,
          hasActivity: dayEntry?.hasActivity || false,
          tasksCompleted: dayEntry?.tasksCompleted || 0,
          goalsCompleted: dayEntry?.goalsCompleted || 0,
          pomodorosCompleted: dayEntry?.pomodorosCompleted || 0,
          xpEarned: dayEntry?.xpEarned || 0,
        };
      })
    };
  };

  const streakStats = getStreakStats();

  // Get recent streak activities
  const getRecentActivities = () => {
    return streakEntries
      .filter(entry => entry.hasActivity)
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 10);
  };

  const recentActivities = getRecentActivities();

  // Calculate streak milestones
  const getStreakMilestones = () => {
    const milestones = [
      { days: 7, title: "Week Warrior", description: "7 days in a row", achieved: currentStreak >= 7 },
      { days: 14, title: "Two Week Champion", description: "14 days in a row", achieved: currentStreak >= 14 },
      { days: 30, title: "Monthly Master", description: "30 days in a row", achieved: currentStreak >= 30 },
      { days: 60, title: "Consistency King", description: "60 days in a row", achieved: currentStreak >= 60 },
      { days: 100, title: "Century Achiever", description: "100 days in a row", achieved: currentStreak >= 100 },
    ];

    return milestones;
  };

  const milestones = getStreakMilestones();
  const nextMilestone = milestones.find(m => !m.achieved);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Streaks</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your consistency and build lasting habits
          </p>
        </div>
      </div>

      {/* Streak Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="card-hover border-aqua-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Current Streak
                </p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">
                  {currentStreak}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  days
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
                <Flame className="w-6 h-6 text-white streak-flame" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover border-aqua-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Longest Streak
                </p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">
                  {longestStreak}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  days
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover border-aqua-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Last 30 Days
                </p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">
                  {streakStats.activeDays}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  active days
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-aqua-400 to-aqua-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover border-aqua-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Consistency
                </p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">
                  {Math.round(streakStats.percentage)}%
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  this month
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar and Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Streak Calendar */}
        <div className="lg:col-span-2">
          <StreakCalendar />
        </div>

        {/* Milestones */}
        <Card className="card-hover border-aqua-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
              Milestones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {nextMilestone && (
                <div className="p-4 bg-aqua-50 dark:bg-aqua-900/20 rounded-xl border border-aqua-200 dark:border-aqua-800">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-800 dark:text-white">
                      Next Goal
                    </h4>
                    <Badge className="bg-aqua-100 text-aqua-700 dark:bg-aqua-900/40 dark:text-aqua-400">
                      {nextMilestone.days - currentStreak} days to go
                    </Badge>
                  </div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {nextMilestone.title}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                    {nextMilestone.description}
                  </p>
                  <Progress 
                    value={(currentStreak / nextMilestone.days) * 100} 
                    className="h-2"
                  />
                </div>
              )}

              <div className="space-y-3">
                {milestones.map((milestone, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 p-3 rounded-lg ${
                      milestone.achieved 
                        ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                        : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      milestone.achieved 
                        ? 'bg-green-500' 
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}>
                      {milestone.achieved ? (
                        <Trophy className="w-4 h-4 text-white" />
                      ) : (
                        <Target className="w-4 h-4 text-gray-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${
                        milestone.achieved 
                          ? 'text-green-700 dark:text-green-400' 
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {milestone.title}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {milestone.description}
                      </p>
                    </div>
                    {milestone.achieved && (
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                        ✓
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="card-hover border-aqua-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  No streak activities recorded yet
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                  Complete tasks, goals, or Pomodoros to start building your streak
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {format(activity.date, 'MMM dd, yyyy')}
                      </span>
                      <Badge className="bg-aqua-100 text-aqua-700 dark:bg-aqua-900/20 dark:text-aqua-400">
                        +{activity.xpEarned} XP
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-white">
                          {activity.tasksCompleted}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Tasks
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-white">
                          {activity.goalsCompleted}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Goals
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-white">
                          {activity.pomodorosCompleted}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Pomodoros
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
