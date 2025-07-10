// App constants
export const APP_NAME = 'Streakify';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'Stay productive with tasks, goals, and streaks';

// Theme constants
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;

// Task priority constants
export const TASK_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

// Task priority colors
export const PRIORITY_COLORS = {
  [TASK_PRIORITIES.LOW]: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
  [TASK_PRIORITIES.MEDIUM]: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
  [TASK_PRIORITIES.HIGH]: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
} as const;

// Pomodoro timer constants
export const POMODORO_DEFAULTS = {
  WORK_DURATION: 25, // minutes
  SHORT_BREAK: 5, // minutes
  LONG_BREAK: 15, // minutes
  SESSIONS_UNTIL_LONG_BREAK: 4,
} as const;

// XP reward constants
export const XP_REWARDS = {
  TASK_COMPLETE: 10,
  TASK_HIGH_PRIORITY: 25,
  TASK_MEDIUM_PRIORITY: 15,
  TASK_LOW_PRIORITY: 10,
  DAILY_GOAL_COMPLETE: 30,
  POMODORO_COMPLETE: 25,
  STREAK_BONUS: 5, // per day in streak
  FIRST_TASK: 10,
  FIRST_GOAL: 25,
  FIRST_POMODORO: 40,
  WEEK_STREAK: 75,
  MONTH_STREAK: 200,
} as const;

// Level thresholds
export const LEVEL_THRESHOLDS = [
  0, 100, 250, 450, 700, 1000, 1350, 1750, 2200, 2700, 
  3250, 3850, 4500, 5200, 5950, 6750, 7600, 8500, 9450, 10450
] as const;

// Level titles
export const LEVEL_TITLES = [
  'Beginner', 'Novice', 'Apprentice', 'Skilled', 'Proficient',
  'Expert', 'Master', 'Grandmaster', 'Legend', 'Mythical',
  'Transcendent', 'Ultimate', 'Supreme', 'Cosmic', 'Infinite'
] as const;

// Streak milestones
export const STREAK_MILESTONES = [
  { days: 3, title: 'Getting Started', emoji: '🌱' },
  { days: 7, title: 'Week Warrior', emoji: '⚡' },
  { days: 14, title: 'Two Week Champion', emoji: '💪' },
  { days: 30, title: 'Monthly Master', emoji: '🏆' },
  { days: 60, title: 'Consistency King', emoji: '👑' },
  { days: 100, title: 'Century Achiever', emoji: '💎' },
  { days: 365, title: 'Year Legend', emoji: '🌟' },
] as const;

// Notification types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  PROFILE: 'streakify_profile',
  TASKS: 'streakify_tasks',
  DAILY_GOALS: 'streakify_daily_goals',
  POMODORO_SESSIONS: 'streakify_pomodoro_sessions',
  STREAK_ENTRIES: 'streakify_streak_entries',
  SETTINGS: 'streakify_settings',
  LAST_DAILY_RESET: 'streakify_last_daily_reset',
  THEME: 'streakify_theme',
} as const;

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  INPUT: 'yyyy-MM-dd',
  TIME: 'HH:mm',
  DATETIME: "yyyy-MM-dd'T'HH:mm",
  RELATIVE: 'relative',
  SHORT: 'MMM dd',
  LONG: 'EEEE, MMMM dd, yyyy',
} as const;

// Responsive breakpoints
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// Animation durations (in milliseconds)
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  SIDEBAR: 300,
  NOTIFICATION: 3000,
  TOOLTIP: 200,
} as const;

// API endpoints (for future use)
export const API_ENDPOINTS = {
  TASKS: '/api/tasks',
  GOALS: '/api/goals',
  POMODOROS: '/api/pomodoros',
  STREAKS: '/api/streaks',
  PROFILE: '/api/profile',
  SETTINGS: '/api/settings',
} as const;

