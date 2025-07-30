import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import { Ionicons } from "@expo/vector-icons";
import { Shadow } from "react-native-shadow-2";

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function LoginScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "MainTabs" }],
    });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <ImageBackground style={styles.background}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <View style={styles.header}>
          <Image
            source={require("../../assets/nonclickable-visual-elements/getthepong-logo.png")}
            style={styles.headerLogo}
          />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
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
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholderTextColor={"#58595B"}
                placeholder="email@domain.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="password"
                placeholderTextColor={"#58595B"}
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
                secureTextEntry
              />
            </View>
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
            <View style={styles.submitWrapper}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleLogin}
              >
                <Text style={styles.submitButtonText}>Log In</Text>
              </TouchableOpacity>
            </View>
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
        </ScrollView>
      </KeyboardAvoidingView>
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
          source={require("../../assets/nonclickable-visual-elements/extracion-logo.png")}
          style={{ tintColor: "#58595B", resizeMode: "contain", height: 30 }}
        />
      </View>
    </ImageBackground>
  );
}

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
    borderRadius: 30, // optional, but keeps inner corners consistent
    fontFamily: "cardRegular",
    color: "#58595B",
  },
  submitWrapper: {
    width: "90%", // Match the button width
    alignItems: "center", // Center the button
    marginTop: 60,
    marginBottom: 12,
  },
  submitButton: {
    backgroundColor: "#8CDBED",
    padding: 10,
    borderRadius: 30,
    alignItems: "center",
    width: "100%", // Full width of the wrapper
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3, // Reduced from 3 for better centering
    },
    shadowOpacity: 0.25, // Reduced for more subtle shadow
    shadowRadius: 2, // Increased for softer shadow
    elevation: 5, // Reduced elevation for Android
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
