/**
 * Email Validator Component
 * Real-time email validation with visual feedback
 */

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../theme";

interface EmailValidatorProps {
  email: string;
  showValidation: boolean;
}

export const EmailValidator: React.FC<EmailValidatorProps> = ({
  email,
  showValidation,
}) => {
  const { theme } = useTheme();

  const validateEmail = (): { isValid: boolean; message: string } => {
    if (!email) {
      return { isValid: false, message: "" };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);

    if (!isValid) {
      return { isValid: false, message: "Please enter a valid email address" };
    }

    return { isValid: true, message: "Email looks good!" };
  };

  const { isValid, message } = validateEmail();

  if (!showValidation || !email || !message) return null;

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.message,
          { color: isValid ? theme.colors.success : theme.colors.error },
        ]}
      >
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
  },
  message: {
    fontSize: 12,
    fontWeight: "500",
  },
});
