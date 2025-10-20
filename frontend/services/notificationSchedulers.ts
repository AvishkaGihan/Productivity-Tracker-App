import { SchedulableTriggerInputTypes } from "expo-notifications";
import { notificationService } from "./notifications";

interface Task {
  id: string;
  title: string;
  dueDate?: string;
  completed: boolean;
}

/**
 * Task Reminder Scheduler
 */
export class TaskReminderScheduler {
  private scheduledReminders: Map<string, string> = new Map();

  async scheduleTaskReminder(task: Task, reminderTime?: Date) {
    if (!task.dueDate || task.completed) return;

    const settings = notificationService.getSettings();
    if (!settings.taskReminders) return;

    // Cancel existing reminder
    await this.cancelTaskReminder(task.id);

    const dueDate = new Date(task.dueDate);
    const now = new Date();

    if (dueDate <= now) return; // Don't schedule past reminders

    // Default: remind 1 hour before due time
    const reminderDate =
      reminderTime || new Date(dueDate.getTime() - 60 * 60 * 1000);

    if (reminderDate <= now) return;

    const notificationId = await notificationService.scheduleNotification(
      "Task Reminder",
      `"${task.title}" is due soon!`,
      {
        type: SchedulableTriggerInputTypes.DATE,
        date: reminderDate,
      },
      {
        taskId: task.id,
        type: "task-reminder",
      },
      "task-reminder"
    );

    if (notificationId) {
      this.scheduledReminders.set(task.id, notificationId);
    }
  }

  async cancelTaskReminder(taskId: string) {
    const notificationId = this.scheduledReminders.get(taskId);
    if (notificationId) {
      await notificationService.cancelNotification(notificationId);
      this.scheduledReminders.delete(taskId);
    }
  }

  async rescheduleAllTaskReminders(tasks: Task[]) {
    // Cancel all existing
    for (const notificationId of this.scheduledReminders.values()) {
      await notificationService.cancelNotification(notificationId);
    }
    this.scheduledReminders.clear();

    // Schedule new ones
    for (const task of tasks) {
      if (!task.completed && task.dueDate) {
        await this.scheduleTaskReminder(task);
      }
    }
  }
}

/**
 * Daily Motivation Scheduler
 */
export class DailyMotivationScheduler {
  private motivationalQuotes = [
    "Start your day with purpose! 🌟",
    "Small progress is still progress! 💪",
    "You've got this! Let's make today count! 🚀",
    "Every task completed is a step forward! ✨",
    "Today is a fresh start! Make it amazing! 🎯",
    "Your productivity journey continues! 📈",
    "Focus on progress, not perfection! 🎨",
    "One task at a time, you're doing great! 👏",
  ];

  async scheduleDailyMotivation(hour: number = 9, minute: number = 0) {
    const settings = notificationService.getSettings();
    if (!settings.dailyMotivation) return;

    const quote =
      this.motivationalQuotes[
        Math.floor(Math.random() * this.motivationalQuotes.length)
      ];

    await notificationService.scheduleNotification(
      "Good Morning!",
      quote,
      {
        type: SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
      {
        type: "daily-motivation",
      }
    );
  }
}

/**
 * Streak Reminder Scheduler
 */
export class StreakReminderScheduler {
  async scheduleStreakReminder(currentStreak: number) {
    const settings = notificationService.getSettings();
    if (!settings.streakReminders) return;

    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(20, 0, 0, 0); // 8 PM reminder

    if (now >= endOfDay) return; // Too late today

    await notificationService.scheduleNotification(
      "Don't Break Your Streak! 🔥",
      `You're on a ${currentStreak}-day streak! Complete a task to keep it going!`,
      {
        type: SchedulableTriggerInputTypes.DATE,
        date: endOfDay,
      },
      {
        type: "streak-reminder",
        streak: currentStreak,
      }
    );
  }
}

/**
 * Achievement Notification Scheduler
 */
export class AchievementNotificationScheduler {
  async notifyAchievementUnlocked(
    achievementTitle: string,
    achievementDescription: string
  ) {
    const settings = notificationService.getSettings();
    if (!settings.achievementNotifications) return;

    await notificationService.scheduleNotification(
      "🏆 Achievement Unlocked!",
      `${achievementTitle}: ${achievementDescription}`,
      null, // Trigger immediately
      {
        type: "achievement",
        title: achievementTitle,
      },
      "achievement"
    );
  }

  async notifyMilestone(milestone: string, count: number) {
    const settings = notificationService.getSettings();
    if (!settings.achievementNotifications) return;

    const emojis: Record<string, string> = {
      tasks: "✅",
      streak: "🔥",
      week: "📅",
      category: "🎯",
    };

    await notificationService.scheduleNotification(
      `${emojis[milestone] || "🎉"} Milestone Reached!`,
      `You've completed ${count} ${milestone}!`,
      null, // Trigger immediately
      {
        type: "milestone",
        milestone,
        count,
      }
    );
  }
}

/**
 * Weekly Summary Scheduler
 */
export class WeeklySummaryScheduler {
  async scheduleWeeklySummary(
    completedTasks: number,
    totalTasks: number,
    topCategory: string
  ) {
    const settings = notificationService.getSettings();
    if (!settings.weeklySummary) return;

    const completionRate = Math.round((completedTasks / totalTasks) * 100);

    await notificationService.scheduleNotification(
      "📊 Your Weekly Summary",
      `You completed ${completedTasks}/${totalTasks} tasks (${completionRate}%)! Top category: ${topCategory}`,
      {
        type: SchedulableTriggerInputTypes.WEEKLY,
        weekday: 2, // Monday (JS weekday: Sunday = 1, Monday = 2)
        hour: 9,
        minute: 0,
      },
      {
        type: "weekly-summary",
        completedTasks,
        totalTasks,
        topCategory,
      }
    );
  }
}

// Export singleton instances
export const taskReminderScheduler = new TaskReminderScheduler();
export const dailyMotivationScheduler = new DailyMotivationScheduler();
export const streakReminderScheduler = new StreakReminderScheduler();
export const achievementNotificationScheduler =
  new AchievementNotificationScheduler();
export const weeklySummaryScheduler = new WeeklySummaryScheduler();
