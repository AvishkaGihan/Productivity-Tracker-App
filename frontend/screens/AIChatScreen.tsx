import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import {
  ActivityIndicator,
  Button,
  Card,
  Text,
  TextInput,
} from "react-native-paper";
import { aiAPI } from "../services/api-client";
import { useAuthStore } from "../store/auth-store";
import { useTaskStore } from "../store/task-store";
import { colors } from "../theme/colors";

interface Message {
  id: string;
  type: "user" | "ai" | "suggestion";
  content: string;
  timestamp: Date;
  suggestions?: Array<{ title: string; reason?: string }>;
}

export default function AIChatScreen() {
  const { user } = useAuthStore();
  const { createTask } = useTaskStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [aiHealth, setAiHealth] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    checkAIHealth();
    addWelcomeMessage();
  }, []);

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const checkAIHealth = async () => {
    try {
      await aiAPI.checkHealth();
      setAiHealth(true);
    } catch (error) {
      setAiHealth(false);
    }
  };

  const addWelcomeMessage = () => {
    const welcomeMsg: Message = {
      id: "0",
      type: "ai",
      content: `Hi! I'm your AI assistant. I can help you generate intelligent task suggestions based on your goals and notes. Try asking me something like: "Suggest tasks based on my goals" or "What should I work on today?"`,
      timestamp: new Date(),
    };
    setMessages([welcomeMsg]);
  };

  const handleSendQuery = async () => {
    if (!query.trim()) {
      Alert.alert("Error", "Please enter a query");
      return;
    }

    if (!aiHealth) {
      Alert.alert(
        "AI Service Unavailable",
        "The AI service is currently unavailable. Please try again later."
      );
      return;
    }

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      type: "user",
      content: query,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setQuery("");

    setIsLoading(true);

    try {
      const response = await aiAPI.suggest(query);

      if (response.data.success && response.data.suggestions.length > 0) {
        const suggestionMsg: Message = {
          id: (Date.now() + 1).toString(),
          type: "suggestion",
          content: `I've generated ${response.data.suggestions.length} task suggestions for you:`,
          timestamp: new Date(),
          suggestions: response.data.suggestions,
        };
        setMessages((prev) => [...prev, suggestionMsg]);
      } else {
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content:
            response.data.message ||
            "No suggestions available. Please set your goals and notes first.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMsg]);
      }
    } catch (error: any) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content:
          error.response?.data?.detail ||
          "Sorry, I encountered an error generating suggestions. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = async (taskTitle: string) => {
    const success = await createTask(taskTitle);
    if (success) {
      Alert.alert("Success", `Task "${taskTitle}" added to your list!`);
    } else {
      Alert.alert("Error", "Failed to add task");
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    if (item.type === "user") {
      return (
        <View style={styles.userMessageContainer}>
          <Card style={styles.userMessage}>
            <Card.Content>
              <Text style={styles.userMessageText}>{item.content}</Text>
            </Card.Content>
          </Card>
        </View>
      );
    }

    if (item.type === "suggestion") {
      return (
        <View style={styles.aiMessageContainer}>
          <Card style={styles.aiMessage}>
            <Card.Content>
              <Text style={styles.messageText}>{item.content}</Text>

              <View style={styles.suggestionsContainer}>
                {item.suggestions?.map((suggestion, index) => (
                  <Card key={index} style={styles.suggestionCard}>
                    <Card.Content>
                      <View style={styles.suggestionHeader}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.suggestionTitle}>
                            {suggestion.title}
                          </Text>
                          {suggestion.reason && (
                            <Text
                              style={styles.suggestionReason}
                              numberOfLines={2}
                            >
                              {suggestion.reason}
                            </Text>
                          )}
                        </View>
                      </View>

                      <Button
                        mode="contained"
                        compact={true}
                        onPress={() => handleAddTask(suggestion.title)}
                        style={styles.addButton}
                      >
                        Add Task
                      </Button>
                    </Card.Content>
                  </Card>
                ))}
              </View>
            </Card.Content>
          </Card>
        </View>
      );
    }

    return (
      <View style={styles.aiMessageContainer}>
        <Card style={styles.aiMessage}>
          <Card.Content>
            <Text style={styles.messageText}>{item.content}</Text>
          </Card.Content>
        </Card>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {!aiHealth && (
        <View style={styles.warningBanner}>
          <MaterialCommunityIcons
            name="alert-circle"
            size={20}
            color={colors.error}
          />
          <Text style={styles.warningText}>AI service unavailable</Text>
        </View>
      )}

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
      />

      <View style={styles.inputContainer}>
        <TextInput
          label="Ask AI for suggestions..."
          value={query}
          onChangeText={setQuery}
          multiline
          maxLength={500}
          placeholder="e.g., Suggest tasks for my goals"
          placeholderTextColor={colors.textSecondary}
          textColor={colors.text}
          style={styles.input}
          editable={!isLoading}
          right={<TextInput.Affix text={`${query.length}/500`} />}
        />

        <Button
          mode="contained"
          onPress={handleSendQuery}
          loading={isLoading}
          disabled={isLoading || !aiHealth || !query.trim()}
          style={styles.sendButton}
          icon="send"
        >
          Send
        </Button>
      </View>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Generating suggestions...</Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  warningBanner: {
    backgroundColor: colors.error + "20",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 8,
  },
  warningText: {
    color: colors.error,
    fontSize: 14,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    gap: 12,
  },
  userMessageContainer: {
    alignItems: "flex-end",
  },
  userMessage: {
    backgroundColor: colors.primary,
    maxWidth: "80%",
  },
  userMessageText: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  aiMessageContainer: {
    alignItems: "flex-start",
  },
  aiMessage: {
    backgroundColor: colors.surface,
    maxWidth: "90%",
  },
  messageText: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  suggestionsContainer: {
    marginTop: 12,
    gap: 8,
  },
  suggestionCard: {
    backgroundColor: colors.background,
    borderColor: colors.secondary,
    borderWidth: 1,
    marginTop: 8,
  },
  suggestionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  suggestionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  suggestionReason: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  addButton: {
    marginTop: 8,
    backgroundColor: colors.secondary,
  },
  inputContainer: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.surface,
    gap: 8,
  },
  input: {
    backgroundColor: colors.surface,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: colors.primary,
  },
  loadingContainer: {
    position: "absolute",
    bottom: 100,
    alignSelf: "center",
    backgroundColor: colors.surface,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  loadingText: {
    color: colors.text,
    marginTop: 8,
  },
});
