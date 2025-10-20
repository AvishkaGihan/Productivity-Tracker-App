import AsyncStorage from "@react-native-async-storage/async-storage";
import { AccessibilityInfo } from "react-native";

const REDUCED_MOTION_KEY = "@reduced_motion";

class AccessibilityService {
  private screenReaderEnabled: boolean = false;
  private reducedMotionPreference: boolean = false;

  async initialize() {
    // Check screen reader status
    this.screenReaderEnabled = await AccessibilityInfo.isScreenReaderEnabled();

    // Listen for screen reader changes
    AccessibilityInfo.addEventListener("screenReaderChanged", (enabled) => {
      this.screenReaderEnabled = enabled;
    });

    // Load reduced motion preference
    try {
      const value = await AsyncStorage.getItem(REDUCED_MOTION_KEY);
      this.reducedMotionPreference = value === "true";
    } catch (error) {
      console.error("Failed to load reduced motion preference:", error);
    }
  }

  isScreenReaderEnabled(): boolean {
    return this.screenReaderEnabled;
  }

  async setReducedMotion(enabled: boolean) {
    this.reducedMotionPreference = enabled;
    try {
      await AsyncStorage.setItem(REDUCED_MOTION_KEY, String(enabled));
    } catch (error) {
      console.error("Failed to save reduced motion preference:", error);
    }
  }

  isReducedMotionEnabled(): boolean {
    return this.reducedMotionPreference;
  }

  // Announce message to screen reader
  announceForAccessibility(message: string) {
    AccessibilityInfo.announceForAccessibility(message);
  }
}

export const accessibilityService = new AccessibilityService();

// Accessibility label helpers
export const getAccessibilityLabel = (
  label: string,
  value?: string | number,
  hint?: string
): string => {
  let fullLabel = label;
  if (value !== undefined) {
    fullLabel += `, ${value}`;
  }
  if (hint) {
    fullLabel += `. ${hint}`;
  }
  return fullLabel;
};

// Check if color contrast meets WCAG AA standard (4.5:1 for normal text)
export const hasGoodContrast = (
  foreground: string,
  background: string,
  minRatio: number = 4.5
): boolean => {
  const fgLuminance = getRelativeLuminance(foreground);
  const bgLuminance = getRelativeLuminance(background);

  const ratio =
    (Math.max(fgLuminance, bgLuminance) + 0.05) /
    (Math.min(fgLuminance, bgLuminance) + 0.05);

  return ratio >= minRatio;
};

function getRelativeLuminance(hexColor: string): number {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return 0;

  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((val) => {
    val = val / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// Touch target size validator
export const isTouchTargetAccessible = (
  width: number,
  height: number
): boolean => {
  const MIN_SIZE = 44; // iOS HIG and Material Design recommendation
  return width >= MIN_SIZE && height >= MIN_SIZE;
};
