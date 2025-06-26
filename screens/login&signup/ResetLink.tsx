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

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function SignUpScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");

  const handleLogin = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  return (
    <ImageBackground
      source={require("../../assets/backgrounds/bg-1.png")}
      style={styles.background}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              padding: 16,
              zIndex: 99,
            }}
          >
            <Image source={require("../../assets/icons/back.png")} />
          </TouchableOpacity>
          <Image
            source={require("../../assets/nonclickable-visual-elements/getthepong-logo.png")}
            style={styles.headerLogo}
          />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.textContainer}>
            <Text style={styles.text}>Link sent! Check your email</Text>
            <Text style={styles.text}>
              <Text style={styles.text}>to reset your password.</Text>
            </Text>
          </View>
          <View style={styles.formContainer}>
            <TouchableOpacity style={styles.submitButton} onPress={handleLogin}>
              <Text style={styles.submitButtonText}>login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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

  formContainer: {
    width: "100%",
    alignItems: "center",
  },
  input: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 30,
    marginBottom: 30,
    fontSize: 16,
    width: "90%",
  },
  submitButton: {
    backgroundColor: "#8CDBED",
    padding: 12,
    borderRadius: 30,
    alignItems: "center",
    width: "90%",
    marginBottom: 12,
  },
  submitButtonText: {
    color: "#000000",
    fontSize: 27,
    fontWeight: "600",
    fontFamily: "second",
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
    height: 35,
    marginLeft: "-11.5%",
    marginTop: "1.5%",
    resizeMode: "contain",
    flex: 1,
    justifyContent: "center",
  },
  textContainer: {
    flexDirection: "column",
    justifyContent: "center",
    marginBottom: "22%",
  },
  text: {
    fontSize: 19,
    color: "#fff",
    textAlign: "center",
    fontFamily: "cardRegular",
  },
});
