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

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function SignUpScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Miss", value: "Miss" },
    { label: "Ms.", value: "Ms." },
    { label: "Mr.", value: "Mr." },
    { label: "Mrs.", value: "Mrs." },
    { label: "Mx.", value: "Mx." },
  ]);
  const [username, setUsername] = useState("");

  // Animation value for smooth transitions
  const animatedHeight = useState(new Animated.Value(0))[0];

  // Handle dropdown open/close with animation
  useEffect(() => {
    if (open) {
      Animated.timing(animatedHeight, {
        toValue: 190, // Adjust this value based on your dropdown height
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

  const handleLogin = () => {
    navigation.navigate("ConfirmEmail");
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <ImageBackground style={styles.background} imageStyle={{ opacity: 0.5 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
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

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Dropdown container with higher zIndex */}
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

            {/* Animated spacer that expands when dropdown is open */}
            <Animated.View style={{ height: animatedHeight }} />
          </View>

          <View style={styles.formContainer}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "center",
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
  dropdownWrapper: {
    zIndex: 1000,
    elevation: 1000,
    marginBottom: 0, // Remove margin since we're using animated spacer
  },
  formContainer: {
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
    borderRadius: 30,
    fontFamily: "cardRegular",
    color: "#58595B",
  },
  submitWrapper: {
    width: "90%", // Match the button width
    alignItems: "center", // Center the button

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
    shadowOffset: {
      width: 0,
      height: 3,
    },
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
    overflow: "visible",
  },
});
