import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useRef } from "react";
import { Animated, PanResponder, StyleSheet, View } from "react-native";
import { Card, Checkbox, IconButton, Text } from "react-native-paper";
import { useTheme } from "../../theme";

export type TaskPriority = "high" | "medium" | "low";
export type TaskCategory =
  | "work"
  | "personal"
  | "health"
  | "learning"
  | "other";

export interface TaskData {
  id: number;
  title: string;
  is_completed: boolean;
  priority?: TaskPriority;
  category?: TaskCategory;
  due_date?: string;
  created_at: string;
}

interface TaskCardProps {
  task: TaskData;
  onToggle: (taskId: number, isCompleted: boolean) => void;
  onDelete: (taskId: number) => void;
  onEdit?: (task: TaskData) => void;
  onPress?: (task: TaskData) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggle,
  onDelete,
  onEdit,
  onPress,
}) => {
  const { theme } = useTheme();
  const translateX = useRef(new Animated.Value(0)).current;
  const swipeThreshold = 80;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          // Swipe left
          translateX.setValue(Math.max(gestureState.dx, -swipeThreshold * 2));
        } else if (gestureState.dx > 0) {
          // Swipe right
          translateX.setValue(Math.min(gestureState.dx, swipeThreshold));
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -swipeThreshold) {
          // Swipe left - show delete
          Animated.spring(translateX, {
            toValue: -swipeThreshold,
            useNativeDriver: true,
          }).start();
        } else if (gestureState.dx > swipeThreshold) {
          // Swipe right - complete task
          onToggle(task.id, !task.is_completed);
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        } else {
          // Reset position
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const getPriorityColor = (priority?: TaskPriority) => {
    switch (priority) {
      case "high":
        return theme.colors.error;
      case "medium":
        return theme.colors.warning;
      case "low":
        return theme.colors.info;
      default:
        return theme.colors.textSecondary;
    }
  };

  const getCategoryIcon = (category?: TaskCategory) => {
    switch (category) {
      case "work":
        return "briefcase";
      case "personal":
        return "account";
      case "health":
        return "heart";
      case "learning":
        return "book-open-variant";
      default:
        return "tag";
    }
  };

  const isOverdue =
    task.due_date && new Date(task.due_date) < new Date() && !task.is_completed;

  return (
    <View style={styles.container}>
      {/* Swipe Actions Background */}
      <View style={styles.swipeActionsContainer}>
        <View style={[styles.swipeAction, styles.completeAction]}>
          <MaterialCommunityIcons name="check" size={24} color="#fff" />
          <Text style={styles.swipeActionText}>Complete</Text>
        </View>
        <View style={[styles.swipeAction, styles.deleteAction]}>
          <MaterialCommunityIcons name="delete" size={24} color="#fff" />
          <Text style={styles.swipeActionText}>Delete</Text>
        </View>
      </View>

      {/* Main Card */}
      <Animated.View
        style={[styles.cardWrapper, { transform: [{ translateX }] }]}
        {...panResponder.panHandlers}
      >
        <Card
          style={[
            styles.card,
            task.is_completed && styles.completedCard,
            { backgroundColor: theme.colors.surface },
          ]}
          onPress={() => onPress?.(task)}
        >
          <Card.Content style={styles.content}>
            <View style={styles.leftSection}>
              <Checkbox
                status={task.is_completed ? "checked" : "unchecked"}
                onPress={() => onToggle(task.id, !task.is_completed)}
                color={theme.colors.primary}
              />
              <View style={styles.taskInfo}>
                <View style={styles.titleRow}>
                  <Text
                    style={[
                      styles.title,
                      { color: theme.colors.text },
                      task.is_completed && styles.completedText,
                    ]}
                    numberOfLines={2}
                  >
                    {task.title}
                  </Text>
                  {task.priority && (
                    <View
                      style={[
                        styles.priorityBadge,
                        {
                          backgroundColor: `${getPriorityColor(
                            task.priority
                          )}20`,
                        },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name="flag"
                        size={12}
                        color={getPriorityColor(task.priority)}
                      />
                    </View>
                  )}
                </View>

                <View style={styles.metadata}>
                  {task.category && (
                    <View style={styles.metadataItem}>
                      <MaterialCommunityIcons
                        name={getCategoryIcon(task.category) as any}
                        size={14}
                        color={theme.colors.textSecondary}
                      />
                      <Text
                        style={[
                          styles.metadataText,
                          { color: theme.colors.textSecondary },
                        ]}
                      >
                        {task.category}
                      </Text>
                    </View>
                  )}
                  {task.due_date && (
                    <View style={styles.metadataItem}>
                      <MaterialCommunityIcons
                        name="calendar"
                        size={14}
                        color={
                          isOverdue
                            ? theme.colors.error
                            : theme.colors.textSecondary
                        }
                      />
                      <Text
                        style={[
                          styles.metadataText,
                          {
                            color: isOverdue
                              ? theme.colors.error
                              : theme.colors.textSecondary,
                          },
                        ]}
                      >
                        {new Date(task.due_date).toLocaleDateString()}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>

            <View style={styles.rightSection}>
              {onEdit && (
                <IconButton
                  icon="pencil"
                  size={20}
                  onPress={() => onEdit(task)}
                  iconColor={theme.colors.primary}
                />
              )}
              <IconButton
                icon="delete"
                size={20}
                onPress={() => onDelete(task.id)}
                iconColor={theme.colors.error}
              />
            </View>
          </Card.Content>
        </Card>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    marginHorizontal: 16,
  },
  swipeActionsContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  swipeAction: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  completeAction: {
    backgroundColor: "#34C759",
    marginRight: "auto",
  },
  deleteAction: {
    backgroundColor: "#FF3B30",
    marginLeft: "auto",
  },
  swipeActionText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
  cardWrapper: {
    flex: 1,
  },
  card: {
    elevation: 2,
    borderRadius: 12,
  },
  completedCard: {
    opacity: 0.7,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  leftSection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  taskInfo: {
    flex: 1,
    marginLeft: 8,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
  },
  completedText: {
    textDecorationLine: "line-through",
    opacity: 0.6,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 8,
  },
  metadata: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  metadataItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metadataText: {
    fontSize: 12,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },
});
