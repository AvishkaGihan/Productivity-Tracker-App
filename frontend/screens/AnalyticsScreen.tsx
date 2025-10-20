import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { Card, Divider, ProgressBar, Text } from "react-native-paper";
import { useTaskStore } from "../store/task-store";
import { colors } from "../theme/colors";

export default function AnalyticsScreen() {
  const { stats, fetchStats } = useTaskStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  };

  const completionRate = stats?.completion_rate || 0;
  const progressValue = completionRate / 100;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Main Stats Card */}
      <Card style={styles.mainCard}>
        <Card.Content>
          <View style={styles.header}>
            <MaterialCommunityIcons
              name="chart-line"
              size={24}
              color={colors.secondary}
            />
            <Text style={styles.cardTitle}>Task Analytics</Text>
          </View>
          <Divider style={styles.divider} />

          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{stats?.total_tasks || 0}</Text>
              <Text style={styles.statLabel}>Total Tasks</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statNumber, { color: colors.success }]}>
                {stats?.completed_tasks || 0}
              </Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statNumber, { color: colors.accent }]}>
                {stats?.pending_tasks || 0}
              </Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Completion Progress */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.progressHeader}>
            <MaterialCommunityIcons
              name="target-variant"
              size={20}
              color={colors.primary}
            />
            <Text style={styles.progressTitle}>Completion Progress</Text>
          </View>
          <Divider style={styles.divider} />

          <View style={styles.progressContainer}>
            <View style={styles.progressLabelRow}>
              <Text style={styles.label}>Overall Progress</Text>
              <Text style={styles.percentText}>
                {Math.round(completionRate)}%
              </Text>
            </View>
            <ProgressBar
              progress={progressValue}
              color={colors.primary}
              style={styles.progressBar}
            />

            <View style={styles.progressDetail}>
              <View style={styles.detailRow}>
                <View
                  style={[styles.colorDot, { backgroundColor: colors.success }]}
                />
                <Text style={styles.detailText}>
                  {stats?.completed_tasks} completed out of {stats?.total_tasks}
                </Text>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Insights */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.insightHeader}>
            <MaterialCommunityIcons
              name="lightbulb"
              size={20}
              color={colors.accent}
            />
            <Text style={styles.progressTitle}>Insights</Text>
          </View>
          <Divider style={styles.divider} />

          <View style={styles.insightBox}>
            {stats && stats.total_tasks === 0 ? (
              <Text style={styles.insightText}>
                Start creating tasks to track your productivity!
              </Text>
            ) : stats && completionRate >= 80 ? (
              <Text style={styles.insightText}>
                🎉 Great job! You're on fire with a {Math.round(completionRate)}
                % completion rate!
              </Text>
            ) : stats && completionRate >= 50 ? (
              <Text style={styles.insightText}>
                💪 Good progress! Keep going to reach 100% completion.
              </Text>
            ) : (
              <Text style={styles.insightText}>
                📈 You're just getting started. Focus on completing those
                pending tasks!
              </Text>
            )}
          </View>
        </Card.Content>
      </Card>

      {/* Productivity Tips */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.tipsHeader}>
            <MaterialCommunityIcons
              name="star"
              size={20}
              color={colors.primary}
            />
            <Text style={styles.progressTitle}>Tips to Improve</Text>
          </View>
          <Divider style={styles.divider} />

          <View style={styles.tipsList}>
            <View style={styles.tipItem}>
              <Text style={styles.tipNumber}>1</Text>
              <Text style={styles.tipText}>
                Break large tasks into smaller ones
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipNumber}>2</Text>
              <Text style={styles.tipText}>
                Use AI to generate smart task suggestions
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipNumber}>3</Text>
              <Text style={styles.tipText}>Update your goals regularly</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipNumber}>4</Text>
              <Text style={styles.tipText}>
                Check off completed tasks daily
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  mainCard: {
    backgroundColor: colors.surface,
    marginBottom: 16,
  },
  card: {
    backgroundColor: colors.surface,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginLeft: 12,
  },
  divider: {
    marginVertical: 12,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statBox: {
    alignItems: "center",
    paddingVertical: 16,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    marginLeft: 8,
  },
  progressContainer: {
    marginTop: 12,
  },
  progressLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: colors.text,
  },
  percentText: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.primary,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    marginBottom: 12,
  },
  progressDetail: {
    marginTop: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  detailText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  insightHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  insightBox: {
    marginTop: 12,
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
  },
  insightText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  tipsHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  tipsList: {
    marginTop: 12,
    gap: 12,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  tipNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    color: colors.background,
    textAlign: "center",
    lineHeight: 24,
    fontWeight: "bold",
    fontSize: 12,
  },
  tipText: {
    fontSize: 13,
    color: colors.text,
    flex: 1,
    lineHeight: 20,
  },
});
