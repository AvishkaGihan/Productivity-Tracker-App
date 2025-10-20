import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Button, Card, Divider, Text, TextInput } from "react-native-paper";
import { contextAPI } from "../services/api-client";
import { useAuthStore, User } from "../store/auth-store";
import { useTaskStore } from "../store/task-store";
import { colors } from "../theme/colors";

export default function ContextScreen() {
  const { user, setUser } = useAuthStore();
  const { fetchStats } = useTaskStore();
  const [goals, setGoals] = useState(user?.goals || "");
  const [notes, setNotes] = useState(user?.notes || "");
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  };

  const handleSaveContext = async () => {
    if (!goals.trim() && !notes.trim()) {
      Alert.alert("Error", "Please enter at least goals or notes");
      return;
    }

    setIsLoading(true);
    try {
      const response = await contextAPI.update(goals, notes);
      const updatedUser = { ...user, ...response.data.user };
      setUser(updatedUser);
      Alert.alert("Success", "Your context has been updated!");
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.detail || "Failed to save context"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearContext = () => {
    Alert.alert(
      "Clear Context",
      "Are you sure you want to clear your goals and notes?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          onPress: async () => {
            setIsLoading(true);
            try {
              await contextAPI.delete();
              setGoals("");
              setNotes("");
              const updatedUser = { ...user, goals: "", notes: "" } as User;
              setUser(updatedUser);
              Alert.alert("Success", "Context cleared");
            } catch (error: any) {
              Alert.alert("Error", "Failed to clear context");
            } finally {
              setIsLoading(false);
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Info Card */}
      <Card style={styles.infoCard}>
        <Card.Content>
          <View style={styles.infoHeader}>
            <MaterialCommunityIcons
              name="information"
              size={20}
              color={colors.primary}
            />
            <Text style={styles.infoTitle}>About Context</Text>
          </View>
          <Divider style={styles.divider} />
          <Text style={styles.infoText}>
            Your goals and notes are used by the AI to generate personalized
            task suggestions. The more detailed you are, the better suggestions
            you'll receive.
          </Text>
        </Card.Content>
      </Card>

      {/* Goals Input */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="target"
              size={20}
              color={colors.secondary}
            />
            <Text style={styles.sectionTitle}>Your Goals</Text>
          </View>
          <Divider style={styles.divider} />

          <TextInput
            label="Goals"
            value={goals}
            onChangeText={setGoals}
            multiline
            numberOfLines={6}
            placeholder="Enter your personal and professional goals..."
            placeholderTextColor={colors.textSecondary}
            textColor={colors.text}
            style={styles.textInput}
          />

          <Text style={styles.charCount}>{goals.length}/1000</Text>
        </Card.Content>
      </Card>

      {/* Notes Input */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="note-text"
              size={20}
              color={colors.accent}
            />
            <Text style={styles.sectionTitle}>Additional Notes</Text>
          </View>
          <Divider style={styles.divider} />

          <TextInput
            label="Notes"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={6}
            placeholder="Add context about your situation, preferences, or current focus..."
            placeholderTextColor={colors.textSecondary}
            textColor={colors.text}
            style={styles.textInput}
          />

          <Text style={styles.charCount}>{notes.length}/1000</Text>
        </Card.Content>
      </Card>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleSaveContext}
          loading={isLoading}
          disabled={isLoading}
          style={styles.saveButton}
        >
          Save Context
        </Button>

        <Button
          mode="outlined"
          onPress={handleClearContext}
          textColor={colors.error}
          disabled={isLoading}
        >
          Clear Context
        </Button>
      </View>

      {/* Examples Card */}
      <Card style={styles.exampleCard}>
        <Card.Content>
          <Text style={styles.exampleTitle}>Example Context</Text>
          <Divider style={styles.divider} />

          <View style={styles.exampleSection}>
            <Text style={styles.exampleLabel}>Goals Example:</Text>
            <Text style={styles.exampleText}>
              • Learn FastAPI and LangChain for AI backend development{"\n"}•
              Build a portfolio project showcasing full-stack skills{"\n"}•
              Master React Native for cross-platform development
            </Text>
          </View>

          <View style={styles.exampleSection}>
            <Text style={styles.exampleLabel}>Notes Example:</Text>
            <Text style={styles.exampleText}>
              • Currently focused on backend development{"\n"}• Available 2-3
              hours per day for projects{"\n"}• Prefer shorter tasks for better
              focus
            </Text>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  infoCard: {
    backgroundColor: colors.surface,
    marginBottom: 16,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    marginLeft: 8,
  },
  divider: {
    marginVertical: 12,
  },
  infoText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  card: {
    backgroundColor: colors.surface,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    marginLeft: 8,
  },
  textInput: {
    backgroundColor: colors.background,
    marginVertical: 12,
    minHeight: 120,
  },
  charCount: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "right",
    marginTop: 4,
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  exampleCard: {
    backgroundColor: colors.surface,
    marginBottom: 32,
  },
  exampleTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
  },
  exampleSection: {
    marginTop: 12,
  },
  exampleLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.secondary,
    marginBottom: 4,
  },
  exampleText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
