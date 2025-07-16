// import React, { useState } from "react";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  ScrollView,
  Modal,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  Animated,
} from "react-native";
import type { ImageSourcePropType } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";
import Header from "../navigation/Header";
import BrewingMethodCard from "../assets/components/extracion/BrewingMethodCard";
import { Ionicons } from "@expo/vector-icons";

import useBLE from "../useBLE";
import { useBLEContext } from "../context/BLEContext";

// Import images for each brewing method
const frenchPressImage = require("../assets/nonclickable-visual-elements/extracion_coffeeMachine.png");
const pourOverImage = require("../assets/nonclickable-visual-elements/extracion_coffeeMachine.png");
const coldDripImage = require("../assets/nonclickable-visual-elements/extracion_coffeeMachine.png");
const brewBarImage = require("../assets/nonclickable-visual-elements/extracion_coffeeMachine.png");

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface BrewingMethod {
  id: string;
  name: string;
  icon: string;
  image: ImageSourcePropType;
}

const brewingMethods: BrewingMethod[] = [
  {
    id: "french_press",
    name: "french press",
    icon: "cafe",
    image: frenchPressImage,
  },
  {
    id: "pour_over",
    name: "pour over",
    icon: "water",
    image: pourOverImage,
  },
  {
    id: "cold_drip",
    name: "cold drip",
    icon: "snow",
    image: coldDripImage,
  },
  {
    id: "brew_bar",
    name: "brew bar",
    icon: "flask",
    image: brewBarImage,
  },
];

