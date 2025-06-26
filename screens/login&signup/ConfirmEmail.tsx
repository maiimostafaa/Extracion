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

  const handlePress = () => {
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

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>
            Thank you for signing up with Extracion!
          </Text>
          <Text style={styles.text}>
            <Text style={styles.text}>Please confirm your email address</Text>
          </Text>
          <Text style={styles.text}>
            <Text style={styles.text}>by clicking the button below</Text>
          </Text>
        </View>
        <View style={styles.formContainer}>
          <TouchableOpacity style={styles.submitButton} onPress={handlePress}>
            <Text style={styles.submitButtonText}>Confirm Email Address</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  submitButton: {
    backgroundColor: "#8CDBED",
    padding: 12,
    borderRadius: 30,
    alignItems: "center",
    width: "90%",
    marginBottom: 12,
    marginTop: "10%",
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
    marginTop: 20,
    marginBottom: 20,
  },
  text: {
    fontSize: 19,
    color: "#fff",
    textAlign: "center",
    fontFamily: "cardRegular",
  },
});
