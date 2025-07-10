import { Task, XP_REWARDS, TaskPriority } from "@shared/schema";

class XPService {
  calculateTaskXP(task: Task): number {
    let baseXP = XP_REWARDS.TASK_COMPLETE;

    // Priority bonus
    switch (task.priority) {
      case TaskPriority.HIGH:
        baseXP = XP_REWARDS.TASK_HIGH_PRIORITY;
        break;
      case TaskPriority.MEDIUM:
        baseXP = XP_REWARDS.TASK_MEDIUM_PRIORITY;
        break;
      case TaskPriority.LOW:
        baseXP = XP_REWARDS.TASK_LOW_PRIORITY;
        break;
    }

    // Quantity bonus for multi-part tasks
    if (task.hasQuantity && task.targetCount > 1) {
      baseXP = Math.floor(baseXP * task.targetCount * 0.8); // 80% of full XP per item
    }

    return Math.max(baseXP, 5); // Minimum 5 XP
  }

  calculateStreakBonus(streakDays: number): number {
    return streakDays * XP_REWARDS.STREAK_BONUS;
  }

  calculateDailyXPTarget(level: number): number {
    // Base target increases with level
    return Math.floor(50 + (level * 10));
  }

  getMotivationalMessage(xpEarned: number): string {
    const messages = [
      "Great job! Keep it up! 🎉",
      "You're on fire! 🔥",
      "Excellent work! 💪",
      "Keep pushing forward! 🚀",
      "You're crushing it! ⭐",
      "Awesome progress! 🎯",
      "Way to go! 👏",
      "Outstanding effort! 🏆",
    ];

    return messages[Math.floor(Math.random() * messages.length)];
  }

  getLevelTitle(level: number): string {
    const titles = [
      "Beginner", "Novice", "Apprentice", "Skilled", "Proficient",
      "Expert", "Master", "Grandmaster", "Legend", "Mythical",
      "Transcendent", "Ultimate", "Supreme", "Cosmic", "Infinite"
    ];

    const index = Math.min(level - 1, titles.length - 1);
    return titles[index] || "Infinite";
  }

  getProgressEmoji(percentage: number): string {
    if (percentage >= 100) return "🎉";
    if (percentage >= 75) return "🔥";
    if (percentage >= 50) return "⚡";
    if (percentage >= 25) return "💪";
    return "🌱";
  }
}

export const xpService = new XPService();
