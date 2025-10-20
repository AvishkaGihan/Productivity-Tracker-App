import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { Text } from "react-native-paper";
import { useTheme } from "../../theme/ThemeContext";

interface CategoryData {
  name: string;
  count: number;
  color: string;
  legendFontColor?: string;
  legendFontSize?: number;
}

interface CategoryDistributionProps {
  data: CategoryData[];
  title?: string;
}

export const CategoryDistribution: React.FC<CategoryDistributionProps> = ({
  data,
  title = "Category Distribution",
}) => {
  const { theme } = useTheme();
  const screenWidth = Dimensions.get("window").width;

  const chartData = data.map((item) => ({
    name: item.name,
    population: item.count,
    color: item.color,
    legendFontColor: theme.colors.text,
    legendFontSize: 12,
  }));

  const chartConfig = {
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Text
        variant="titleMedium"
        style={[styles.title, { color: theme.colors.text }]}
      >
        {title}
      </Text>
      {data.length > 0 ? (
        <PieChart
          data={chartData}
          width={screenWidth - 48}
          height={220}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
          hasLegend={true}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.textSecondary }}
          >
            No category data available
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  title: {
    marginBottom: 16,
    fontWeight: "600",
  },
  emptyState: {
    height: 220,
    justifyContent: "center",
    alignItems: "center",
  },
});
