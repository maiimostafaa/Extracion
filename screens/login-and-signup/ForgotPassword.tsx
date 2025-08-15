// README
// This screen lets a user enter their registered email to receive a password reset link.
// Visuals and behavior are preserved exactly; comments and small clean-ups added.

// -------------------- Imports --------------------
import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";

// Navigation imports
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/AppNavigator";

// Icon import
import { Ionicons } from "@expo/vector-icons";

// -------------------- Navigation Types --------------------
type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

// -------------------- Constants --------------------
const windowWidth = Dimensions.get("window").width; // used for responsive container height

// -------------------- Component --------------------
export default function SignUpScreen() {
  // Navigation instance for routing
  const navigation = useNavigation<LoginScreenNavigationProp>();

  // Handler: proceed to the reset-link screen
  const handlePress = () => {
    navigation.navigate("ResetLink");
  };

  // Handler: go back to previous screen
  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.background}>
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

      {/* ---------- Scrollable content: instructions + email input + submit ---------- */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Instructional text */}
        <View style={styles.textContainer}>
          <Text style={styles.text}>
            <Text style={styles.text}>Enter your registered email</Text>
          </Text>
          <Text style={styles.text}>to receive the password reset</Text>
          <Text style={styles.text}>
            <Text style={styles.text}>link</Text>
          </Text>
        </View>

        {/* Email field + Submit */}
        <View style={{ alignSelf: "center", width: "100%" }}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholderTextColor={"#58595B"}
              placeholder="email@domain.com"
              // value={email}
              // onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              accessibilityLabel="Email address"
              accessibilityHint="Enter the email you used to sign up"
            />
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handlePress}
            accessibilityRole="button"
            accessibilityLabel="Submit email"
            accessibilityHint="Sends a password reset link to your email"
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ---------- Footer: brand mark ---------- */}
      <View style={styles.footerStyle}>
        <Image
          source={require("../../assets/graphics/logos/extracion.png")}
          style={styles.footerLogo}
        />
      </View>
    </View>
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
    marginTop: 20,
    borderRadius: 30,
    alignItems: "center",
    alignSelf: "center",
    width: "90%", // full width of the wrapper
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
  inputWrapper: {
    width: "90%",
    borderRadius: 30,
    backgroundColor: "#CCCCCC",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 5,
    alignSelf: "center",
  },
  input: {
    padding: 10,
    fontSize: 16,
    borderRadius: 30, // keeps inner corners consistent
    fontFamily: "cardRegular",
    color: "#58595B",
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
    marginBottom: 30,
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
  footerStyle: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "flex-end",
    padding: 70,
    alignItems: "center",
  },
  footerLogo: {
    tintColor: "#58595B",
    resizeMode: "contain",
    height: 30,
  },
});
