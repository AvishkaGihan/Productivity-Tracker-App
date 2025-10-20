/**
 * Enhanced Card Component
 * Custom card with press states, variants, and elevation
 */

import React from "react";
import { TouchableOpacity, View, ViewStyle } from "react-native";
import { useTheme } from "../../theme";

export type CardVariant = "elevated" | "outlined" | "filled";

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: CardVariant;
  elevated?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  variant = "elevated",
  elevated = true,
  style,
  contentStyle,
}) => {
  const { theme } = useTheme();
  const [pressed, setPressed] = React.useState(false);

  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: theme.radius.lg,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surface,
    };

    const variantStyles: Record<CardVariant, ViewStyle> = {
      elevated: {
        ...theme.shadows.md,
        backgroundColor: theme.colors.surface,
      },
      outlined: {
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.surface,
      },
      filled: {
        backgroundColor: theme.colors.surfaceSecondary,
      },
    };

    return {
      ...baseStyle,
      ...variantStyles[variant],
      ...(elevated && variant === "elevated" && theme.shadows.lg),
      ...(pressed && {
        transform: [{ scale: 0.98 }],
        ...theme.shadows.sm,
      }),
    };
  };

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        activeOpacity={0.9}
        style={[getCardStyle(), style]}
      >
        <View style={contentStyle}>{children}</View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[getCardStyle(), style]}>
      <View style={contentStyle}>{children}</View>
    </View>
  );
};
