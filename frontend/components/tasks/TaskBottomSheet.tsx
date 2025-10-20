import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Chip, Text, TextInput } from "react-native-paper";
import { useTheme } from "../../theme";
import { TaskCategory, TaskPriority } from "./TaskCard";

interface TaskBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (taskData: TaskFormData) => void;
  initialData?: TaskFormData;
  mode?: "create" | "edit";
}

export interface TaskFormData {
  title: string;
  priority?: TaskPriority;
  category?: TaskCategory;
  due_date?: string;
  notes?: string;
}

const priorities: { value: TaskPriority; label: string; icon: string }[] = [
  { value: "high", label: "High", icon: "flag" },
  { value: "medium", label: "Medium", icon: "flag" },
  { value: "low", label: "Low", icon: "flag" },
];

const categories: { value: TaskCategory; label: string; icon: string }[] = [
  { value: "work", label: "Work", icon: "briefcase" },
  { value: "personal", label: "Personal", icon: "account" },
  { value: "health", label: "Health", icon: "heart" },
  { value: "learning", label: "Learning", icon: "book-open-variant" },
  { value: "other", label: "Other", icon: "tag" },
];

export const TaskBottomSheet: React.FC<TaskBottomSheetProps> = ({
  visible,
  onClose,
  onSubmit,
  initialData,
  mode = "create",
}) => {
  const { theme } = useTheme();
  const [title, setTitle] = useState(initialData?.title || "");
  const [priority, setPriority] = useState<TaskPriority | undefined>(
    initialData?.priority
  );
  const [category, setCategory] = useState<TaskCategory | undefined>(
    initialData?.category
  );
  const [dueDate, setDueDate] = useState(initialData?.due_date || "");
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [showPriorityPicker, setShowPriorityPicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  const handleSubmit = () => {
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      priority,
      category,
      due_date: dueDate || undefined,
      notes: notes || undefined,
    });

    // Reset form
    setTitle("");
    setPriority(undefined);
    setCategory(undefined);
    setDueDate("");
    setNotes("");
    onClose();
  };

  const handleClose = () => {
    setTitle(initialData?.title || "");
    setPriority(initialData?.priority);
    setCategory(initialData?.category);
    setDueDate(initialData?.due_date || "");
    setNotes(initialData?.notes || "");
    onClose();
  };

  const parseDateInput = (input: string): string => {
    const lowerInput = input.toLowerCase().trim();
    const today = new Date();

    if (lowerInput === "today") {
      return today.toISOString().split("T")[0];
    } else if (lowerInput === "tomorrow") {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString().split("T")[0];
    } else if (lowerInput === "next week") {
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);
      return nextWeek.toISOString().split("T")[0];
    }
    return input;
  };

  const getPriorityColor = (p: TaskPriority) => {
    switch (p) {
      case "high":
        return theme.colors.error;
      case "medium":
        return theme.colors.warning;
      case "low":
        return theme.colors.info;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleClose}
        />

        <View style={[styles.sheet, { backgroundColor: theme.colors.surface }]}>
          {/* Handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
              {mode === "create" ? "Create Task" : "Edit Task"}
            </Text>
            <TouchableOpacity onPress={handleClose}>
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={theme.colors.text}
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Title Input */}
            <TextInput
              label="Task Title"
              value={title}
              onChangeText={setTitle}
              mode="outlined"
              placeholder="What needs to be done?"
              style={styles.input}
              autoFocus
            />

            {/* Priority Selector */}
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { color: theme.colors.text }]}>
                Priority
              </Text>
              <View style={styles.chipContainer}>
                {priorities.map((p) => (
                  <Chip
                    key={p.value}
                    selected={priority === p.value}
                    onPress={() => setPriority(p.value)}
                    style={styles.chip}
                    icon={p.icon}
                    selectedColor={getPriorityColor(p.value)}
                  >
                    {p.label}
                  </Chip>
                ))}
                {priority && (
                  <Chip
                    onPress={() => setPriority(undefined)}
                    style={styles.chip}
                    textStyle={{ fontSize: 12 }}
                  >
                    Clear
                  </Chip>
                )}
              </View>
            </View>

            {/* Category Selector */}
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { color: theme.colors.text }]}>
                Category
              </Text>
              <View style={styles.chipContainer}>
                {categories.map((c) => (
                  <Chip
                    key={c.value}
                    selected={category === c.value}
                    onPress={() => setCategory(c.value)}
                    style={styles.chip}
                    icon={c.icon}
                  >
                    {c.label}
                  </Chip>
                ))}
                {category && (
                  <Chip
                    onPress={() => setCategory(undefined)}
                    style={styles.chip}
                    textStyle={{ fontSize: 12 }}
                  >
                    Clear
                  </Chip>
                )}
              </View>
            </View>

            {/* Due Date */}
            <TextInput
              label="Due Date (optional)"
              value={dueDate}
              onChangeText={setDueDate}
              onBlur={() => setDueDate(parseDateInput(dueDate))}
              mode="outlined"
              placeholder="today, tomorrow, next week, or YYYY-MM-DD"
              style={styles.input}
              left={<TextInput.Icon icon="calendar" />}
            />

            {/* Notes */}
            <TextInput
              label="Notes (optional)"
              value={notes}
              onChangeText={setNotes}
              mode="outlined"
              placeholder="Add additional details..."
              multiline
              numberOfLines={3}
              style={styles.input}
            />

            {/* Quick Tips */}
            <View style={styles.tipsContainer}>
              <MaterialCommunityIcons
                name="lightbulb-outline"
                size={16}
                color={theme.colors.textSecondary}
              />
              <Text
                style={[styles.tipText, { color: theme.colors.textSecondary }]}
              >
                Tip: For due date, try "today", "tomorrow", or "next week"
              </Text>
            </View>
          </ScrollView>

          {/* Actions */}
          <View style={styles.actions}>
            <Button mode="outlined" onPress={handleClose} style={styles.button}>
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.button}
              disabled={!title.trim()}
            >
              {mode === "create" ? "Create" : "Update"}
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.OS === "ios" ? 34 : 16,
    maxHeight: "90%",
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#ccc",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    paddingHorizontal: 20,
  },
  input: {
    marginBottom: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    marginRight: 0,
  },
  tipsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
    marginBottom: 16,
  },
  tipText: {
    fontSize: 12,
    flex: 1,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 12,
  },
  button: {
    flex: 1,
  },
});
