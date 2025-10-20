import React, { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { IconButton } from "react-native-paper";
import { useTheme } from "../../theme/ThemeContext";

interface RichTextEditorProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  minHeight?: number;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChangeText,
  placeholder = "Write your notes here...",
  minHeight = 120,
}) => {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const insertFormatting = (prefix: string, suffix: string = "") => {
    // Simple formatting - in production, you'd want more sophisticated text manipulation
    const newText = value + prefix + suffix;
    onChangeText(newText);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderColor: isFocused ? theme.colors.primary : theme.colors.surface,
        },
      ]}
    >
      {/* Toolbar */}
      <View
        style={[styles.toolbar, { borderBottomColor: theme.colors.background }]}
      >
        <IconButton
          icon="format-bold"
          size={20}
          onPress={() => insertFormatting("**", "**")}
          iconColor={theme.colors.text}
        />
        <IconButton
          icon="format-italic"
          size={20}
          onPress={() => insertFormatting("_", "_")}
          iconColor={theme.colors.text}
        />
        <IconButton
          icon="format-list-bulleted"
          size={20}
          onPress={() => insertFormatting("\n- ")}
          iconColor={theme.colors.text}
        />
        <IconButton
          icon="format-list-numbered"
          size={20}
          onPress={() => insertFormatting("\n1. ")}
          iconColor={theme.colors.text}
        />
        <IconButton
          icon="link"
          size={20}
          onPress={() => insertFormatting("[Link](url)")}
          iconColor={theme.colors.text}
        />
        <IconButton
          icon="code-tags"
          size={20}
          onPress={() => insertFormatting("`", "`")}
          iconColor={theme.colors.text}
        />
      </View>

      {/* Text Input */}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textSecondary}
        multiline
        textAlignVertical="top"
        style={[
          styles.input,
          {
            color: theme.colors.text,
            minHeight,
          },
        ]}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />

      {/* Character Count */}
      <View style={styles.footer}>
        <View style={{ flex: 1 }} />
        <View
          style={[
            styles.characterCount,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <IconButton
            icon="information-outline"
            size={14}
            iconColor={theme.colors.textSecondary}
          />
          <View style={styles.countText}>
            {value.length > 0 && (
              <View style={{ flexDirection: "row", gap: 8 }}>
                <View style={{ opacity: 0.7 }}>
                  {/* Character count would go here */}
                </View>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 2,
    overflow: "hidden",
  },
  toolbar: {
    flexDirection: "row",
    borderBottomWidth: 1,
    paddingHorizontal: 4,
  },
  input: {
    padding: 16,
    fontSize: 16,
    lineHeight: 24,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  characterCount: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countText: {
    marginLeft: 4,
  },
});
