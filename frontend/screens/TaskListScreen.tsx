import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { FAB, Text } from "react-native-paper";
import {
  FilterOptions,
  TaskBottomSheet,
  TaskCard,
  TaskData,
  TaskFilters,
  TaskFormData,
} from "../components/tasks";
import { Task, useTaskStore } from "../store/task-store";
import { useTheme } from "../theme";

export default function TaskListScreen() {
  const { theme } = useTheme();
  const { tasks, fetchTasks, createTask, updateTask, deleteTask, isLoading } =
    useTaskStore();

  const [refreshing, setRefreshing] = useState(false);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskData | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    status: "all",
    priority: undefined,
    category: undefined,
    sortBy: "created",
    sortOrder: "desc",
  });

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    await fetchTasks();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
  };

  const handleCreateTask = async (formData: TaskFormData) => {
    const success = await createTask(formData.title);
    if (success) {
      setBottomSheetVisible(false);
      await fetchTasks();
    } else {
      Alert.alert("Error", "Failed to create task");
    }
  };

  const handleEditTask = async (formData: TaskFormData) => {
    if (!editingTask) return;

    const success = await updateTask(
      editingTask.id,
      formData.title,
      editingTask.is_completed
    );
    if (success) {
      setBottomSheetVisible(false);
      setEditingTask(null);
      await fetchTasks();
    } else {
      Alert.alert("Error", "Failed to update task");
    }
  };

  const handleToggleTask = async (taskId: number, isCompleted: boolean) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const success = await updateTask(taskId, task.title, isCompleted);
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

  const handleEditPress = (task: TaskData) => {
    setEditingTask(task);
    setBottomSheetVisible(true);
  };

  const handleTaskPress = (task: TaskData) => {
    handleEditPress(task);
  };

  const handleBottomSheetClose = () => {
    setBottomSheetVisible(false);
    setEditingTask(null);
  };

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = [...tasks];

    if (filters.search) {
      filtered = filtered.filter((task) =>
        task.title.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.status === "completed") {
      filtered = filtered.filter((task) => task.is_completed);
    } else if (filters.status === "pending") {
      filtered = filtered.filter((task) => !task.is_completed);
    }

    filtered.sort((a, b) => {
      let comparison = 0;

      switch (filters.sortBy) {
        case "created":
          comparison =
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case "alphabetical":
          comparison = a.title.localeCompare(b.title);
          break;
        case "priority":
          comparison = 0;
          break;
        case "dueDate":
          comparison = 0;
          break;
      }

      return filters.sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [tasks, filters]);

  const renderTaskCard = ({ item }: { item: Task }) => {
    const taskData: TaskData = {
      id: item.id,
      title: item.title,
      is_completed: item.is_completed,
      created_at: item.created_at,
    };

    return (
      <TaskCard
        task={taskData}
        onToggle={handleToggleTask}
        onDelete={handleDeleteTask}
        onEdit={handleEditPress}
        onPress={handleTaskPress}
      />
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons
        name="clipboard-check-outline"
        size={80}
        color={theme.colors.textSecondary}
      />
      <Text style={[styles.emptyText, { color: theme.colors.text }]}>
        {filters.search ||
        filters.status !== "all" ||
        filters.priority ||
        filters.category
          ? "No tasks match your filters"
          : "No tasks yet"}
      </Text>
      <Text
        style={[styles.emptySubtext, { color: theme.colors.textSecondary }]}
      >
        {filters.search ||
        filters.status !== "all" ||
        filters.priority ||
        filters.category
          ? "Try adjusting your filters"
          : "Create your first task to get started"}
      </Text>
    </View>
  );

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <TaskFilters onFilterChange={setFilters} activeFilters={filters} />

      {filteredAndSortedTasks.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={filteredAndSortedTasks}
          renderItem={renderTaskCard}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContent}
        />
      )}

      <TaskBottomSheet
        visible={bottomSheetVisible}
        onClose={handleBottomSheetClose}
        onSubmit={editingTask ? handleEditTask : handleCreateTask}
        initialData={
          editingTask
            ? {
                title: editingTask.title,
                priority: editingTask.priority,
                category: editingTask.category,
                due_date: editingTask.due_date,
              }
            : undefined
        }
        mode={editingTask ? "edit" : "create"}
      />

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => setBottomSheetVisible(true)}
        label="New Task"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    bottom: 16,
    right: 16,
  },
});
