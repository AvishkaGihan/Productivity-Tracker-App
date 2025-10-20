/**
 * Error State Component
 * Error handling UI with retry functionality
 */

import React from "react";
import { Text, View, ViewStyle } from "react-native";
import { useTheme } from "../../theme";
import { Button } from "./Button";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Oops! Something went wrong",
  message,
  onRetry,
  retryLabel = "Try Again",
  icon,
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
          }}
        >
          {icon}
        </View>
      )}

      <Text
        style={{
          fontSize: theme.typography.sizes.xl,
          fontWeight: theme.typography.weights.semiBold,
          color: theme.colors.error,
          marginBottom: theme.spacing.sm,
          textAlign: "center",
        }}
      >
        {title}
      </Text>

      <Text
        style={{
          fontSize: theme.typography.sizes.md,
          color: theme.colors.textSecondary,
          textAlign: "center",
          marginBottom: theme.spacing.lg,
          maxWidth: 300,
        }}
      >
        {message}
      </Text>

      {onRetry && (
        <Button onPress={onRetry} variant="primary">
          {retryLabel}
        </Button>
      )}
    </View>
  );
};
