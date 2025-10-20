/**
 * Chip Component
 * Enhanced chips/tags with variants and states
 */

import React from "react";
import {
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useTheme } from "../../theme";

export type ChipVariant = "filled" | "outlined";
export type ChipSize = "sm" | "md";

interface ChipProps {
  label: string;
  onPress?: () => void;
  onDelete?: () => void;
  variant?: ChipVariant;
  size?: ChipSize;
  selected?: boolean;
  icon?: React.ReactNode;
  deleteIcon?: React.ReactNode;
  color?: string;
  style?: ViewStyle;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  onPress,
  onDelete,
  variant = "filled",
  size = "md",
  selected = false,
  icon,
  deleteIcon,
  color,
  style,
}) => {
  const { theme } = useTheme();

  const getContainerStyle = (): ViewStyle => {
    const baseColor = color || theme.colors.primary;

    const baseStyle: ViewStyle = {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: theme.radius.full,
      paddingHorizontal: size === "sm" ? 8 : 12,
      paddingVertical: size === "sm" ? 4 : 6,
    };

    if (variant === "filled") {
      return {
        ...baseStyle,
        backgroundColor: selected ? baseColor : theme.colors.surfaceSecondary,
      };
    }

    return {
      ...baseStyle,
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: selected ? baseColor : theme.colors.border,
    };
  };

  const getTextStyle = (): TextStyle => {
    const baseColor = color || theme.colors.primary;

    return {
      fontSize: size === "sm" ? 12 : 14,
      fontWeight: theme.typography.weights.medium,
      color:
        variant === "filled" && selected
          ? "#FFFFFF"
          : variant === "outlined" && selected
          ? baseColor
          : theme.colors.text,
    };
  };

  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      onPress={onPress}
      style={[getContainerStyle(), style]}
      activeOpacity={0.7}
    >
      {icon && <View style={{ marginRight: 6 }}>{icon}</View>}
      <Text style={getTextStyle()}>{label}</Text>
      {onDelete && (
        <TouchableOpacity
          onPress={onDelete}
          style={{ marginLeft: 6 }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          {deleteIcon || (
            <Text style={{ color: theme.colors.textSecondary, fontSize: 16 }}>
              ×
            </Text>
          )}
        </TouchableOpacity>
      )}
    </Container>
  );
};
