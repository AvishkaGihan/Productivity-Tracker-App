import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { Avatar, Text } from "react-native-paper";
import { useTheme } from "../../theme";

interface MessageBubbleProps {
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  showAvatar?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  type,
  content,
  timestamp,
  showAvatar = true,
}) => {
  const { theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const isUser = type === "user";
  const bubbleColor = isUser ? theme.colors.primary : theme.colors.surface;
  const textColor = isUser ? "#FFFFFF" : theme.colors.text;

  return (
    <Animated.View
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.aiContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {!isUser && showAvatar && (
        <Avatar.Icon
          size={32}
          icon="robot"
          style={[styles.avatar, { backgroundColor: theme.colors.primary }]}
        />
      )}

      <View style={styles.bubbleWrapper}>
        <View
          style={[
            styles.bubble,
            isUser ? styles.userBubble : styles.aiBubble,
            { backgroundColor: bubbleColor },
          ]}
        >
          {/* Tail */}
          {isUser ? (
            <View
              style={[
                styles.tail,
                styles.userTail,
                { borderLeftColor: bubbleColor },
              ]}
            />
          ) : (
            <View
              style={[
                styles.tail,
                styles.aiTail,
                { borderRightColor: bubbleColor },
              ]}
            />
          )}

          <Text style={[styles.content, { color: textColor }]}>{content}</Text>
        </View>

        <Text
          style={[
            styles.timestamp,
            isUser ? styles.userTimestamp : styles.aiTimestamp,
            { color: theme.colors.textSecondary },
          ]}
        >
          {formatTime(timestamp)}
        </Text>
      </View>

      {isUser && showAvatar && (
        <Avatar.Icon
          size={32}
          icon="account"
          style={[styles.avatar, { backgroundColor: theme.colors.secondary }]}
        />
      )}
    </Animated.View>
  );
};

const formatTime = (date: Date): string => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  userContainer: {
    justifyContent: "flex-end",
  },
  aiContainer: {
    justifyContent: "flex-start",
  },
  avatar: {
    marginHorizontal: 8,
  },
  bubbleWrapper: {
    maxWidth: "70%",
  },
  bubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    position: "relative",
  },
  userBubble: {
    borderTopRightRadius: 4,
  },
  aiBubble: {
    borderTopLeftRadius: 4,
  },
  content: {
    fontSize: 15,
    lineHeight: 20,
  },
  tail: {
    position: "absolute",
    width: 0,
    height: 0,
    borderStyle: "solid",
  },
  userTail: {
    top: 0,
    right: -8,
    borderLeftWidth: 8,
    borderRightWidth: 0,
    borderTopWidth: 8,
    borderBottomWidth: 0,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    borderRightColor: "transparent",
  },
  aiTail: {
    top: 0,
    left: -8,
    borderRightWidth: 8,
    borderLeftWidth: 0,
    borderTopWidth: 8,
    borderBottomWidth: 0,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: "transparent",
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
    paddingHorizontal: 4,
  },
  userTimestamp: {
    textAlign: "right",
  },
  aiTimestamp: {
    textAlign: "left",
  },
});
