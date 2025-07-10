import { useState, useEffect } from "react";
import { useApp } from "../contexts/AppContext";
import { PomodoroTimer } from "../components/timer/PomodoroTimer";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Clock, Play, Pause, Settings, BarChart3 } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

export default function Pomodoro() {
  const { pomodoroSessions, settings, tasks } = useApp();

  const todaysSessions = pomodoroSessions.filter(session => {
    const today = new Date().toDateString();
    return session.completedAt.toDateString() === today;
  });

  const thisWeekSessions = pomodoroSessions.filter(session => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return session.completedAt >= weekAgo;
  });

  const totalMinutesToday = todaysSessions.reduce((total, session) => total + session.duration, 0);
  const totalXPToday = todaysSessions.reduce((total, session) => total + session.xpEarned, 0);

  const getSessionStats = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date;
    }).reverse();

    return last7Days.map(date => {
      const daysSessions = pomodoroSessions.filter(session => 
        session.completedAt.toDateString() === date.toDateString()
      );
      return {
        date: format(date, 'MMM dd'),
        sessions: daysSessions.length,
        minutes: daysSessions.reduce((total, session) => total + session.duration, 0),
      };
    });
  };

  const sessionStats = getSessionStats();
  const maxSessions = Math.max(...sessionStats.map(stat => stat.sessions), 1);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Pomodoro Timer</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Focus on your tasks with the Pomodoro technique
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="card-hover border-aqua-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Sessions Today
                </p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">
                  {todaysSessions.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-aqua-400 to-aqua-600 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover border-aqua-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Minutes Today
                </p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">
                  {totalMinutesToday}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                <Play className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover border-aqua-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  XP Today
                </p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">
                  {totalXPToday}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover border-aqua-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  This Week
                </p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">
                  {thisWeekSessions.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timer and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pomodoro Timer */}
        <PomodoroTimer />

        {/* Weekly Progress Chart */}
        <Card className="card-hover border-aqua-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
              Weekly Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sessionStats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-16">
                      {stat.date}
                    </span>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 min-w-[100px]">
                      <div
                        className="level-progress h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(stat.sessions / maxSessions) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      {stat.sessions}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      ({stat.minutes}m)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sessions */}
      <Card className="card-hover border-aqua-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
            Recent Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pomodoroSessions.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  No Pomodoro sessions completed yet
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                  Start your first session to see your progress here
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pomodoroSessions
                  .slice()
                  .reverse()
                  .slice(0, 9)
                  .map((session) => {
                    const relatedTask = session.taskId ? tasks.find(t => t.id === session.taskId) : null;
                    
                    return (
                      <div
                        key={session.id}
                        className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-aqua-500" />
                            <span className="font-medium text-gray-800 dark:text-white">
                              {session.duration} min
                            </span>
                          </div>
                          <Badge className="bg-aqua-100 text-aqua-700 dark:bg-aqua-900/20 dark:text-aqua-400">
                            +{session.xpEarned} XP
                          </Badge>
                        </div>
                        
                        {relatedTask && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            Task: {relatedTask.title}
                          </p>
                        )}
                        
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDistanceToNow(session.completedAt, { addSuffix: true })}
                        </p>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
