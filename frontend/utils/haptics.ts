import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";

const HAPTICS_ENABLED_KEY = "@haptics_enabled";

class HapticsService {
  private enabled: boolean = true;

  async initialize() {
    try {
      const value = await AsyncStorage.getItem(HAPTICS_ENABLED_KEY);
      this.enabled = value !== "false";
    } catch (error) {
      console.error("Failed to load haptics preference:", error);
    }
  }

  async setEnabled(enabled: boolean) {
    this.enabled = enabled;
    try {
      await AsyncStorage.setItem(HAPTICS_ENABLED_KEY, String(enabled));
    } catch (error) {
      console.error("Failed to save haptics preference:", error);
    }
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  // Light impact - for button presses, selections
  light() {
    if (!this.enabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  // Medium impact - for toggles, switches
  medium() {
    if (!this.enabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }

  // Heavy impact - for destructive actions, important confirmations
  heavy() {
    if (!this.enabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }

  // Success - for task completion, successful actions
  success() {
    if (!this.enabled) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  // Warning - for non-critical alerts
  warning() {
    if (!this.enabled) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  }

  // Error - for errors, failed actions
  error() {
    if (!this.enabled) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }

  // Selection - for picker selections, tab changes
  selection() {
    if (!this.enabled) return;
    Haptics.selectionAsync();
  }
}

export const haptics = new HapticsService();

// Convenience exports
export const triggerHaptic = {
  light: () => haptics.light(),
  medium: () => haptics.medium(),
  heavy: () => haptics.heavy(),
  success: () => haptics.success(),
  warning: () => haptics.warning(),
  error: () => haptics.error(),
  selection: () => haptics.selection(),
};
