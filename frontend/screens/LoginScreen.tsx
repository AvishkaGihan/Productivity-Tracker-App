/**
 * Enhanced Login Screen
 * Features: Gradient background, real-time validation, animations, improved UX
 */

import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  TextInput as RNTextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "react-native-paper";
import { EmailValidator } from "../components/auth";
import { Button, Card, Input } from "../components/common";
import { useAuthStore } from "../store/auth-store";
import { useTheme } from "../theme";

export default function LoginScreen({ navigation }: any) {
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });

  const { login, isLoading } = useAuthStore();

  const passwordInputRef = useRef<RNTextInput>(null);
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
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      return false;
    }
    if (!emailRegex.test(value)) {
      setErrors((prev) => ({ ...prev, email: "Invalid email format" }));
      return false;
    }
    setErrors((prev) => ({ ...prev, email: "" }));
    return true;
  };

  const validatePassword = (value: string): boolean => {
    if (!value) {
      setErrors((prev) => ({ ...prev, password: "Password is required" }));
      return false;
    }
    if (value.length < 6) {
      setErrors((prev) => ({ ...prev, password: "Password too short" }));
      return false;
    }
    setErrors((prev) => ({ ...prev, password: "" }));
    return true;
  };

  const handleLogin = async () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    const success = await login(email, password);
    if (!success) {
      Alert.alert(
        "Login Failed",
        "Invalid email or password. Please try again."
      );
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (emailTouched) {
      validateEmail(value);
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (value.length > 0) {
      validatePassword(value);
    }
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
            {/* Logo/Brand Section */}
            <View style={styles.header}>
              <View
                style={[
                  styles.logoContainer,
                  { backgroundColor: theme.colors.primary },
                ]}
              >
                <Text style={styles.logoText}>📊</Text>
              </View>
              <Text
                style={[
                  styles.title,
                  theme.typography.styles.h1,
                  { color: theme.colors.text },
                ]}
              >
                Welcome Back
              </Text>
              <Text
                style={[
                  styles.subtitle,
                  theme.typography.styles.body1,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Sign in to continue your productivity journey
              </Text>
            </View>

            {/* Form Card */}
            <Card variant="elevated" style={styles.formCard}>
              <Input
                label="Email"
                value={email}
                onChangeText={handleEmailChange}
                onBlur={() => {
                  setEmailTouched(true);
                  validateEmail(email);
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="your@email.com"
                error={errors.email}
                returnKeyType="next"
                onSubmitEditing={() => passwordInputRef.current?.focus()}
                containerStyle={styles.inputContainer}
              />

              <EmailValidator
                email={email}
                showValidation={emailTouched && !errors.email}
              />

              <Input
                label="Password"
                value={password}
                onChangeText={handlePasswordChange}
                secureTextEntry={!showPassword}
                placeholder="Enter your password"
                error={errors.password}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
                containerStyle={styles.inputContainer}
                rightIcon={
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Text style={{ fontSize: 20 }}>
                      {showPassword ? "👁️" : "👁️‍🗨️"}
                    </Text>
                  </TouchableOpacity>
                }
              />

              {/* Remember Me & Forgot Password */}
              <View style={styles.optionsRow}>
                <TouchableOpacity
                  style={styles.rememberMe}
                  onPress={() => setRememberMe(!rememberMe)}
                >
                  <View
                    style={[
                      styles.checkbox,
                      {
                        borderColor: theme.colors.border,
                        backgroundColor: rememberMe
                          ? theme.colors.primary
                          : "transparent",
                      },
                    ]}
                  >
                    {rememberMe && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text
                    style={[styles.rememberText, { color: theme.colors.text }]}
                  >
                    Remember me
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.navigate("ForgotPassword")}
                >
                  <Text
                    style={[
                      styles.forgotPassword,
                      { color: theme.colors.primary },
                    ]}
                  >
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Login Button */}
              <Button
                variant="gradient"
                size="lg"
                fullWidth
                onPress={handleLogin}
                loading={isLoading}
                disabled={isLoading || !!errors.email || !!errors.password}
              >
                Sign In
              </Button>

              {/* Divider */}
              <View style={styles.divider}>
                <View
                  style={[
                    styles.dividerLine,
                    { backgroundColor: theme.colors.border },
                  ]}
                />
                <Text
                  style={[
                    styles.dividerText,
                    { color: theme.colors.textTertiary },
                  ]}
                >
                  or continue with
                </Text>
                <View
                  style={[
                    styles.dividerLine,
                    { backgroundColor: theme.colors.border },
                  ]}
                />
              </View>

              {/* Social Login Placeholders */}
              <View style={styles.socialButtons}>
                <Card
                  variant="outlined"
                  style={styles.socialButton}
                  onPress={() =>
                    Alert.alert(
                      "Coming Soon",
                      "Google sign-in will be available soon"
                    )
                  }
                >
                  <Text style={styles.socialIcon}>🔍</Text>
                  <Text
                    style={[styles.socialText, { color: theme.colors.text }]}
                  >
                    Google
                  </Text>
                </Card>
                <Card
                  variant="outlined"
                  style={styles.socialButton}
                  onPress={() =>
                    Alert.alert(
                      "Coming Soon",
                      "Apple sign-in will be available soon"
                    )
                  }
                >
                  <Text style={styles.socialIcon}>🍎</Text>
                  <Text
                    style={[styles.socialText, { color: theme.colors.text }]}
                  >
                    Apple
                  </Text>
                </Card>
              </View>
            </Card>

            {/* Sign Up Link */}
            <View style={styles.footer}>
              <Text
                style={[
                  styles.footerText,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Don't have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <Text style={[styles.link, { color: theme.colors.primary }]}>
                  Sign Up
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
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  logoText: {
    fontSize: 40,
  },
  title: {
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
  },
  formCard: {
    padding: 24,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  rememberMe: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  rememberText: {
    fontSize: 14,
  },
  forgotPassword: {
    fontSize: 14,
    fontWeight: "600",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 12,
    fontWeight: "500",
  },
  socialButtons: {
    flexDirection: "row",
    gap: 12,
  },
  socialButton: {
    flex: 1,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  socialIcon: {
    fontSize: 20,
  },
  socialText: {
    fontSize: 14,
    fontWeight: "600",
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
