// README
// Landing/Login screen for existing users.
// Lets users enter email/password, navigate to Forgot Password, and Sign Up.
// Uses AuthContext.login to set authenticated state. Visuals and behavior unchanged.

// -------------------- Imports --------------------
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ImageBackground,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/AppNavigator";

import { useAuth } from "../../context/AuthContext";

// -------------------- Navigation Types --------------------
type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

// -------------------- Component --------------------
export default function LoginScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();

  // Local state for credentials (kept as-is; no validation added here)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Auth context method (existing wiring preserved)
  const { login } = useAuth();

  // Handler: Trigger auth flow. If email is missing, show a simple alert.
  // (Kept behavior identical, including minimal check + login payload)
  const handleLogin = () => {
    if (!email) return alert("Please provide login information");
    login({ email }); // you can also include title if you want
    // Original navigation reset left commented:
    // navigation.reset({ index: 0, routes: [{ name: "MainTabs" }] });
  };

  // Optional: back handler (not currently used in UI, but left intact)
  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <ImageBackground style={styles.background}>
      {/* Keyboard avoidance for iOS; no visual change */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* ---------- Header: centered brand logo ---------- */}
          <View style={styles.header}>
            <Image
              source={require("../../assets/graphics/logos/get-the-pong.png")}
              style={styles.headerLogo}
            />
          </View>

          {/* ---------- Form: email/password, actions ---------- */}
          <View style={styles.formContainer}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: "cardRegular",
                color: "#58595B",
                paddingVertical: 20,
              }}
            >
              Sign in to your account
            </Text>

            {/* Email input */}
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholderTextColor={"#58595B"}
                placeholder="email@domain.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                accessibilityLabel="Email address"
                accessibilityHint="Enter the email associated with your account"
              />
            </View>

            {/* Password input */}
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="password"
                placeholderTextColor={"#58595B"}
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
                secureTextEntry
                accessibilityLabel="Password"
                accessibilityHint="Enter your account password"
              />
            </View>

            {/* Forgot password link */}
            <TouchableOpacity
              onPress={() => navigation.navigate("ForgotPassword")}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "cardRegular",
                  color: "#58595B",
                }}
              >
                Forgot Password?
              </Text>
            </TouchableOpacity>

            {/* Submit/login */}
            <View style={styles.submitWrapper}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleLogin}
                accessibilityRole="button"
                accessibilityLabel="Log In"
                accessibilityHint="Attempts to log you into your account"
              >
                <Text style={styles.submitButtonText}>Log In</Text>
              </TouchableOpacity>
            </View>

            {/* Sign up CTA */}
            <View style={styles.textsContainer}>
              <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                <Text
                  style={{
                    fontSize: 16,
                    color: "#000",
                    fontFamily: "cardRegular",
                    flexDirection: "row",
                  }}
                >
                  Not a Member?<Text style={styles.signUp}> Sign Up Now</Text>
                </Text>
              </TouchableOpacity>
            </View>

            {/* Terms & Privacy note */}
            <View style={styles.termsofServiceContainer}>
              <Text style={styles.termsofService}>
                By clicking continue, you agree to our
              </Text>
              <Text style={styles.termsofService}>
                <Text style={styles.termsofServiceBold}>Terms of Service</Text>{" "}
                and{" "}
                <Text style={styles.termsofServiceBold}>Privacy Policy</Text>
              </Text>
            </View>
          </View>

          {/* ---------- Footer: brand mark ---------- */}
          <View
            style={{
              width: "100%",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: 70,
              alignItems: "center",
            }}
          >
            <Image
              source={require("../../assets/graphics/logos/extracion.png")}
              style={{
                tintColor: "#58595B",
                resizeMode: "contain",
                height: 30,
              }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

// -------------------- Styles --------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  logoContainer: {
    flexDirection: "row",
    marginRight: "35%",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
  },
  formContainer: {
    marginTop: "20%",
    width: "100%",
    alignItems: "center",
  },
  inputWrapper: {
    width: "90%",
    borderRadius: 30,
    backgroundColor: "#CCCCCC",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 5,
  },
  input: {
    padding: 10,
    fontSize: 16,
    borderRadius: 30, // keeps inner corners consistent
    fontFamily: "cardRegular",
    color: "#58595B",
  },
  submitWrapper: {
    width: "90%",
    alignItems: "center",
    marginTop: 60,
    marginBottom: 12,
  },
  submitButton: {
    backgroundColor: "#8CDBED",
    padding: 10,
    borderRadius: 30,
    alignItems: "center",
    width: "100%", // full width of the wrapper
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 5,
  },
  submitButtonText: {
    color: "#58595B",
    fontSize: 18,
    fontFamily: "cardRegular",
  },
  background: {
    flex: 1,
    resizeMode: "cover",
    color: "F5F5F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: "20%",
    zIndex: 10,
  },
  headerLogo: {
    height: 30,
    marginTop: "1.5%",
    resizeMode: "contain",
    flex: 1,
    justifyContent: "center",
    tintColor: "#000000",
  },
  label: {
    fontSize: 16,
    color: "#000",
    marginBottom: 8,
    fontFamily: "cardRegular",
    flexDirection: "row",
    alignSelf: "flex-start",
    marginLeft: "5%",
  },
  textsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    width: "90%",
    marginBottom: 20,
  },
  signUp: {
    fontSize: 16,
    color: "#078CC9",
    fontFamily: "cardRegular",
    flexDirection: "row",
  },
  forgotPassword: {
    fontSize: 16,
    color: "#000",
    fontFamily: "cardRegular",
    flexDirection: "row",
  },
  termsofServiceContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  termsofService: {
    fontSize: 14,
    color: "#000",
    textAlign: "center",
    fontFamily: "cardRegular",
  },
  termsofServiceBold: {
    fontSize: 14,
    color: "#000",
    textAlign: "center",
    fontFamily: "cardBold",
  },
});
