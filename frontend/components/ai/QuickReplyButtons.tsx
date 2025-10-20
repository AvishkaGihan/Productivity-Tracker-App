import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Chip } from "react-native-paper";
import { useTheme } from "../../theme";

interface QuickReplyButtonsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
}

export const QuickReplyButtons: React.FC<QuickReplyButtonsProps> = ({
  suggestions,
  onSelect,
}) => {
  const { theme } = useTheme();

  if (suggestions.length === 0) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {suggestions.map((suggestion, index) => (
        <Chip
          key={index}
          onPress={() => onSelect(suggestion)}
          style={[styles.chip, { backgroundColor: theme.colors.surface }]}
          icon="message-reply-text"
        >
          {suggestion}
        </Chip>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  content: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    marginRight: 0,
  },
});
