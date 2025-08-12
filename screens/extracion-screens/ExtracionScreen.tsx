// import React, { useState } from "react";
import React, { useState, useEffect, useRef } from "react";
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
  ImageBackground,
  FlatList,
  Alert,
  Animated,
} from "react-native";
import type { ImageSourcePropType } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import Header from "../../navigation/Header";
import BrewingMethodCard from "../../assets/components/extracion-components/BrewingMethodCard";
import { Ionicons } from "@expo/vector-icons";

import useBLE from "../../useBLE";
import { useBLEContext } from "../../context/BLEContext";

// Import images for each brewing method
const frenchPressImage = require("../../assets/nonclickable-visual-elements/extracion_coffeeMachine.png");
const pourOverImage = require("../../assets/nonclickable-visual-elements/extracion_coffeeMachine.png");
const coldDripImage = require("../../assets/nonclickable-visual-elements/extracion_coffeeMachine.png");
const brewBarImage = require("../../assets/nonclickable-visual-elements/extracion_coffeeMachine.png");

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
    name: "French Press",
    icon: "cafe",
    image: frenchPressImage,
  },
  {
    id: "pour_over",
    name: "Pour Over",
    icon: "water",
    image: pourOverImage,
  },
  {
    id: "cold_drip",
    name: "Cold Drip",
    icon: "snow",
    image: coldDripImage,
  },
  {
    id: "brew_bar",
    name: "Brew Bar",
    icon: "flask",
    image: brewBarImage,
  },
];

