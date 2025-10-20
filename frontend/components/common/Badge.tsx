/**
 * Badge Component
 * Status and count badges with variants
 */

import React from "react";
import { Text, TextStyle, View, ViewStyle } from "react-native";
import { useTheme } from "../../theme";

export type BadgeVariant =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "info";
export type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "primary",
  size = "md",
  dot = false,
  style,
  textStyle,
}) => {
  const { theme } = useTheme();

  const getVariantColor = (): string => {
    const colors: Record<BadgeVariant, string> = {
      primary: theme.colors.primary,
      secondary: theme.colors.secondary,
      success: theme.colors.success,
      warning: theme.colors.warning,
      error: theme.colors.error,
      info: theme.colors.info,
    };
    return colors[variant];
  };

  const getSizeStyle = (): ViewStyle => {
    const sizes: Record<BadgeSize, ViewStyle> = {
      sm: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        minWidth: dot ? 8 : 20,
        height: dot ? 8 : 20,
      },
      md: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        minWidth: dot ? 10 : 24,
        height: dot ? 10 : 24,
      },
      lg: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        minWidth: dot ? 12 : 28,
        height: dot ? 12 : 28,
      },
    };
    return sizes[size];
  };

  const getTextSize = (): number => {
    const sizes: Record<BadgeSize, number> = {
      sm: 10,
      md: 12,
      lg: 14,
    };
    return sizes[size];
  };

  const badgeStyle: ViewStyle = {
    backgroundColor: getVariantColor(),
    borderRadius: theme.radius.full,
    alignItems: "center",
    justifyContent: "center",
    ...getSizeStyle(),
  };

  const badgeTextStyle: TextStyle = {
    color: "#FFFFFF",
    fontSize: getTextSize(),
    fontWeight: theme.typography.weights.semiBold,
  };

  if (dot) {
    return <View style={[badgeStyle, style]} />;
  }

  return (
    <View style={[badgeStyle, style]}>
      <Text style={[badgeTextStyle, textStyle]}>{children}</Text>
    </View>
  );
};
