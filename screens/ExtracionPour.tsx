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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { useBLEContext } from "../context/BLEContext";
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ExtracionPour() {
  const navigation = useNavigation<NavigationProp>();
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

  console.log(temperature.toFixed(1));
  console.log(weight.toFixed(1));

  return (
    <SafeAreaView>
      <Ionicons
        name="chevron-back"
        size={24}
        color="#000"
        style={{ margin: 16 }}
        onPress={handleBack}
      ></Ionicons>
      <ScrollView contentContainerStyle={styles.container}>
        <DynamicThermometer temp={Number(temperature.toFixed(0))} />
        <TimerTemperatureRing
          initialTime={120}
          temp={Number(temperature.toFixed(0))}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingBottom: 60,
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
});
