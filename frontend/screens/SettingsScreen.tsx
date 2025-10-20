import React, { useState } from "react";
import { Alert, Linking, ScrollView, StyleSheet, View } from "react-native";
import { Avatar, Button, Divider, Text } from "react-native-paper";
import {
  SettingItem,
  SettingsSection,
  ThemePreview,
} from "../components/settings";
import { useAuthStore } from "../store/auth-store";
import { useTheme } from "../theme/ThemeContext";

export default function SettingsScreen() {
  const { theme } = useTheme();
  const { user, logout } = useAuthStore();

  // Settings state
  const [notifications, setNotifications] = useState(true);
  const [taskReminders, setTaskReminders] = useState(true);
  const [dailySummary, setDailySummary] = useState(true);
  const [achievementAlerts, setAchievementAlerts] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState("dark");
  const [autoArchive, setAutoArchive] = useState(false);
  const [showSubtasks, setShowSubtasks] = useState(true);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => logout(),
      },
    ]);
  };

  const handleExportData = () => {
    Alert.alert("Export Data", "Your data export will be sent to your email.");
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This action cannot be undone. All your data will be permanently deleted.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            Alert.alert("Account Deleted", "Your account has been deleted.");
            logout();
          },
        },
      ]
    );
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View
          style={[
            styles.profileHeader,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <Avatar.Text
            size={80}
            label={user?.email?.substring(0, 2).toUpperCase() || "U"}
          />
          <Text
            variant="headlineSmall"
            style={[styles.username, { color: theme.colors.text }]}
          >
            {user?.email?.split("@")[0] || "User"}
          </Text>
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.textSecondary }}
          >
            {user?.email || "user@example.com"}
          </Text>
          <Button
            mode="outlined"
            onPress={() => Alert.alert("Edit Profile", "Coming soon!")}
            style={styles.editButton}
          >
            Edit Profile
          </Button>
        </View>

        {/* Appearance */}
        <SettingsSection title="Appearance">
          <View style={{ padding: 16 }}>
            <Text
              variant="bodyMedium"
              style={[styles.sectionSubtitle, { color: theme.colors.text }]}
            >
              Choose your theme
            </Text>
            <ThemePreview
              selectedTheme={selectedTheme}
              onSelectTheme={setSelectedTheme}
            />
          </View>
          <Divider />
          <SettingItem
            icon="brightness-6"
            label="Dark Mode"
            type="toggle"
            value={darkMode}
            onToggle={setDarkMode}
            showDivider={false}
          />
        </SettingsSection>

        {/* Notifications */}
        <SettingsSection title="Notifications">
          <SettingItem
            icon="bell"
            label="Push Notifications"
            type="toggle"
            value={notifications}
            onToggle={setNotifications}
            iconColor="#FF9500"
          />
          <SettingItem
            icon="clock-alert"
            label="Task Reminders"
            type="toggle"
            value={taskReminders}
            onToggle={setTaskReminders}
            iconColor="#007AFF"
          />
          <SettingItem
            icon="email"
            label="Daily Summary"
            type="toggle"
            value={dailySummary}
            onToggle={setDailySummary}
            iconColor="#5856D6"
          />
          <SettingItem
            icon="trophy"
            label="Achievement Alerts"
            type="toggle"
            value={achievementAlerts}
            onToggle={setAchievementAlerts}
            iconColor="#FFD700"
            showDivider={false}
          />
        </SettingsSection>

        {/* Tasks & Productivity */}
        <SettingsSection title="Tasks & Productivity">
          <SettingItem
            icon="archive"
            label="Auto-Archive Completed"
            type="toggle"
            value={autoArchive}
            onToggle={setAutoArchive}
            iconColor="#34C759"
          />
          <SettingItem
            icon="format-list-checkbox"
            label="Show Subtasks"
            type="toggle"
            value={showSubtasks}
            onToggle={setShowSubtasks}
            iconColor="#007AFF"
          />
          <SettingItem
            icon="sort"
            label="Default Sort"
            type="value"
            value="Priority"
            onPress={() => Alert.alert("Sort Options", "Coming soon!")}
            iconColor="#5856D6"
          />
          <SettingItem
            icon="view-grid"
            label="Default View"
            type="value"
            value="List"
            onPress={() => Alert.alert("View Options", "Coming soon!")}
            iconColor="#FF9500"
            showDivider={false}
          />
        </SettingsSection>

        {/* AI Preferences */}
        <SettingsSection title="AI Preferences">
          <SettingItem
            icon="robot"
            label="AI Assistant"
            type="value"
            value="Advanced"
            onPress={() => Alert.alert("AI Settings", "Coming soon!")}
            iconColor="#9C27B0"
          />
          <SettingItem
            icon="lightning-bolt"
            label="Suggestion Frequency"
            type="value"
            value="Medium"
            onPress={() => Alert.alert("Frequency Settings", "Coming soon!")}
            iconColor="#FF9500"
            showDivider={false}
          />
        </SettingsSection>

        {/* Privacy & Security */}
        <SettingsSection title="Privacy & Security">
          <SettingItem
            icon="lock"
            label="Change Password"
            type="navigation"
            onPress={() => Alert.alert("Change Password", "Coming soon!")}
            iconColor="#FF3B30"
          />
          <SettingItem
            icon="fingerprint"
            label="Biometric Lock"
            type="navigation"
            onPress={() => Alert.alert("Biometric Settings", "Coming soon!")}
            iconColor="#34C759"
          />
          <SettingItem
            icon="shield-check"
            label="Privacy Policy"
            type="navigation"
            onPress={() => Linking.openURL("https://example.com/privacy")}
            iconColor="#007AFF"
          />
          <SettingItem
            icon="file-document"
            label="Terms of Service"
            type="navigation"
            onPress={() => Linking.openURL("https://example.com/terms")}
            iconColor="#5856D6"
            showDivider={false}
          />
        </SettingsSection>

        {/* Data & Storage */}
        <SettingsSection title="Data & Storage">
          <SettingItem
            icon="download"
            label="Export Data"
            type="navigation"
            onPress={handleExportData}
            iconColor="#34C759"
          />
          <SettingItem
            icon="backup-restore"
            label="Backup & Restore"
            type="navigation"
            onPress={() => Alert.alert("Backup", "Coming soon!")}
            iconColor="#007AFF"
          />
          <SettingItem
            icon="delete-sweep"
            label="Clear Cache"
            type="navigation"
            onPress={() => Alert.alert("Success", "Cache cleared!")}
            iconColor="#FF9500"
            showDivider={false}
          />
        </SettingsSection>

        {/* Help & Support */}
        <SettingsSection title="Help & Support">
          <SettingItem
            icon="help-circle"
            label="Help Center"
            type="navigation"
            onPress={() => Alert.alert("Help Center", "Coming soon!")}
            iconColor="#007AFF"
          />
          <SettingItem
            icon="message-text"
            label="Contact Support"
            type="navigation"
            onPress={() =>
              Alert.alert("Contact Support", "Email: support@example.com")
            }
            iconColor="#34C759"
          />
          <SettingItem
            icon="star"
            label="Rate App"
            type="navigation"
            onPress={() =>
              Alert.alert("Rate App", "Thank you for your support!")
            }
            iconColor="#FFD700"
          />
          <SettingItem
            icon="share-variant"
            label="Share App"
            type="navigation"
            onPress={() => Alert.alert("Share", "Coming soon!")}
            iconColor="#5856D6"
            showDivider={false}
          />
        </SettingsSection>

        {/* About */}
        <SettingsSection title="About">
          <SettingItem
            icon="information"
            label="Version"
            type="value"
            value="1.0.0"
            onPress={() => {}}
            iconColor="#8E8E93"
          />
          <SettingItem
            icon="code-tags"
            label="Open Source Licenses"
            type="navigation"
            onPress={() => Alert.alert("Licenses", "Coming soon!")}
            iconColor="#007AFF"
            showDivider={false}
          />
        </SettingsSection>

        {/* Danger Zone */}
        <View
          style={[styles.dangerZone, { backgroundColor: theme.colors.surface }]}
        >
          <Button
            mode="outlined"
            onPress={handleLogout}
            style={[styles.dangerButton, { borderColor: theme.colors.error }]}
            textColor={theme.colors.error}
            icon="logout"
          >
            Logout
          </Button>
          <Button
            mode="outlined"
            onPress={handleDeleteAccount}
            style={[styles.dangerButton, { borderColor: theme.colors.error }]}
            textColor={theme.colors.error}
            icon="delete"
          >
            Delete Account
          </Button>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    alignItems: "center",
    padding: 24,
    marginBottom: 24,
  },
  username: {
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 4,
  },
  editButton: {
    marginTop: 16,
  },
  sectionSubtitle: {
    marginBottom: 16,
  },
  dangerZone: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  dangerButton: {
    borderWidth: 2,
  },
});
