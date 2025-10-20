import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Text } from "react-native-paper";
import { useTheme } from "../../theme/ThemeContext";

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  children,
}) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Text
        variant="titleSmall"
        style={[styles.title, { color: theme.colors.textSecondary }]}
      >
        {title.toUpperCase()}
      </Text>
      <Card
        style={[styles.card, { backgroundColor: theme.colors.surface }]}
        mode="contained"
      >
        {children}
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    marginBottom: 8,
    paddingHorizontal: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  card: {
    borderRadius: 12,
    overflow: "hidden",
  },
});
