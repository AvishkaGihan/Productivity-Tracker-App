import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { useTheme } from "../../theme";

export const TypingIndicator: React.FC = () => {
  const { theme } = useTheme();
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = (dot: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: -8,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animate(dot1, 0);
    animate(dot2, 133);
    animate(dot3, 266);
  }, []);

  return (
    <View style={styles.container}>
      <View style={[styles.bubble, { backgroundColor: theme.colors.surface }]}>
        <Animated.View
          style={[
            styles.dot,
            { backgroundColor: theme.colors.textSecondary },
            { transform: [{ translateY: dot1 }] },
          ]}
        />
        <Animated.View
          style={[
            styles.dot,
            { backgroundColor: theme.colors.textSecondary },
            { transform: [{ translateY: dot2 }] },
          ]}
        />
        <Animated.View
          style={[
            styles.dot,
            { backgroundColor: theme.colors.textSecondary },
            { transform: [{ translateY: dot3 }] },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  bubble: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderTopLeftRadius: 4,
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
