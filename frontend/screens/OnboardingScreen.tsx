import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { OnboardingFlow } from "../components/onboarding/OnboardingFlow";
import { useTheme } from "../theme";

export default function OnboardingScreen({ navigation }: any) {
  const { theme } = useTheme();

  const handleComplete = (goals?: any) => {
    // Navigate to the main app after onboarding
    navigation.replace("Main");
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <OnboardingFlow onComplete={handleComplete} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
