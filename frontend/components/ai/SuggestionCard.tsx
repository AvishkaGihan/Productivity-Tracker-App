import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useRef } from "react";
import {
  Animated,
  PanResponder,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Card, Chip, IconButton, Text } from "react-native-paper";
import { useTheme } from "../../theme";

interface Suggestion {
  title: string;
  reason?: string;
  confidence?: number; // 0-100
}

interface SuggestionCardProps {
  suggestion: Suggestion;
  onAdd: (suggestion: Suggestion) => void;
  onEdit?: (suggestion: Suggestion) => void;
  index: number;
}

export const SuggestionCard: React.FC<SuggestionCardProps> = ({
  suggestion,
  onAdd,
  onEdit,
  index,
}) => {
  const { theme } = useTheme();
  const translateX = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx > 0) {
          translateX.setValue(Math.min(gestureState.dx, 100));
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 80) {
          // Swipe right to add
          handleAdd();
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

  const handleAdd = () => {
    Animated.timing(translateX, {
      toValue: 500,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onAdd(suggestion);
    });
  };

  const getConfidenceColor = (confidence?: number) => {
    if (!confidence) return theme.colors.textSecondary;
    if (confidence >= 80) return theme.colors.success;
    if (confidence >= 60) return theme.colors.warning;
    return theme.colors.error;
  };

  const getConfidenceLabel = (confidence?: number) => {
    if (!confidence) return "N/A";
    if (confidence >= 80) return "High";
    if (confidence >= 60) return "Medium";
    return "Low";
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }, { translateX }],
        },
      ]}
      {...panResponder.panHandlers}
    >
      {/* Swipe Action Background */}
      <View
        style={[
          styles.swipeBackground,
          { backgroundColor: theme.colors.success },
        ]}
      >
        <MaterialCommunityIcons name="plus-circle" size={24} color="#fff" />
        <Text style={styles.swipeText}>Add Task</Text>
      </View>

      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <View style={styles.header}>
            <MaterialCommunityIcons
              name="lightbulb-on"
              size={20}
              color={theme.colors.warning}
            />
            {suggestion.confidence !== undefined && (
              <Chip
                style={[
                  styles.confidenceChip,
                  {
                    backgroundColor: `${getConfidenceColor(
                      suggestion.confidence
                    )}20`,
                  },
                ]}
                textStyle={{
                  color: getConfidenceColor(suggestion.confidence),
                  fontSize: 11,
                }}
              >
                {getConfidenceLabel(suggestion.confidence)}
              </Chip>
            )}
          </View>

          <Text style={[styles.title, { color: theme.colors.text }]}>
            {suggestion.title}
          </Text>

          {suggestion.reason && (
            <Text
              style={[styles.reason, { color: theme.colors.textSecondary }]}
              numberOfLines={2}
            >
              {suggestion.reason}
            </Text>
          )}

          <View style={styles.actions}>
            {onEdit && (
              <IconButton
                icon="pencil"
                size={20}
                onPress={() => onEdit(suggestion)}
                iconColor={theme.colors.primary}
              />
            )}
            <TouchableOpacity
              style={[
                styles.addButton,
                { backgroundColor: theme.colors.primary },
              ]}
              onPress={handleAdd}
            >
              <MaterialCommunityIcons name="plus" size={20} color="#fff" />
              <Text style={styles.addButtonText}>Add Task</Text>
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    marginHorizontal: 16,
  },
  swipeBackground: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 100,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    gap: 4,
  },
  swipeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  card: {
    elevation: 2,
    borderRadius: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  confidenceChip: {
    height: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  reason: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 8,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
