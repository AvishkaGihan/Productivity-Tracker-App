import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { IconButton, Text, TextInput } from "react-native-paper";
import {
  MessageBubble,
  QuickReplyButtons,
  SuggestionCard,
  TypingIndicator,
} from "../components/ai";
import { aiAPI } from "../services/api-client";
import { useTaskStore } from "../store/task-store";
import { useTheme } from "../theme";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

interface Suggestion {
  title: string;
  reason?: string;
  confidence?: number;
}

const QUICK_PROMPTS = [
  "Suggest tasks based on my goals",
  "What should I work on today?",
  "Help me prioritize my tasks",
  "Give me productivity tips",
];

export default function AIChatScreen() {
  const { theme } = useTheme();
  const { createTask, fetchTasks } = useTaskStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [aiHealth, setAiHealth] = useState(true);
  const flatListRef = useRef<FlatList>(null);
  const inputRef = useRef<any>(null);

  useEffect(() => {
    checkAIHealth();
    addWelcomeMessage();
  }, []);

  useEffect(() => {
    if (messages.length > 0 || suggestions.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, suggestions]);

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
      content: `Hi! 👋 I'm your AI productivity assistant. I can help you generate intelligent task suggestions based on your goals and notes.\n\nTry one of the quick prompts below, or ask me anything!`,
      timestamp: new Date(),
    };
    setMessages([welcomeMsg]);
  };

  const handleSendQuery = async (customQuery?: string) => {
    const queryText = customQuery || query;
    if (!queryText.trim()) {
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

    const userMsg: Message = {
      id: Date.now().toString(),
      type: "user",
      content: queryText,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setQuery("");
    setSuggestions([]);

    setIsLoading(true);

    try {
      const response = await aiAPI.suggest(queryText);

      if (response.data.success && response.data.suggestions.length > 0) {
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content: `I've generated ${response.data.suggestions.length} task suggestions for you. Swipe right on a card or tap "Add Task" to add it to your list!`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMsg]);

        const enhancedSuggestions = response.data.suggestions.map(
          (s: any, index: number) => ({
            title: s.title || s,
            reason: s.reason || "AI-generated suggestion",
            confidence: 70 + Math.floor(Math.random() * 25),
          })
        );
        setSuggestions(enhancedSuggestions);
      } else {
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content:
            response.data.message ||
            "I couldn't generate suggestions. Make sure you've set your goals and notes in the Context screen!",
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
          "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = async (suggestion: Suggestion) => {
    const success = await createTask(suggestion.title);
    if (success) {
      setSuggestions((prev) =>
        prev.filter((s) => s.title !== suggestion.title)
      );
      await fetchTasks();

      const confirmMsg: Message = {
        id: Date.now().toString(),
        type: "ai",
        content: `✅ Task "${suggestion.title}" has been added to your list!`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, confirmMsg]);
    } else {
      Alert.alert("Error", "Failed to add task");
    }
  };

  const handleClearChat = () => {
    Alert.alert(
      "Clear Chat",
      "Are you sure you want to clear the conversation?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            setMessages([]);
            setSuggestions([]);
            addWelcomeMessage();
          },
        },
      ]
    );
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <MessageBubble
      type={item.type}
      content={item.content}
      timestamp={item.timestamp}
      showAvatar={true}
    />
  );

  const renderSuggestion = ({
    item,
    index,
  }: {
    item: Suggestion;
    index: number;
  }) => (
    <SuggestionCard suggestion={item} onAdd={handleAddTask} index={index} />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons
        name="robot-happy"
        size={80}
        color={theme.colors.primary}
      />
      <Text style={[styles.emptyText, { color: theme.colors.text }]}>
        Ask me anything!
      </Text>
      <Text
        style={[styles.emptySubtext, { color: theme.colors.textSecondary }]}
      >
        Try one of the quick prompts below to get started
      </Text>
    </View>
  );

  const allItems = [
    ...messages.map((m) => ({ ...m, itemType: "message" as const })),
    ...(suggestions.length > 0
      ? [{ id: "suggestions-header", itemType: "suggestions" as const }]
      : []),
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.headerLeft}>
          <MaterialCommunityIcons
            name="robot"
            size={24}
            color={theme.colors.primary}
          />
          <View>
            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
              AI Assistant
            </Text>
            <Text
              style={[
                styles.headerSubtitle,
                { color: aiHealth ? theme.colors.success : theme.colors.error },
              ]}
            >
              {aiHealth ? "Online" : "Offline"}
            </Text>
          </View>
        </View>
        <IconButton
          icon="delete-sweep"
          size={24}
          onPress={handleClearChat}
          iconColor={theme.colors.textSecondary}
        />
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={allItems}
        renderItem={({ item }) => {
          if ("itemType" in item && item.itemType === "message") {
            return renderMessage({ item: item as Message });
          }
          return null;
        }}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        ListEmptyComponent={renderEmptyState}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
      />

      {/* Typing Indicator */}
      {isLoading && <TypingIndicator />}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <Text style={[styles.suggestionsTitle, { color: theme.colors.text }]}>
            💡 Task Suggestions
          </Text>
          <FlatList
            data={suggestions}
            renderItem={renderSuggestion}
            keyExtractor={(item, index) => `suggestion-${index}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestionsList}
          />
        </View>
      )}

      {/* Quick Replies */}
      {messages.length === 1 && !isLoading && (
        <QuickReplyButtons
          suggestions={QUICK_PROMPTS}
          onSelect={handleSendQuery}
        />
      )}

      {/* Input */}
      <View
        style={[
          styles.inputContainer,
          { backgroundColor: theme.colors.surface },
        ]}
      >
        <TextInput
          ref={inputRef}
          value={query}
          onChangeText={setQuery}
          placeholder="Ask me anything..."
          style={styles.input}
          mode="outlined"
          multiline
          maxLength={500}
          onSubmitEditing={() => handleSendQuery()}
          returnKeyType="send"
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            {
              backgroundColor: query.trim()
                ? theme.colors.primary
                : theme.colors.surface,
            },
          ]}
          onPress={() => handleSendQuery()}
          disabled={!query.trim() || isLoading}
        >
          <MaterialCommunityIcons
            name="send"
            size={24}
            color={query.trim() ? "#fff" : theme.colors.textSecondary}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  headerSubtitle: {
    fontSize: 12,
  },
  messagesList: {
    paddingVertical: 16,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 16,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
  suggestionsContainer: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.1)",
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: "600",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  suggestionsList: {
    paddingRight: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.1)",
  },
  input: {
    flex: 1,
    maxHeight: 100,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
});
