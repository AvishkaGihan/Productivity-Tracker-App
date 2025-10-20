/**
 * Avatar Component
 * User avatar with image, initials, or icon support
 */

import React from "react";
import { Image, Text, TextStyle, View, ViewStyle } from "react-native";
import { useTheme } from "../../theme";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

interface AvatarProps {
  source?: { uri: string };
  initials?: string;
  icon?: React.ReactNode;
  size?: AvatarSize;
  backgroundColor?: string;
  style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  initials,
  icon,
  size = "md",
  backgroundColor,
  style,
}) => {
  const { theme } = useTheme();

  const getSizeValue = (): number => {
    const sizes: Record<AvatarSize, number> = {
      xs: 24,
      sm: 32,
      md: 40,
      lg: 56,
      xl: 80,
    };
    return sizes[size];
  };

  const getFontSize = (): number => {
    const sizes: Record<AvatarSize, number> = {
      xs: 10,
      sm: 14,
      md: 16,
      lg: 24,
      xl: 32,
    };
    return sizes[size];
  };

  const sizeValue = getSizeValue();

  const containerStyle: ViewStyle = {
    width: sizeValue,
    height: sizeValue,
    borderRadius: sizeValue / 2,
    backgroundColor: backgroundColor || theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    ...theme.shadows.sm,
  };

  const textStyle: TextStyle = {
    color: "#FFFFFF",
    fontSize: getFontSize(),
    fontWeight: theme.typography.weights.semiBold,
  };

  if (source) {
    return (
      <View style={[containerStyle, style]}>
        <Image
          source={source}
          style={{ width: sizeValue, height: sizeValue }}
        />
      </View>
    );
  }

  if (icon) {
    return <View style={[containerStyle, style]}>{icon}</View>;
  }

  return (
    <View style={[containerStyle, style]}>
      <Text style={textStyle}>
        {initials?.toUpperCase().slice(0, 2) || "?"}
      </Text>
    </View>
  );
};
