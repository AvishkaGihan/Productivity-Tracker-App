import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Button, Card, Divider, ProgressBar, Text } from "react-native-paper";
import { useAuthStore } from "../store/auth-store";
import { useTaskStore } from "../store/task-store";
import { colors } from "../theme/colors";

export default function DashboardScreen({ navigation }: any) {
  const { user, logout } = useAuthStore();
  const { stats, fetchStats, isLoading, fetchTasks } = useTaskStore();
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    await fetchStats();
    await fetchTasks();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await initializeData();
    setRefreshing(false);
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: () => logout(),
        style: "destructive",
      },
    ]);
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
      {/* User Welcome Card */}
      <Card style={styles.welcomeCard}>
        <Card.Content>
          <View style={styles.welcomeHeader}>
            <View>
              <Text style={styles.greeting}>
                Welcome, {user?.email.split("@")[0]}!
              </Text>
              <Text style={styles.date}>{new Date().toLocaleDateString()}</Text>
            </View>
            <Button
              mode="text"
              onPress={handleLogout}
              compact
              textColor={colors.error}
            >
              Logout
            </Button>
          </View>
        </Card.Content>
      </Card>

      {/* Progress Card */}
      <Card style={styles.progressCard}>
        <Card.Content>
          <View style={styles.progressHeader}>
            <MaterialCommunityIcons
              name="target"
              size={24}
              color={colors.secondary}
            />
            <Text style={styles.progressTitle}>Today's Progress</Text>
          </View>
          <Divider style={styles.divider} />

          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats?.total_tasks || 0}</Text>
              <Text style={styles.statLabel}>Total Tasks</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.success }]}>
                {stats?.completed_tasks || 0}
              </Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.accent }]}>
                {stats?.pending_tasks || 0}
              </Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
          </View>

          <View style={styles.progressSection}>
            <View style={styles.progressLabelRow}>
              <Text style={styles.progressLabel}>Completion Rate</Text>
              <Text style={styles.progressPercent}>
                {Math.round(completionRate)}%
              </Text>
            </View>
            <ProgressBar
              progress={progressValue}
              color={colors.primary}
              style={styles.progressBar}
            />
          </View>
        </Card.Content>
      </Card>

      {/* Quick Actions */}
      <Card style={styles.actionsCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <Divider style={styles.divider} />

          <View style={styles.buttonRow}>
            <Button
              mode="outlined"
              onPress={() => navigation.navigate("Tasks")}
              style={styles.actionButton}
              icon="checkbox-marked-outline"
            >
              View Tasks
            </Button>
            <Button
              mode="outlined"
              onPress={() => navigation.navigate("AI")}
              style={styles.actionButton}
              icon="robot"
            >
              Get Suggestions
            </Button>
          </View>

          <View style={styles.buttonRow}>
            <Button
              mode="outlined"
              onPress={() => navigation.navigate("Analytics")}
              style={styles.actionButton}
              icon="chart-line"
            >
              Analytics
            </Button>
            <Button
              mode="outlined"
              onPress={() => navigation.navigate("Context")}
              style={styles.actionButton}
              icon="target"
            >
              My Goals
            </Button>
          </View>
        </Card.Content>
      </Card>

      {/* Goals & Notes Preview */}
      {(user?.goals || user?.notes) && (
        <Card style={styles.infoCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Your Context</Text>
            <Divider style={styles.divider} />

            {user?.goals && (
              <View style={styles.infoSection}>
                <Text style={styles.infoLabel}>Goals</Text>
                <Text style={styles.infoText} numberOfLines={3}>
                  {user.goals}
                </Text>
              </View>
            )}

            {user?.notes && (
              <View style={styles.infoSection}>
                <Text style={styles.infoLabel}>Notes</Text>
                <Text style={styles.infoText} numberOfLines={3}>
                  {user.notes}
                </Text>
              </View>
            )}

            <Button
              mode="text"
              onPress={() => navigation.navigate("Context")}
              style={styles.editButton}
            >
              Edit Context
            </Button>
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  welcomeCard: {
    backgroundColor: colors.surface,
    marginBottom: 16,
  },
  welcomeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
  },
  date: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  progressCard: {
    backgroundColor: colors.surface,
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginLeft: 12,
  },
  divider: {
    marginVertical: 12,
    backgroundColor: colors.textSecondary,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  progressSection: {
    marginTop: 12,
  },
  progressLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: colors.text,
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.primary,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  actionsCard: {
    backgroundColor: colors.surface,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginVertical: 8,
  },
  actionButton: {
    flex: 1,
    borderColor: colors.primary,
  },
  infoCard: {
    backgroundColor: colors.surface,
    marginBottom: 32,
  },
  infoSection: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.secondary,
    fontWeight: "bold",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  editButton: {
    marginTop: 8,
  },
});
