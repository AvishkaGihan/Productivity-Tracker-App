/**
 * Typography System
 * Comprehensive typography scale and text styles
 */

export const typography = {
  // Font Families
  fonts: {
    primary: {
      regular: "System",
      medium: "System",
      semiBold: "System",
      bold: "System",
    },
    mono: "Courier New",
  },

  // Font Weights
  weights: {
    light: "300" as const,
    regular: "400" as const,
    medium: "500" as const,
    semiBold: "600" as const,
    bold: "700" as const,
    extraBold: "800" as const,
  },

  // Font Sizes
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
    "4xl": 36,
    "5xl": 48,
    "6xl": 60,
  },

  // Line Heights
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },

  // Letter Spacing
  letterSpacing: {
    tighter: -0.5,
    tight: -0.25,
    normal: 0,
    wide: 0.25,
    wider: 0.5,
    widest: 1,
  },

  // Text Styles - Headings
  styles: {
    h1: {
      fontSize: 36,
      fontWeight: "700" as const,
      lineHeight: 1.2,
      letterSpacing: -0.5,
    },
    h2: {
      fontSize: 30,
      fontWeight: "700" as const,
      lineHeight: 1.3,
      letterSpacing: -0.25,
    },
    h3: {
      fontSize: 24,
      fontWeight: "600" as const,
      lineHeight: 1.4,
      letterSpacing: 0,
    },
    h4: {
      fontSize: 20,
      fontWeight: "600" as const,
      lineHeight: 1.4,
      letterSpacing: 0,
    },
    h5: {
      fontSize: 18,
      fontWeight: "600" as const,
      lineHeight: 1.5,
      letterSpacing: 0,
    },
    h6: {
      fontSize: 16,
      fontWeight: "600" as const,
      lineHeight: 1.5,
      letterSpacing: 0,
    },

    // Body Text
    body1: {
      fontSize: 16,
      fontWeight: "400" as const,
      lineHeight: 1.5,
      letterSpacing: 0,
    },
    body2: {
      fontSize: 14,
      fontWeight: "400" as const,
      lineHeight: 1.5,
      letterSpacing: 0,
    },

    // Utility Text
    subtitle1: {
      fontSize: 16,
      fontWeight: "500" as const,
      lineHeight: 1.5,
      letterSpacing: 0.15,
    },
    subtitle2: {
      fontSize: 14,
      fontWeight: "500" as const,
      lineHeight: 1.5,
      letterSpacing: 0.1,
    },
    caption: {
      fontSize: 12,
      fontWeight: "400" as const,
      lineHeight: 1.5,
      letterSpacing: 0.4,
    },
    overline: {
      fontSize: 12,
      fontWeight: "600" as const,
      lineHeight: 1.5,
      letterSpacing: 1,
      textTransform: "uppercase" as const,
    },
    button: {
      fontSize: 16,
      fontWeight: "600" as const,
      lineHeight: 1.5,
      letterSpacing: 0.5,
      textTransform: "uppercase" as const,
    },

    // Special Styles
    label: {
      fontSize: 14,
      fontWeight: "500" as const,
      lineHeight: 1.5,
      letterSpacing: 0.25,
    },
    input: {
      fontSize: 16,
      fontWeight: "400" as const,
      lineHeight: 1.5,
      letterSpacing: 0,
    },
    link: {
      fontSize: 16,
      fontWeight: "500" as const,
      lineHeight: 1.5,
      letterSpacing: 0,
      textDecorationLine: "underline" as const,
    },
    code: {
      fontSize: 14,
      fontWeight: "400" as const,
      lineHeight: 1.5,
      letterSpacing: 0,
      fontFamily: "Courier New",
    },
  },
} as const;

export type Typography = typeof typography;
