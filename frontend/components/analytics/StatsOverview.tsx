import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Text } from "react-native-paper";
import { useTheme } from "../../theme/ThemeContext";

interface StatItemProps {
  label: string;
  value: string | number;
  icon: string;
  trend?: number;
  color?: string;
}

const StatItem: React.FC<StatItemProps> = ({
  label,
  value,
  icon,
  trend,
  color,
}) => {
  const { theme } = useTheme();
  const trendColor =
    trend && trend > 0
      ? "#4CAF50"
      : trend && trend < 0
      ? "#F44336"
      : theme.colors.textSecondary;

  return (
    <Card
      style={[styles.statCard, { backgroundColor: theme.colors.surface }]}
      mode="contained"
    >
      <View style={styles.statHeader}>
        <MaterialCommunityIcons
          name={icon as any}
          size={24}
          color={color || theme.colors.primary}
        />
        {trend !== undefined && (
          <View style={styles.trendContainer}>
            <MaterialCommunityIcons
              name={
                trend > 0
                  ? "trending-up"
                  : trend < 0
                  ? "trending-down"
                  : "trending-neutral"
              }
              size={16}
              color={trendColor}
            />
            <Text variant="bodySmall" style={{ color: trendColor }}>
              {Math.abs(trend)}%
            </Text>
          </View>
        )}
      </View>
      <Text
        variant="headlineMedium"
        style={[styles.statValue, { color: theme.colors.text }]}
      >
        {value}
      </Text>
      <Text variant="bodySmall" style={{ color: theme.colors.textSecondary }}>
        {label}
      </Text>
    </Card>
  );
};

interface StatsOverviewProps {
  stats: StatItemProps[];
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  return (
    <View style={styles.container}>
      {stats.map((stat, index) => (
        <StatItem key={index} {...stat} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    minWidth: "47%",
    padding: 16,
    borderRadius: 16,
  },
  statHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  trendContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statValue: {
    fontWeight: "bold",
    marginBottom: 4,
  },
});
