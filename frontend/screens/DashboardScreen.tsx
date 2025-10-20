import React, { useEffect } from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { FAB } from "react-native-paper";
import {
  AchievementBadges,
  CircularProgress,
  DashboardHeader,
  MotivationalQuote,
  QuickStat,
  RecentActivity,
  StreakCounter,
  TodaysFocusCard,
} from "../components/dashboard";
import { useAuthStore } from "../store/auth-store";
import { useTaskStore } from "../store/task-store";
import { useTheme } from "../theme";

export default function DashboardScreen({ navigation }: any) {
  const { user, logout } = useAuthStore();
  const { stats, tasks, fetchStats, fetchTasks, updateTask } = useTaskStore();
  const { theme } = useTheme();
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
        style: "destructive",
        onPress: async () => {
          await logout();
          navigation.replace("Auth");
        },
      },
    ]);
  };

  const handleTaskToggle = async (taskId: number, isCompleted: boolean) => {
    await updateTask(taskId, undefined, isCompleted);
    await fetchStats(); // Refresh stats after task update
  };

  const navigateToTasks = () => {
    navigation.navigate("TaskList");
  };

  const navigateToAnalytics = () => {
    navigation.navigate("Analytics");
  };

  const navigateToAIChat = () => {
    navigation.navigate("AIChat");
  };

  const navigateToContext = () => {
    navigation.navigate("Context");
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <DashboardHeader
          userName={user?.email?.split("@")[0] || "User"}
          userEmail={user?.email || ""}
          onLogout={handleLogout}
        />

        <View style={styles.content}>
          {/* Progress Section */}
          <View style={styles.progressSection}>
            <CircularProgress
              progress={stats?.completion_rate || 0}
              size={120}
              strokeWidth={12}
              color={theme.colors.primary}
            />
            <View style={styles.statsGrid}>
              <QuickStat
                label="Total Tasks"
                value={stats?.total_tasks || 0}
                icon="clipboard-list"
                color={theme.colors.primary}
              />
              <QuickStat
                label="Completed"
                value={stats?.completed_tasks || 0}
                icon="check-circle"
                color={theme.colors.success}
              />
              <QuickStat
                label="Pending"
                value={stats?.pending_tasks || 0}
                icon="clock-outline"
                color={theme.colors.warning}
              />
            </View>
          </View>

          {/* Motivational Quote */}
          <MotivationalQuote />

          {/* Today's Focus */}
          <TodaysFocusCard
            tasks={tasks.slice(0, 3).map((task) => ({
              id: task.id.toString(),
              title: task.title,
              completed: task.is_completed,
            }))}
            onTaskComplete={(taskId) =>
              handleTaskToggle(
                parseInt(taskId),
                !tasks.find((t) => t.id.toString() === taskId)?.is_completed
              )
            }
            onViewAll={navigateToTasks}
          />

          {/* Recent Activity */}
          <RecentActivity
            activities={tasks.slice(0, 5).map((task) => ({
              id: task.id.toString(),
              type: task.is_completed
                ? ("completed" as const)
                : ("created" as const),
              title: task.title,
              timestamp: task.created_at || new Date().toISOString(),
            }))}
          />

          {/* Achievements and Streaks */}
          <View style={styles.bottomSection}>
            <AchievementBadges
              achievements={[
                {
                  id: "1",
                  icon: "star",
                  title: "First Task",
                  description: "Complete your first task",
                  unlocked: tasks.length > 0,
                },
                {
                  id: "2",
                  icon: "fire",
                  title: "5 Day Streak",
                  description: "Complete tasks for 5 days in a row",
                  unlocked: false, // TODO: Calculate actual streak
                },
                {
                  id: "3",
                  icon: "trophy",
                  title: "Task Master",
                  description: "Complete 50 tasks",
                  unlocked: (stats?.completed_tasks || 0) >= 50,
                  progress: Math.min(
                    ((stats?.completed_tasks || 0) / 50) * 100,
                    100
                  ),
                },
              ]}
            />
            <StreakCounter
              currentStreak={7} // TODO: Calculate actual streak
              bestStreak={12} // TODO: Calculate best streak
            />
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => navigation.navigate("TaskList")}
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
  },
  content: {
    padding: 16,
  },
  progressSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 24,
  },
  bottomSection: {
    marginTop: 16,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
