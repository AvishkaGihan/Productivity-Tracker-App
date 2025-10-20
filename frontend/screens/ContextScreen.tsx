import React, { useEffect, useState } from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  Button,
  Chip,
  FAB,
  Modal,
  Portal,
  Text,
  TextInput,
} from "react-native-paper";
import { GoalCard, GoalTemplates, RichTextEditor } from "../components/context";
import { contextAPI } from "../services/api-client";
import { useAuthStore } from "../store/auth-store";
import { useTheme } from "../theme/ThemeContext";

interface Goal {
  id: number;
  title: string;
  description?: string;
  category: string;
  progress: number;
  target: number;
  deadline?: string;
}

export default function ContextScreen() {
  const { theme } = useTheme();
  const { user, setUser } = useAuthStore();
  const [notes, setNotes] = useState(user?.notes || "");
  const [goals, setGoals] = useState<Goal[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  // Form state
  const [goalTitle, setGoalTitle] = useState("");
  const [goalDescription, setGoalDescription] = useState("");
  const [goalCategory, setGoalCategory] = useState("Career");
  const [goalProgress, setGoalProgress] = useState("0");
  const [goalTarget, setGoalTarget] = useState("100");
  const [goalDeadline, setGoalDeadline] = useState("");

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = () => {
    // Mock goals - in production, fetch from API
    const mockGoals: Goal[] = [
      {
        id: 1,
        title: "Complete React Native Course",
        description: "Finish all modules and build 3 projects",
        category: "Learning",
        progress: 65,
        target: 100,
        deadline: "2025-12-31",
      },
      {
        id: 2,
        title: "Improve Fitness",
        description: "Exercise 3 times per week",
        category: "Health",
        progress: 12,
        target: 52,
      },
    ];
    setGoals(mockGoals);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    loadGoals();
    setRefreshing(false);
  };

  const handleSaveNotes = async () => {
    try {
      const response = await contextAPI.update(user?.goals || "", notes);
      const updatedUser = { ...user, ...response.data.user };
      setUser(updatedUser);
      Alert.alert("Success", "Notes saved successfully!");
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.detail || "Failed to save notes"
      );
    }
  };

  const handleAddGoal = () => {
    setEditingGoal(null);
    setGoalTitle("");
    setGoalDescription("");
    setGoalCategory("Career");
    setGoalProgress("0");
    setGoalTarget("100");
    setGoalDeadline("");
    setModalVisible(true);
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setGoalTitle(goal.title);
    setGoalDescription(goal.description || "");
    setGoalCategory(goal.category);
    setGoalProgress(String(goal.progress));
    setGoalTarget(String(goal.target));
    setGoalDeadline(goal.deadline || "");
    setModalVisible(true);
  };

  const handleDeleteGoal = (goalId: number) => {
    Alert.alert("Delete Goal", "Are you sure you want to delete this goal?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setGoals(goals.filter((g) => g.id !== goalId));
          Alert.alert("Success", "Goal deleted");
        },
      },
    ]);
  };

  const handleSaveGoal = () => {
    if (!goalTitle.trim()) {
      Alert.alert("Error", "Please enter a goal title");
      return;
    }

    const newGoal: Goal = {
      id: editingGoal?.id || Date.now(),
      title: goalTitle,
      description: goalDescription,
      category: goalCategory,
      progress: parseInt(goalProgress) || 0,
      target: parseInt(goalTarget) || 100,
      deadline: goalDeadline,
    };

    if (editingGoal) {
      setGoals(goals.map((g) => (g.id === editingGoal.id ? newGoal : g)));
      Alert.alert("Success", "Goal updated!");
    } else {
      setGoals([...goals, newGoal]);
      Alert.alert("Success", "Goal created!");
    }

    setModalVisible(false);
  };

  const handleSelectTemplate = (template: any) => {
    setGoalCategory(template.category);
    setModalVisible(true);
  };

  const categories = ["Career", "Health", "Learning", "Personal", "Finance"];

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text
            variant="headlineMedium"
            style={[styles.title, { color: theme.colors.text }]}
          >
            Goals & Context
          </Text>
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.textSecondary }}
          >
            Set your goals and track progress
          </Text>
        </View>

        {/* Goal Templates */}
        <GoalTemplates onSelectTemplate={handleSelectTemplate} />

        {/* Goals Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text
              variant="titleMedium"
              style={[styles.sectionTitle, { color: theme.colors.text }]}
            >
              My Goals
            </Text>
            <Chip
              mode="flat"
              textStyle={{ fontSize: 12 }}
              style={{ backgroundColor: theme.colors.primary + "20" }}
            >
              {goals.length} active
            </Chip>
          </View>

          {goals.length > 0 ? (
            goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onEdit={() => handleEditGoal(goal)}
                onDelete={() => handleDeleteGoal(goal.id)}
              />
            ))
          ) : (
            <View
              style={[
                styles.emptyState,
                { backgroundColor: theme.colors.surface },
              ]}
            >
              <Text
                variant="bodyLarge"
                style={{ color: theme.colors.textSecondary }}
              >
                No goals yet
              </Text>
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.textSecondary, marginTop: 8 }}
              >
                Tap the + button to create your first goal
              </Text>
            </View>
          )}
        </View>

        {/* Notes Section */}
        <View style={styles.section}>
          <Text
            variant="titleMedium"
            style={[styles.sectionTitle, { color: theme.colors.text }]}
          >
            Personal Notes
          </Text>
          <Text
            variant="bodySmall"
            style={[styles.subtitle, { color: theme.colors.textSecondary }]}
          >
            Keep track of ideas, thoughts, and important information
          </Text>

          <RichTextEditor
            value={notes}
            onChangeText={setNotes}
            placeholder="Write your notes here... (Supports Markdown)"
            minHeight={200}
          />

          <Button
            mode="contained"
            onPress={handleSaveNotes}
            style={styles.saveButton}
            contentStyle={{ paddingVertical: 8 }}
          >
            Save Notes
          </Button>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Add Goal FAB */}
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={handleAddGoal}
        label="Add Goal"
      />

      {/* Goal Modal */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={[
            styles.modal,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <ScrollView>
            <Text
              variant="titleLarge"
              style={[styles.modalTitle, { color: theme.colors.text }]}
            >
              {editingGoal ? "Edit Goal" : "New Goal"}
            </Text>

            <TextInput
              label="Goal Title *"
              value={goalTitle}
              onChangeText={setGoalTitle}
              style={styles.input}
              mode="outlined"
            />

            <TextInput
              label="Description"
              value={goalDescription}
              onChangeText={setGoalDescription}
              style={styles.input}
              mode="outlined"
              multiline
              numberOfLines={3}
            />

            <Text
              variant="bodyMedium"
              style={[styles.label, { color: theme.colors.text }]}
            >
              Category
            </Text>
            <View style={styles.categoryGrid}>
              {categories.map((category) => (
                <Chip
                  key={category}
                  selected={goalCategory === category}
                  onPress={() => setGoalCategory(category)}
                  style={styles.categoryChip}
                  mode={goalCategory === category ? "flat" : "outlined"}
                >
                  {category}
                </Chip>
              ))}
            </View>

            <View style={styles.row}>
              <TextInput
                label="Progress"
                value={goalProgress}
                onChangeText={setGoalProgress}
                style={[styles.input, { flex: 1 }]}
                mode="outlined"
                keyboardType="numeric"
              />
              <TextInput
                label="Target"
                value={goalTarget}
                onChangeText={setGoalTarget}
                style={[styles.input, { flex: 1, marginLeft: 12 }]}
                mode="outlined"
                keyboardType="numeric"
              />
            </View>

            <TextInput
              label="Deadline (Optional)"
              value={goalDeadline}
              onChangeText={setGoalDeadline}
              style={styles.input}
              mode="outlined"
              placeholder="YYYY-MM-DD"
            />

            <View style={styles.modalActions}>
              <Button
                mode="outlined"
                onPress={() => setModalVisible(false)}
                style={{ flex: 1 }}
              >
                Cancel
              </Button>
              <View style={{ width: 12 }} />
              <Button
                mode="contained"
                onPress={handleSaveGoal}
                style={{ flex: 1 }}
              >
                {editingGoal ? "Update" : "Create"}
              </Button>
            </View>
          </ScrollView>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: "600",
  },
  subtitle: {
    marginTop: 4,
    marginBottom: 16,
  },
  emptyState: {
    padding: 40,
    borderRadius: 12,
    alignItems: "center",
  },
  saveButton: {
    marginTop: 16,
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
  },
  modal: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
    maxHeight: "90%",
  },
  modalTitle: {
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontWeight: "500",
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  categoryChip: {
    minWidth: 80,
  },
  row: {
    flexDirection: "row",
  },
  modalActions: {
    flexDirection: "row",
    marginTop: 24,
  },
});
