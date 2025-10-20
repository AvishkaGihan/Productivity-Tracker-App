import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaWrapper } from "../components/common/SafeAreaWrapper";
import {
  notificationService,
  NotificationSettings,
} from "../services/notifications";
import { dailyMotivationScheduler } from "../services/notificationSchedulers";
import { haptics } from "../utils/haptics";

export const NotificationSettingsScreen = () => {
  const [settings, setSettings] = useState<NotificationSettings>(
    notificationService.getSettings()
  );
  const [showQuietStart, setShowQuietStart] = useState(false);
  const [showQuietEnd, setShowQuietEnd] = useState(false);
  const [showMotivationTime, setShowMotivationTime] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const loadedSettings = notificationService.getSettings();
    setSettings(loadedSettings);
  };

  const updateSetting = async <K extends keyof NotificationSettings>(
    key: K,
    value: NotificationSettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    await notificationService.updateSettings(newSettings);
    await haptics.selection();

    // Re-schedule daily motivation if time changed
    if (key === "dailyMotivationTime") {
      const [hour, minute] = (value as string).split(":").map(Number);
      await dailyMotivationScheduler.scheduleDailyMotivation(hour, minute);
    }
  };

  const handleQuietHoursStartChange = (_event: any, selectedDate?: Date) => {
    setShowQuietStart(false);
    if (selectedDate) {
      const hours = selectedDate.getHours().toString().padStart(2, "0");
      const minutes = selectedDate.getMinutes().toString().padStart(2, "0");
      updateSetting("quietHoursStart", `${hours}:${minutes}`);
    }
  };

  const handleQuietHoursEndChange = (_event: any, selectedDate?: Date) => {
    setShowQuietEnd(false);
    if (selectedDate) {
      const hours = selectedDate.getHours().toString().padStart(2, "0");
      const minutes = selectedDate.getMinutes().toString().padStart(2, "0");
      updateSetting("quietHoursEnd", `${hours}:${minutes}`);
    }
  };

  const handleMotivationTimeChange = (_event: any, selectedDate?: Date) => {
    setShowMotivationTime(false);
    if (selectedDate) {
      const hours = selectedDate.getHours().toString().padStart(2, "0");
      const minutes = selectedDate.getMinutes().toString().padStart(2, "0");
      updateSetting("dailyMotivationTime", `${hours}:${minutes}`);
    }
  };

  const getDateFromTime = (timeString: string): Date => {
    const [hours, minutes] = timeString.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  const testNotification = async () => {
    await haptics.success();
    await notificationService.scheduleNotification(
      "Test Notification",
      "Your notifications are working perfectly! 🎉",
      null,
      { type: "test" }
    );
    Alert.alert("Success", "Test notification sent!");
  };

  const requestPermissions = async () => {
    const granted = await notificationService.requestPermissions();
    if (granted) {
      await haptics.success();
      Alert.alert("Success", "Notification permissions granted!");
      await updateSetting("enabled", true);
    } else {
      await haptics.error();
      Alert.alert(
        "Permission Denied",
        "Please enable notifications in your device settings to use this feature."
      );
    }
  };

  const renderSettingRow = (
    icon: string,
    title: string,
    subtitle: string,
    value: boolean,
    onValueChange: (value: boolean) => void,
    disabled?: boolean
  ) => (
    <View style={[styles.settingRow, disabled && styles.settingRowDisabled]}>
      <View style={styles.settingInfo}>
        <MaterialCommunityIcons
          name={icon as any}
          size={24}
          color={disabled ? "#999" : "#007AFF"}
          style={styles.settingIcon}
        />
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, disabled && styles.disabledText]}>
            {title}
          </Text>
          <Text style={styles.settingSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ false: "#E5E5E5", true: "#007AFF" }}
        thumbColor="#FFFFFF"
      />
    </View>
  );

  const renderTimeRow = (
    icon: string,
    title: string,
    subtitle: string,
    timeValue: string,
    onPress: () => void,
    disabled?: boolean
  ) => (
    <TouchableOpacity
      style={[styles.settingRow, disabled && styles.settingRowDisabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View style={styles.settingInfo}>
        <MaterialCommunityIcons
          name={icon as any}
          size={24}
          color={disabled ? "#999" : "#007AFF"}
          style={styles.settingIcon}
        />
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, disabled && styles.disabledText]}>
            {title}
          </Text>
          <Text style={styles.settingSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <Text style={styles.timeValue}>{timeValue}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaWrapper>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <MaterialCommunityIcons name="bell" size={48} color="#007AFF" />
          <Text style={styles.headerTitle}>Notification Settings</Text>
          <Text style={styles.headerSubtitle}>
            Customize your notification preferences
          </Text>
        </View>

        {/* Master Toggle */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>
          {renderSettingRow(
            "bell-ring",
            "Enable Notifications",
            "Receive all app notifications",
            settings.enabled,
            (value) => updateSetting("enabled", value)
          )}
          {renderSettingRow(
            "volume-high",
            "Sound",
            "Play sound for notifications",
            settings.soundEnabled,
            (value) => updateSetting("soundEnabled", value),
            !settings.enabled
          )}
          {renderSettingRow(
            "vibrate",
            "Vibration",
            "Vibrate for notifications",
            settings.vibrationEnabled,
            (value) => updateSetting("vibrationEnabled", value),
            !settings.enabled
          )}
        </View>

        {/* Notification Types */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Types</Text>
          {renderSettingRow(
            "alarm",
            "Task Reminders",
            "Get reminded about upcoming tasks",
            settings.taskReminders,
            (value) => updateSetting("taskReminders", value),
            !settings.enabled
          )}
          {renderSettingRow(
            "white-balance-sunny",
            "Daily Motivation",
            "Start your day with motivation",
            settings.dailyMotivation,
            (value) => updateSetting("dailyMotivation", value),
            !settings.enabled
          )}
          {renderTimeRow(
            "clock",
            "Motivation Time",
            "When to send daily motivation",
            settings.dailyMotivationTime,
            () => setShowMotivationTime(true),
            !settings.enabled || !settings.dailyMotivation
          )}
          {renderSettingRow(
            "fire",
            "Streak Reminders",
            "Don't break your streak!",
            settings.streakReminders,
            (value) => updateSetting("streakReminders", value),
            !settings.enabled
          )}
          {renderSettingRow(
            "trophy",
            "Achievements",
            "Celebrate your milestones",
            settings.achievementNotifications,
            (value) => updateSetting("achievementNotifications", value),
            !settings.enabled
          )}
          {renderSettingRow(
            "chart-bar",
            "Weekly Summary",
            "Get your weekly productivity report",
            settings.weeklySummary,
            (value) => updateSetting("weeklySummary", value),
            !settings.enabled
          )}
        </View>

        {/* Quiet Hours */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quiet Hours</Text>
          {renderSettingRow(
            "moon-waning-crescent",
            "Enable Quiet Hours",
            "Silence notifications during set times",
            settings.quietHoursEnabled,
            (value) => updateSetting("quietHoursEnabled", value),
            !settings.enabled
          )}
          {renderTimeRow(
            "weather-night",
            "Start Time",
            "When quiet hours begin",
            settings.quietHoursStart,
            () => setShowQuietStart(true),
            !settings.enabled || !settings.quietHoursEnabled
          )}
          {renderTimeRow(
            "weather-sunset",
            "End Time",
            "When quiet hours end",
            settings.quietHoursEnd,
            () => setShowQuietEnd(true),
            !settings.enabled || !settings.quietHoursEnabled
          )}
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.button, styles.testButton]}
            onPress={testNotification}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="bell-ring" size={20} color="#FFF" />
            <Text style={styles.buttonText}>Send Test Notification</Text>
          </TouchableOpacity>

          {!settings.enabled && (
            <TouchableOpacity
              style={[styles.button, styles.permissionButton]}
              onPress={requestPermissions}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="shield-check"
                size={20}
                color="#FFF"
              />
              <Text style={styles.buttonText}>Request Permissions</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Time Pickers */}
        {showQuietStart && (
          <DateTimePicker
            value={getDateFromTime(settings.quietHoursStart)}
            mode="time"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleQuietHoursStartChange}
          />
        )}
        {showQuietEnd && (
          <DateTimePicker
            value={getDateFromTime(settings.quietHoursEnd)}
            mode="time"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleQuietHoursEndChange}
          />
        )}
        {showMotivationTime && (
          <DateTimePicker
            value={getDateFromTime(settings.dailyMotivationTime)}
            mode="time"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleMotivationTimeChange}
          />
        )}
      </ScrollView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 24,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginTop: 16,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
  },
  section: {
    marginTop: 24,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#E5E5E5",
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#F8F9FA",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  settingRowDisabled: {
    opacity: 0.5,
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingIcon: {
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 13,
    color: "#666",
  },
  disabledText: {
    color: "#999",
  },
  timeValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
    marginLeft: 8,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  testButton: {
    backgroundColor: "#007AFF",
  },
  permissionButton: {
    backgroundColor: "#34C759",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
