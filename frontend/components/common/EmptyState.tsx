/**
 * Empty State Component
 * Display empty states with illustrations and helpful messages
 */

import React from "react";
import { Text, View, ViewStyle } from "react-native";
import { useTheme } from "../../theme";
import { Button } from "./Button";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  style,
}) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          padding: theme.spacing.xl,
        },
        style,
      ]}
    >
      {icon && (
        <View
          style={{
            marginBottom: theme.spacing.lg,
            opacity: 0.6,
          }}
        >
          {icon}
        </View>
      )}

      <Text
        style={{
          fontSize: theme.typography.sizes.xl,
          fontWeight: theme.typography.weights.semiBold,
          color: theme.colors.text,
          marginBottom: theme.spacing.sm,
          textAlign: "center",
        }}
      >
        {title}
      </Text>

      {description && (
        <Text
          style={{
            fontSize: theme.typography.sizes.md,
            color: theme.colors.textSecondary,
            textAlign: "center",
            marginBottom: theme.spacing.lg,
            maxWidth: 300,
          }}
        >
          {description}
        </Text>
      )}

      {actionLabel && onAction && (
        <Button onPress={onAction} variant="primary">
          {actionLabel}
        </Button>
      )}
    </View>
  );
};
