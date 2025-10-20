/**
 * Password Strength Meter Component
 * Visual indicator of password strength with feedback
 */

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../theme";

interface PasswordStrengthMeterProps {
  password: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  password,
}) => {
  const { theme } = useTheme();

  const calculateStrength = (): {
    strength: number;
    label: string;
    color: string;
  } => {
    if (!password) {
      return { strength: 0, label: "", color: theme.colors.textTertiary };
    }

    let strength = 0;
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    strength += checks.length ? 1 : 0;
    strength += checks.uppercase ? 1 : 0;
    strength += checks.lowercase ? 1 : 0;
    strength += checks.number ? 1 : 0;
    strength += checks.special ? 1 : 0;

    if (strength <= 1) {
      return { strength: 20, label: "Weak", color: theme.colors.error };
    } else if (strength === 2) {
      return { strength: 40, label: "Fair", color: theme.colors.warning };
    } else if (strength === 3) {
      return { strength: 60, label: "Good", color: "#FFB74D" };
    } else if (strength === 4) {
      return { strength: 80, label: "Strong", color: theme.colors.success };
    } else {
      return {
        strength: 100,
        label: "Very Strong",
        color: theme.colors.success,
      };
    }
  };

  const { strength, label, color } = calculateStrength();

  if (!password) return null;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.barBackground,
          { backgroundColor: theme.colors.surfaceSecondary },
        ]}
      >
        <View
          style={[
            styles.barFill,
            { width: `${strength}%`, backgroundColor: color },
          ]}
        />
      </View>
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  barBackground: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 4,
  },
});
