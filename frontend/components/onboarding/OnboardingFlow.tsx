import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { FeatureCarousel } from "./FeatureCarousel";
import { GoalSetupWizard } from "./GoalSetupWizard";
import { WelcomeScreen } from "./WelcomeScreen";

interface OnboardingFlowProps {
  onComplete: (goals?: any) => void;
}

type OnboardingStep = "welcome" | "features" | "goals" | "complete";

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("welcome");

  const handleWelcomeNext = () => {
    setCurrentStep("features");
  };

  const handleFeaturesNext = () => {
    setCurrentStep("goals");
  };

  const handleGoalsComplete = async (goals: any) => {
    // Save that onboarding is complete
    await AsyncStorage.setItem("onboarding_completed", "true");
    if (goals) {
      await AsyncStorage.setItem("user_goals", JSON.stringify(goals));
    }
    onComplete(goals);
  };

  const handleSkip = async () => {
    // Save that onboarding is complete even if skipped
    await AsyncStorage.setItem("onboarding_completed", "true");
    onComplete();
  };

  const renderStep = () => {
    switch (currentStep) {
      case "welcome":
        return (
          <WelcomeScreen onGetStarted={handleWelcomeNext} onSkip={handleSkip} />
        );
      case "features":
        return (
          <FeatureCarousel onNext={handleFeaturesNext} onSkip={handleSkip} />
        );
      case "goals":
        return (
          <GoalSetupWizard
            onComplete={handleGoalsComplete}
            onSkip={handleSkip}
          />
        );
      default:
        return null;
    }
  };

  return <View style={styles.container}>{renderStep()}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
