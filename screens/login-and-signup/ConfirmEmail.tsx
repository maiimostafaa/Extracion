// README
// This screen prompts the user to confirm their email address after signing up.
// It provides a back button, a thank-you message, and a button to confirm email
// (navigating the user to the Landing screen).

// -------------------- Imports --------------------
import React from "react";
import {
  StyleSheet,
  View,
  Text,
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
const windowWidth = Dimensions.get("window").width; // device width used for responsive layout

// -------------------- Component --------------------
export default function SignUpScreen() {
  // Navigation object for routing actions
  const navigation = useNavigation<LoginScreenNavigationProp>();

  // Handler: Navigate to Landing screen (reset navigation stack)
  const handlePress = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Landing" }],
    });
  };

  // Handler: Go back to previous screen
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
        />
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/graphics/logos/get-the-pong.png")}
            style={styles.headerLogo}
          />
        </View>
      </View>

      {/* ---------- Scrollable content: message + confirm button ---------- */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Thank-you and confirmation instructions */}
        <View style={styles.textContainer}>
          <Text style={[styles.text, { marginBottom: 15 }]}>
            Thank you for signing up with Extracion!
          </Text>
          <Text style={styles.text}>Please confirm your</Text>
          <Text style={styles.text}>email address</Text>
          <Text style={styles.text}>by clicking the button below</Text>
        </View>

        {/* Button: triggers handlePress to confirm email and go to Landing */}
        <TouchableOpacity style={styles.submitButton} onPress={handlePress}>
          <Text style={styles.submitButtonText}>Confirm Email Address</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ---------- Footer: Extracion logo ---------- */}
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
  // Screen background container
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  // Header container with back button and centered logo
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: "11%",
    zIndex: 10,
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
  // ScrollView content wrapper
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "center",
  },
  // Grey rounded container for instructional text
  textContainer: {
    backgroundColor: "#E5E5E6",
    borderRadius: 20,
    flexDirection: "column",
    justifyContent: "center",
    alignSelf: "center",
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
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
  // Confirm button styling
  submitButton: {
    backgroundColor: "#8CDBED",
    padding: 10,
    marginTop: 60,
    borderRadius: 30,
    alignItems: "center",
    alignSelf: "center",
    width: "90%",
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
  // Footer logo styling
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
