/**
 * Enhanced Input Component
 * Custom text input with variants, validation, and enhanced UI
 */

import React, { useState } from "react";
import { Text, TextInput, TextInputProps, View, ViewStyle } from "react-native";
import { useTheme } from "../../theme";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: ViewStyle;
  disabled?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle,
  disabled = false,
  ...textInputProps
}) => {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const getContainerStyle = (): ViewStyle => ({
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 2,
    borderColor: error
      ? theme.colors.error
      : isFocused
      ? theme.colors.primary
      : theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    minHeight: 48,
    ...(disabled && {
      opacity: 0.5,
      backgroundColor: theme.colors.surfaceSecondary,
    }),
  });

  const getLabelStyle = () => ({
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: error ? theme.colors.error : theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  });

  const getHelperTextStyle = () => ({
    fontSize: theme.typography.sizes.xs,
    color: error ? theme.colors.error : theme.colors.textTertiary,
    marginTop: theme.spacing.xs,
  });

  return (
    <View style={containerStyle}>
      {label && <Text style={getLabelStyle()}>{label}</Text>}
      <View style={getContainerStyle()}>
        {leftIcon && (
          <View style={{ marginRight: theme.spacing.sm }}>{leftIcon}</View>
        )}
        <TextInput
          style={[
            {
              flex: 1,
              fontSize: theme.typography.sizes.md,
              color: theme.colors.text,
              paddingVertical: theme.spacing.xs,
            },
            inputStyle,
          ]}
          placeholderTextColor={theme.colors.textTertiary}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          editable={!disabled}
          {...textInputProps}
        />
        {rightIcon && (
          <View style={{ marginLeft: theme.spacing.sm }}>{rightIcon}</View>
        )}
      </View>
      {(error || helperText) && (
        <Text style={getHelperTextStyle()}>{error || helperText}</Text>
      )}
    </View>
  );
};
