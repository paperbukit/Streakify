import { useState, useEffect, useRef } from "react";
import { useApp } from "../../contexts/AppContext";
import { Button } from "../ui/button";
import { ProgressRing } from "../ui/ProgressRing";
import { Play, Pause, Square, Settings } from "lucide-react";

export function PomodoroTimer() {
  const { settings, addPomodoroSession } = useApp();
  const [timeLeft, setTimeLeft] = useState(settings.pomodoroLength * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionType, setSessionType] = useState<'work' | 'short' | 'long'>('work');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleTimerComplete = async () => {
    setIsRunning(false);
    
    if (sessionType === 'work') {
      await addPomodoroSession({
        duration: settings.pomodoroLength,
        xpEarned: 25,
      });
    }

    // Browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Pomodoro Complete!', {
        body: sessionType === 'work' ? 'Time for a break!' : 'Ready to focus again?',
        icon: '/favicon.ico',
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const totalTime = getSessionDuration() * 60;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  const getSessionDuration = () => {
    switch (sessionType) {
      case 'work':
        return settings.pomodoroLength;
      case 'short':
        return settings.shortBreakLength;
      case 'long':
        return settings.longBreakLength;
      default:
        return settings.pomodoroLength;
    }
  };

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    const duration = sessionType === 'work' ? settings.pomodoroLength : 
                    sessionType === 'short' ? settings.shortBreakLength : 
                    settings.longBreakLength;
    setTimeLeft(duration * 60);
  };

  const switchSession = (type: 'work' | 'short' | 'long') => {
    setSessionType(type);
    setIsRunning(false);
    const newDuration = type === 'work' ? settings.pomodoroLength : 
                       type === 'short' ? settings.shortBreakLength : 
                       settings.longBreakLength;
    setTimeLeft(newDuration * 60);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-aqua-200 dark:border-gray-700 p-6 card-hover">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Pomodoro Timer
        </h3>
        <div className="flex items-center space-x-2">
          <Button
            variant={sessionType === 'work' ? 'default' : 'outline'}
            size="sm"
            onClick={() => switchSession('work')}
          >
            Focus
          </Button>
          <Button
            variant={sessionType === 'short' ? 'default' : 'outline'}
            size="sm"
            onClick={() => switchSession('short')}
          >
            Short Break
          </Button>
          <Button
            variant={sessionType === 'long' ? 'default' : 'outline'}
            size="sm"
            onClick={() => switchSession('long')}
          >
            Long Break
          </Button>
        </div>
      </div>

      <div className="text-center">
        <ProgressRing
          progress={getProgress()}
          size={200}
          strokeWidth={8}
          className="mx-auto"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-800 dark:text-white">
              {formatTime(timeLeft)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
              {sessionType === 'work' ? 'Focus Time' : 'Break Time'}
            </div>
          </div>
        </ProgressRing>

        <div className="flex items-center justify-center space-x-4 mt-8">
          <Button
            onClick={startTimer}
            disabled={isRunning || timeLeft === 0}
            className="w-16 h-16 rounded-full bg-aqua-500 hover:bg-aqua-600 text-white"
          >
            <Play className="w-6 h-6" />
          </Button>
          <Button
            onClick={pauseTimer}
            disabled={!isRunning}
            variant="outline"
            className="w-16 h-16 rounded-full"
          >
            <Pause className="w-6 h-6" />
          </Button>
          <Button
            onClick={resetTimer}
            variant="outline"
            className="w-16 h-16 rounded-full"
          >
            <Square className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}
