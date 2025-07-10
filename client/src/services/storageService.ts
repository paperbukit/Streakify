import { Task, DailyGoal, PomodoroSession, StreakEntry, UserProfile, Settings } from "@shared/schema";

const STORAGE_KEYS = {
  PROFILE: 'streakify_profile',
  TASKS: 'streakify_tasks',
  DAILY_GOALS: 'streakify_daily_goals',
  POMODORO_SESSIONS: 'streakify_pomodoro_sessions',
  STREAK_ENTRIES: 'streakify_streak_entries',
  SETTINGS: 'streakify_settings',
} as const;

// Check if we're in development or production
const USE_API = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
const API_BASE = USE_API ? '/api' : '';

class StorageService {
  private async apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    if (!USE_API) {
      throw new Error('API not available in development');
    }
    
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    
    return response.json();
  }

  private async getItem<T>(key: string, defaultValue: T): Promise<T> {
    try {
      // Try API first if available
      if (USE_API) {
        try {
          const response = await this.apiRequest<{ data: T }>(`/storage/${key}`);
          return response.data || defaultValue;
        } catch (error) {
          console.warn('API storage failed, falling back to localStorage:', error);
        }
      }
      
      // Fallback to localStorage
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;
      
      const parsed = JSON.parse(item);
      // Convert date strings back to Date objects
      return this.reviveDates(parsed) as T;
    } catch (error) {
      console.error(`Error loading ${key}:`, error);
      return defaultValue;
    }
  }

  private async setItem<T>(key: string, value: T): Promise<void> {
    try {
      // Try API first if available
      if (USE_API) {
        try {
          await this.apiRequest(`/storage/${key}`, {
            method: 'POST',
            body: JSON.stringify(value),
          });
        } catch (error) {
          console.warn('API storage failed, falling back to localStorage:', error);
        }
      }
      
      // Always save to localStorage as backup
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
      // Don't throw error to prevent UI crashes
    }
  }

  private reviveDates(obj: any): any {
    if (obj === null || typeof obj !== 'object') return obj;
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.reviveDates(item));
    }

    const result: any = {};
    for (const key in obj) {
      const value = obj[key];
      if (typeof value === 'string' && this.isISODateString(value)) {
        result[key] = new Date(value);
      } else if (typeof value === 'object') {
        result[key] = this.reviveDates(value);
      } else {
        result[key] = value;
      }
    }
    return result;
  }

  private isISODateString(value: string): boolean {
    return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/.test(value);
  }

  // Profile
  async getProfile(): Promise<UserProfile> {
    const defaultProfile: UserProfile = {
      id: '1',
      name: 'Student',
      totalXP: 0,
      level: 1,
      currentStreak: 0,
      longestStreak: 0,
      tasksCompleted: 0,
      goalsCompleted: 0,
      pomodorosCompleted: 0,
      theme: 'light',
      notifications: true,
      pomodoroLength: 25,
      shortBreakLength: 5,
      longBreakLength: 15,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return await this.getItem(STORAGE_KEYS.PROFILE, defaultProfile);
  }

  async saveProfile(profile: UserProfile): Promise<void> {
    await this.setItem(STORAGE_KEYS.PROFILE, profile);
  }

  // Tasks
  async getTasks(): Promise<Task[]> {
    return await this.getItem(STORAGE_KEYS.TASKS, []);
  }

  async saveTasks(tasks: Task[]): Promise<void> {
    await this.setItem(STORAGE_KEYS.TASKS, tasks);
  }

  // Daily Goals
  async getDailyGoals(): Promise<DailyGoal[]> {
    return await this.getItem(STORAGE_KEYS.DAILY_GOALS, []);
  }

  async saveDailyGoals(goals: DailyGoal[]): Promise<void> {
    await this.setItem(STORAGE_KEYS.DAILY_GOALS, goals);
  }

  // Pomodoro Sessions
  async getPomodoroSessions(): Promise<PomodoroSession[]> {
    return await this.getItem(STORAGE_KEYS.POMODORO_SESSIONS, []);
  }

  async savePomodoroSessions(sessions: PomodoroSession[]): Promise<void> {
    await this.setItem(STORAGE_KEYS.POMODORO_SESSIONS, sessions);
  }

  // Streak Entries
  async getStreakEntries(): Promise<StreakEntry[]> {
    return await this.getItem(STORAGE_KEYS.STREAK_ENTRIES, []);
  }

  async saveStreakEntries(entries: StreakEntry[]): Promise<void> {
    await this.setItem(STORAGE_KEYS.STREAK_ENTRIES, entries);
  }

  // Settings
  async getSettings(): Promise<Settings> {
    const defaultSettings: Settings = {
      theme: 'light',
      notifications: true,
      pomodoroLength: 25,
      shortBreakLength: 5,
      longBreakLength: 15,
      dailyGoalReminderTime: '09:00',
      soundEnabled: true,
    };

    return await this.getItem(STORAGE_KEYS.SETTINGS, defaultSettings);
  }

  async saveSettings(settings: Settings): Promise<void> {
    await this.setItem(STORAGE_KEYS.SETTINGS, settings);
  }

  // Utility methods
  async clearAllData(): Promise<void> {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw error;
    }
  }

  async exportData(): Promise<string> {
    try {
      const data = {
        profile: await this.getProfile(),
        tasks: await this.getTasks(),
        dailyGoals: await this.getDailyGoals(),
        pomodoroSessions: await this.getPomodoroSessions(),
        streakEntries: await this.getStreakEntries(),
        settings: await this.getSettings(),
        exportedAt: new Date().toISOString(),
      };

      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }

  async importData(jsonData: string): Promise<void> {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.profile) await this.saveProfile(data.profile);
      if (data.tasks) await this.saveTasks(data.tasks);
      if (data.dailyGoals) await this.saveDailyGoals(data.dailyGoals);
      if (data.pomodoroSessions) await this.savePomodoroSessions(data.pomodoroSessions);
      if (data.streakEntries) await this.saveStreakEntries(data.streakEntries);
      if (data.settings) await this.saveSettings(data.settings);
    } catch (error) {
      console.error('Error importing data:', error);
      throw error;
    }
  }
}

export const storageService = new StorageService();