export default function ExtractionScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [showBLEModal, setShowBLEModal] = useState(true);
  const [showDeviceList, setShowDeviceList] = useState(false);

  // console.log(
  //   "ExtractionScreen render - showBLEModal:",
  //   showBLEModal,
  //   "showDeviceList:",
  //   showDeviceList
  // );
  // console.log("Modal should be visible:", showBLEModal);
  // console.log("Device list should be shown:", showDeviceList);

  // Animation for pulsing dot
  const pulseAnim = new Animated.Value(1);

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

  useEffect(() => {
    // Request permissions when component mounts
    requestPermissions().then((granted) => {
      if (!granted) {
        Alert.alert(
          "Permissions Required",
          "Bluetooth permissions are required to scan for BLE devices"
        );
      }
    });
  }, []);

  // Pulse animation effect
  useEffect(() => {
    if (isScanning) {
      const pulse = () => {
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]).start(() => {
          if (isScanning) pulse();
        });
      };
      pulse();
    }
  }, [isScanning, pulseAnim]);

  const handleMethodSelect = (method: BrewingMethod) => {
    if (connectedDevice) {
      navigation.navigate("ExtracionConfigScreen");
    } else {
      // Alert.alert("Device Required", "Please connect to a BLE device first", [
      //   { text: "OK", onPress: () => setShowBLEModal(true) },
      // ]);
      navigation.navigate("ExtracionConfigScreen");
    }
  };

  const handleBLEModalClose = () => {
    setShowBLEModal(false);
  };

  const handleContinue = async () => {
    console.log(
      "Continue button pressed - checking permissions and showing modal"
    );
    if (connectedDevice) {
      setShowBLEModal(false);
      return;
    }

    const hasPermissions = await requestPermissions();
    if (hasPermissions) {
      console.log("Permissions granted - showing device list modal");
      setShowDeviceList(true);
      console.log("Starting BLE scan...");
      scanForPeripherals();
    } else {
      console.log("Permissions denied");
      Alert.alert("Permissions Required", "Bluetooth permissions are required");
    }
  };

  const handleDeviceConnect = async (device: any) => {
    await connectToDevice(device);
    setShowDeviceList(false);
  };

  const handleDisconnect = () => {
    Alert.alert(
      "Disconnect Device",
      "Are you sure you want to disconnect from the BLE device?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Disconnect",
          style: "destructive",
          onPress: () => {
            disconnectFromDevice();
            setShowDeviceList(false);
          },
        },
      ]
    );
  };

  const renderDevice = ({ item }: { item: any }) => {
    console.log(
      "Rendering device:",
      item.name || item.localName || "Unknown",
      item.id
    );
    return (
      <TouchableOpacity
        style={styles.deviceItem}
        onPress={() => handleDeviceConnect(item)}
      >
        <View style={styles.deviceInfo}>
          <Text style={styles.deviceName}>
            {item.name || item.localName || "Unknown Device"}
          </Text>
          <Text style={styles.deviceId}>{item.id}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#666" />
      </TouchableOpacity>
    );
  };

  const renderBrewingMethodCard = (method: BrewingMethod, index: number) => (
    <View key={method.id} style={styles.cardContainer}>
      <BrewingMethodCard
        title={method.name}
        image={method.image}
        onPress={() => handleMethodSelect(method)}
        isSelected={false}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Header tintColor="#333" />
      </View>

      <View style={styles.content}>
        <View style={styles.methodsContainer}>
          <Text style={styles.sectionTitle}>choose your brewing method</Text>

          {/* Connection Status and Data */}
          {connectedDevice && (
            <View style={styles.deviceStatus}>
              <View style={styles.statusHeader}>
                <View style={styles.connectedIndicator}>
                  <Ionicons name="bluetooth" size={16} color="#4CAF50" />
                  <Text style={styles.connectedText}>BLE Device Connected</Text>
                </View>
                <TouchableOpacity
                  onPress={handleDisconnect}
                  style={styles.disconnectButton}
                >
                  <Text style={styles.disconnectText}>Disconnect</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.dataRow}>
                <View style={styles.dataItem}>
                  <Text style={styles.dataLabel}>Temperature</Text>
                  <Text style={styles.dataValue}>
                    {temperature.toFixed(1)}°C
                  </Text>
                </View>
                <View style={styles.dataItem}>
                  <Text style={styles.dataLabel}>Weight</Text>
                  <Text style={styles.dataValue}>{weight.toFixed(1)}g</Text>
                </View>
              </View>
            </View>
          )}

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContent}
            style={styles.carousel}
          >
            {brewingMethods.map(renderBrewingMethodCard)}
          </ScrollView>

          {/* Page indicators */}
          {/* <View style={styles.pageIndicators}>
            {brewingMethods.map((_, index) => (
              <View
                key={index}
                style={styles.pageIndicator}
              />
            ))}
          </View> */}
        </View>
      </View>

      {/* BLE Connection Modal */}
      <Modal
        visible={showBLEModal}
        transparent={true}
        animationType="slide"
        onRequestClose={handleBLEModalClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Status Bar - Fixed position outside ScrollView */}

            <View style={styles.statusBar} />

            {/* Close Button - Fixed position outside ScrollView */}

            {/* Scrollable Content */}
            <ScrollView
              style={styles.modalScrollView}
              contentContainerStyle={styles.modalScrollContent}
              showsVerticalScrollIndicator={true}
              bounces={true}
            >
              {/* Debug: Test that modal content is rendering */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleBLEModalClose}
              >
                <Ionicons name="close" size={40} color="#666666" />
              </TouchableOpacity>
              {/* <Text
                style={{
                  fontSize: 24,
                  color: "red",
                  textAlign: "center",
                  backgroundColor: "yellow",
                  padding: 10,
                  margin: 10,
                }}
              >
                DEBUG: MODAL IS RENDERING
              </Text> */}
              {/* French Press Icon */}
              <Image
                source={require("../assets/nonclickable-visual-elements/extracion_coffeeMachine.png")}
                style={styles.frenchPressModalIcon}
              />

              {/* Title */}
              <Text style={styles.modalTitle}>
                {connectedDevice
                  ? "Device Connected!"
                  : showDeviceList
                    ? "Select BLE Device"
                    : "Turn on your device"}
              </Text>

              {/* Subtitle */}
              <Text style={styles.modalSubtitle}>
                {connectedDevice
                  ? `Connected to ${connectedDevice.name || connectedDevice.localName || "Device"} - Ready to brew!`
                  : showDeviceList
                    ? "Choose any BLE device from the list below (testing mode):"
                    : "Continue to scan for BLE devices."}
              </Text>

              {/* Device List or Continue Button */}
              {showDeviceList && !connectedDevice ? (
                <View style={styles.deviceListContainer}>
                  {/* Scanning Status Header */}
                  <View style={styles.scanningHeader}>
                    <View style={styles.scanningIconContainer}>
                      {isScanning ? (
                        <>
                          <Animated.View
                            style={[
                              styles.pulsingDot,
                              { transform: [{ scale: pulseAnim }] },
                            ]}
                          />
                          <Ionicons
                            name="bluetooth"
                            size={24}
                            color="#007AFF"
                          />
                        </>
                      ) : (
                        <Ionicons name="bluetooth" size={24} color="#666" />
                      )}
                    </View>
                    <Text
                      style={[
                        styles.scanningHeaderText,
                        isScanning && styles.scanningActiveText,
                      ]}
                    >
                      {isScanning
                        ? "Scanning for BLE devices..."
                        : `Found ${allDevices.length} device${allDevices.length !== 1 ? "s" : ""}`}
                    </Text>
                    {isScanning && (
                      <View style={styles.scanningProgress}>
                        <View style={styles.progressBar} />
                      </View>
                    )}
                  </View>

                  {/* Device List - Fixed Height and Scrollable */}
                  <View style={styles.deviceListWrapper}>
                    <Text style={styles.debugText}>
                      Debug: {allDevices.length} devices in array
                    </Text>
                    {allDevices.length > 0 ? (
                      <>
                        <Text style={styles.listHeader}>
                          Available Devices:
                        </Text>
                        <FlatList
                          data={allDevices}
                          renderItem={renderDevice}
                          keyExtractor={(item) => item.id}
                          style={styles.deviceList}
                          contentContainerStyle={styles.deviceListContent}
                          showsVerticalScrollIndicator={true}
                          scrollEnabled={true}
                          nestedScrollEnabled={true}
                          bounces={true}
                        />
                      </>
                    ) : (
                      <>
                        {/* Test with mock data to verify list works */}
                        <Text style={styles.listHeader}>
                          Test Devices (if no real devices):
                        </Text>
                        <FlatList
                          data={[
                            {
                              id: "test1",
                              name: "Test Device 1",
                              localName: "TestBLE1",
                            },
                            {
                              id: "test2",
                              name: "Test Device 2",
                              localName: "TestBLE2",
                            },
                            { id: "test3", name: null, localName: "TestBLE3" },
                            {
                              id: "test4",
                              name: "Test Device 4",
                              localName: "TestBLE4",
                            },
                            {
                              id: "test5",
                              name: "Test Device 5",
                              localName: "TestBLE5",
                            },
                          ]}
                          renderItem={renderDevice}
                          keyExtractor={(item) => item.id}
                          style={styles.deviceList}
                          contentContainerStyle={styles.deviceListContent}
                          showsVerticalScrollIndicator={true}
                          scrollEnabled={true}
                          nestedScrollEnabled={true}
                          bounces={true}
                        />
                        <View style={styles.emptyList}>
                          <Ionicons
                            name={
                              isScanning ? "bluetooth" : "bluetooth-outline"
                            }
                            size={48}
                            color={isScanning ? "#007AFF" : "#CCC"}
                            style={styles.emptyIcon}
                          />
                          <Text style={styles.emptyText}>
                            {isScanning
                              ? "Searching for BLE devices..."
                              : "Real devices will replace test data above"}
                          </Text>
                          <Text style={styles.emptySubtext}>
                            {isScanning
                              ? "This may take a few seconds"
                              : 'Tap "Scan Again" to search for real devices'}
                          </Text>
                        </View>
                      </>
                    )}
                  </View>

                  {/* Action Buttons */}
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={[
                        styles.rescanButton,
                        isScanning && styles.rescanButtonDisabled,
                      ]}
                      onPress={scanForPeripherals}
                      disabled={isScanning}
                    >
                      <Ionicons
                        name="refresh"
                        size={16}
                        color={isScanning ? "#999" : "#333"}
                        style={styles.buttonIcon}
                      />
                      <Text
                        style={[
                          styles.rescanButtonText,
                          isScanning && styles.rescanButtonTextDisabled,
                        ]}
                      >
                        {isScanning ? "Scanning..." : "Scan Again"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                /* Continue Button */
                <TouchableOpacity
                  style={styles.continueButton}
                  onPress={handleContinue}
                >
                  <Text style={styles.continueButtonText}>
                    {connectedDevice ? "continue" : "find device"}
                  </Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 24,
    color: "#333",
    marginBottom: 24,
  },
  methodsContainer: {
    flex: 1,
    alignItems: "center",
  },
  carousel: {
    marginVertical: 20,
    height: 400, // Make carousel taller
  },
  carouselContent: {
    paddingHorizontal: 0,
  },
  cardContainer: {
    marginHorizontal: 10,
    width: Dimensions.get("window").width * 0.8,
  },
  pageIndicators: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  pageIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#E5E5E5",
    marginHorizontal: 6,
  },
  activePageIndicator: {
    backgroundColor: "#333",
  },

  // Device Status Styles
  deviceStatus: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    width: "100%",
    borderWidth: 1,
    borderColor: "#E8F5E8",
  },
  statusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  connectedIndicator: {
    flexDirection: "row",
    alignItems: "center",
  },
  connectedText: {
    marginLeft: 8,
    color: "#4CAF50",
    fontSize: 16,
    fontWeight: "600",
  },
  disconnectButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#FFF3F3",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#FFE6E6",
  },
  disconnectText: {
    color: "#E53E3E",
    fontSize: 12,
    fontWeight: "500",
  },
  dataRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  dataItem: {
    alignItems: "center",
    flex: 1,
  },
  dataLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  dataValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "column",
  },
  modalContent: {
    backgroundColor: "#F5F5F5",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    width: "100%",
    height: "90%", // Changed from maxHeight to height
    minHeight: 500, // Added minimum height
    position: "relative",
    borderWidth: 3, // Debug: Add visible border
    borderColor: "red", // Debug: Make border highly visible
    flexDirection: "column",
  },
  modalScrollView: {
    width: "100%",
    flexDirection: "column",
  },
  modalScrollContent: {
    paddingHorizontal: 40,
    flexDirection: "column",
    paddingBottom: 40,
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 20,
    left: 30,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  statusBar: {
    width: 60,
    height: 6,
    backgroundColor: "#D1D1D1",
    borderRadius: 3,
    marginBottom: 40,
    position: "absolute",
    top: 15,
    flexDirection: "column",
  },
  frenchPressModalIcon: {
    width: 100,
    height: 100,
    marginBottom: 30,
    resizeMode: "contain",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333333",
    textAlign: "center",
    marginBottom: 12,
  },
  modalSubtitle: {
    fontSize: 16,
    color: "#999999",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
  },
  continueButton: {
    backgroundColor: "#8CDBED",
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 50,
    width: "100%",
    alignItems: "center",
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
  },

  // Device List Styles
  deviceListContainer: {
    width: "100%",
    minHeight: 400, // Use minHeight instead of maxHeight
  },
  deviceListWrapper: {
    minHeight: 300, // Use min height instead of fixed height
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: "#007AFF",
    marginBottom: 20, // Add margin for spacing
  },
  deviceList: {
    flex: 1,
    paddingHorizontal: 8,
  },
  deviceListContent: {
    paddingBottom: 10,
  },
  deviceItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderWidth: 2,
    borderColor: "#00FF00", // Bright green border for debugging
    backgroundColor: "#FFFFFF",
    marginVertical: 4,
    borderRadius: 8,
    marginHorizontal: 8,
    minHeight: 60, // Ensure minimum height
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  deviceId: {
    fontSize: 10,
    color: "#666",
    marginTop: 2,
  },
  emptyList: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
  },
  rescanButton: {
    backgroundColor: "#8CDBED",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "center",
  },
  rescanButtonDisabled: {
    backgroundColor: "#DDD",
  },
  rescanButtonText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "600",
  },
  rescanButtonTextDisabled: {
    color: "#999",
  },

  // Enhanced Scanning Styles
  scanningHeader: {
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  scanningIconContainer: {
    position: "relative",
    marginBottom: 12,
  },
  pulsingDot: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#007AFF",
    opacity: 0.8,
  },
  scanningHeaderText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    textAlign: "center",
    marginBottom: 8,
  },
  scanningActiveText: {
    color: "#007AFF",
  },
  scanningProgress: {
    width: "100%",
    height: 4,
    backgroundColor: "#E5E5E5",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#007AFF",
    borderRadius: 2,
    width: "100%",
  },

  emptyIcon: {
    marginBottom: 16,
  },
  actionButtons: {
    marginTop: 16,
    width: "100%",
  },
  buttonIcon: {
    marginRight: 8,
  },
  debugText: {
    fontSize: 12,
    color: "#FF6B6B",
    textAlign: "center",
    padding: 8,
    backgroundColor: "#FFE5E5",
    borderRadius: 4,
    marginBottom: 8,
  },
  listHeader: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    backgroundColor: "#F8F9FA",
  },
});
