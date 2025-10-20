import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

const NOTIFICATION_SETTINGS_KEY = "@notification_settings";
const PUSH_TOKEN_KEY = "@push_token";

interface NotificationSettings {
  enabled: boolean;
  taskReminders: boolean;
  dailyMotivation: boolean;
  dailyMotivationTime: string; // HH:MM format
  streakReminders: boolean;
  achievementNotifications: boolean;
  weeklySummary: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string; // HH:MM format
  quietHoursEnd: string; // HH:MM format
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: true,
  taskReminders: true,
  dailyMotivation: true,
  dailyMotivationTime: "09:00",
  streakReminders: true,
  achievementNotifications: true,
  weeklySummary: true,
  quietHoursEnabled: false,
  quietHoursStart: "22:00",
  quietHoursEnd: "08:00",
  soundEnabled: true,
  vibrationEnabled: true,
};

// Configure how notifications are handled when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

class NotificationService {
  private settings: NotificationSettings = DEFAULT_SETTINGS;
  private pushToken: string | null = null;

  async initialize() {
    // Load saved settings
    await this.loadSettings();

    // Request permissions
    await this.requestPermissions();

    // Get push token
    await this.registerForPushNotifications();

    // Set up notification categories with actions
    await this.setupNotificationCategories();
  }

  async loadSettings(): Promise<NotificationSettings> {
    try {
      const saved = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);
      if (saved) {
        this.settings = { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.error("Failed to load notification settings:", error);
    }
    return this.settings;
  }

  async saveSettings(settings: Partial<NotificationSettings>) {
    try {
      this.settings = { ...this.settings, ...settings };
      await AsyncStorage.setItem(
        NOTIFICATION_SETTINGS_KEY,
        JSON.stringify(this.settings)
      );
    } catch (error) {
      console.error("Failed to save notification settings:", error);
    }
  }

  getSettings(): NotificationSettings {
    return this.settings;
  }

  async updateSettings(settings: Partial<NotificationSettings>) {
    await this.saveSettings(settings);
  }

  async requestPermissions(): Promise<boolean> {
    if (!Device.isDevice) {
      console.log("Notifications only work on physical devices");
      return false;
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Failed to get push token for notifications");
      return false;
    }

    return true;
  }

  async registerForPushNotifications(): Promise<string | null> {
    try {
      if (!Device.isDevice) {
        return null;
      }

      const token = await Notifications.getExpoPushTokenAsync({
        projectId: "your-project-id", // Replace with your Expo project ID
      });

      this.pushToken = token.data;
      await AsyncStorage.setItem(PUSH_TOKEN_KEY, token.data);

      // Configure Android channel
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#007AFF",
        });

        // Task reminders channel
        await Notifications.setNotificationChannelAsync("task-reminders", {
          name: "Task Reminders",
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          sound: "default",
        });

        // Achievements channel
        await Notifications.setNotificationChannelAsync("achievements", {
          name: "Achievements",
          importance: Notifications.AndroidImportance.DEFAULT,
          vibrationPattern: [0, 250],
          sound: "default",
        });
      }

      return token.data;
    } catch (error) {
      console.error("Failed to get push token:", error);
      return null;
    }
  }

  async setupNotificationCategories() {
    // Task reminder category with actions
    await Notifications.setNotificationCategoryAsync("task-reminder", [
      {
        identifier: "complete",
        buttonTitle: "Complete",
        options: {
          opensAppToForeground: false,
        },
      },
      {
        identifier: "snooze",
        buttonTitle: "Snooze 1hr",
        options: {
          opensAppToForeground: false,
        },
      },
    ]);

    // Achievement category
    await Notifications.setNotificationCategoryAsync("achievement", [
      {
        identifier: "view",
        buttonTitle: "View",
        options: {
          opensAppToForeground: true,
        },
      },
    ]);
  }

  isQuietHours(): boolean {
    if (!this.settings.quietHoursEnabled) return false;

    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    const { quietHoursStart, quietHoursEnd } = this.settings;

    // Handle cases where quiet hours span midnight
    if (quietHoursStart > quietHoursEnd) {
      return currentTime >= quietHoursStart || currentTime < quietHoursEnd;
    }

    return currentTime >= quietHoursStart && currentTime < quietHoursEnd;
  }

  async scheduleNotification(
    title: string,
    body: string,
    trigger: Notifications.NotificationTriggerInput,
    data?: any,
    categoryId?: string
  ): Promise<string | null> {
    if (!this.settings.enabled) return null;
    if (this.isQuietHours()) return null;

    try {
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          categoryIdentifier: categoryId,
          sound: this.settings.soundEnabled ? "default" : undefined,
          badge: 1,
        },
        trigger,
      });
      return id;
    } catch (error) {
      console.error("Failed to schedule notification:", error);
      return null;
    }
  }

  async cancelNotification(notificationId: string) {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error("Failed to cancel notification:", error);
    }
  }

  async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error("Failed to cancel all notifications:", error);
    }
  }

  async getAllScheduledNotifications() {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error("Failed to get scheduled notifications:", error);
      return [];
    }
  }

  async setBadgeCount(count: number) {
    try {
      await Notifications.setBadgeCountAsync(count);
    } catch (error) {
      console.error("Failed to set badge count:", error);
    }
  }

  async clearBadge() {
    try {
      await Notifications.setBadgeCountAsync(0);
    } catch (error) {
      console.error("Failed to clear badge:", error);
    }
  }

  getPushToken(): string | null {
    return this.pushToken;
  }

  // Add notification response listener
  addNotificationResponseListener(
    listener: (response: Notifications.NotificationResponse) => void
  ) {
    return Notifications.addNotificationResponseReceivedListener(listener);
  }

  // Add notification received listener (for foreground notifications)
  addNotificationReceivedListener(
    listener: (notification: Notifications.Notification) => void
  ) {
    return Notifications.addNotificationReceivedListener(listener);
  }
}

export const notificationService = new NotificationService();

export type { NotificationSettings };
