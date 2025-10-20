import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Text } from "react-native-paper";
import { useTheme } from "../../theme/ThemeContext";

interface CompletionTrendChartProps {
  data: number[];
  labels: string[];
  title?: string;
}

export const CompletionTrendChart: React.FC<CompletionTrendChartProps> = ({
  data,
  labels,
  title = "Completion Trend",
}) => {
  const { theme } = useTheme();
  const screenWidth = Dimensions.get("window").width;

  const chartConfig = {
    backgroundColor: theme.colors.surface,
    backgroundGradientFrom: theme.colors.surface,
    backgroundGradientTo: theme.colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(98, 0, 238, ${opacity})`,
    labelColor: (opacity = 1) => theme.colors.text,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: theme.colors.primary,
    },
  };

  const chartData = {
    labels,
    datasets: [
      {
        data,
        color: (opacity = 1) => `rgba(98, 0, 238, ${opacity})`,
        strokeWidth: 3,
      },
    ],
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Text
        variant="titleMedium"
        style={[styles.title, { color: theme.colors.text }]}
      >
        {title}
      </Text>
      <LineChart
        data={chartData}
        width={screenWidth - 48}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        withInnerLines={false}
        withOuterLines={true}
        withVerticalLines={false}
        withHorizontalLines={true}
        withVerticalLabels={true}
        withHorizontalLabels={true}
        fromZero
      />
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
  chart: {
    borderRadius: 16,
    marginLeft: -16,
  },
});
