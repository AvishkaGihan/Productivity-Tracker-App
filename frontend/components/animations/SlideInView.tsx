import React, { useEffect, useRef } from "react";
import { Animated, ViewStyle } from "react-native";
import { AnimationDurations } from "../../utils/animations";

interface SlideInViewProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  from?: "top" | "bottom" | "left" | "right";
  distance?: number;
  style?: ViewStyle;
}

export const SlideInView: React.FC<SlideInViewProps> = ({
  children,
  delay = 0,
  duration = AnimationDurations.normal,
  from = "bottom",
  distance = 20,
  style,
}) => {
  const slideAnim = useRef(new Animated.Value(distance)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [slideAnim, fadeAnim, delay, duration]);

  const getTransform = () => {
    switch (from) {
      case "top":
        return {
          translateY: slideAnim.interpolate({
            inputRange: [-distance, 0],
            outputRange: [-distance, 0],
          }),
        };
      case "bottom":
        return { translateY: slideAnim };
      case "left":
        return {
          translateX: slideAnim.interpolate({
            inputRange: [-distance, 0],
            outputRange: [-distance, 0],
          }),
        };
      case "right":
        return { translateX: slideAnim };
      default:
        return { translateY: slideAnim };
    }
  };

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: fadeAnim,
          transform: [getTransform()],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};
