import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Text } from "react-native-paper";
import { useTheme } from "../../theme";

interface StreakCounterProps {
  currentStreak: number;
  bestStreak: number;
}

export const StreakCounter: React.FC<StreakCounterProps> = ({
  currentStreak,
  bestStreak,
}) => {
  const { theme } = useTheme();

  return (
    <Card style={styles.card}>
      <LinearGradient
        colors={["#FF6B6B", "#FF8E53"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.streakContainer}>
            <MaterialCommunityIcons name="fire" size={48} color="#FFD700" />
            <View style={styles.streakText}>
              <Text style={styles.streakNumber}>{currentStreak}</Text>
              <Text style={styles.streakLabel}>Day Streak</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.bestContainer}>
            <MaterialCommunityIcons
              name="trophy"
              size={20}
              color="rgba(255, 255, 255, 0.8)"
            />
            <Text style={styles.bestText}>Best: {bestStreak} days</Text>
          </View>

          {currentStreak > 0 && (
            <Text style={styles.motivationText}>
              {currentStreak >= bestStreak
                ? "🎉 New record! Keep it going!"
                : "Keep it up! You're doing great!"}
            </Text>
          )}
        </View>
      </LinearGradient>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 12,
    overflow: "hidden",
  },
  gradient: {
    padding: 20,
  },
  content: {
    alignItems: "center",
  },
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  streakText: {
    marginLeft: 16,
    alignItems: "flex-start",
  },
  streakNumber: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    lineHeight: 40,
  },
  streakLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "600",
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    marginVertical: 12,
  },
  bestContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  bestText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    marginLeft: 8,
    fontWeight: "600",
  },
  motivationText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    marginTop: 8,
  },
});
