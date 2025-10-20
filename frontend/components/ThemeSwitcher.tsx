/**
 * Theme Switcher Component
 * UI for switching between themes and theme variants
 */

import React, { useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { ThemeMode, ThemeVariant, useTheme } from "../theme";
import { Button } from "./common/Button";
import { Card } from "./common/Card";

export const ThemeSwitcher: React.FC = () => {
  const {
    theme,
    themeMode,
    themeVariant,
    setThemeMode,
    setThemeVariant,
    toggleTheme,
  } = useTheme();
  const [visible, setVisible] = useState(false);

  const modes: { value: ThemeMode; label: string }[] = [
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
  ];

  const variants: {
    value: ThemeVariant;
    label: string;
    description: string;
  }[] = [
    {
      value: "default",
      label: "Default",
      description: "Classic iOS-inspired theme",
    },
    {
      value: "professional",
      label: "Professional",
      description: "Clean business look",
    },
    {
      value: "vibrant",
      label: "Vibrant",
      description: "Colorful and energetic",
    },
    { value: "minimal", label: "Minimal", description: "Simple and elegant" },
  ];

  return (
    <>
      <TouchableOpacity onPress={() => setVisible(true)}>
        <View
          style={{
            padding: theme.spacing.md,
            backgroundColor: theme.colors.surface,
            borderRadius: theme.radius.md,
            ...theme.shadows.sm,
          }}
        >
          <Text
            style={{
              fontSize: theme.typography.sizes.md,
              color: theme.colors.text,
              fontWeight: theme.typography.weights.medium,
            }}
          >
            🎨 Theme Settings
          </Text>
        </View>
      </TouchableOpacity>

      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: theme.colors.overlay,
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: theme.colors.background,
              borderTopLeftRadius: theme.radius.xl,
              borderTopRightRadius: theme.radius.xl,
              padding: theme.spacing.lg,
              maxHeight: "80%",
            }}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text
                style={{
                  fontSize: theme.typography.sizes["2xl"],
                  fontWeight: theme.typography.weights.bold,
                  color: theme.colors.text,
                  marginBottom: theme.spacing.lg,
                }}
              >
                Theme Settings
              </Text>

              {/* Mode Selection */}
              <View style={{ marginBottom: theme.spacing.xl }}>
                <Text
                  style={{
                    fontSize: theme.typography.sizes.lg,
                    fontWeight: theme.typography.weights.semiBold,
                    color: theme.colors.text,
                    marginBottom: theme.spacing.md,
                  }}
                >
                  Mode
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    gap: theme.spacing.md,
                  }}
                >
                  {modes.map((mode) => (
                    <TouchableOpacity
                      key={mode.value}
                      onPress={() => setThemeMode(mode.value)}
                      style={{ flex: 1 }}
                    >
                      <Card
                        variant={
                          themeMode === mode.value ? "elevated" : "outlined"
                        }
                        style={{
                          borderWidth: 2,
                          borderColor:
                            themeMode === mode.value
                              ? theme.colors.primary
                              : theme.colors.border,
                        }}
                      >
                        <Text
                          style={{
                            textAlign: "center",
                            color:
                              themeMode === mode.value
                                ? theme.colors.primary
                                : theme.colors.text,
                            fontWeight: theme.typography.weights.semiBold,
                          }}
                        >
                          {mode.label}
                        </Text>
                      </Card>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Variant Selection */}
              <View style={{ marginBottom: theme.spacing.xl }}>
                <Text
                  style={{
                    fontSize: theme.typography.sizes.lg,
                    fontWeight: theme.typography.weights.semiBold,
                    color: theme.colors.text,
                    marginBottom: theme.spacing.md,
                  }}
                >
                  Style
                </Text>
                {variants.map((variant) => (
                  <TouchableOpacity
                    key={variant.value}
                    onPress={() => setThemeVariant(variant.value)}
                    style={{ marginBottom: theme.spacing.md }}
                  >
                    <Card
                      variant={
                        themeVariant === variant.value ? "elevated" : "outlined"
                      }
                      style={{
                        borderWidth: 2,
                        borderColor:
                          themeVariant === variant.value
                            ? theme.colors.primary
                            : theme.colors.border,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: theme.typography.sizes.md,
                          fontWeight: theme.typography.weights.semiBold,
                          color:
                            themeVariant === variant.value
                              ? theme.colors.primary
                              : theme.colors.text,
                          marginBottom: theme.spacing.xs,
                        }}
                      >
                        {variant.label}
                      </Text>
                      <Text
                        style={{
                          fontSize: theme.typography.sizes.sm,
                          color: theme.colors.textSecondary,
                        }}
                      >
                        {variant.description}
                      </Text>
                    </Card>
                  </TouchableOpacity>
                ))}
              </View>

              <Button
                onPress={() => setVisible(false)}
                variant="primary"
                fullWidth
              >
                Done
              </Button>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};
