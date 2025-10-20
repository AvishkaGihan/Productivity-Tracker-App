import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Badge, Text } from "react-native-paper";
import { useTheme } from "../../theme/ThemeContext";

interface TabConfig {
  label: string;
  icon: string;
  activeIcon?: string;
  badge?: number;
}

const tabConfig: Record<string, TabConfig> = {
  Dashboard: {
    label: "Dashboard",
    icon: "view-dashboard-outline",
    activeIcon: "view-dashboard",
  },
  Tasks: {
    label: "Tasks",
    icon: "checkbox-multiple-outline",
    activeIcon: "checkbox-multiple-marked",
  },
  AIChat: { label: "AI Chat", icon: "robot-outline", activeIcon: "robot" },
  Analytics: {
    label: "Analytics",
    icon: "chart-line",
    activeIcon: "chart-line",
  },
  Context: { label: "Context", icon: "target", activeIcon: "target" },
};

export const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const config = tabConfig[route.name] || {
          label: route.name,
          icon: "circle",
        };
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TabButton
            key={route.key}
            label={config.label}
            icon={isFocused ? config.activeIcon || config.icon : config.icon}
            isFocused={isFocused}
            badge={config.badge}
            onPress={onPress}
            onLongPress={onLongPress}
          />
        );
      })}
    </View>
  );
};

interface TabButtonProps {
  label: string;
  icon: string;
  isFocused: boolean;
  badge?: number;
  onPress: () => void;
  onLongPress: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({
  label,
  icon,
  isFocused,
  badge,
  onPress,
  onLongPress,
}) => {
  const { theme } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: isFocused ? 1.1 : 1,
        useNativeDriver: true,
        friction: 8,
      }),
      Animated.spring(translateY, {
        toValue: isFocused ? -4 : 0,
        useNativeDriver: true,
        friction: 8,
      }),
    ]).start();
  }, [isFocused]);

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.9,
      useNativeDriver: true,
      friction: 8,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: isFocused ? 1.1 : 1,
      useNativeDriver: true,
      friction: 8,
    }).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.tabButton}
      activeOpacity={1}
    >
      <Animated.View
        style={[
          styles.tabContent,
          {
            transform: [{ scale }, { translateY }],
          },
        ]}
      >
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name={icon as any}
            size={24}
            color={
              isFocused ? theme.colors.primary : theme.colors.textSecondary
            }
          />
          {badge !== undefined && badge > 0 && (
            <Badge
              style={[styles.badge, { backgroundColor: theme.colors.error }]}
              size={16}
            >
              {badge > 99 ? "99+" : badge}
            </Badge>
          )}
        </View>
        <Text
          variant="labelSmall"
          style={[
            styles.label,
            {
              color: isFocused
                ? theme.colors.primary
                : theme.colors.textSecondary,
              fontWeight: isFocused ? "600" : "400",
            },
          ]}
        >
          {label}
        </Text>
        {isFocused && (
          <View
            style={[
              styles.indicator,
              { backgroundColor: theme.colors.primary },
            ]}
          />
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: Platform.OS === "ios" ? 88 : 60,
    paddingBottom: Platform.OS === "ios" ? 28 : 0,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabContent: {
    alignItems: "center",
    gap: 4,
  },
  iconContainer: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -8,
  },
  label: {
    fontSize: 11,
  },
  indicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },
});
