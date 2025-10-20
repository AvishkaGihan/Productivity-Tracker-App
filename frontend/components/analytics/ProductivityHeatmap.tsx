import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { useTheme } from "../../theme/ThemeContext";

interface ProductivityHeatmapProps {
  data: number[][]; // 7 weeks x 7 days
  title?: string;
}

export const ProductivityHeatmap: React.FC<ProductivityHeatmapProps> = ({
  data,
  title = "Productivity Heatmap",
}) => {
  const { theme } = useTheme();

  const getColor = (value: number) => {
    if (value === 0) return theme.colors.surface;
    if (value <= 2) return "rgba(98, 0, 238, 0.3)";
    if (value <= 5) return "rgba(98, 0, 238, 0.5)";
    if (value <= 8) return "rgba(98, 0, 238, 0.7)";
    return theme.colors.primary;
  };

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Text
        variant="titleMedium"
        style={[styles.title, { color: theme.colors.text }]}
      >
        {title}
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          <View style={styles.heatmapContainer}>
            {days.map((day, dayIndex) => (
              <View key={dayIndex} style={styles.row}>
                <Text
                  variant="bodySmall"
                  style={[
                    styles.dayLabel,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  {day}
                </Text>
                {data.map((week, weekIndex) => (
                  <View
                    key={weekIndex}
                    style={[
                      styles.cell,
                      {
                        backgroundColor: getColor(week[dayIndex] || 0),
                      },
                    ]}
                  />
                ))}
              </View>
            ))}
          </View>
          <View style={styles.legend}>
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.textSecondary }}
            >
              Less
            </Text>
            <View style={styles.legendColors}>
              {[0, 2, 5, 8, 10].map((value, index) => (
                <View
                  key={index}
                  style={[
                    styles.legendCell,
                    { backgroundColor: getColor(value) },
                  ]}
                />
              ))}
            </View>
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.textSecondary }}
            >
              More
            </Text>
          </View>
        </View>
      </ScrollView>
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
  heatmapContainer: {
    gap: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dayLabel: {
    width: 40,
    fontSize: 11,
  },
  cell: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
  legend: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 16,
    paddingLeft: 44,
  },
  legendColors: {
    flexDirection: "row",
    gap: 4,
  },
  legendCell: {
    width: 16,
    height: 16,
    borderRadius: 3,
  },
});
