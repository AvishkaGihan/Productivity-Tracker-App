import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Text } from "react-native-paper";
import { useTheme } from "../../theme";

interface QuickStatProps {
  icon: string;
  label: string;
  value: number | string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  color?: string;
}

export const QuickStat: React.FC<QuickStatProps> = ({
  icon,
  label,
  value,
  trend,
  trendValue,
  color,
}) => {
  const { theme } = useTheme();
  const statColor = color || theme.colors.primary;

  const getTrendIcon = () => {
    if (trend === "up") return "trending-up";
    if (trend === "down") return "trending-down";
    return "minus";
  };

  const getTrendColor = () => {
    if (trend === "up") return theme.colors.success;
    if (trend === "down") return theme.colors.error;
    return theme.colors.textSecondary;
  };

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        <View
          style={[styles.iconContainer, { backgroundColor: `${statColor}15` }]}
        >
          <MaterialCommunityIcons
            name={icon as any}
            size={24}
            color={statColor}
          />
        </View>

        <View style={styles.dataContainer}>
          <Text style={[styles.value, { color: statColor }]}>{value}</Text>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
            {label}
          </Text>
        </View>

        {trend && trendValue && (
          <View style={styles.trendContainer}>
            <MaterialCommunityIcons
              name={getTrendIcon() as any}
              size={16}
              color={getTrendColor()}
            />
            <Text style={[styles.trendText, { color: getTrendColor() }]}>
              {trendValue}
            </Text>
          </View>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 6,
  },
  content: {
    alignItems: "center",
    paddingVertical: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  dataContainer: {
    alignItems: "center",
  },
  value: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  trendContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  trendText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
});
