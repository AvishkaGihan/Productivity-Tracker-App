import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { useTheme } from "../../theme";
import { Button } from "../common";

interface WelcomeScreenProps {
  onGetStarted: () => void;
  onSkip: () => void;
}

export function WelcomeScreen({ onGetStarted, onSkip }: WelcomeScreenProps) {
  const { theme } = useTheme();

  return (
    <LinearGradient
      colors={[theme.colors.primary, theme.colors.secondary]}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Logo/Icon */}
        <View
          style={[
            styles.logoContainer,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <Text style={styles.logoIcon}>📊</Text>
        </View>

        {/* Title */}
        <Text
          style={[
            styles.title,
            theme.typography.styles.h1,
            { color: theme.colors.surface },
          ]}
        >
          Welcome to{"\n"}Productivity Tracker
        </Text>

        {/* Subtitle */}
        <Text
          style={[
            styles.subtitle,
            theme.typography.styles.body1,
            { color: theme.colors.surface, opacity: 0.9 },
          ]}
        >
          Your personal AI-powered assistant for{"\n"}tracking tasks and
          boosting productivity
        </Text>

        {/* Benefits List */}
        <View style={styles.benefitsList}>
          <BenefitItem
            icon="✨"
            text="Smart AI suggestions for task management"
            theme={theme}
          />
          <BenefitItem
            icon="📈"
            text="Track progress with beautiful analytics"
            theme={theme}
          />
          <BenefitItem
            icon="🎯"
            text="Set goals and build productive habits"
            theme={theme}
          />
          <BenefitItem
            icon="⚡"
            text="Get personalized insights and tips"
            theme={theme}
          />
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <Button
          variant="secondary"
          size="lg"
          fullWidth
          onPress={onGetStarted}
          style={{ ...styles.button, backgroundColor: theme.colors.surface }}
        >
          <Text style={{ color: theme.colors.primary, fontWeight: "700" }}>
            Get Started
          </Text>
        </Button>
        <Button variant="ghost" onPress={onSkip} style={styles.skipButton}>
          <Text style={{ color: theme.colors.surface, opacity: 0.8 }}>
            Skip for now
          </Text>
        </Button>
      </View>
    </LinearGradient>
  );
}

interface BenefitItemProps {
  icon: string;
  text: string;
  theme: any;
}

function BenefitItem({ icon, text, theme }: BenefitItemProps) {
  return (
    <View style={styles.benefitItem}>
      <Text style={styles.benefitIcon}>{icon}</Text>
      <Text
        style={[
          styles.benefitText,
          theme.typography.styles.body1,
          { color: theme.colors.surface },
        ]}
      >
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  logoIcon: {
    fontSize: 56,
  },
  title: {
    textAlign: "center",
    marginBottom: 16,
    fontWeight: "800",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 48,
    paddingHorizontal: 16,
  },
  benefitsList: {
    width: "100%",
    gap: 16,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 8,
  },
  benefitIcon: {
    fontSize: 28,
  },
  benefitText: {
    flex: 1,
    fontWeight: "500",
  },
  actions: {
    width: "100%",
    gap: 12,
  },
  button: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  skipButton: {
    marginTop: 8,
  },
});
