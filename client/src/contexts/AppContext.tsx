import { createContext, useContext, useEffect, useState } from "react";
import { Task, DailyGoal, PomodoroSession, StreakEntry, UserProfile, Settings } from "@shared/schema";
import { storageService } from "../services/storageService";
import { xpService } from "../services/xpService";
import { useNotifications } from "../hooks/useNotifications";

interface AppContextType {
  // User data
  profile: UserProfile | null;
  tasks: Task[];
  dailyGoals: DailyGoal[];
  pomodoroSessions: PomodoroSession[];
  streakEntries: StreakEntry[];
  settings: Settings;

  // UI state
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  activeView: string;

  // Actions
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setActiveView: (view: string) => void;
  
  // Task actions
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
  incrementTaskCount: (id: string) => Promise<void>;
  decrementTaskCount: (id: string) => Promise<void>;

  // Daily goal actions
  addDailyGoal: (goal: Omit<DailyGoal, 'id' | 'createdAt' | 'lastResetDate'>) => Promise<void>;
  updateDailyGoal: (id: string, updates: Partial<DailyGoal>) => Promise<void>;
  deleteDailyGoal: (id: string) => Promise<void>;
  incrementGoalCount: (id: string) => Promise<void>;
  decrementGoalCount: (id: string) => Promise<void>;

  // Pomodoro actions
  addPomodoroSession: (session: Omit<PomodoroSession, 'id' | 'completedAt'>) => Promise<void>;

  // Profile actions
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  updateSettings: (updates: Partial<Settings>) => Promise<void>;

