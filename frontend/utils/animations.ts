/**
 * Animation utilities and constants
 * Centralized animation configurations for consistent animations across the app
 */

export const AnimationDurations = {
  fast: 150,
  normal: 300,
  slow: 500,
  verySlow: 800,
} as const;

export const AnimationEasing = {
  linear: "linear" as const,
  easeIn: "ease-in" as const,
  easeOut: "ease-out" as const,
  easeInOut: "ease-in-out" as const,
  spring: "spring" as const,
};

export const SpringConfigs = {
  gentle: {
    damping: 20,
    stiffness: 120,
    mass: 1,
  },
  bouncy: {
    damping: 10,
    stiffness: 150,
    mass: 1,
  },
  stiff: {
    damping: 30,
    stiffness: 200,
    mass: 1,
  },
} as const;

export const FadeAnimationConfig = {
  duration: AnimationDurations.normal,
  useNativeDriver: true,
};

export const ScaleAnimationConfig = {
  duration: AnimationDurations.fast,
  useNativeDriver: true,
};

export const SlideAnimationConfig = {
  duration: AnimationDurations.normal,
  useNativeDriver: true,
};

// Animation presets
export const AnimationPresets = {
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  fadeOut: {
    from: { opacity: 1 },
    to: { opacity: 0 },
  },
  slideInUp: {
    from: { translateY: 20, opacity: 0 },
    to: { translateY: 0, opacity: 1 },
  },
  slideInDown: {
    from: { translateY: -20, opacity: 0 },
    to: { translateY: 0, opacity: 1 },
  },
  slideInLeft: {
    from: { translateX: -20, opacity: 0 },
    to: { translateX: 0, opacity: 1 },
  },
  slideInRight: {
    from: { translateX: 20, opacity: 0 },
    to: { translateX: 0, opacity: 1 },
  },
  scaleIn: {
    from: { scale: 0.9, opacity: 0 },
    to: { scale: 1, opacity: 1 },
  },
  scaleOut: {
    from: { scale: 1, opacity: 1 },
    to: { scale: 0.9, opacity: 0 },
  },
} as const;

// Stagger delay for list animations
export const getStaggerDelay = (
  index: number,
  baseDelay: number = 50
): number => {
  return index * baseDelay;
};

// Spring animation helper
export const createSpringAnimation = (
  toValue: number,
  config = SpringConfigs.gentle
) => {
  return {
    toValue,
    ...config,
    useNativeDriver: true,
  };
};
