/**
 * Animation System
 * Animation timing, easing functions, and presets
 */

import { Easing } from "react-native";

export const animations = {
  // Duration presets
  duration: {
    instant: 0,
    fastest: 100,
    fast: 150,
    normal: 300,
    slow: 500,
    slower: 700,
    slowest: 1000,
  },

  // Easing functions
  easing: {
    // Standard easing
    linear: Easing.linear,
    ease: Easing.ease,
    easeIn: Easing.in(Easing.ease),
    easeOut: Easing.out(Easing.ease),
    easeInOut: Easing.inOut(Easing.ease),

    // Quad easing
    quadIn: Easing.in(Easing.quad),
    quadOut: Easing.out(Easing.quad),
    quadInOut: Easing.inOut(Easing.quad),

    // Cubic easing
    cubicIn: Easing.in(Easing.cubic),
    cubicOut: Easing.out(Easing.cubic),
    cubicInOut: Easing.inOut(Easing.cubic),

    // Elastic easing
    elasticIn: Easing.in(Easing.elastic(1)),
    elasticOut: Easing.out(Easing.elastic(1)),
    elasticInOut: Easing.inOut(Easing.elastic(1)),

    // Bounce easing
    bounceIn: Easing.in(Easing.bounce),
    bounceOut: Easing.out(Easing.bounce),
    bounceInOut: Easing.inOut(Easing.bounce),

    // Back easing
    backIn: Easing.in(Easing.back(1.5)),
    backOut: Easing.out(Easing.back(1.5)),
    backInOut: Easing.inOut(Easing.back(1.5)),

    // Bezier curves (Material Design)
    standardCurve: Easing.bezier(0.4, 0.0, 0.2, 1),
    decelerationCurve: Easing.bezier(0.0, 0.0, 0.2, 1),
    accelerationCurve: Easing.bezier(0.4, 0.0, 1, 1),
    sharpCurve: Easing.bezier(0.4, 0.0, 0.6, 1),
  },

  // Animation presets
  presets: {
    // Fade animations
    fadeIn: {
      duration: 300,
      easing: Easing.out(Easing.ease),
    },
    fadeOut: {
      duration: 200,
      easing: Easing.in(Easing.ease),
    },

    // Slide animations
    slideInUp: {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    },
    slideInDown: {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    },
    slideInLeft: {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    },
    slideInRight: {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    },

    // Scale animations
    scaleIn: {
      duration: 300,
      easing: Easing.out(Easing.back(1.5)),
    },
    scaleOut: {
      duration: 200,
      easing: Easing.in(Easing.cubic),
    },

    // Bounce animations
    bounceIn: {
      duration: 500,
      easing: Easing.out(Easing.bounce),
    },

    // Spring animations
    spring: {
      duration: 400,
      easing: Easing.elastic(1),
    },

    // Press animations
    pressIn: {
      duration: 100,
      easing: Easing.out(Easing.quad),
    },
    pressOut: {
      duration: 150,
      easing: Easing.in(Easing.quad),
    },

    // Modal animations
    modalIn: {
      duration: 300,
      easing: Easing.bezier(0.0, 0.0, 0.2, 1),
    },
    modalOut: {
      duration: 250,
      easing: Easing.bezier(0.4, 0.0, 1, 1),
    },

    // Loading animations
    pulse: {
      duration: 1000,
      easing: Easing.inOut(Easing.ease),
    },
    shimmer: {
      duration: 1500,
      easing: Easing.linear,
    },
  },

  // Transition configs
  transitions: {
    default: {
      duration: 300,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1),
    },
    quick: {
      duration: 150,
      easing: Easing.out(Easing.ease),
    },
    slow: {
      duration: 500,
      easing: Easing.bezier(0.0, 0.0, 0.2, 1),
    },
  },

  // Gesture animations
  gestures: {
    swipe: {
      duration: 200,
      easing: Easing.out(Easing.ease),
    },
    drag: {
      duration: 0,
      easing: Easing.linear,
    },
    fling: {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    },
  },

  // Loading states
  loading: {
    spinner: {
      duration: 1000,
      easing: Easing.linear,
    },
    skeleton: {
      duration: 1500,
      easing: Easing.inOut(Easing.ease),
    },
    progressBar: {
      duration: 300,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1),
    },
  },

  // Micro-interactions
  microInteractions: {
    buttonPress: {
      scaleValue: 0.95,
      duration: 100,
      easing: Easing.out(Easing.quad),
    },
    cardPress: {
      scaleValue: 0.98,
      duration: 150,
      easing: Easing.out(Easing.quad),
    },
    checkboxCheck: {
      duration: 200,
      easing: Easing.out(Easing.back(1.5)),
    },
    switchToggle: {
      duration: 200,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1),
    },
    ripple: {
      duration: 300,
      easing: Easing.out(Easing.ease),
    },
  },

  // Stagger delays for list animations
  stagger: {
    fast: 50,
    normal: 100,
    slow: 150,
  },
} as const;

export type Animations = typeof animations;
