import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Text } from "react-native-paper";
import { useTheme } from "../../theme";

interface MotivationalQuoteProps {
  quote?: string;
  author?: string;
}

const defaultQuotes = [
  {
    quote: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
  },
  {
    quote:
      "Productivity is never an accident. It is always the result of a commitment to excellence.",
    author: "Paul J. Meyer",
  },
  {
    quote: "Focus on being productive instead of busy.",
    author: "Tim Ferriss",
  },
  {
    quote:
      "The key is not to prioritize what's on your schedule, but to schedule your priorities.",
    author: "Stephen Covey",
  },
  {
    quote:
      "You don't have to be great to start, but you have to start to be great.",
    author: "Zig Ziglar",
  },
];

export const MotivationalQuote: React.FC<MotivationalQuoteProps> = ({
  quote,
  author,
}) => {
  const { theme } = useTheme();

  // Select a random quote if none provided
  const selectedQuote =
    quote ||
    defaultQuotes[Math.floor(Math.random() * defaultQuotes.length)].quote;
  const selectedAuthor =
    author ||
    defaultQuotes.find((q) => q.quote === selectedQuote)?.author ||
    "";

  return (
    <Card style={styles.card}>
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name="format-quote-open"
            size={32}
            color="rgba(255, 255, 255, 0.3)"
          />
        </View>

        <Text style={styles.quote}>{selectedQuote}</Text>

        {selectedAuthor && (
          <Text style={styles.author}>— {selectedAuthor}</Text>
        )}
      </LinearGradient>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 12,
    overflow: "hidden",
  },
  gradient: {
    padding: 20,
    paddingVertical: 24,
  },
  iconContainer: {
    marginBottom: 8,
  },
  quote: {
    fontSize: 16,
    lineHeight: 24,
    color: "#fff",
    fontStyle: "italic",
    marginBottom: 12,
  },
  author: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "600",
    textAlign: "right",
  },
});
