import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "react-native-paper";
import { useTheme } from "../../theme";
import { Button, Card, Input } from "../common";

interface GoalSetupWizardProps {
  onComplete: (goals: UserGoals) => void;
  onSkip: () => void;
}

interface UserGoals {
  dailyTaskTarget: number;
  workHoursPerDay: number;
  focusAreas: string[];
  notificationsEnabled: boolean;
  reminderTime: string;
}

const FOCUS_AREAS = [
  { id: "work", label: "Work & Career", icon: "💼" },
  { id: "personal", label: "Personal Growth", icon: "🌱" },
  { id: "health", label: "Health & Fitness", icon: "💪" },
  { id: "learning", label: "Learning & Skills", icon: "📚" },
  { id: "creative", label: "Creative Projects", icon: "🎨" },
  { id: "finance", label: "Finance & Money", icon: "💰" },
  { id: "relationships", label: "Relationships", icon: "❤️" },
  { id: "hobbies", label: "Hobbies & Fun", icon: "🎮" },
];

export function GoalSetupWizard({ onComplete, onSkip }: GoalSetupWizardProps) {
  const { theme } = useTheme();
  const [step, setStep] = useState(1);
  const [dailyTaskTarget, setDailyTaskTarget] = useState("5");
  const [workHoursPerDay, setWorkHoursPerDay] = useState("8");
  const [selectedFocusAreas, setSelectedFocusAreas] = useState<string[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState("09:00");

  const toggleFocusArea = (id: string) => {
    setSelectedFocusAreas((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (step === 1 && (!dailyTaskTarget || parseInt(dailyTaskTarget) < 1)) {
      Alert.alert("Invalid Input", "Please enter a valid daily task target");
      return;
    }
    if (step === 2 && selectedFocusAreas.length === 0) {
      Alert.alert(
        "Select Focus Areas",
        "Please select at least one focus area"
      );
      return;
    }
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    const goals: UserGoals = {
      dailyTaskTarget: parseInt(dailyTaskTarget) || 5,
      workHoursPerDay: parseInt(workHoursPerDay) || 8,
      focusAreas: selectedFocusAreas,
      notificationsEnabled,
      reminderTime,
    };
    onComplete(goals);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text
              style={[
                styles.stepTitle,
                theme.typography.styles.h2,
                { color: theme.colors.text },
              ]}
            >
              📈 Set Your Goals
            </Text>
            <Text
              style={[
                styles.stepDescription,
                theme.typography.styles.body1,
                { color: theme.colors.textSecondary },
              ]}
            >
              Let's set some targets to help you stay productive
            </Text>

            <View style={styles.inputSection}>
              <Input
                label="Daily Task Target"
                value={dailyTaskTarget}
                onChangeText={setDailyTaskTarget}
                keyboardType="number-pad"
                placeholder="5"
                helperText="How many tasks do you want to complete daily?"
              />

              <Input
                label="Work Hours Per Day"
                value={workHoursPerDay}
                onChangeText={setWorkHoursPerDay}
                keyboardType="number-pad"
                placeholder="8"
                helperText="How many hours do you typically work?"
                containerStyle={{ marginTop: 16 }}
              />
            </View>

            <View style={styles.tipCard}>
              <Text style={{ fontSize: 20, marginBottom: 8 }}>💡</Text>
              <Text
                style={[
                  styles.tipText,
                  { color: theme.colors.textSecondary, fontSize: 12 },
                ]}
              >
                Tip: Start with achievable targets and increase them as you
                build momentum!
              </Text>
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text
              style={[
                styles.stepTitle,
                theme.typography.styles.h2,
                { color: theme.colors.text },
              ]}
            >
              🎯 Choose Focus Areas
            </Text>
            <Text
              style={[
                styles.stepDescription,
                theme.typography.styles.body1,
                { color: theme.colors.textSecondary },
              ]}
            >
              Select areas you want to focus on (choose at least one)
            </Text>

            <ScrollView
              style={styles.focusAreasScroll}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.focusAreasGrid}>
                {FOCUS_AREAS.map((area) => {
                  const isSelected = selectedFocusAreas.includes(area.id);
                  return (
                    <TouchableOpacity
                      key={area.id}
                      onPress={() => toggleFocusArea(area.id)}
                      activeOpacity={0.7}
                    >
                      <Card
                        variant={isSelected ? "filled" : "outlined"}
                        style={
                          isSelected
                            ? {
                                ...styles.focusAreaCard,
                                backgroundColor: `${theme.colors.primary}15`,
                                borderColor: theme.colors.primary,
                                borderWidth: 2,
                              }
                            : styles.focusAreaCard
                        }
                      >
                        <Text style={styles.focusAreaIcon}>{area.icon}</Text>
                        <Text
                          style={[
                            styles.focusAreaLabel,
                            {
                              color: isSelected
                                ? theme.colors.primary
                                : theme.colors.text,
                              fontWeight: isSelected ? "700" : "500",
                            },
                          ]}
                        >
                          {area.label}
                        </Text>
                      </Card>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text
              style={[
                styles.stepTitle,
                theme.typography.styles.h2,
                { color: theme.colors.text },
              ]}
            >
              🔔 Notification Settings
            </Text>
            <Text
              style={[
                styles.stepDescription,
                theme.typography.styles.body1,
                { color: theme.colors.textSecondary },
              ]}
            >
              Stay on track with helpful reminders
            </Text>

            <Card variant="outlined" style={styles.settingCard}>
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text
                    style={[styles.settingLabel, { color: theme.colors.text }]}
                  >
                    Enable Notifications
                  </Text>
                  <Text
                    style={[
                      styles.settingDescription,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    Get reminders for tasks and goals
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setNotificationsEnabled(!notificationsEnabled)}
                  style={[
                    styles.toggle,
                    {
                      backgroundColor: notificationsEnabled
                        ? theme.colors.primary
                        : theme.colors.border,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.toggleThumb,
                      {
                        backgroundColor: theme.colors.surface,
                        transform: [
                          { translateX: notificationsEnabled ? 22 : 2 },
                        ],
                      },
                    ]}
                  />
                </TouchableOpacity>
              </View>
            </Card>

            {notificationsEnabled && (
              <Input
                label="Daily Reminder Time"
                value={reminderTime}
                onChangeText={setReminderTime}
                placeholder="09:00"
                helperText="When should we remind you about your tasks?"
                containerStyle={{ marginTop: 16 }}
              />
            )}

            <View style={styles.tipCard}>
              <Text style={{ fontSize: 20, marginBottom: 8 }}>✨</Text>
              <Text
                style={[
                  styles.tipText,
                  { color: theme.colors.textSecondary, fontSize: 12 },
                ]}
              >
                You're all set! You can change these settings anytime from the
                app settings.
              </Text>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          {[1, 2, 3].map((s) => (
            <View
              key={s}
              style={[
                styles.progressStep,
                {
                  backgroundColor:
                    s <= step ? theme.colors.primary : theme.colors.border,
                },
              ]}
            />
          ))}
        </View>
        <Text
          style={{
            color: theme.colors.textTertiary,
            fontSize: 12,
            marginTop: 8,
          }}
        >
          Step {step} of 3
        </Text>
      </View>

      {/* Step Content */}
      {renderStep()}

      {/* Actions */}
      <View style={styles.actions}>
        {step > 1 && (
          <Button
            variant="outline"
            onPress={() => setStep(step - 1)}
            style={{ flex: 1 }}
          >
            Back
          </Button>
        )}
        <Button
          variant="primary"
          onPress={handleNext}
          style={{ flex: step > 1 ? 1 : undefined }}
          fullWidth={step === 1}
        >
          {step === 3 ? "Complete Setup" : "Next"}
        </Button>
      </View>

      <Button variant="ghost" onPress={onSkip} style={{ marginTop: 12 }}>
        <Text style={{ color: theme.colors.textSecondary }}>Skip for now</Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  progressContainer: {
    alignItems: "center",
    marginBottom: 32,
    marginTop: 20,
  },
  progressBar: {
    flexDirection: "row",
    gap: 8,
    width: "100%",
    maxWidth: 200,
  },
  progressStep: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    textAlign: "center",
    marginBottom: 8,
    fontWeight: "700",
  },
  stepDescription: {
    textAlign: "center",
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  inputSection: {
    marginBottom: 24,
  },
  tipCard: {
    backgroundColor: "rgba(99, 102, 241, 0.1)",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    alignItems: "center",
  },
  tipText: {
    textAlign: "center",
    lineHeight: 18,
  },
  focusAreasScroll: {
    flex: 1,
  },
  focusAreasGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  focusAreaCard: {
    width: (Dimensions.get("window").width - 72) / 2,
    padding: 16,
    alignItems: "center",
    gap: 8,
  },
  focusAreaIcon: {
    fontSize: 32,
  },
  focusAreaLabel: {
    fontSize: 12,
    textAlign: "center",
  },
  settingCard: {
    padding: 16,
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
});
