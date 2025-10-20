import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Card, Text } from "react-native-paper";
import { useTheme } from "../../theme/ThemeContext";

interface ThemeOption {
  id: string;
  name: string;
  colors: {
    primary: string;
    background: string;
    surface: string;
  };
}

const themes: ThemeOption[] = [
  {
    id: "dark",
    name: "Dark",
    colors: {
      primary: "#007AFF",
      background: "#000000",
      surface: "#1C1C1E",
    },
  },
  {
    id: "light",
    name: "Light",
    colors: {
      primary: "#007AFF",
      background: "#FFFFFF",
      surface: "#F5F5F5",
    },
  },
  {
    id: "purple",
    name: "Purple Dream",
    colors: {
      primary: "#9C27B0",
      background: "#1A0033",
      surface: "#2D1B46",
    },
  },
];

interface ThemePreviewProps {
  selectedTheme: string;
  onSelectTheme: (themeId: string) => void;
}

export const ThemePreview: React.FC<ThemePreviewProps> = ({
  selectedTheme,
  onSelectTheme,
}) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      {themes.map((themeOption) => (
        <TouchableOpacity
          key={themeOption.id}
          onPress={() => onSelectTheme(themeOption.id)}
          activeOpacity={0.7}
        >
          <Card
            style={[
              styles.themeCard,
              selectedTheme === themeOption.id && {
                borderWidth: 3,
                borderColor: theme.colors.primary,
              },
            ]}
          >
            <View
              style={[
                styles.preview,
                { backgroundColor: themeOption.colors.background },
              ]}
            >
              <View
                style={[
                  styles.previewSurface,
                  { backgroundColor: themeOption.colors.surface },
                ]}
              >
                <View
                  style={[
                    styles.previewAccent,
                    { backgroundColor: themeOption.colors.primary },
                  ]}
                />
              </View>
            </View>
            <Card.Content style={styles.themeInfo}>
              <View style={styles.nameRow}>
                <Text variant="bodyMedium" style={{ color: theme.colors.text }}>
                  {themeOption.name}
                </Text>
                {selectedTheme === themeOption.id && (
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={20}
                    color={theme.colors.primary}
                  />
                )}
              </View>
            </Card.Content>
          </Card>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
  },
  themeCard: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  preview: {
    height: 100,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 12,
  },
  previewSurface: {
    flex: 1,
    borderRadius: 8,
    padding: 8,
  },
  previewAccent: {
    width: "60%",
    height: 8,
    borderRadius: 4,
  },
  themeInfo: {
    paddingTop: 12,
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
