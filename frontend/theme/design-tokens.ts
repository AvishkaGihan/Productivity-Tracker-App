/**
 * Design Tokens - Complete Design System
 * Central source of truth for all design values
 */

export const designTokens = {
  // Extended Color Palette
  colors: {
    // Primary Colors
    primary: {
      main: "#007AFF",
      light: "#3395FF",
      dark: "#0051D5",
      contrast: "#FFFFFF",
    },
    secondary: {
      main: "#5856D6",
      light: "#7B79E8",
      dark: "#3634A3",
      contrast: "#FFFFFF",
    },
    accent: {
      main: "#FF9500",
      light: "#FFB340",
      dark: "#CC7700",
      contrast: "#FFFFFF",
    },

    // Semantic Colors
    success: {
      main: "#34C759",
      light: "#5DD97D",
      dark: "#28A745",
      contrast: "#FFFFFF",
    },
    warning: {
      main: "#FF9500",
      light: "#FFB340",
      dark: "#CC7700",
      contrast: "#FFFFFF",
    },
    error: {
      main: "#FF3B30",
      light: "#FF6259",
      dark: "#CC2F26",
      contrast: "#FFFFFF",
    },
    info: {
      main: "#007AFF",
      light: "#3395FF",
      dark: "#0051D5",
      contrast: "#FFFFFF",
    },

    // Neutral Colors - Light Theme
    light: {
      background: {
        primary: "#FFFFFF",
        secondary: "#F2F2F7",
        tertiary: "#E5E5EA",
      },
      surface: {
        primary: "#FFFFFF",
        secondary: "#F9F9F9",
        elevated: "#FFFFFF",
      },
      text: {
        primary: "#000000",
        secondary: "#3C3C43",
        tertiary: "#8E8E93",
        disabled: "#C7C7CC",
      },
      border: {
        primary: "#C6C6C8",
        secondary: "#E5E5EA",
        tertiary: "#F2F2F7",
      },
    },

    // Neutral Colors - Dark Theme
    dark: {
      background: {
        primary: "#000000",
        secondary: "#1C1C1E",
        tertiary: "#2C2C2E",
      },
      surface: {
        primary: "#1C1C1E",
        secondary: "#2C2C2E",
        elevated: "#3A3A3C",
      },
      text: {
        primary: "#FFFFFF",
        secondary: "#EBEBF5",
        tertiary: "#A0A0A0",
        disabled: "#545456",
      },
      border: {
        primary: "#38383A",
        secondary: "#2C2C2E",
        tertiary: "#1C1C1E",
      },
    },

    // Overlay Colors
    overlay: {
      light: "rgba(0, 0, 0, 0.4)",
      dark: "rgba(0, 0, 0, 0.7)",
      backdrop: "rgba(0, 0, 0, 0.5)",
    },

    // Status Colors
    status: {
      online: "#34C759",
      away: "#FF9500",
      busy: "#FF3B30",
      offline: "#8E8E93",
    },

    // Priority Colors
    priority: {
      high: "#FF3B30",
      medium: "#FF9500",
      low: "#007AFF",
      none: "#8E8E93",
    },
  },

  // Gradient Definitions
  gradients: {
    primary: ["#007AFF", "#5856D6"],
    success: ["#34C759", "#30D158"],
    warm: ["#FF9500", "#FF375F"],
    cool: ["#007AFF", "#5AC8FA"],
    dark: ["#1C1C1E", "#2C2C2E"],
    light: ["#FFFFFF", "#F2F2F7"],
    vibrant: ["#FF375F", "#FF9500", "#FFCC00"],
    ocean: ["#007AFF", "#5856D6", "#AF52DE"],
    sunset: ["#FF9500", "#FF375F", "#FF2D55"],
  },

  // Border Radius Scale
  radius: {
    none: 0,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    full: 9999,
  },

  // Shadow Depths (Elevation)
  shadows: {
    none: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    xs: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    sm: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
    xl: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.25,
      shadowRadius: 24,
      elevation: 12,
    },
  },

  // Opacity Scale
  opacity: {
    transparent: 0,
    light: 0.1,
    medium: 0.5,
    heavy: 0.8,
    opaque: 1,
  },

  // Border Width Scale
  borderWidth: {
    none: 0,
    thin: 1,
    medium: 2,
    thick: 4,
  },
} as const;

export type DesignTokens = typeof designTokens;
