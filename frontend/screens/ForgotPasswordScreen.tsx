import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "react-native-paper";
import { EmailValidator } from "../components/auth";
import { Button, Card, Input } from "../components/common";
import { useTheme } from "../theme";

export default function ForgotPasswordScreen({ navigation }: any) {
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState("");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      setError("Email is required");
      return false;
    }
    if (!emailRegex.test(value)) {
      setError("Invalid email format");
      return false;
    }
    setError("");
    return true;
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (emailTouched) {
      validateEmail(value);
    }
  };

  const handleSendReset = async () => {
    if (!validateEmail(email)) {
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setEmailSent(true);
      Alert.alert(
        "Email Sent",
        `Password reset instructions have been sent to ${email}`,
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <LinearGradient
        colors={[theme.colors.background, theme.colors.backgroundSecondary]}
        style={styles.gradient}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Header */}
            <View style={styles.header}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: theme.colors.primary },
                ]}
              >
                <Text style={styles.iconText}>🔒</Text>
              </View>
              <Text
                style={[
                  styles.title,
                  theme.typography.styles.h1,
                  { color: theme.colors.text },
                ]}
              >
                Forgot Password?
              </Text>
              <Text
                style={[
                  styles.subtitle,
                  theme.typography.styles.body1,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {emailSent
                  ? "Check your email for reset instructions"
                  : "Enter your email address and we'll send you instructions to reset your password"}
              </Text>
            </View>

            {/* Form Card */}
            {!emailSent && (
              <Card variant="elevated" style={styles.formCard}>
                <Input
                  label="Email Address"
                  value={email}
                  onChangeText={handleEmailChange}
                  onBlur={() => {
                    setEmailTouched(true);
                    validateEmail(email);
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder="your@email.com"
                  error={error}
                  returnKeyType="send"
                  onSubmitEditing={handleSendReset}
                  containerStyle={styles.inputContainer}
                />

                <EmailValidator
                  email={email}
                  showValidation={emailTouched && !error}
                />

                <Button
                  variant="gradient"
                  size="lg"
                  fullWidth
                  onPress={handleSendReset}
                  loading={isLoading}
                  disabled={isLoading || !!error}
                  style={styles.button}
                >
                  Send Reset Link
                </Button>

                <View style={styles.helpText}>
                  <Text
                    style={[
                      styles.helpTextContent,
                      { color: theme.colors.textTertiary },
                    ]}
                  >
                    💡 The reset link will be valid for 24 hours
                  </Text>
                </View>
              </Card>
            )}

            {/* Success State */}
            {emailSent && (
              <Card variant="elevated" style={styles.successCard}>
                <Text style={styles.successIcon}>✉️</Text>
                <Text
                  style={[
                    styles.successTitle,
                    theme.typography.styles.h3,
                    { color: theme.colors.text },
                  ]}
                >
                  Email Sent!
                </Text>
                <Text
                  style={[
                    styles.successText,
                    theme.typography.styles.body2,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  We've sent password reset instructions to{"\n"}
                  <Text
                    style={{ fontWeight: "700", color: theme.colors.primary }}
                  >
                    {email}
                  </Text>
                </Text>

                <View style={styles.successActions}>
                  <Button
                    variant="outline"
                    fullWidth
                    onPress={() => setEmailSent(false)}
                  >
                    Send Again
                  </Button>
                  <Button
                    variant="primary"
                    fullWidth
                    onPress={() => navigation.goBack()}
                  >
                    Back to Login
                  </Button>
                </View>
              </Card>
            )}

            {/* Back to Login */}
            <View style={styles.footer}>
              <Text
                style={[
                  styles.footerText,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Remember your password?{" "}
              </Text>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={[styles.link, { color: theme.colors.primary }]}>
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  content: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  iconText: {
    fontSize: 40,
  },
  title: {
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    paddingHorizontal: 16,
  },
  formCard: {
    padding: 24,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  helpText: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "rgba(99, 102, 241, 0.1)",
    borderRadius: 8,
  },
  helpTextContent: {
    fontSize: 12,
    textAlign: "center",
  },
  successCard: {
    padding: 32,
    alignItems: "center",
    marginBottom: 24,
  },
  successIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  successTitle: {
    textAlign: "center",
    marginBottom: 12,
    fontWeight: "700",
  },
  successText: {
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  successActions: {
    width: "100%",
    gap: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
  },
  link: {
    fontSize: 14,
    fontWeight: "700",
  },
});
