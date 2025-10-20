import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { useTheme } from "../../theme";

interface CircularProgressProps {
  size?: number;
  strokeWidth?: number;
  progress: number; // 0-100
  color?: string;
  backgroundColor?: string;
  showPercentage?: boolean;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  size = 120,
  strokeWidth = 12,
  progress,
  color,
  backgroundColor,
  showPercentage = true,
}) => {
  const { theme } = useTheme();
  const animatedValue = useRef(new Animated.Value(0)).current;

  const circleColor = color || theme.colors.primary;
  const bgColor = backgroundColor || theme.colors.surface;

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const rotation = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Background Circle */}
      <View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: bgColor,
            opacity: 0.3,
          },
        ]}
      />

      {/* Progress Circle - Simplified visual */}
      <Animated.View
        style={[
          styles.progressCircle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: circleColor,
            borderTopColor: "transparent",
            borderRightColor: progress > 25 ? circleColor : "transparent",
            borderBottomColor: progress > 50 ? circleColor : "transparent",
            borderLeftColor: progress > 75 ? circleColor : "transparent",
            transform: [{ rotate: rotation }],
          },
        ]}
      />

      {showPercentage && (
        <View style={styles.textContainer}>
          <Text style={[styles.percentage, { color: circleColor }]}>
            {Math.round(progress)}%
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  circle: {
    position: "absolute",
  },
  progressCircle: {
    position: "absolute",
  },
  textContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  percentage: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
