// README
// Sign-up screen where the user creates a new account.
// Includes a title dropdown (Miss, Ms., Mr., Mrs., Mx.), fields for name, username, email,
// password, and confirm password. After signing up, user is taken to the ConfirmEmail screen.

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
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import { Ionicons } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";

// Navigation type for typed route names
type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function SignUpScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();

  // ---------------- State variables ----------------
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [open, setOpen] = useState(false); // dropdown open/close
  const [items, setItems] = useState([
    { label: "Miss", value: "Miss" },
    { label: "Ms.", value: "Ms." },
    { label: "Mr.", value: "Mr." },
    { label: "Mrs.", value: "Mrs." },
    { label: "Mx.", value: "Mx." },
  ]);
  const [username, setUsername] = useState("");

  // Animation value to create space under the dropdown when open
  const animatedHeight = useState(new Animated.Value(0))[0];

  // ---------------- Effects ----------------
  // Animate spacer height to avoid overlapping UI when dropdown opens
  useEffect(() => {
    if (open) {
      Animated.timing(animatedHeight, {
        toValue: 190, // adjust if dropdown height changes
        duration: 200,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(animatedHeight, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  }, [open]);

  // ---------------- Handlers ----------------
  const handleLogin = () => {
    // On sign up, go to ConfirmEmail screen
    navigation.navigate("ConfirmEmail");
  };

  const handleBack = () => {
    // Go back to previous screen
    navigation.goBack();
  };

  // ---------------- Render ----------------
  return (
    <ImageBackground style={styles.background} imageStyle={{ opacity: 0.5 }}>
      {/* Avoid keyboard covering inputs */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        {/* Header with back button and centered logo */}
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

        {/* Scrollable form content */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Dropdown for title selection */}
          <View style={styles.dropdownWrapper}>
            <DropDownPicker
              open={open}
              value={title}
              items={items}
              setOpen={setOpen}
              setValue={setTitle}
              setItems={setItems}
              placeholder="Title"
              placeholderStyle={styles.input}
              labelStyle={styles.input}
              textStyle={styles.input}
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              arrowIconStyle={{
                backgroundColor: "#8CDBED",
                borderRadius: 10,
              }}
              listMode="SCROLLVIEW"
            />
            {/* Spacer expands/collapses under dropdown */}
            <Animated.View style={{ height: animatedHeight }} />
          </View>

          {/* Input fields */}
          <View style={styles.formContainer}>
            {/* Full name */}
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="First and Last Name"
                placeholderTextColor={"#58595B"}
                value={name}
                onChangeText={setName}
                keyboardType="default"
                autoCapitalize="none"
              />
            </View>

            {/* Username */}
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor={"#58595B"}
                value={username}
                onChangeText={setUsername}
                keyboardType="default"
                autoCapitalize="none"
              />
            </View>

            {/* Email */}
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="email@domain.com"
                placeholderTextColor={"#58595B"}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password */}
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={"#58595B"}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            {/* Confirm Password */}
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor={"#58595B"}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>

            {/* Submit button */}
            <View style={styles.submitWrapper}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleLogin}
              >
                <Text style={styles.submitButtonText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Footer logo */}
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

// ---------------- Styles ----------------
const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "center",
  },
  logoContainer: { flexDirection: "row", marginRight: "35%" },
  title: { fontSize: 32, fontWeight: "bold", color: "#333" },
  dropdownWrapper: {
    zIndex: 1000,
    elevation: 1000,
    marginBottom: 0, // Spacer handles dropdown space
  },
  formContainer: { width: "100%", alignItems: "center" },
  inputWrapper: {
    width: "90%",
    borderRadius: 30,
    backgroundColor: "#CCCCCC",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 5,
  },
  input: {
    padding: 10,
    fontSize: 16,
    borderRadius: 30,
    fontFamily: "cardRegular",
    color: "#58595B",
  },
  submitWrapper: {
    width: "90%",
    alignItems: "center",
    marginBottom: 12,
  },
  submitButton: {
    backgroundColor: "#8CDBED",
    padding: 10,
    borderRadius: 30,
    alignItems: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 5,
  },
  submitButtonText: {
    color: "#58595B",
    fontSize: 18,
    fontFamily: "cardRegular",
  },
  background: { flex: 1, resizeMode: "cover" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: "11%",
    zIndex: 10,
  },
  backButton: { marginRight: 12, padding: 8 },
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
    color: "#",
    marginBottom: 8,
    fontFamily: "cardRegular",
    flexDirection: "row",
    alignSelf: "flex-start",
    marginLeft: "5%",
  },
  textsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginBottom: 20,
  },
  signUp: {
    fontSize: 16,
    color: "#8CDBED",
    fontFamily: "cardRegular",
    flexDirection: "row",
  },
  dropdown: {
    width: "90%",
    backgroundColor: "#CCCCCC",
    borderRadius: 30,
    borderWidth: 0,
    marginBottom: 20,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 5,
  },
  dropdownContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 30,
    borderWidth: 0,
    width: "90%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
    overflow: "visible",
  },
});
