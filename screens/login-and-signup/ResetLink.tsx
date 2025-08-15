// README
// This screen confirms that a password reset link was sent.
// It shows a header with a back button, a confirmation message, and a button to go to Login.
// Visuals and behavior preserved exactly; comments and small clean-ups only.

// -------------------- Imports --------------------
import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ImageBackground,
  Dimensions,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/AppNavigator";

import { Ionicons } from "@expo/vector-icons";

// -------------------- Navigation Types --------------------
type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

// -------------------- Constants --------------------
const windowWidth = Dimensions.get("window").width;

// -------------------- Component --------------------
export default function SignUpScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();

  // Handler: go to the Login screen (Landing) and reset stack
  const handlePress = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Landing" }],
    });
  };

  // Handler: return to previous screen
  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <ImageBackground style={styles.background}>
      {/* ---------- Header: back button + centered logo ---------- */}
      <View style={styles.header}>
        <Ionicons
          name="chevron-back"
          size={35}
          color="#000"
          style={{ padding: 16 }}
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          accessibilityHint="Returns to the previous screen"
        />
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/graphics/logos/get-the-pong.png")}
            style={styles.headerLogo}
          />
        </View>
      </View>

      {/* ---------- Content: confirmation text + action button ---------- */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>Link sent ! Check your email</Text>
          <Text style={styles.text}>to reset your password</Text>
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handlePress}
          accessibilityRole="button"
          accessibilityLabel="Log In"
          accessibilityHint="Navigates to the login screen"
        >
          <Text style={styles.submitButtonText}>Log In</Text>
        </TouchableOpacity>
      </ScrollView>

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
          style={{ tintColor: "#58595B", resizeMode: "contain", height: 30 }}
        />
      </View>
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
    justifyContent: "center",
  },
  formContainer: {
    width: "100%",
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: "row",
    marginRight: "35%",
  },
  headerLogo: {
    height: 30,
    marginTop: "1.5%",
    resizeMode: "contain",
    flex: 1,
    justifyContent: "center",
    tintColor: "#000000",
  },
  submitButton: {
    backgroundColor: "#8CDBED",
    padding: 10,
    marginTop: 60,
    borderRadius: 30,
    alignItems: "center",
    alignSelf: "center",
    width: "90%", // Full width of the wrapper
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
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: "11%",
    zIndex: 10,
  },
  backButton: {
    marginRight: 12,
    padding: 8,
  },
  textContainer: {
    backgroundColor: "#E5E5E6",
    borderRadius: 20,
    flexDirection: "column",
    justifyContent: "center",
    alignSelf: "center",
    padding: 20,
    marginTop: 20,
    width: "90%",
    height: windowWidth * 0.8,
  },
  text: {
    fontSize: 19,
    color: "#58595B",
    textAlign: "center",
    fontFamily: "cardRegular",
    lineHeight: 30,
  },
});
