import React from "react";
import { Platform, StatusBar, StyleSheet, View, ViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface SafeAreaWrapperProps extends ViewProps {
  children: React.ReactNode;
  edges?: ("top" | "right" | "bottom" | "left")[];
  backgroundColor?: string;
}

export const SafeAreaWrapper: React.FC<SafeAreaWrapperProps> = ({
  children,
  edges = ["top", "right", "bottom", "left"],
  backgroundColor,
  style,
  ...props
}) => {
  const insets = useSafeAreaInsets();

  const paddingTop = edges.includes("top") ? insets.top : 0;
  const paddingRight = edges.includes("right") ? insets.right : 0;
  const paddingBottom = edges.includes("bottom") ? insets.bottom : 0;
  const paddingLeft = edges.includes("left") ? insets.left : 0;

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop,
          paddingRight,
          paddingBottom,
          paddingLeft,
          backgroundColor,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

// Helper to get status bar height
export const getStatusBarHeight = (): number => {
  if (Platform.OS === "ios") {
    return 44; // Approximate for iOS with notch
  }
  return StatusBar.currentHeight || 0;
};
