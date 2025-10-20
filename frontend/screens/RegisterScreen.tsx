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
import { EmailValidator, PasswordStrengthMeter } from "../components/auth";
import { Button, Card, Input } from "../components/common";
import { useAuthStore } from "../store/auth-store";
import { useTheme } from "../theme";
export default function RegisterScreen({ navigation }: any) {
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { register, isLoading } = useAuthStore();

  const passwordInputRef = useRef<RNTextInput>(null);
  const confirmPasswordInputRef = useRef<RNTextInput>(null);
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
    if (value.length < 8) {
      setErrors((prev) => ({
        ...prev,
        password: "Password must be at least 8 characters",
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, password: "" }));
    return true;
  };

  const validateConfirmPassword = (value: string): boolean => {
    if (!value) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Please confirm your password",
      }));
      return false;
    }
    if (value !== password) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, confirmPassword: "" }));
    return true;
  };
  const handleRegister = async () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);

    if (!isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
      return;
    }

    const success = await register(email, password);
    if (!success) {
      Alert.alert(
        "Registration Failed",
        "This email may already be registered. Please try logging in or use a different email."
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
    if (passwordTouched) {
      validatePassword(value);
    }
    if (confirmPassword) {
      validateConfirmPassword(confirmPassword);
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (value.length > 0) {
      validateConfirmPassword(value);
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
                Create Account
              </Text>
              <Text
                style={[
                  styles.subtitle,
                  theme.typography.styles.body1,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Join us and start your productivity journey
              </Text>
            </View>

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
                onBlur={() => setPasswordTouched(true)}
                secureTextEntry={!showPassword}
                placeholder="Minimum 8 characters"
                error={errors.password}
                returnKeyType="next"
                onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
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

              <PasswordStrengthMeter password={password} />

              <Input
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={handleConfirmPasswordChange}
                secureTextEntry={!showPassword}
                placeholder="Re-enter your password"
                error={errors.confirmPassword}
                returnKeyType="done"
                onSubmitEditing={handleRegister}
                containerStyle={styles.inputContainer}
              />

              <Button
                variant="gradient"
                size="lg"
                fullWidth
                onPress={handleRegister}
                loading={isLoading}
                disabled={
                  isLoading ||
                  !!errors.email ||
                  !!errors.password ||
                  !!errors.confirmPassword
                }
              >
                Create Account
              </Button>

              <Text
                style={[styles.termsText, { color: theme.colors.textTertiary }]}
              >
                By creating an account, you agree to our{" "}
                <Text
                  style={{ color: theme.colors.primary, fontWeight: "600" }}
                >
                  Terms of Service
                </Text>{" "}
                and{" "}
                <Text
                  style={{ color: theme.colors.primary, fontWeight: "600" }}
                >
                  Privacy Policy
                </Text>
              </Text>

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
                  or sign up with
                </Text>
                <View
                  style={[
                    styles.dividerLine,
                    { backgroundColor: theme.colors.border },
                  ]}
                />
              </View>

              <View style={styles.socialButtons}>
                <Card
                  variant="outlined"
                  style={styles.socialButton}
                  onPress={() =>
                    Alert.alert(
                      "Coming Soon",
                      "Google sign-up will be available soon"
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
                      "Apple sign-up will be available soon"
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

            <View style={styles.footer}>
              <Text
                style={[
                  styles.footerText,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Already have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
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
    paddingTop: 40,
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
  termsText: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 8,
    lineHeight: 18,
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
