/**
 * Loading State Component
 * Loading skeletons and placeholders
 */

import React, { useEffect, useRef } from "react";
import { Animated, View, ViewStyle } from "react-native";
import { useTheme } from "../../theme";

export type LoadingVariant = "text" | "circle" | "rectangular";

interface LoadingStateProps {
  variant?: LoadingVariant;
  width?: number | string;
  height?: number;
  style?: ViewStyle;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  variant = "rectangular",
  width = "100%",
  height = 20,
  style,
}) => {
  const { theme } = useTheme();
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const getVariantStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: theme.colors.surfaceSecondary,
      width: width as any,
      height,
    };

    switch (variant) {
      case "circle":
        return {
          ...baseStyle,
          borderRadius: typeof width === "number" ? width / 2 : 50,
          width: height,
        };
      case "text":
        return {
          ...baseStyle,
          borderRadius: theme.radius.xs,
        };
      case "rectangular":
      default:
        return {
          ...baseStyle,
          borderRadius: theme.radius.sm,
        };
    }
  };

  return <Animated.View style={[getVariantStyle(), { opacity }, style]} />;
};

// Skeleton screen component
interface SkeletonProps {
  children?: React.ReactNode;
  loading?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  children,
  loading = true,
}) => {
  if (!loading) {
    return <>{children}</>;
  }

  return (
    <View>
      <LoadingState variant="text" height={24} style={{ marginBottom: 12 }} />
      <LoadingState variant="text" height={16} style={{ marginBottom: 8 }} />
      <LoadingState variant="text" height={16} width="80%" />
    </View>
  );
};