  // Utility actions
  refreshData: () => Promise<void>;
  resetDailyGoals: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dailyGoals, setDailyGoals] = useState<DailyGoal[]>([]);
  const [pomodoroSessions, setPomodoroSessions] = useState<PomodoroSession[]>([]);
  const [streakEntries, setStreakEntries] = useState<StreakEntry[]>([]);
  const [settings, setSettings] = useState<Settings>({
    theme: 'light',
    notifications: true,
    pomodoroLength: 25,
    shortBreakLength: 5,
    longBreakLength: 15,
    dailyGoalReminderTime: '09:00',
    soundEnabled: true,
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [activeView, setActiveView] = useState('dashboard');

  const { showNotification } = useNotifications();

  // Load data on mount
  useEffect(() => {
    loadInitialData();
  }, []);

  // Apply theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Daily reset check
  useEffect(() => {
    const checkDailyReset = async () => {
      const today = new Date().toDateString();
      const lastReset = localStorage.getItem('lastDailyReset');
      
      if (lastReset !== today) {
        await resetDailyGoals();
        localStorage.setItem('lastDailyReset', today);
      }
    };

    checkDailyReset();
    const interval = setInterval(checkDailyReset, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const loadInitialData = async () => {
    try {
      const [profileData, tasksData, goalsData, sessionsData, streaksData, settingsData] = await Promise.all([
        storageService.getProfile(),
        storageService.getTasks(),
        storageService.getDailyGoals(),
        storageService.getPomodoroSessions(),
        storageService.getStreakEntries(),
        storageService.getSettings(),
      ]);

      setProfile(profileData);
      setTasks(tasksData);
      setDailyGoals(goalsData);
      setPomodoroSessions(sessionsData);
      setStreakEntries(streaksData);
      setSettings(settingsData);
      setTheme(settingsData.theme);
    } catch (error) {
      console.error('Failed to load initial data:', error);
    }
  };

  const refreshData = async () => {
    await loadInitialData();
  };

  const resetDailyGoals = async () => {
    const today = new Date();
    const updatedGoals = dailyGoals.map(goal => ({
      ...goal,
      currentCount: 0,
      isCompleted: false,
      lastResetDate: today,
    }));

    await storageService.saveDailyGoals(updatedGoals);
    setDailyGoals(updatedGoals);
  };

  // Task actions
  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };

    const updatedTasks = [...tasks, newTask];
    await storageService.saveTasks(updatedTasks);
    setTasks(updatedTasks);
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    const updatedTasks = tasks.map(task => 
      task.id === id ? { ...task, ...updates } : task
    );
    await storageService.saveTasks(updatedTasks);
    setTasks(updatedTasks);
  };

  const deleteTask = async (id: string) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    await storageService.saveTasks(updatedTasks);
    setTasks(updatedTasks);
  };

  const completeTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const xpEarned = xpService.calculateTaskXP(task);
    await updateTask(id, { isCompleted: true, completedAt: new Date() });
    
    if (profile) {
      await updateProfile({
        totalXP: profile.totalXP + xpEarned,
        tasksCompleted: profile.tasksCompleted + 1,
      });
    }

    showNotification('Task Completed!', `+${xpEarned} XP earned`);
  };

  const incrementTaskCount = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task || !task.hasQuantity) return;

    const newCount = Math.min(task.currentCount + 1, task.targetCount);
    const isCompleted = newCount >= task.targetCount;

    await updateTask(id, { 
      currentCount: newCount,
      isCompleted,
      completedAt: isCompleted ? new Date() : undefined,
    });

    if (isCompleted && profile) {
      const xpEarned = xpService.calculateTaskXP(task);
      await updateProfile({
        totalXP: profile.totalXP + xpEarned,
        tasksCompleted: profile.tasksCompleted + 1,
      });
      showNotification('Task Completed!', `+${xpEarned} XP earned`);
    }
  };

  const decrementTaskCount = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task || !task.hasQuantity) return;

    const newCount = Math.max(task.currentCount - 1, 0);
    await updateTask(id, { 
      currentCount: newCount,
      isCompleted: false,
      completedAt: undefined,
    });
  };

  // Daily goal actions
  const addDailyGoal = async (goalData: Omit<DailyGoal, 'id' | 'createdAt' | 'lastResetDate'>) => {
    const newGoal: DailyGoal = {
      ...goalData,
      id: Date.now().toString(),
      createdAt: new Date(),
      lastResetDate: new Date(),
    };

    const updatedGoals = [...dailyGoals, newGoal];
    await storageService.saveDailyGoals(updatedGoals);
    setDailyGoals(updatedGoals);
  };

  const updateDailyGoal = async (id: string, updates: Partial<DailyGoal>) => {
    const updatedGoals = dailyGoals.map(goal => 
      goal.id === id ? { ...goal, ...updates } : goal
    );
    await storageService.saveDailyGoals(updatedGoals);
    setDailyGoals(updatedGoals);
  };

  const deleteDailyGoal = async (id: string) => {
    const updatedGoals = dailyGoals.filter(goal => goal.id !== id);
    await storageService.saveDailyGoals(updatedGoals);
    setDailyGoals(updatedGoals);
  };

  const incrementGoalCount = async (id: string) => {
    const goal = dailyGoals.find(g => g.id === id);
    if (!goal) return;

    const newCount = Math.min(goal.currentCount + 1, goal.targetCount);
    const isCompleted = newCount >= goal.targetCount;

    await updateDailyGoal(id, { 
      currentCount: newCount,
      isCompleted,
      completedAt: isCompleted ? new Date() : undefined,
    });

    if (isCompleted && profile) {
      const xpEarned = goal.xpReward;
      await updateProfile({
        totalXP: profile.totalXP + xpEarned,
        goalsCompleted: profile.goalsCompleted + 1,
      });
      showNotification('Daily Goal Completed!', `+${xpEarned} XP earned`);
    }
  };

  const decrementGoalCount = async (id: string) => {
    const goal = dailyGoals.find(g => g.id === id);
    if (!goal) return;

    const newCount = Math.max(goal.currentCount - 1, 0);
    await updateDailyGoal(id, { 
      currentCount: newCount,
      isCompleted: false,
      completedAt: undefined,
    });
  };

  // Pomodoro actions
  const addPomodoroSession = async (sessionData: Omit<PomodoroSession, 'id' | 'completedAt'>) => {
    const newSession: PomodoroSession = {
      ...sessionData,
      id: Date.now().toString(),
      completedAt: new Date(),
    };

    const updatedSessions = [...pomodoroSessions, newSession];
    await storageService.savePomodoroSessions(updatedSessions);
    setPomodoroSessions(updatedSessions);

    if (profile) {
      await updateProfile({
        totalXP: profile.totalXP + newSession.xpEarned,
        pomodorosCompleted: profile.pomodorosCompleted + 1,
      });
    }

    showNotification('Pomodoro Complete!', `+${newSession.xpEarned} XP earned`);
  };

  // Profile actions
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!profile) return;

    const updatedProfile = { ...profile, ...updates, updatedAt: new Date() };
    await storageService.saveProfile(updatedProfile);
    setProfile(updatedProfile);
  };

  const updateSettings = async (updates: Partial<Settings>) => {
    const updatedSettings = { ...settings, ...updates };
    await storageService.saveSettings(updatedSettings);
    setSettings(updatedSettings);
    
    if (updates.theme) {
      setTheme(updates.theme);
    }
  };

  const value: AppContextType = {
    // Data
    profile,
    tasks,
    dailyGoals,
    pomodoroSessions,
    streakEntries,
    settings,

    // UI State
    sidebarOpen,
    theme,
    activeView,

    // UI Actions
    setSidebarOpen,
    setTheme,
    setActiveView,

    // Task Actions
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    incrementTaskCount,
    decrementTaskCount,

    // Daily Goal Actions
    addDailyGoal,
    updateDailyGoal,
    deleteDailyGoal,
    incrementGoalCount,
    decrementGoalCount,

    // Pomodoro Actions
    addPomodoroSession,

    // Profile Actions
    updateProfile,
    updateSettings,

    // Utility Actions
    refreshData,
    resetDailyGoals,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
