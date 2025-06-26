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

export default function LandingScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    navigation.navigate("Login");
  };
  const handleSignUp = () => {
    navigation.navigate("SignUp");
  };

  return (
    <ImageBackground
      source={require("../../assets/backgrounds/bg-1.png")}
      style={styles.background}
    >
      <View style={styles.header}>
        <Image
          source={require("../../assets/nonclickable-visual-elements/getthepong-logo.png")}
          style={styles.headerLogo}
        />
      </View>

      <View style={styles.formContainer}>
        <TouchableOpacity style={styles.signupButton} onPress={handleSignUp}>
          <Text style={styles.submitButtonText}>Sign up</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton} onPress={handleLogin}>
          <Text style={styles.submitButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.footerContainer}>
        <View style={styles.termsofServiceContainer}>
          <Text style={styles.termsofService}>
            By clicking continue, you agree to our{" "}
          </Text>
          <Text style={styles.termsofService}>
            <Text style={styles.termsofServiceBold}>Terms of Service</Text> and{" "}
            <Text style={styles.termsofServiceBold}>Privacy Policy</Text>
          </Text>
          <View style={styles.extracionContainer}>
            <Image
              source={require("../../assets/nonclickable-visual-elements/extracion-logo.png")}
              style={styles.extracionLogo}
            />
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    marginTop: "75%",
    width: "100%",
    alignItems: "center",
  },

  signupButton: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 30,
    alignItems: "center",
    width: "80%",
    marginBottom: "7%",
  },
  submitButton: {
    backgroundColor: "#8CDBED",
    padding: 12,
    borderRadius: 30,
    alignItems: "center",
    width: "80%",
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

  headerLogo: {
    height: 35,
    marginTop: "1.5%",
    resizeMode: "contain",
    flex: 1,
    justifyContent: "center",
  },

  termsofServiceContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 20,
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
  extracionContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: "5%",
  },
  extracionLogo: {
    height: 30,
    marginTop: "1.5%",
    resizeMode: "contain",
    justifyContent: "center",
  },
  footerContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 20,
  },
});
