import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Text } from "react-native-paper";
import { useTheme } from "../../theme";

interface ActivityItem {
  id: string;
  type: "completed" | "created" | "updated" | "deleted";
  title: string;
  timestamp: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
  maxItems?: number;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({
  activities,
  maxItems = 5,
}) => {
  const { theme } = useTheme();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "completed":
        return "check-circle";
      case "created":
        return "plus-circle";
      case "updated":
        return "pencil-circle";
      case "deleted":
        return "delete-circle";
      default:
        return "circle";
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "completed":
        return theme.colors.success;
      case "created":
        return theme.colors.primary;
      case "updated":
        return theme.colors.warning;
      case "deleted":
        return theme.colors.error;
      default:
        return theme.colors.textSecondary;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const recentActivities = activities.slice(0, maxItems);

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <MaterialCommunityIcons
            name="clock-outline"
            size={24}
            color={theme.colors.primary}
          />
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Recent Activity
          </Text>
        </View>

        {recentActivities.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="history"
              size={48}
              color={theme.colors.textSecondary}
              style={{ opacity: 0.5 }}
            />
            <Text
              style={[styles.emptyText, { color: theme.colors.textSecondary }]}
            >
              No recent activity
            </Text>
          </View>
        ) : (
          <View style={styles.timeline}>
            {recentActivities.map((activity, index) => (
              <View key={activity.id} style={styles.activityItem}>
                <View style={styles.timelineLeft}>
                  <View
                    style={[
                      styles.iconContainer,
                      {
                        backgroundColor: `${getActivityColor(activity.type)}15`,
                      },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={getActivityIcon(activity.type) as any}
                      size={20}
                      color={getActivityColor(activity.type)}
                    />
                  </View>

                  {index < recentActivities.length - 1 && (
                    <View
                      style={[
                        styles.timelineLine,
                        { backgroundColor: theme.colors.border },
                      ]}
                    />
                  )}
                </View>

                <View style={styles.activityContent}>
                  <Text
                    style={[styles.activityTitle, { color: theme.colors.text }]}
                    numberOfLines={2}
                  >
                    {activity.title}
                  </Text>
                  <Text
                    style={[
                      styles.activityTime,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    {formatTimestamp(activity.timestamp)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  timeline: {
    marginTop: 8,
  },
  activityItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  timelineLeft: {
    alignItems: "center",
    marginRight: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: 4,
    marginBottom: 4,
  },
  activityContent: {
    flex: 1,
    paddingTop: 4,
  },
  activityTitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 14,
    marginTop: 12,
  },
});
