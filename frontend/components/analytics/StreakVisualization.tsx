import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Text } from "react-native-paper";
import { useTheme } from "../../theme/ThemeContext";

interface StreakVisualizationProps {
  currentStreak: number;
  longestStreak: number;
  weekData: boolean[]; // 7 days, true if tasks completed
}

export const StreakVisualization: React.FC<StreakVisualizationProps> = ({
  currentStreak,
  longestStreak,
  weekData,
}) => {
  const { theme } = useTheme();
  const days = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <Card
      style={[styles.container, { backgroundColor: theme.colors.surface }]}
      mode="contained"
    >
      <View style={styles.header}>
        <MaterialCommunityIcons name="fire" size={32} color="#FF6B6B" />
        <View style={styles.streakInfo}>
          <Text
            variant="headlineLarge"
            style={[styles.streakNumber, { color: theme.colors.text }]}
          >
            {currentStreak}
          </Text>
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.textSecondary }}
          >
            Day Streak
          </Text>
        </View>
      </View>

      <View style={styles.weekContainer}>
        {days.map((day, index) => (
          <View key={index} style={styles.dayColumn}>
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.textSecondary, marginBottom: 8 }}
            >
              {day}
            </Text>
            <View
              style={[
                styles.dayDot,
                {
                  backgroundColor: weekData[index]
                    ? theme.colors.primary
                    : theme.colors.surface,
                },
              ]}
            />
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <MaterialCommunityIcons
          name="trophy"
          size={20}
          color={theme.colors.primary}
        />
        <Text variant="bodyMedium" style={{ color: theme.colors.text }}>
          Longest Streak:{" "}
          <Text style={{ fontWeight: "bold" }}>{longestStreak} days</Text>
        </Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 16,
  },
  streakInfo: {
    flex: 1,
  },
  streakNumber: {
    fontWeight: "bold",
  },
  weekContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  dayColumn: {
    alignItems: "center",
  },
  dayDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
});
