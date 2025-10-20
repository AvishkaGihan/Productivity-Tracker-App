import * as Notifications from "expo-notifications";
import { useEffect, useRef } from "react";
import { notificationService } from "../services/notifications";
import {
  achievementNotificationScheduler,
  dailyMotivationScheduler,
  taskReminderScheduler,
} from "../services/notificationSchedulers";

/**
 * Hook to initialize and handle notifications in the app
 */
export const useNotifications = (
  onNavigate?: (path: string, params?: any) => void
) => {
  const notificationListener = useRef<Notifications.Subscription | undefined>(
    undefined
  );
  const responseListener = useRef<Notifications.Subscription | undefined>(
    undefined
  );

  useEffect(() => {
    // Initialize notification service
    initializeNotifications();

    // Listen for notification responses (user tapped notification)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(
        handleNotificationResponse
      );

    // Listen for notifications received while app is in foreground
    notificationListener.current =
      Notifications.addNotificationReceivedListener(handleNotificationReceived);

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  const initializeNotifications = async () => {
    await notificationService.initialize();

    // Schedule daily motivation at 9:00 AM by default
    const settings = notificationService.getSettings();
    if (settings.enabled && settings.dailyMotivation) {
      await dailyMotivationScheduler.scheduleDailyMotivation(9, 0);
    }
  };

  const handleNotificationResponse = (
    response: Notifications.NotificationResponse
  ) => {
    const data = response.notification.request.content.data;
    const actionIdentifier = response.actionIdentifier;

    if (!onNavigate) return;

    // Handle different notification types
    switch (data.type) {
      case "task-reminder":
        if (actionIdentifier === "complete") {
          // Navigate to task and mark as complete
          onNavigate("/tasks", { taskId: data.taskId, action: "complete" });
        } else if (actionIdentifier === "snooze") {
          // Snooze for 15 minutes
          // This would be handled by the scheduler
        } else {
          // Default tap - open task details
          onNavigate("/tasks", { taskId: data.taskId });
        }
        break;

      case "achievement":
        // Navigate to analytics/achievements
        onNavigate("/analytics");
        break;

      case "weekly-summary":
        // Navigate to analytics
        onNavigate("/analytics");
        break;

      case "streak-reminder":
        // Navigate to tasks
        onNavigate("/tasks");
        break;

      case "daily-motivation":
        // Navigate to dashboard
        onNavigate("/dashboard");
        break;

      default:
        // Default: navigate to home
        onNavigate("/dashboard");
    }
  };

  const handleNotificationReceived = (
    notification: Notifications.Notification
  ) => {
    // You can add custom logic here for when notifications are received
    // while the app is in the foreground
    console.log("Notification received:", notification);
  };

  return {
    scheduleTaskReminder: taskReminderScheduler.scheduleTaskReminder.bind(
      taskReminderScheduler
    ),
    cancelTaskReminder: taskReminderScheduler.cancelTaskReminder.bind(
      taskReminderScheduler
    ),
    notifyAchievement:
      achievementNotificationScheduler.notifyAchievementUnlocked.bind(
        achievementNotificationScheduler
      ),
    notifyMilestone: achievementNotificationScheduler.notifyMilestone.bind(
      achievementNotificationScheduler
    ),
  };
};
