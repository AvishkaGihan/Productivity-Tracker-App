/**
 * Spacing System
 * Consistent spacing scale based on 4px grid
 */

export const spacing = {
  // Base unit (4px)
  unit: 4,

  // Spacing Scale
  scale: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    9: 36,
    10: 40,
    12: 48,
    16: 64,
    20: 80,
    24: 96,
    32: 128,
  },

  // Named Spacing Values
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 48,
  "3xl": 64,

  // Component-specific Spacing
  components: {
    // Padding
    padding: {
      xs: 8,
      sm: 12,
      md: 16,
      lg: 20,
      xl: 24,
    },

    // Margins
    margin: {
      xs: 8,
      sm: 12,
      md: 16,
      lg: 20,
      xl: 24,
    },

    // Gap (for flexbox/grid)
    gap: {
      xs: 4,
      sm: 8,
      md: 12,
      lg: 16,
      xl: 20,
    },

    // Screen Edges
    screenPadding: {
      horizontal: 16,
      vertical: 20,
    },

    // Card Spacing
    card: {
      padding: 16,
      gap: 12,
    },

    // List Item Spacing
    listItem: {
      padding: 16,
      gap: 12,
    },

    // Button Spacing
    button: {
      paddingHorizontal: 24,
      paddingVertical: 12,
      gap: 8,
    },

    // Input Spacing
    input: {
      paddingHorizontal: 16,
      paddingVertical: 12,
    },

    // Section Spacing
    section: {
      marginBottom: 24,
      gap: 16,
    },
  },

  // Layout Spacing
  layout: {
    headerHeight: 60,
    tabBarHeight: 60,
    bottomNavHeight: 80,
    fabSize: 56,
    fabMargin: 16,
  },
} as const;

export type Spacing = typeof spacing;
