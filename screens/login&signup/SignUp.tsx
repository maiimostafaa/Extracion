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

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function SignUpScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");

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
              source={require("../../assets/nonclickable-visual-elements/getthepong-logo.png")}
              style={styles.headerLogo}
            />
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formContainer}>
            <Text style={styles.label}> full name</Text>
            <TextInput
              style={styles.input}
              placeholder="Jane Doe"
              value={name}
              onChangeText={setName}
              keyboardType="default"
              autoCapitalize="none"
            />
            <Text style={styles.label}> username</Text>
            <TextInput
              style={styles.input}
              placeholder="janedoecoffee"
              value={username}
              onChangeText={setUsername}
              keyboardType="default"
              autoCapitalize="none"
            />

            <Text style={styles.label}> email</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Text style={styles.label}> password</Text>
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <Text style={styles.label}> confirm password</Text>
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />

            <TouchableOpacity style={styles.submitButton} onPress={handleLogin}>
              <Text style={styles.submitButtonText}>Sign Up</Text>
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
    width: "100%",
    alignItems: "center",
  },
  input: {
    backgroundColor: "rgba(250, 250, 250, 0.75)",
    padding: 10,
    borderRadius: 30,
    borderWidth: 1,
    marginBottom: 30,
    fontSize: 16,
    width: "90%",
  },
  submitButton: {
    backgroundColor: "rgba(140, 219, 237, 0.75)",
    padding: 8,
    borderRadius: 30,
    borderWidth: 1,
    alignItems: "center",
    width: "90%",
    marginBottom: 12,
    marginTop: 80,
  },
  submitButtonText: {
    color: "#000000",
    fontSize: 23,
    fontWeight: "300",
    letterSpacing: 1,
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
  forgotPassword: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "cardRegular",
    flexDirection: "row",
  },
  termsofServiceContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  termsofService: {
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
    fontFamily: "cardRegular",
  },
  termsofServiceBold: {
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
    fontFamily: "cardMedium",
  },
});
