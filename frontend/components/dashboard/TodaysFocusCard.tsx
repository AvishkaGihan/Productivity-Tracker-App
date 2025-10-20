import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Card, Checkbox, Text } from "react-native-paper";
import { useTheme } from "../../theme";

interface Task {
  id: string;
  title: string;
  priority?: "high" | "medium" | "low";
  completed?: boolean;
}

interface TodaysFocusCardProps {
  tasks: Task[];
  onTaskPress?: (taskId: string) => void;
  onTaskComplete?: (taskId: string) => void;
  onViewAll?: () => void;
}

export const TodaysFocusCard: React.FC<TodaysFocusCardProps> = ({
  tasks,
  onTaskPress,
  onTaskComplete,
  onViewAll,
}) => {
  const { theme } = useTheme();

  const getPriorityColor = (priority?: string) => {
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

  const topTasks = tasks.slice(0, 3);

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <MaterialCommunityIcons
              name="target"
              size={24}
              color={theme.colors.primary}
            />
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Today's Focus
            </Text>
          </View>

          {onViewAll && (
            <TouchableOpacity onPress={onViewAll} activeOpacity={0.7}>
              <Text
                style={[styles.viewAllText, { color: theme.colors.primary }]}
              >
                View All
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {topTasks.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="check-circle-outline"
              size={48}
              color={theme.colors.success}
            />
            <Text
              style={[styles.emptyText, { color: theme.colors.textSecondary }]}
            >
              No tasks for today. You're all caught up!
            </Text>
          </View>
        ) : (
          <View style={styles.taskList}>
            {topTasks.map((task, index) => (
              <TouchableOpacity
                key={task.id}
                onPress={() => onTaskPress?.(task.id)}
                activeOpacity={0.7}
                style={[
                  styles.taskItem,
                  index < topTasks.length - 1 && styles.taskItemBorder,
                  { borderBottomColor: theme.colors.border },
                ]}
              >
                <Checkbox
                  status={task.completed ? "checked" : "unchecked"}
                  onPress={() => onTaskComplete?.(task.id)}
                  color={theme.colors.primary}
                />

                <View style={styles.taskContent}>
                  <Text
                    style={[
                      styles.taskTitle,
                      { color: theme.colors.text },
                      task.completed && styles.taskCompleted,
                    ]}
                    numberOfLines={2}
                  >
                    {task.title}
                  </Text>
                </View>

                {task.priority && (
                  <View
                    style={[
                      styles.priorityDot,
                      { backgroundColor: getPriorityColor(task.priority) },
                    ]}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
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
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: "600",
  },
  taskList: {
    marginTop: 8,
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  taskItemBorder: {
    borderBottomWidth: 1,
  },
  taskContent: {
    flex: 1,
    marginLeft: 8,
  },
  taskTitle: {
    fontSize: 15,
    lineHeight: 20,
  },
  taskCompleted: {
    textDecorationLine: "line-through",
    opacity: 0.6,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 14,
    marginTop: 12,
    textAlign: "center",
  },
});
