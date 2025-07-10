import { z } from "zod";

// Priority levels for tasks
export const TaskPriority = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
} as const;

export type TaskPriority = typeof TaskPriority[keyof typeof TaskPriority];

// Task schema
export const taskSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional(),
  priority: z.enum([TaskPriority.LOW, TaskPriority.MEDIUM, TaskPriority.HIGH]),
  tags: z.array(z.string()).default([]),
  isCompleted: z.boolean().default(false),
  hasQuantity: z.boolean().default(false),
  currentCount: z.number().default(0),
  targetCount: z.number().default(1),
  xpReward: z.number().default(10),
  createdAt: z.date(),
  completedAt: z.date().optional(),
  dueDate: z.date().optional(),
});

export type Task = z.infer<typeof taskSchema>;

// Daily goal schema
export const dailyGoalSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Goal title is required"),
  description: z.string().optional(),
  targetCount: z.number().min(1, "Target count must be at least 1"),
  currentCount: z.number().default(0),
  xpReward: z.number().default(20),
  isCompleted: z.boolean().default(false),
  createdAt: z.date(),
  completedAt: z.date().optional(),
  lastResetDate: z.date(),
});

export type DailyGoal = z.infer<typeof dailyGoalSchema>;

// Pomodoro session schema
export const pomodoroSessionSchema = z.object({
  id: z.string(),
  duration: z.number(), // in minutes
  completedAt: z.date(),
  taskId: z.string().optional(),
  xpEarned: z.number().default(25),
});

export type PomodoroSession = z.infer<typeof pomodoroSessionSchema>;

// Streak entry schema
export const streakEntrySchema = z.object({
  id: z.string(),
  date: z.date(),
  tasksCompleted: z.number().default(0),
  goalsCompleted: z.number().default(0),
  pomodorosCompleted: z.number().default(0),
  xpEarned: z.number().default(0),
  hasActivity: z.boolean().default(false),
});

export type StreakEntry = z.infer<typeof streakEntrySchema>;

// User profile schema
export const userProfileSchema = z.object({
  id: z.string(),
  name: z.string().default("Student"),
  totalXP: z.number().default(0),
  level: z.number().default(1),
  currentStreak: z.number().default(0),
  longestStreak: z.number().default(0),
  tasksCompleted: z.number().default(0),
  goalsCompleted: z.number().default(0),
  pomodorosCompleted: z.number().default(0),
  theme: z.enum(["light", "dark"]).default("light"),
  notifications: z.boolean().default(true),
  pomodoroLength: z.number().default(25), // minutes
  shortBreakLength: z.number().default(5), // minutes
  longBreakLength: z.number().default(15), // minutes
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UserProfile = z.infer<typeof userProfileSchema>;

// Settings schema
export const settingsSchema = z.object({
  theme: z.enum(["light", "dark"]).default("light"),
  notifications: z.boolean().default(true),
  pomodoroLength: z.number().min(5).max(60).default(25),
  shortBreakLength: z.number().min(1).max(30).default(5),
  longBreakLength: z.number().min(5).max(60).default(15),
  dailyGoalReminderTime: z.string().default("09:00"),
  soundEnabled: z.boolean().default(true),
});

export type Settings = z.infer<typeof settingsSchema>;

// XP calculation constants
export const XP_REWARDS = {
  TASK_COMPLETE: 10,
  TASK_HIGH_PRIORITY: 25,
  TASK_MEDIUM_PRIORITY: 15,
  TASK_LOW_PRIORITY: 10,
  DAILY_GOAL_COMPLETE: 30,
  POMODORO_COMPLETE: 25,
  STREAK_BONUS: 5, // per day in streak
} as const;

// Level calculation
export const LEVEL_XP_REQUIREMENTS = [
  0, 100, 250, 450, 700, 1000, 1350, 1750, 2200, 2700, 3250, 3850, 4500, 5200, 5950, 6750, 7600, 8500, 9450, 10450
];

export function calculateLevel(totalXP: number): number {
  for (let i = LEVEL_XP_REQUIREMENTS.length - 1; i >= 0; i--) {
    if (totalXP >= LEVEL_XP_REQUIREMENTS[i]) {
      return i + 1;
    }
  }
  return 1;
}

export function getXPForNextLevel(currentXP: number): number {
  const currentLevel = calculateLevel(currentXP);
  if (currentLevel >= LEVEL_XP_REQUIREMENTS.length) {
    return LEVEL_XP_REQUIREMENTS[LEVEL_XP_REQUIREMENTS.length - 1];
  }
  return LEVEL_XP_REQUIREMENTS[currentLevel];
}

export function getLevelProgress(currentXP: number): { current: number; total: number; percentage: number } {
  const currentLevel = calculateLevel(currentXP);
  const currentLevelXP = LEVEL_XP_REQUIREMENTS[currentLevel - 1] || 0;
  const nextLevelXP = getXPForNextLevel(currentXP);
  
  const current = currentXP - currentLevelXP;
  const total = nextLevelXP - currentLevelXP;
  const percentage = total > 0 ? (current / total) * 100 : 0;
  
  return { current, total, percentage };
}