export default function ExtractionScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [showBLEModal, setShowBLEModal] = useState(false);
  const [modalState, setModalState] = useState<
    "initial" | "searching" | "deviceList" | "connecting" | "connected"
  >("initial");
  const [connectingDevice, setConnectingDevice] = useState<any>(null);
  const [justDisconnected, setJustDisconnected] = useState(false);
  const [showDeviceList, setShowDeviceList] = useState(false);
  const [hasCheckedConnection, setHasCheckedConnection] = useState(false);
  const [userDismissedModal, setUserDismissedModal] = useState(false);
  const [modalSlideAnim] = useState(new Animated.Value(300)); // Start off-screen
  const modalStateRef = useRef(modalState);
  const scanTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  console.log(
    "ExtractionScreen render - showBLEModal:",
    showBLEModal,
    "modalState:",
    modalState
  );

  // Animation for pulsing dot and loading
  const pulseAnim = new Animated.Value(1);
  const spinAnim = new Animated.Value(0);

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
    modalStateRef.current = modalState;
  }, [modalState]);

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

  // Auto-show BLE modal when screen is focused and no device is connected
  useFocusEffect(
    React.useCallback(() => {
      // Add a small delay to ensure the screen is fully loaded
      const timer = setTimeout(() => {
        // Only auto-show modal if we're not already showing it and not in a process
        if (
          !connectedDevice &&
          !hasCheckedConnection &&
          !userDismissedModal &&
          !showBLEModal
        ) {
          console.log(
            "Screen focused - showing BLE modal (no device connected)"
          );
          setShowBLEModal(true);
          setModalState("initial");
          setHasCheckedConnection(true);
        }
      }, 500); // 500ms delay to ensure smooth navigation

      // Cleanup function runs when screen loses focus
      return () => {
        clearTimeout(timer);
        // Clear any scanning timeout when leaving screen
        if (scanTimeoutRef.current) {
          clearTimeout(scanTimeoutRef.current);
          scanTimeoutRef.current = null;
        }
        // Reset dismissal state when leaving the tab
        if (userDismissedModal) {
          console.log("Screen unfocused - resetting dismissal state");
          setUserDismissedModal(false);
          setHasCheckedConnection(false);
        }
      };
    }, [
      connectedDevice,
      hasCheckedConnection,
      userDismissedModal,
      showBLEModal,
    ])
  );

  // Reset the check flag when device disconnects, but keep user dismissal state
  useEffect(() => {
    if (!connectedDevice && hasCheckedConnection && modalState === "initial") {
      // Only reset if we're not in the middle of a scanning/connecting process
      // If we had a connection and now we don't, reset the flag
      // but keep the userDismissedModal flag so modal shows again after disconnect
      setHasCheckedConnection(false);
      setUserDismissedModal(false); // Reset dismissal state when device disconnects
    }
  }, [connectedDevice, hasCheckedConnection, modalState]);

  // Pulse animation effect
  useEffect(() => {
    if (isScanning || modalState === "searching") {
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
          if (isScanning || modalState === "searching") pulse();
        });
      };
      pulse();
    }
  }, [isScanning, modalState, pulseAnim]);

  // Animation for modal slide up/down
  useEffect(() => {
    if (showBLEModal) {
      // Slide up
      Animated.timing(modalSlideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Slide down
      Animated.timing(modalSlideAnim, {
        toValue: 300,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [showBLEModal, modalSlideAnim]);

  useEffect(() => {
    if (modalState === "connecting" || modalState === "searching") {
      const spin = () => {
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }).start(() => {
          spinAnim.setValue(0);
          if (modalState === "connecting" || modalState === "searching") spin();
        });
      };
      spin();
    }
  }, [modalState, spinAnim]);

  // REMOVED: The problematic useEffect that was causing state cycling
  // This was the main culprit - it was automatically transitioning states
  // based on allDevices changes, creating a race condition

  const handleMethodSelect = (method: BrewingMethod) => {
    // Allow navigation to config screen regardless of BLE connection status
    navigation.navigate("ExtracionConfigScreen");
  };

  const handleBLEModalClose = () => {
    // Clear any pending scan timeout
    if (scanTimeoutRef.current) {
      clearTimeout(scanTimeoutRef.current);
      scanTimeoutRef.current = null;
    }
    setShowBLEModal(false);
    setModalState("initial");
    setUserDismissedModal(true); // Mark that user dismissed the modal
  };

  const handleContinue = async () => {
    console.log("Continue button pressed, current state:", modalState);

    // Prevent multiple rapid taps
    if (modalState === "searching" || modalState === "connecting") {
      console.log("Already in progress, ignoring tap");
      return;
    }

    if (connectedDevice) {
      setShowBLEModal(false);
      return;
    }

    const hasPermissions = await requestPermissions();
    if (!hasPermissions) {
      Alert.alert("Permissions Required", "Bluetooth permissions are required");
      return;
    }

    console.log("Starting scan process");
    setModalState("searching");

    // Clear any existing timeout
    if (scanTimeoutRef.current) {
      clearTimeout(scanTimeoutRef.current);
    }

    try {
      if (justDisconnected) {
        console.log("Using force delay for STM32WB device after disconnect");
        await scanForPeripherals(true);
        setJustDisconnected(false);
      } else {
        await scanForPeripherals();
      }

      // Set a fixed timeout to transition to device list
      scanTimeoutRef.current = setTimeout(() => {
        console.log("Scan timeout reached, transitioning to device list");
        if (modalStateRef.current === "searching") {
          setModalState("deviceList");
        }
        scanTimeoutRef.current = null;
      }, 4000); // Fixed 4-second scan period
    } catch (error) {
      console.error("Scan failed:", error);
      setModalState("deviceList"); // Show device list even if scan fails
    }
  };

  const handleDeviceConnect = async (device: any) => {
    console.log(
      "Attempting to connect to device:",
      device.name || device.localName
    );

    // Clear scan timeout since we're connecting
    if (scanTimeoutRef.current) {
      clearTimeout(scanTimeoutRef.current);
      scanTimeoutRef.current = null;
    }

    setConnectingDevice(device);
    setModalState("connecting");

    try {
      await connectToDevice(device);
      console.log("Connection successful");
      setModalState("connected");
    } catch (error) {
      console.error("Connection failed:", error);
      setModalState("deviceList");
      setConnectingDevice(null);
      Alert.alert("Connection Failed", "Failed to connect to device");
    }
  };

  const handleDisconnect = async () => {
    Alert.alert(
      "Disconnect Device",
      "Are you sure you want to disconnect from the BLE device?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Disconnect",
          style: "destructive",
          onPress: async () => {
            await disconnectFromDevice();
            setJustDisconnected(true);
            setModalState("initial");
            setHasCheckedConnection(false); // Reset so modal shows again

            // Log disconnect completion for STM32WB device
            console.log(
              "Disconnected from STM32WB - device should restart advertising after 3 seconds"
            );
          },
        },
      ]
    );
  };

  // Legacy render function - keeping for reference
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
        <Text style={styles.deviceName}>
          {item.name || item.localName || "Unknown Device"}
        </Text>

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
    <ImageBackground
      style={styles.background}
      source={require("../../assets/backgrounds/screen-backgrounds/bg-extracion.png")}
    >
      <ScrollView style={styles.container}>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Header tintColor="#58595B" />
          </View>

          <View style={styles.content}>
            <View style={styles.methodsContainer}>
              {/* <ExtracionCoffeeToWaterInstructionBanner text="Choose your brewing method" /> */}

              {/* BLE Connection Button - Show when no device connected */}
              {!connectedDevice && (
                <TouchableOpacity
                  style={styles.connectButton}
                  onPress={() => {
                    setShowBLEModal(true);
                    setModalState("initial");
                  }}
                >
                  <Ionicons name="bluetooth" size={20} color="#8CDBED" />
                  <Text style={styles.connectButtonText}>
                    Connect to Extracion Device
                  </Text>
                  <Text style={styles.connectButtonSubtext}>
                    Optional - for live data
                  </Text>
                </TouchableOpacity>
              )}

              {/* Connection Status and Data */}
              {connectedDevice && (
                <View style={styles.deviceStatus}>
                  <View style={styles.statusHeader}>
                    <View style={styles.connectedIndicator}>
                      <Ionicons name="bluetooth" size={16} color="#4CAF50" />
                      <Text style={styles.connectedText}>
                        BLE Device Connected
                      </Text>
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
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleBLEModalClose}
                >
                  <Ionicons name="close" size={46} color="#666" />
                </TouchableOpacity>

                {/* Scrollable Content */}
                <View style={styles.modalBody}>
                  {/* French Press Icon */}

                  {modalState === "initial" && (
                    <>
                      <View
                        style={{
                          width: "90%",
                          height: 290,
                          backgroundColor: "#58595B1A",
                          borderRadius: 20,
                          marginTop: "-40%",
                        }}
                      >
                        <Image
                          source={require("../../assets/nonclickable-visual-elements/coffee press unfilled.png")}
                          style={styles.frenchPressModalIcon}
                        />
                        <Text style={styles.modalTitle}>
                          Turn on your Extracion
                        </Text>
                        <Text style={styles.modalSubtitle}>
                          Continue when it's on.
                        </Text>
                      </View>

                      <View style={styles.buttonContainer}>
                        <TouchableOpacity
                          style={styles.continueButton}
                          onPress={handleContinue}
                        >
                          <Text style={styles.continueButtonText}>
                            Continue
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}

                  {modalState === "searching" && (
                    <>
                      <View
                        style={{
                          width: "90%",
                          height: "100%",
                          backgroundColor: "#58595B1A",
                          borderRadius: 20,
                          marginTop: "-40%",
                        }}
                      >
                        <Animated.View
                          style={[
                            styles.loadingSpinner,
                            {
                              transform: [
                                {
                                  rotate: spinAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ["0deg", "360deg"],
                                  }),
                                },
                              ],
                            },
                          ]}
                        >
                          <View style={styles.spinnerCircle} />
                        </Animated.View>
                        <Text style={styles.modalTitle}>Searching...</Text>
                        <Text style={styles.modalSubtitle}>
                          Make sure your machine is turned on.
                        </Text>
                      </View>
                    </>
                  )}

                  {modalState === "deviceList" && (
                    <>
                      {allDevices.length > 0 ? (
                        <>
                          <View
                            style={{
                              width: "90%",
                              height: 290,
                              backgroundColor: "#58595B1A",
                              borderRadius: 20,
                              marginBottom: 30,
                              marginTop: "-40%",
                            }}
                          >
                            <Image
                              source={require("../../assets/nonclickable-visual-elements/coffee press unfilled.png")}
                              style={styles.frenchPressModalIcon}
                            />
                            <Text style={styles.modalTitle}>
                              Let's connect to Extracion
                            </Text>
                            <Text style={styles.modalSubtitle}>
                              Choose your Extracion device
                            </Text>
                            <Text style={styles.modalSubtitle}>
                              to continue.
                            </Text>
                          </View>
                          <View style={styles.deviceListContainer}>
                            {allDevices.map((device, index) => (
                              <TouchableOpacity
                                key={device.id}
                                style={styles.deviceItem}
                                onPress={() => handleDeviceConnect(device)}
                              >
                                <View style={styles.wifiIcon}>
                                  <Ionicons
                                    name="bluetooth"
                                    size={20}
                                    color="#333"
                                  />
                                </View>
                                <Text style={styles.deviceName}>
                                  {device.name ||
                                    device.localName ||
                                    "STM32WB Device"}
                                </Text>
                                <Ionicons
                                  name="chevron-forward"
                                  size={20}
                                  color="#666"
                                />
                              </TouchableOpacity>
                            ))}
                          </View>

                          {/* Your additional button */}
                          {allDevices.map((device, index) => (
                            <TouchableOpacity
                              style={styles.continueButton}
                              onPress={() => handleDeviceConnect(device)}
                            >
                              <Text style={styles.continueButtonText}>
                                Continue
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </>
                      ) : (
                        <>
                          <View
                            style={{
                              width: "90%",
                              height: 290,
                              backgroundColor: "#58595B1A",
                              borderRadius: 20,
                              marginBottom: 30,
                              marginTop: "-30%",
                            }}
                          >
                            <Image
                              source={require("../../assets/nonclickable-visual-elements/coffee press unfilled.png")}
                              style={styles.frenchPressModalIcon}
                            />
                            <Text style={styles.modalTitle}>
                              Let's connect to Extracion
                            </Text>
                            <Text style={styles.modalSubtitle}>
                              Choose your Extracion device
                            </Text>
                            <Text style={styles.modalSubtitle}>
                              to continue.
                            </Text>
                          </View>
                          <Text style={styles.noDevicesText}>
                            No STM32WB devices found
                          </Text>
                          <View style={styles.buttonContainer}>
                            <TouchableOpacity
                              style={styles.continueButton}
                              onPress={() => {
                                console.log("Search again button pressed");
                                setModalState("initial");
                              }}
                            >
                              <Text style={styles.continueButtonText}>
                                Search Again
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.skipButton}
                              onPress={handleBLEModalClose}
                            >
                              <Text style={styles.skipButtonText}>
                                Continue without device
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </>
                      )}
                    </>
                  )}

                  {modalState === "connecting" && (
                    <>
                      <View
                        style={{
                          width: "90%",
                          height: "100%",
                          backgroundColor: "#58595B1A",
                          borderRadius: 20,
                          marginTop: "-40%",
                          marginBottom: 30,
                          alignContent: "center",
                        }}
                      >
                        <Animated.View
                          style={[
                            styles.loadingSpinner,
                            {
                              transform: [
                                {
                                  rotate: spinAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ["0deg", "360deg"],
                                  }),
                                },
                              ],
                            },
                          ]}
                        >
                          <View style={styles.spinnerCircle} />
                        </Animated.View>
                        <Text style={styles.modalTitle}>Connecting...</Text>

                        <Text style={styles.modalSubtitle}>
                          Just a moment more, please.
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => {
                          setConnectingDevice(null);
                          setModalState("deviceList");
                        }}
                      >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                      </TouchableOpacity>
                    </>
                  )}

                  {modalState === "connected" && (
                    <>
                      <View
                        style={{
                          width: "90%",
                          height: 290,
                          backgroundColor: "#58595B1A",
                          borderRadius: 20,
                          marginTop: "-40%",
                        }}
                      >
                        <Image
                          source={require("../../assets/nonclickable-visual-elements/coffee press unfilled.png")}
                          style={styles.frenchPressModalIcon}
                        />
                        <Text style={styles.modalTitle}>
                          Extracion is ready to use
                        </Text>
                        <Text style={styles.modalSubtitle}>
                          Let's brew some magic!
                        </Text>
                      </View>

                      <View style={styles.buttonContainer}>
                        <TouchableOpacity
                          style={styles.continueButton}
                          onPress={() => {
                            setShowBLEModal(false);
                            setModalState("initial");
                          }}
                        >
                          <Text style={styles.continueButtonText}>Finish</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                </View>
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: "10%",
  },
  background: { flex: 1, resizeMode: "cover" },
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

  // Connect Button Styles
  connectButton: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    width: "100%",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    alignItems: "center",
    flexDirection: "column",
  },
  connectButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginTop: 8,
    marginBottom: 4,
  },
  connectButtonSubtext: {
    fontSize: 12,
    color: "#666",
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
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "column",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: "100%",
    height: "65%",
    position: "relative",
  },
  modalBody: {
    paddingHorizontal: 40,
    flexDirection: "column",
    paddingBottom: 40,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingTop: "50%",
  },
  closeButton: {
    position: "absolute",
    top: 15,
    left: 15,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  statusBar: {
    width: 40,
    height: 4,
    backgroundColor: "#E5E5E5",
    borderRadius: 2,
    position: "absolute",
    top: 10,
    alignSelf: "center",
    left: "50%",
    marginLeft: -20,
  },
  frenchPressModalIcon: {
    width: 150,
    height: 150,
    marginVertical: 20,
    alignSelf: "center",
    resizeMode: "contain",
    tintColor: "#666666",
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "cardRegular",
    color: "#333333",
    textAlign: "center",
    marginBottom: 18,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#999999",
    textAlign: "center",

    lineHeight: 18,
    fontFamily: "cardRegular",
  },
  continueButton: {
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
  continueButtonText: {
    fontSize: 18,
    fontFamily: "cardRegular",
    color: "#58595B",
  },
  buttonContainer: {
    width: "90%", // Match the button width
    alignItems: "center", // Center the button
    marginTop: "10%",
    marginBottom: 12,
  },
  skipButton: {
    backgroundColor: "transparent",
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 25,
    alignItems: "center",
    minWidth: 200,
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666666",
  },
  cancelButton: {
    backgroundColor: "#E5E5E5",
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
  cancelButtonText: {
    fontSize: 18,
    fontFamily: "cardRegular",
    color: "#58595B",
  },
  loadingSpinner: {
    width: 100,
    height: 100,
    marginBottom: 20,
    marginTop: 100,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  spinnerCircle: {
    width: 100,
    height: 100,
    borderWidth: 3,
    borderColor: "transparent",
    borderTopColor: "#58595B",
    borderRadius: 100,
  },

  // Device List Styles
  deviceListContainer: {
    width: "90%",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3, // Reduced from 3 for better centering
    },
    shadowOpacity: 0.25, // Reduced for more subtle shadow
    shadowRadius: 2, // Increased for softer shadow
    elevation: 5, // Reduced elevation for Android
    marginBottom: 10,
  },
  deviceItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#F6F7FA",
    borderColor: "#E5E5E5",
    borderRadius: 50,
    marginBottom: 8,
  },
  wifiIcon: {
    marginRight: 12,
  },
  deviceName: {
    flex: 1,
    fontSize: 16,
    color: "#333333",
  },
  noDevicesText: {
    fontSize: 14,
    color: "#999999",
    textAlign: "center",
    fontStyle: "italic",
  },

  // Legacy styles (to be cleaned up)
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
