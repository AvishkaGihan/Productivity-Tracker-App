import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Text } from "react-native-paper";
import { useTheme } from "../../theme";

interface Achievement {
  id: string;
  icon: string;
  title: string;
  description: string;
  unlocked: boolean;
  progress?: number; // 0-100
}

interface AchievementBadgesProps {
  achievements: Achievement[];
  maxDisplay?: number;
}

export const AchievementBadges: React.FC<AchievementBadgesProps> = ({
  achievements,
  maxDisplay = 4,
}) => {
  const { theme } = useTheme();

  const displayedAchievements = achievements.slice(0, maxDisplay);

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <MaterialCommunityIcons
            name="trophy"
            size={24}
            color={theme.colors.warning}
          />
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Achievements
          </Text>
        </View>

        <View style={styles.badgeGrid}>
          {displayedAchievements.map((achievement) => (
            <View
              key={achievement.id}
              style={[
                styles.badgeItem,
                !achievement.unlocked && styles.badgeLocked,
              ]}
            >
              <View
                style={[
                  styles.badgeIconContainer,
                  {
                    backgroundColor: achievement.unlocked
                      ? `${theme.colors.warning}15`
                      : theme.colors.surface,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name={achievement.icon as any}
                  size={32}
                  color={
                    achievement.unlocked
                      ? theme.colors.warning
                      : theme.colors.textSecondary
                  }
                />
              </View>

              <Text
                style={[
                  styles.badgeTitle,
                  {
                    color: achievement.unlocked
                      ? theme.colors.text
                      : theme.colors.textSecondary,
                  },
                ]}
                numberOfLines={2}
              >
                {achievement.title}
              </Text>

              {achievement.unlocked && (
                <View style={styles.unlockedBadge}>
                  <MaterialCommunityIcons name="check" size={12} color="#fff" />
                </View>
              )}

              {!achievement.unlocked && achievement.progress !== undefined && (
                <View style={styles.progressContainer}>
                  <View
                    style={[
                      styles.progressBar,
                      { backgroundColor: theme.colors.border },
                    ]}
                  >
                    <View
                      style={[
                        styles.progressFill,
                        {
                          backgroundColor: theme.colors.primary,
                          width: `${achievement.progress}%`,
                        },
                      ]}
                    />
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>

        {achievements.length > maxDisplay && (
          <Text
            style={[styles.moreText, { color: theme.colors.textSecondary }]}
          >
            +{achievements.length - maxDisplay} more achievements
          </Text>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  badgeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 8,
  },
  badgeItem: {
    width: "48%",
    alignItems: "center",
    marginBottom: 16,
    position: "relative",
  },
  badgeLocked: {
    opacity: 0.5,
  },
  badgeIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  badgeTitle: {
    fontSize: 12,
    textAlign: "center",
    fontWeight: "600",
  },
  unlockedBadge: {
    position: "absolute",
    top: 0,
    right: "20%",
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
  },
  progressContainer: {
    width: "100%",
    marginTop: 8,
    paddingHorizontal: 8,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  moreText: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 8,
  },
});
