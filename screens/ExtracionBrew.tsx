import DynamicThermometer from "../assets/components/thermometer";
import TimerTemperatureRing from "../assets/components/countdownTimer";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { useBLEContext } from "../context/BLEContext";
import ExtracionCoffeeToWaterInstructionBanner from "../assets/components/extracion/ExtracionCoffeeToWaterInstructionBanner";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface RouteParams {
  waterAmount: string;
  coffeeAmount?: string;
  ratio?: number;
  time: number;
}

export default function ExtracionBrew() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const windowWidth = Dimensions.get("window").width;

  // Get parameters from navigation
  const { waterAmount, coffeeAmount, ratio, time } =
    route.params as RouteParams;

  // Extract numeric value from water amount (remove 'ml')
  const waterAmountNumeric = parseInt(waterAmount.replace("ml", ""));

  // Calculate pour amount (e.g., 20% of total water)
  const pourAmount = Math.round(waterAmountNumeric * 0.2); // 30% of total water for initial pour

  const coffeeAmountNumeric = coffeeAmount
    ? parseInt(coffeeAmount.replace("g", ""))
    : 0;

  const handleBack = () => {
    navigation.goBack();
  };

  const {
    requestPermissions,
    scanForPeripherals,
    allDevices,
    connectToDevice,
    connectedDevice,
    disconnectFromDevice,
    isScanning,
    temperature,
    weight,
  } = useBLEContext();

  const zeroedOut = Math.abs(weight - coffeeAmountNumeric);

  return (
    <SafeAreaView style={{ backgroundColor: "#333333" }}>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
        }}
      >
        <Ionicons
          name="close"
          size={24}
          color="#fff"
          style={{ margin: 16 }}
          onPress={handleBack}
        />
        <View
          style={{
            width: windowWidth - 100,
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <Text
            style={{
              fontFamily: "cardRegular",
              fontSize: 20,
              color: "#fff",
            }}
          >
            french press
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <ExtracionCoffeeToWaterInstructionBanner text="Wait for coffee to brew" />

        {/* Display brewing info */}
        <View style={styles.brewingInfo}>
          <Text style={styles.infoText}>Total Water: {waterAmount}</Text>
          {coffeeAmount && (
            <Text style={styles.infoText}>Coffee: {coffeeAmount}</Text>
          )}
          {ratio && <Text style={styles.infoText}>Ratio: 1:{ratio}</Text>}
          <Text style={styles.infoText}>Time:{time}</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            width: windowWidth - 50,
            justifyContent: "flex-end",
          }}
        ></View>

        <TimerTemperatureRing
          initialTime={time}
          temp={Number(temperature.toFixed(0))}
          size={350}
        />
        <TouchableOpacity
          style={{
            width: "70%",
            height: 40,
            backgroundColor: "#D9D9D9",
            borderRadius: 30,
            alignSelf: "center",
            marginTop: 20,
          }}
          onPress={() => navigation.navigate("ExtracionScreen")}
        >
          <Text style={{ fontSize: 30, textAlign: "center" }}>next</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingBottom: 60,
    paddingHorizontal: 20,
  },
  content: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 12,
    fontFamily: "cardMedium",
  },
  body: {
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 24,
    fontFamily: "cardRegular",
  },
  button: {
    backgroundColor: "#8CDBED",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    fontFamily: "cardRegular",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
    backgroundColor: "#fff",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#8CDBED",
  },
  inactiveDot: {
    backgroundColor: "#000",
  },
  // NEW: Brewing info styles
  brewingInfo: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
    textAlign: "center",
  },
});
