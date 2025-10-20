import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Divider, Switch, Text } from "react-native-paper";
import { useTheme } from "../../theme/ThemeContext";

interface SettingItemProps {
  icon: string;
  label: string;
  value?: string | boolean;
  type: "navigation" | "toggle" | "value";
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
  iconColor?: string;
  showDivider?: boolean;
}

export const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  label,
  value,
  type,
  onPress,
  onToggle,
  iconColor,
  showDivider = true,
}) => {
  const { theme } = useTheme();

  const renderRightContent = () => {
    switch (type) {
      case "toggle":
        return (
          <Switch
            value={value as boolean}
            onValueChange={onToggle}
            color={theme.colors.primary}
          />
        );
      case "value":
        return (
          <View style={styles.valueContainer}>
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.textSecondary }}
            >
              {value as string}
            </Text>
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={theme.colors.textSecondary}
            />
          </View>
        );
      case "navigation":
        return (
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color={theme.colors.textSecondary}
          />
        );
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.container}
        onPress={onPress}
        disabled={type === "toggle"}
        activeOpacity={0.7}
      >
        <View style={styles.leftContent}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: (iconColor || theme.colors.primary) + "20" },
            ]}
          >
            <MaterialCommunityIcons
              name={icon as any}
              size={22}
              color={iconColor || theme.colors.primary}
            />
          </View>
          <Text
            variant="bodyLarge"
            style={[styles.label, { color: theme.colors.text }]}
          >
            {label}
          </Text>
        </View>
        {renderRightContent()}
      </TouchableOpacity>
      {showDivider && <Divider style={{ marginLeft: 60 }} />}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  label: {
    flex: 1,
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
});
