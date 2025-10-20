import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import {
  Button,
  Card,
  Chip,
  FAB,
  IconButton,
  Text,
  TextInput,
} from "react-native-paper";
import { Task, useTaskStore } from "../store/task-store";
import { colors } from "../theme/colors";

export default function TaskListScreen() {
  const {
    tasks,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    isLoading,
    error,
  } = useTaskStore();
  const [refreshing, setRefreshing] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "completed" | "pending"
  >("all");

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    await fetchTasks(statusFilter === "all" ? undefined : statusFilter);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTasks(statusFilter === "all" ? undefined : statusFilter);
    setRefreshing(false);
  };

  const handleCreateTask = async () => {
    if (!newTaskTitle.trim()) {
      Alert.alert("Error", "Please enter a task title");
      return;
    }

    const success = await createTask(newTaskTitle);
    if (success) {
      setNewTaskTitle("");
      setModalVisible(false);
    } else {
      Alert.alert("Error", "Failed to create task");
    }
  };

  const handleToggleTask = async (task: Task) => {
    const success = await updateTask(task.id, task.title, !task.is_completed);
    if (!success) {
      Alert.alert("Error", "Failed to update task");
    }
  };

  const handleDeleteTask = (taskId: number) => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: async () => {
          const success = await deleteTask(taskId);
          if (!success) {
            Alert.alert("Error", "Failed to delete task");
          }
        },
        style: "destructive",
      },
    ]);
  };

  const filteredTasks = tasks.filter((task) => {
    if (statusFilter === "completed") return task.is_completed;
    if (statusFilter === "pending") return !task.is_completed;
    return true;
  });

  const renderTaskCard = ({ item }: { item: Task }) => (
    <Card style={[styles.taskCard, item.is_completed && styles.completedCard]}>
      <Card.Content style={styles.taskContent}>
        <View style={styles.taskLeft}>
          <MaterialCommunityIcons
            name={
              item.is_completed ? "checkbox-marked" : "checkbox-blank-outline"
            }
            size={24}
            color={item.is_completed ? colors.success : colors.primary}
            onPress={() => handleToggleTask(item)}
          />
          <View style={styles.taskInfo}>
            <Text
              style={[
                styles.taskTitle,
                item.is_completed && styles.completedText,
              ]}
              numberOfLines={2}
            >
              {item.title}
            </Text>
            <Text style={styles.taskDate}>
              {new Date(item.created_at).toLocaleDateString()}
            </Text>
          </View>
        </View>

        <IconButton
          icon="trash-can-outline"
          onPress={() => handleDeleteTask(item.id)}
          iconColor={colors.error}
        />
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        <Chip
          selected={statusFilter === "all"}
          onPress={() => {
            setStatusFilter("all");
            fetchTasks();
          }}
          style={styles.chip}
        >
          All
        </Chip>
        <Chip
          selected={statusFilter === "pending"}
          onPress={() => {
            setStatusFilter("pending");
            fetchTasks("pending");
          }}
          style={styles.chip}
        >
          Pending
        </Chip>
        <Chip
          selected={statusFilter === "completed"}
          onPress={() => {
            setStatusFilter("completed");
            fetchTasks("completed");
          }}
          style={styles.chip}
        >
          Completed
        </Chip>
      </View>

      {/* Task List */}
      {tasks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons
            name="inbox-outline"
            size={64}
            color={colors.textSecondary}
          />
          <Text style={styles.emptyText}>No tasks yet</Text>
          <Text style={styles.emptySubtext}>
            Create your first task or get AI suggestions
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredTasks}
          renderItem={renderTaskCard}
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Add Task Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Task</Text>

            <TextInput
              label="Task Title"
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
              placeholder="Enter task description"
              placeholderTextColor={colors.textSecondary}
              textColor={colors.text}
              style={styles.modalInput}
            />

            <View style={styles.modalButtons}>
              <Button
                mode="outlined"
                onPress={() => setModalVisible(false)}
                style={{ flex: 1 }}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleCreateTask}
                loading={isLoading}
                disabled={isLoading}
                style={{ flex: 1 }}
              >
                Create
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      {/* Floating Action Button */}
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => setModalVisible(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  chip: {
    backgroundColor: colors.surface,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
  taskCard: {
    backgroundColor: colors.surface,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  completedCard: {
    borderLeftColor: colors.success,
    opacity: 0.7,
  },
  taskContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  taskLeft: {
    flexDirection: "row",
    flex: 1,
    alignItems: "flex-start",
    gap: 12,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: colors.textSecondary,
  },
  taskDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  fab: {
    position: "absolute",
    bottom: 16,
    right: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 24,
    width: "80%",
    gap: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
  },
  modalInput: {
    backgroundColor: colors.background,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
});
