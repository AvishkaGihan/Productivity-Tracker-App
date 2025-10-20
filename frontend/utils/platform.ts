import { Platform } from "react-native";

/**
 * Platform-specific value selector
 */
export function platformSelect<T>(values: {
  ios?: T;
  android?: T;
  web?: T;
  default?: T;
}): T | undefined {
  const platform = Platform.OS;
  if (platform === "ios" && values.ios !== undefined) return values.ios;
  if (platform === "android" && values.android !== undefined)
    return values.android;
  if (platform === "web" && values.web !== undefined) return values.web;
  return values.default;
}

/**
 * iOS specific value
 */
export function ios<T>(value: T): T | undefined {
  return Platform.OS === "ios" ? value : undefined;
}

/**
 * Android specific value
 */
export function android<T>(value: T): T | undefined {
  return Platform.OS === "android" ? value : undefined;
}

/**
 * Platform-specific font family
 */
export const fontFamily = {
  regular: platformSelect({
    ios: "System",
    android: "Roboto",
    default: "System",
  }),
  medium: platformSelect({
    ios: "System",
    android: "Roboto-Medium",
    default: "System",
  }),
  bold: platformSelect({
    ios: "System",
    android: "Roboto-Bold",
    default: "System",
  }),
  monospace: platformSelect({
    ios: "Menlo",
    android: "monospace",
    default: "monospace",
  }),
};

/**
 * Platform-specific button height
 */
export const buttonHeight = platformSelect({
  ios: 48,
  android: 42,
  default: 44,
});

/**
 * Platform-specific input height
 */
export const inputHeight = platformSelect({
  ios: 44,
  android: 56,
  default: 48,
});

/**
 * Check if running on specific platform
 */
export const isIOS = Platform.OS === "ios";
export const isAndroid = Platform.OS === "android";
export const isWeb = Platform.OS === "web";

/**
 * Get platform-specific shadow
 */
export const platformShadow = (elevation: number) => {
  if (Platform.OS === "ios") {
    return {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: elevation / 2,
      },
      shadowOpacity: 0.1 + elevation * 0.03,
      shadowRadius: elevation * 0.8,
    };
  }
  return {
    elevation,
  };
};

/**
 * Platform-specific ripple effect
 */
export const platformRipple = (color: string) => {
  if (Platform.OS === "android" && Platform.Version >= 21) {
    return {
      android_ripple: {
        color,
        borderless: false,
      },
    };
  }
  return {};
};
