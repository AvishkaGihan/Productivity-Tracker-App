import { LinearGradient } from "expo-linear-gradient";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  StyleSheet,
  View,
  ViewToken,
} from "react-native";
import { Text } from "react-native-paper";
import { useTheme } from "../../theme";
import { Button } from "../common";

const { width } = Dimensions.get("window");

interface CarouselItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  color: string;
}

const CAROUSEL_ITEMS: CarouselItem[] = [
  {
    id: "1",
    icon: "🤖",
    title: "AI-Powered Assistant",
    description:
      "Get intelligent suggestions and insights to optimize your productivity. Our AI learns from your habits and helps you work smarter.",
    color: "#6366f1",
  },
  {
    id: "2",
    icon: "✅",
    title: "Smart Task Management",
    description:
      "Organize tasks with priorities, categories, and due dates. Quick actions and gestures make task management effortless.",
    color: "#8b5cf6",
  },
  {
    id: "3",
    icon: "📊",
    title: "Beautiful Analytics",
    description:
      "Track your progress with intuitive charts and insights. See trends, streaks, and achievements to stay motivated.",
    color: "#ec4899",
  },
  {
    id: "4",
    icon: "🎯",
    title: "Goal Setting & Habits",
    description:
      "Set goals, build habits, and achieve more. Get personalized recommendations to help you reach your targets.",
    color: "#f59e0b",
  },
];

interface FeatureCarouselProps {
  onNext: () => void;
  onSkip: () => void;
}

export function FeatureCarousel({ onNext, onSkip }: FeatureCarouselProps) {
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const viewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setCurrentIndex(viewableItems[0].index || 0);
      }
    }
  ).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const handleNext = () => {
    if (currentIndex < CAROUSEL_ITEMS.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      onNext();
    }
  };

  const renderItem = ({ item }: { item: CarouselItem }) => (
    <View style={[styles.slide, { width }]}>
      <LinearGradient
        colors={[item.color, theme.colors.background]}
        style={styles.slideGradient}
      >
        <View style={styles.slideContent}>
          <Text style={styles.icon}>{item.icon}</Text>
          <Text
            style={[
              styles.title,
              theme.typography.styles.h2,
              { color: theme.colors.text },
            ]}
          >
            {item.title}
          </Text>
          <Text
            style={[
              styles.description,
              theme.typography.styles.body1,
              { color: theme.colors.textSecondary },
            ]}
          >
            {item.description}
          </Text>
        </View>
      </LinearGradient>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={CAROUSEL_ITEMS}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
      />

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {CAROUSEL_ITEMS.map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 24, 8],
            extrapolate: "clamp",
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  width: dotWidth,
                  opacity,
                  backgroundColor: theme.colors.primary,
                },
              ]}
            />
          );
        })}
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <Button variant="ghost" onPress={onSkip}>
          <Text style={{ color: theme.colors.textSecondary }}>Skip</Text>
        </Button>
        <View style={styles.progressText}>
          <Text style={{ color: theme.colors.textTertiary, fontSize: 12 }}>
            {currentIndex + 1} / {CAROUSEL_ITEMS.length}
          </Text>
        </View>
        <Button variant="primary" onPress={handleNext}>
          {currentIndex === CAROUSEL_ITEMS.length - 1 ? "Finish" : "Next"}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    flex: 1,
  },
  slideGradient: {
    flex: 1,
    paddingTop: 100,
    paddingBottom: 120,
    paddingHorizontal: 24,
  },
  slideContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 100,
    marginBottom: 32,
  },
  title: {
    textAlign: "center",
    marginBottom: 16,
    fontWeight: "700",
  },
  description: {
    textAlign: "center",
    paddingHorizontal: 24,
    lineHeight: 24,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  progressText: {
    flex: 1,
    alignItems: "center",
  },
});