// Error messages
export const ERROR_MESSAGES = {
  TASK_CREATE_FAILED: 'Failed to create task',
  TASK_UPDATE_FAILED: 'Failed to update task',
  TASK_DELETE_FAILED: 'Failed to delete task',
  GOAL_CREATE_FAILED: 'Failed to create goal',
  GOAL_UPDATE_FAILED: 'Failed to update goal',
  GOAL_DELETE_FAILED: 'Failed to delete goal',
  PROFILE_UPDATE_FAILED: 'Failed to update profile',
  SETTINGS_UPDATE_FAILED: 'Failed to update settings',
  DATA_EXPORT_FAILED: 'Failed to export data',
  DATA_IMPORT_FAILED: 'Failed to import data',
  DATA_CLEAR_FAILED: 'Failed to clear data',
  NOTIFICATION_PERMISSION_DENIED: 'Notification permission denied',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  TASK_CREATED: 'Task created successfully',
  TASK_UPDATED: 'Task updated successfully',
  TASK_DELETED: 'Task deleted successfully',
  TASK_COMPLETED: 'Task completed! Great job!',
  GOAL_CREATED: 'Goal created successfully',
  GOAL_UPDATED: 'Goal updated successfully',
  GOAL_DELETED: 'Goal deleted successfully',
  GOAL_COMPLETED: 'Goal completed! Excellent work!',
  POMODORO_COMPLETED: 'Pomodoro session completed!',
  PROFILE_UPDATED: 'Profile updated successfully',
  SETTINGS_UPDATED: 'Settings updated successfully',
  DATA_EXPORTED: 'Data exported successfully',
  DATA_IMPORTED: 'Data imported successfully',
  STREAK_MILESTONE: 'Streak milestone achieved!',
  LEVEL_UP: 'Level up! Congratulations!',
} as const;

// Motivational quotes
export const MOTIVATIONAL_QUOTES = [
  'The way to get started is to quit talking and begin doing. - Walt Disney',
  'The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt',
  'It is during our darkest moments that we must focus to see the light. - Aristotle',
  'Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill',
  'The only impossible journey is the one you never begin. - Tony Robbins',
  'In the middle of difficulty lies opportunity. - Albert Einstein',
  'Believe you can and you\'re halfway there. - Theodore Roosevelt',
  'The only way to do great work is to love what you do. - Steve Jobs',
] as const;

// App features for onboarding
export const APP_FEATURES = [
  {
    title: 'Task Management',
    description: 'Create, organize, and track your tasks with priorities and tags',
    icon: 'CheckSquare',
  },
  {
    title: 'Daily Goals',
    description: 'Set daily targets and track your consistency over time',
    icon: 'Target',
  },
  {
    title: 'Pomodoro Timer',
    description: 'Focus sessions with customizable durations and break times',
    icon: 'Clock',
  },
  {
    title: 'Streak Tracking',
    description: 'Build habits and maintain streaks with visual progress',
    icon: 'Calendar',
  },
  {
    title: 'XP & Levels',
    description: 'Gamified experience with points, levels, and achievements',
    icon: 'Trophy',
  },
  {
    title: 'Offline Support',
    description: 'Works completely offline with local data storage',
    icon: 'Database',
  },
] as const;

// Color palette (aqua/teal theme)
export const COLORS = {
  AQUA: {
    50: 'hsl(180, 100%, 98%)',
    100: 'hsl(180, 54%, 90%)',
    200: 'hsl(180, 44%, 83%)',
    300: 'hsl(180, 34%, 71%)',
    400: 'hsl(186, 81%, 36%)',
    500: 'hsl(186, 95%, 27%)',
    600: 'hsl(186, 100%, 22%)',
    700: 'hsl(186, 100%, 17%)',
    800: 'hsl(186, 100%, 12%)',
    900: 'hsl(186, 100%, 7%)',
  },
  PRIORITY: {
    LOW: 'hsl(120, 60%, 50%)',
    MEDIUM: 'hsl(45, 100%, 50%)',
    HIGH: 'hsl(0, 70%, 50%)',
  },
} as const;

// Regular expressions for validation
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  TIME: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
  TAG: /^[a-zA-Z0-9_-]+$/,
} as const;

// File types for import/export
export const FILE_TYPES = {
  JSON: 'application/json',
  CSV: 'text/csv',
  TXT: 'text/plain',
} as const;

// Maximum limits
export const LIMITS = {
  TASK_TITLE_LENGTH: 100,
  TASK_DESCRIPTION_LENGTH: 500,
  GOAL_TITLE_LENGTH: 100,
  GOAL_DESCRIPTION_LENGTH: 300,
  PROFILE_NAME_LENGTH: 50,
  TAG_LENGTH: 20,
  MAX_TAGS_PER_TASK: 5,
  MAX_TARGET_COUNT: 100,
  MIN_POMODORO_DURATION: 1,
  MAX_POMODORO_DURATION: 120,
} as const;
