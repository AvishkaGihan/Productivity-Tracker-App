import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Card, Text } from "react-native-paper";
import { useTheme } from "../../theme/ThemeContext";

interface GoalTemplate {
  id: string;
  title: string;
  category: string;
  icon: string;
  color: string;
  suggestions: string[];
}

const templates: GoalTemplate[] = [
  {
    id: "career",
    title: "Career Growth",
    category: "Career",
    icon: "briefcase",
    color: "#007AFF",
    suggestions: [
      "Get promoted to senior position",
      "Learn a new programming language",
      "Complete professional certification",
      "Build a side project",
    ],
  },
  {
    id: "health",
    title: "Health & Fitness",
    category: "Health",
    icon: "heart-pulse",
    color: "#34C759",
    suggestions: [
      "Exercise 3 times per week",
      "Drink 8 glasses of water daily",
      "Lose 10 pounds",
      "Run a 5K marathon",
    ],
  },
  {
    id: "learning",
    title: "Learning & Development",
    category: "Learning",
    icon: "school",
    color: "#FF9500",
    suggestions: [
      "Read 12 books this year",
      "Complete online course",
      "Learn a new language",
      "Master a musical instrument",
    ],
  },
  {
    id: "personal",
    title: "Personal Development",
    category: "Personal",
    icon: "account-star",
    color: "#5856D6",
    suggestions: [
      "Meditate daily for 10 minutes",
      "Journal weekly",
      "Develop a new hobby",
      "Improve public speaking",
    ],
  },
  {
    id: "finance",
    title: "Financial Goals",
    category: "Finance",
    icon: "cash",
    color: "#FFD700",
    suggestions: [
      "Save $10,000 for emergency fund",
      "Pay off credit card debt",
      "Invest in retirement account",
      "Create a budget plan",
    ],
  },
  {
    id: "social",
    title: "Social & Relationships",
    category: "Personal",
    icon: "account-group",
    color: "#FF3B30",
    suggestions: [
      "Reconnect with old friends",
      "Volunteer monthly",
      "Join a community group",
      "Strengthen family bonds",
    ],
  },
];

interface GoalTemplatesProps {
  onSelectTemplate: (template: GoalTemplate) => void;
}

export const GoalTemplates: React.FC<GoalTemplatesProps> = ({
  onSelectTemplate,
}) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Text
        variant="titleMedium"
        style={[styles.header, { color: theme.colors.text }]}
      >
        Goal Templates
      </Text>
      <Text
        variant="bodySmall"
        style={[styles.subtitle, { color: theme.colors.textSecondary }]}
      >
        Choose a template to get started quickly
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {templates.map((template) => (
          <TouchableOpacity
            key={template.id}
            onPress={() => onSelectTemplate(template)}
            activeOpacity={0.7}
          >
            <Card
              style={[
                styles.templateCard,
                { backgroundColor: theme.colors.surface },
              ]}
              mode="contained"
            >
              <Card.Content style={styles.cardContent}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: template.color + "20" },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={template.icon as any}
                    size={32}
                    color={template.color}
                  />
                </View>
                <Text
                  variant="titleSmall"
                  style={[styles.templateTitle, { color: theme.colors.text }]}
                  numberOfLines={2}
                >
                  {template.title}
                </Text>
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.textSecondary }}
                >
                  {template.suggestions.length} suggestions
                </Text>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    fontWeight: "600",
    marginBottom: 4,
  },
  subtitle: {
    marginBottom: 16,
  },
  scrollContent: {
    paddingRight: 16,
  },
  templateCard: {
    width: 160,
    marginRight: 12,
    borderRadius: 12,
  },
  cardContent: {
    alignItems: "center",
    paddingVertical: 20,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  templateTitle: {
    textAlign: "center",
    fontWeight: "600",
    marginBottom: 4,
    height: 40,
  },
});
