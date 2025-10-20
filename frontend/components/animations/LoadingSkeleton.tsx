import React from "react";
import { Animated, StyleSheet, View } from "react-native";
import { useTheme } from "../../theme/ThemeContext";

interface LoadingSkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  width = "100%",
  height = 20,
  borderRadius = 4,
  style,
}) => {
  const { theme } = useTheme();
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: theme.colors.surface,
          opacity,
        },
        style,
      ]}
    />
  );
};

interface SkeletonCardProps {
  style?: any;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ style }) => {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.header}>
        <LoadingSkeleton width={60} height={60} borderRadius={30} />
        <View style={styles.headerText}>
          <LoadingSkeleton width="80%" height={16} />
          <LoadingSkeleton width="60%" height={12} style={{ marginTop: 8 }} />
        </View>
      </View>
      <LoadingSkeleton width="100%" height={12} style={{ marginTop: 16 }} />
      <LoadingSkeleton width="90%" height={12} style={{ marginTop: 8 }} />
      <LoadingSkeleton width="70%" height={12} style={{ marginTop: 8 }} />
    </View>
  );
};

interface SkeletonListProps {
  count?: number;
  style?: any;
}

export const SkeletonList: React.FC<SkeletonListProps> = ({
  count = 3,
  style,
}) => {
  return (
    <View style={style}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={styles.listItem}>
          <LoadingSkeleton width={40} height={40} borderRadius={20} />
          <View style={styles.listItemText}>
            <LoadingSkeleton width="70%" height={14} />
            <LoadingSkeleton width="50%" height={10} style={{ marginTop: 6 }} />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    marginLeft: 12,
    flex: 1,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  listItemText: {
    marginLeft: 12,
    flex: 1,
  },
});
