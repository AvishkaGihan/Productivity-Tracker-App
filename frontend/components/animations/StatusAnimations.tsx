import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { useTheme } from "../../theme/ThemeContext";

interface SuccessAnimationProps {
  visible: boolean;
  onComplete?: () => void;
  size?: number;
}

export const SuccessAnimation: React.FC<SuccessAnimationProps> = ({
  visible,
  onComplete,
  size = 80,
}) => {
  const { theme } = useTheme();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 4,
            tension: 40,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            scaleAnim.setValue(0);
            rotateAnim.setValue(0);
            onComplete?.();
          });
        }, 800);
      });
    }
  }, [visible, scaleAnim, rotateAnim, fadeAnim, onComplete]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.iconContainer,
            {
              backgroundColor: theme.colors.success,
              width: size,
              height: size,
              borderRadius: size / 2,
              transform: [{ scale: scaleAnim }, { rotate }],
              opacity: fadeAnim,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="check-bold"
            size={size * 0.5}
            color="#FFFFFF"
          />
        </Animated.View>
      </View>
    </View>
  );
};

interface ErrorAnimationProps {
  visible: boolean;
  onComplete?: () => void;
  size?: number;
}

export const ErrorAnimation: React.FC<ErrorAnimationProps> = ({
  visible,
  onComplete,
  size = 80,
}) => {
  const { theme } = useTheme();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 4,
            tension: 40,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(shakeAnim, {
            toValue: 10,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: -10,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: 10,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            scaleAnim.setValue(0);
            shakeAnim.setValue(0);
            onComplete?.();
          });
        }, 800);
      });
    }
  }, [visible, scaleAnim, shakeAnim, fadeAnim, onComplete]);

  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.iconContainer,
            {
              backgroundColor: theme.colors.error,
              width: size,
              height: size,
              borderRadius: size / 2,
              transform: [{ scale: scaleAnim }, { translateX: shakeAnim }],
              opacity: fadeAnim,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="close-thick"
            size={size * 0.5}
            color="#FFFFFF"
          />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
