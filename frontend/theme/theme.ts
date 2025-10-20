/**
 * Theme System
 * Complete theme with light/dark mode support and theme variations
 */

import { animations } from "./animations";
import { designTokens } from "./design-tokens";
import { shadows } from "./shadows";
import { spacing } from "./spacing";
import { typography } from "./typography";

export type ThemeMode = "light" | "dark";
export type ThemeVariant = "default" | "professional" | "vibrant" | "minimal";

export interface Theme {
  mode: ThemeMode;
  variant: ThemeVariant;
  colors: {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    secondary: string;
    secondaryLight: string;
    secondaryDark: string;
    accent: string;
    accentLight: string;
    accentDark: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    background: string;
    backgroundSecondary: string;
    backgroundTertiary: string;
    surface: string;
    surfaceSecondary: string;
    surfaceElevated: string;
    text: string;
    textSecondary: string;
    textTertiary: string;
    textDisabled: string;
    border: string;
    borderSecondary: string;
    borderTertiary: string;
    overlay: string;
    backdrop: string;
  };
  gradients: typeof designTokens.gradients;
  radius: typeof designTokens.radius;
  spacing: typeof spacing;
  typography: typeof typography;
  shadows: typeof shadows;
  animations: typeof animations;
}

// Light Theme
const createLightTheme = (variant: ThemeVariant): Theme => {
  const baseColors = {
    primary: designTokens.colors.primary.main,
    primaryLight: designTokens.colors.primary.light,
    primaryDark: designTokens.colors.primary.dark,
    secondary: designTokens.colors.secondary.main,
    secondaryLight: designTokens.colors.secondary.light,
    secondaryDark: designTokens.colors.secondary.dark,
    accent: designTokens.colors.accent.main,
    accentLight: designTokens.colors.accent.light,
    accentDark: designTokens.colors.accent.dark,
    success: designTokens.colors.success.main,
    warning: designTokens.colors.warning.main,
    error: designTokens.colors.error.main,
    info: designTokens.colors.info.main,
    background: designTokens.colors.light.background.primary,
    backgroundSecondary: designTokens.colors.light.background.secondary,
    backgroundTertiary: designTokens.colors.light.background.tertiary,
    surface: designTokens.colors.light.surface.primary,
    surfaceSecondary: designTokens.colors.light.surface.secondary,
    surfaceElevated: designTokens.colors.light.surface.elevated,
    text: designTokens.colors.light.text.primary,
    textSecondary: designTokens.colors.light.text.secondary,
    textTertiary: designTokens.colors.light.text.tertiary,
    textDisabled: designTokens.colors.light.text.disabled,
    border: designTokens.colors.light.border.primary,
    borderSecondary: designTokens.colors.light.border.secondary,
    borderTertiary: designTokens.colors.light.border.tertiary,
    overlay: designTokens.colors.overlay.light,
    backdrop: designTokens.colors.overlay.backdrop,
  };

  // Apply variant modifications
  const colors = applyVariant(baseColors, variant);

  return {
    mode: "light",
    variant,
    colors,
    gradients: designTokens.gradients,
    radius: designTokens.radius,
    spacing,
    typography,
    shadows,
    animations,
  };
};

// Dark Theme
const createDarkTheme = (variant: ThemeVariant): Theme => {
  const baseColors = {
    primary: designTokens.colors.primary.main,
    primaryLight: designTokens.colors.primary.light,
    primaryDark: designTokens.colors.primary.dark,
    secondary: designTokens.colors.secondary.main,
    secondaryLight: designTokens.colors.secondary.light,
    secondaryDark: designTokens.colors.secondary.dark,
    accent: designTokens.colors.accent.main,
    accentLight: designTokens.colors.accent.light,
    accentDark: designTokens.colors.accent.dark,
    success: designTokens.colors.success.main,
    warning: designTokens.colors.warning.main,
    error: designTokens.colors.error.main,
    info: designTokens.colors.info.main,
    background: designTokens.colors.dark.background.primary,
    backgroundSecondary: designTokens.colors.dark.background.secondary,
    backgroundTertiary: designTokens.colors.dark.background.tertiary,
    surface: designTokens.colors.dark.surface.primary,
    surfaceSecondary: designTokens.colors.dark.surface.secondary,
    surfaceElevated: designTokens.colors.dark.surface.elevated,
    text: designTokens.colors.dark.text.primary,
    textSecondary: designTokens.colors.dark.text.secondary,
    textTertiary: designTokens.colors.dark.text.tertiary,
    textDisabled: designTokens.colors.dark.text.disabled,
    border: designTokens.colors.dark.border.primary,
    borderSecondary: designTokens.colors.dark.border.secondary,
    borderTertiary: designTokens.colors.dark.border.tertiary,
    overlay: designTokens.colors.overlay.dark,
    backdrop: designTokens.colors.overlay.backdrop,
  };

  // Apply variant modifications
  const colors = applyVariant(baseColors, variant);

  return {
    mode: "dark",
    variant,
    colors,
    gradients: designTokens.gradients,
    radius: designTokens.radius,
    spacing,
    typography,
    shadows,
    animations,
  };
};

// Apply theme variant modifications
function applyVariant(baseColors: any, variant: ThemeVariant) {
  switch (variant) {
    case "professional":
      return {
        ...baseColors,
        primary: "#2563EB", // Blue
        secondary: "#475569", // Slate
        accent: "#0891B2", // Cyan
      };

    case "vibrant":
      return {
        ...baseColors,
        primary: "#EC4899", // Pink
        secondary: "#8B5CF6", // Purple
        accent: "#F59E0B", // Amber
      };

    case "minimal":
      return {
        ...baseColors,
        primary: "#18181B", // Zinc
        secondary: "#52525B", // Gray
        accent: "#71717A", // Neutral
      };

    default:
      return baseColors;
  }
}

// Theme presets
export const themes = {
  light: {
    default: createLightTheme("default"),
    professional: createLightTheme("professional"),
    vibrant: createLightTheme("vibrant"),
    minimal: createLightTheme("minimal"),
  },
  dark: {
    default: createDarkTheme("default"),
    professional: createDarkTheme("professional"),
    vibrant: createDarkTheme("vibrant"),
    minimal: createDarkTheme("minimal"),
  },
};

// Default theme
export const defaultTheme = themes.dark.default;
