import React, { useEffect, useMemo, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { FAB, SegmentedButtons, Text } from "react-native-paper";
import {
  CategoryDistribution,
  CompletionTrendChart,
  ProductivityHeatmap,
  StatsOverview,
  StreakVisualization,
} from "../components/analytics";
import { useTaskStore } from "../store/task-store";
import { useTheme } from "../theme/ThemeContext";

type TimeRange = "week" | "month";

export default function AnalyticsScreen() {
  const { theme } = useTheme();
  const { tasks, stats, fetchStats } = useTaskStore();
  const [timeRange, setTimeRange] = useState<TimeRange>("week");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  };

  // Calculate analytics data
  const analyticsData = useMemo(() => {
    const now = new Date();
    const days = timeRange === "week" ? 7 : 30;

    // Completion trend data
    const trendData: number[] = [];
    const trendLabels: string[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);

      const dayTasks = tasks.filter((task) => {
        const taskDate = new Date(task.created_at);
        return taskDate.toDateString() === date.toDateString();
      });

      const completedCount = dayTasks.filter((t) => t.is_completed).length;
      trendData.push(completedCount);

      if (timeRange === "week") {
        trendLabels.push(
          ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()]
        );
      } else {
        trendLabels.push(String(date.getDate()));
      }
    }

    // Category distribution - mock data since tasks don't have categories yet
    const categoryData = [
      { name: "Work", count: Math.floor(tasks.length * 0.4), color: "#007AFF" },
      {
        name: "Personal",
        count: Math.floor(tasks.length * 0.3),
        color: "#5856D6",
      },
      {
        name: "Health",
        count: Math.floor(tasks.length * 0.2),
        color: "#34C759",
      },
      {
        name: "Learning",
        count: Math.floor(tasks.length * 0.1),
        color: "#FF9500",
      },
    ];

    // Stats overview
    const totalTasks = stats?.total_tasks || 0;
    const completedTasks = stats?.completed_tasks || 0;
    const completionRate =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const prevWeekCompletion = 45; // Mock data - calculate from previous week
    const trend = completionRate - prevWeekCompletion;

    const statsData = [
      {
        label: "Total Tasks",
        value: totalTasks,
        icon: "checkbox-multiple-marked-outline",
        trend: 12,
        color: theme.colors.primary,
      },
      {
        label: "Completed",
        value: completedTasks,
        icon: "check-circle",
        trend: 8,
        color: theme.colors.success,
      },
      {
        label: "Pending",
        value: stats?.pending_tasks || 0,
        icon: "clock-outline",
        trend: -5,
        color: theme.colors.accent,
      },
      {
        label: "Completion Rate",
        value: `${completionRate}%`,
        icon: "chart-line",
        trend,
        color: theme.colors.secondary,
      },
    ];

    // Streak data
    const currentStreak = 5; // Mock - calculate from actual task completion
    const longestStreak = 12; // Mock - calculate from history
    const weekData = [true, true, false, true, true, true, false]; // Last 7 days

    // Heatmap data (7 weeks x 7 days)
    const heatmapData: number[][] = [];
    for (let week = 0; week < 7; week++) {
      const weekData: number[] = [];
      for (let day = 0; day < 7; day++) {
        weekData.push(Math.floor(Math.random() * 10)); // Mock data
      }
      heatmapData.push(weekData);
    }

    return {
      trendData,
      trendLabels,
      categoryData,
      statsData,
      currentStreak,
      longestStreak,
      weekData,
      heatmapData,
    };
  }, [tasks, stats, timeRange, theme]);

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text
            variant="headlineMedium"
            style={[styles.title, { color: theme.colors.text }]}
          >
            Analytics & Insights
          </Text>
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.textSecondary }}
          >
            Track your productivity trends
          </Text>
        </View>

        {/* Time Range Selector */}
        <View style={styles.timeRangeContainer}>
          <SegmentedButtons
            value={timeRange}
            onValueChange={(value) => setTimeRange(value as TimeRange)}
            buttons={[
              {
                value: "week",
                label: "Week",
                icon: "calendar-week",
              },
              {
                value: "month",
                label: "Month",
                icon: "calendar-month",
              },
            ]}
            style={{ backgroundColor: theme.colors.surface }}
          />
        </View>

        {/* Stats Overview */}
        <StatsOverview stats={analyticsData.statsData} />

        {/* Streak Visualization */}
        <StreakVisualization
          currentStreak={analyticsData.currentStreak}
          longestStreak={analyticsData.longestStreak}
          weekData={analyticsData.weekData}
        />

        {/* Completion Trend Chart */}
        <CompletionTrendChart
          data={analyticsData.trendData}
          labels={analyticsData.trendLabels}
          title={`Completion Trend (${
            timeRange === "week" ? "Last 7 Days" : "Last 30 Days"
          })`}
        />

        {/* Category Distribution */}
        <CategoryDistribution
          data={analyticsData.categoryData}
          title="Tasks by Category"
        />

        {/* Productivity Heatmap */}
        <ProductivityHeatmap
          data={analyticsData.heatmapData}
          title="Productivity Heatmap (Last 7 Weeks)"
        />

        {/* Bottom spacing */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Export/Share FAB */}
      <FAB
        icon="share-variant"
        label="Share Stats"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => {
          // TODO: Implement share functionality
          console.log("Share stats");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  timeRangeContainer: {
    marginBottom: 20,
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
  },
});
