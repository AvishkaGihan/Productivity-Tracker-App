import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Animated, PanResponder, StyleSheet, View } from "react-native";
import { Card, Chip, IconButton, ProgressBar, Text } from "react-native-paper";
import { useTheme } from "../../theme/ThemeContext";

interface GoalCardProps {
  goal: {
    id: number;
    title: string;
    description?: string;
    category: string;
    progress: number;
    target: number;
    deadline?: string;
  };
  onEdit: () => void;
  onDelete: () => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onEdit,
  onDelete,
}) => {
  const { theme } = useTheme();
  const [translateX] = useState(new Animated.Value(0));

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, gestureState) =>
      Math.abs(gestureState.dx) > 10,
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dx < 0) {
        translateX.setValue(Math.max(gestureState.dx, -80));
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx < -40) {
        Animated.spring(translateX, {
          toValue: -80,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  const progressPercentage =
    goal.target > 0 ? (goal.progress / goal.target) * 100 : 0;
  const isOverdue = goal.deadline && new Date(goal.deadline) < new Date();

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Career: "#007AFF",
      Health: "#34C759",
      Learning: "#FF9500",
      Personal: "#5856D6",
      Finance: "#FFD700",
    };
    return colors[category] || theme.colors.primary;
  };

  return (
    <View style={styles.container}>
      {/* Action Buttons */}
      <View
        style={[
          styles.actionsContainer,
          { backgroundColor: theme.colors.error },
        ]}
      >
        <IconButton
          icon="delete"
          iconColor="#fff"
          size={24}
          onPress={onDelete}
        />
      </View>

      {/* Goal Card */}
      <Animated.View
        style={[styles.cardWrapper, { transform: [{ translateX }] }]}
        {...panResponder.panHandlers}
      >
        <Card
          style={[styles.card, { backgroundColor: theme.colors.surface }]}
          mode="contained"
          onPress={() => translateX.setValue(0)}
        >
          <Card.Content>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <MaterialCommunityIcons
                  name="target"
                  size={20}
                  color={getCategoryColor(goal.category)}
                />
                <Chip
                  mode="flat"
                  textStyle={{ fontSize: 11 }}
                  style={[
                    styles.categoryChip,
                    { backgroundColor: getCategoryColor(goal.category) + "20" },
                  ]}
                >
                  {goal.category}
                </Chip>
              </View>
              <IconButton
                icon="pencil"
                size={20}
                iconColor={theme.colors.textSecondary}
                onPress={onEdit}
              />
            </View>

            {/* Title & Description */}
            <Text
              variant="titleMedium"
              style={[styles.title, { color: theme.colors.text }]}
            >
              {goal.title}
            </Text>
            {goal.description && (
              <Text
                variant="bodySmall"
                numberOfLines={2}
                style={{ color: theme.colors.textSecondary, marginBottom: 12 }}
              >
                {goal.description}
              </Text>
            )}

            {/* Progress */}
            <View style={styles.progressContainer}>
              <View style={styles.progressHeader}>
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.textSecondary }}
                >
                  Progress
                </Text>
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.text, fontWeight: "600" }}
                >
                  {goal.progress} / {goal.target}
                </Text>
              </View>
              <ProgressBar
                progress={progressPercentage / 100}
                color={getCategoryColor(goal.category)}
                style={styles.progressBar}
              />
            </View>

            {/* Footer */}
            {goal.deadline && (
              <View style={styles.footer}>
                <MaterialCommunityIcons
                  name="calendar"
                  size={14}
                  color={
                    isOverdue ? theme.colors.error : theme.colors.textSecondary
                  }
                />
                <Text
                  variant="bodySmall"
                  style={{
                    color: isOverdue
                      ? theme.colors.error
                      : theme.colors.textSecondary,
                  }}
                >
                  {isOverdue
                    ? "Overdue"
                    : `Due ${new Date(goal.deadline).toLocaleDateString()}`}
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  actionsContainer: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 80,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  cardWrapper: {
    width: "100%",
  },
  card: {
    borderRadius: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  categoryChip: {
    height: 24,
  },
  title: {
    fontWeight: "600",
    marginBottom: 4,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
  },
});
