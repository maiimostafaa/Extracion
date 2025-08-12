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
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import { Ionicons } from "@expo/vector-icons";

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const windowWidth = Dimensions.get("window").width;
export default function SignUpScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handlePress = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Landing" }],
    });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <ImageBackground style={styles.background}>
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

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>
            <Text style={styles.text}>Link sent ! Check your email</Text>
          </Text>

          <Text style={styles.text}>
            <Text style={styles.text}>to reset your password</Text>
          </Text>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handlePress}>
          <Text style={styles.submitButtonText}>Log In</Text>
        </TouchableOpacity>
      </ScrollView>
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
