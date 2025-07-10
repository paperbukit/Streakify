import { format, isToday, isYesterday, isThisWeek, startOfDay, endOfDay, addDays, subDays } from 'date-fns';

export const dateUtils = {
  // Format date for display
  formatDisplayDate: (date: Date): string => {
    if (isToday(date)) {
      return 'Today';
    }
    if (isYesterday(date)) {
      return 'Yesterday';
    }
    if (isThisWeek(date)) {
      return format(date, 'EEEE'); // Day name
    }
    return format(date, 'MMM dd, yyyy');
  },

  // Format time for display
  formatDisplayTime: (date: Date): string => {
    return format(date, 'HH:mm');
  },

  // Format relative time
  formatRelativeTime: (date: Date): string => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return 'Just now';
    }
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    }
    
    return format(date, 'MMM dd, yyyy');
  },

  // Get start and end of day
  getStartOfDay: (date: Date = new Date()): Date => {
    return startOfDay(date);
  },

  getEndOfDay: (date: Date = new Date()): Date => {
    return endOfDay(date);
  },

  // Get date ranges
  getToday: (): Date => {
    return new Date();
  },

  getYesterday: (): Date => {
    return subDays(new Date(), 1);
  },

  getTomorrow: (): Date => {
    return addDays(new Date(), 1);
  },

  // Get week start/end
  getWeekStart: (date: Date = new Date()): Date => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  },

  getWeekEnd: (date: Date = new Date()): Date => {
    const weekStart = dateUtils.getWeekStart(date);
    return addDays(weekStart, 6);
  },

  // Get month start/end
  getMonthStart: (date: Date = new Date()): Date => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  },

  getMonthEnd: (date: Date = new Date()): Date => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  },

  // Check if dates are same day
  isSameDay: (date1: Date, date2: Date): boolean => {
    return startOfDay(date1).getTime() === startOfDay(date2).getTime();
  },

  // Generate date range
  generateDateRange: (startDate: Date, endDate: Date): Date[] => {
    const dates = [];
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate = addDays(currentDate, 1);
    }
    
    return dates;
  },

  // Calculate days between dates
  daysBetween: (date1: Date, date2: Date): number => {
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },

  // Format duration (seconds to readable format)
  formatDuration: (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    }
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  },

  // Format timer display (MM:SS or HH:MM:SS)
  formatTimer: (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  },

  // Get calendar month grid
  getCalendarMonth: (date: Date = new Date()): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());
    
    const endDate = new Date(lastDayOfMonth);
    endDate.setDate(endDate.getDate() + (6 - lastDayOfMonth.getDay()));
    
    return dateUtils.generateDateRange(startDate, endDate);
  },

  // Time zone utilities
  getUserTimezone: (): string => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  },

  // Parse date string safely
  parseDate: (dateString: string): Date | null => {
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? null : date;
    } catch {
      return null;
    }
  },

  // Format date for input elements
  formatForInput: (date: Date): string => {
    return format(date, 'yyyy-MM-dd');
  },

  formatTimeForInput: (date: Date): string => {
    return format(date, 'HH:mm');
  },

  formatDateTimeForInput: (date: Date): string => {
    return format(date, "yyyy-MM-dd'T'HH:mm");
  },
};
