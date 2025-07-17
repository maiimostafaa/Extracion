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
  const [showBLEModal, setShowBLEModal] = useState(false); // Changed to false - modal won't show automatically
  const [modalState, setModalState] = useState<'initial' | 'searching' | 'deviceList' | 'connecting' | 'connected'>('initial');
  const [connectingDevice, setConnectingDevice] = useState<any>(null);
  const [justDisconnected, setJustDisconnected] = useState(false);
  const [showDeviceList, setShowDeviceList] = useState(false);
  
  console.log('ExtractionScreen render - showBLEModal:', showBLEModal, 'modalState:', modalState);
  
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
    if (isScanning || modalState === 'searching') {
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
          if (isScanning || modalState === 'searching') pulse();
        });
      };
      pulse();
    }
  }, [isScanning, modalState, pulseAnim]);

  // Spinning animation for connecting state
  useEffect(() => {
    if (modalState === 'connecting') {
      const spin = () => {
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }).start(() => {
          spinAnim.setValue(0);
          if (modalState === 'connecting') spin();
        });
      };
      spin();
    }
  }, [modalState, spinAnim]);

  const handleMethodSelect = (method: BrewingMethod) => {
    // Allow navigation to config screen regardless of BLE connection status
    navigation.navigate("ExtracionConfigScreen");
  };

  const handleBLEModalClose = () => {
    setShowBLEModal(false);
    setModalState('initial');
  };

  const handleContinue = async () => {
    console.log('Continue button pressed - checking permissions and starting search');

    if (connectedDevice) {
      setShowBLEModal(false);
      return;
    }

    const hasPermissions = await requestPermissions();
    if (hasPermissions) {
      console.log('Permissions granted - starting search');
      setModalState('searching');
      console.log('Starting BLE scan...');
      
      // Use forceDelay if we just disconnected from a STM32WB device
      if (justDisconnected) {
        console.log('Using force delay for STM32WB device after disconnect');
        scanForPeripherals(true); // true = forceDelay
        setJustDisconnected(false); // Reset the flag
      } else {
        scanForPeripherals(); // Normal scan
      }
      
      // After scanning starts, show device list after a delay
      setTimeout(() => {
        setModalState('deviceList');
      }, 2000);
    } else {
      console.log("Permissions denied");
      Alert.alert("Permissions Required", "Bluetooth permissions are required");
    }
  };

  const handleDeviceConnect = async (device: any) => {
    setConnectingDevice(device);
    setModalState('connecting');
    
    try {
      await connectToDevice(device);
      setModalState('connected');
    } catch (error) {
      setModalState('deviceList');
      setConnectingDevice(null);
      Alert.alert('Connection Failed', 'Failed to connect to device');
    }

  };

  const handleDisconnect = async () => {
    Alert.alert(
      "Disconnect Device",
      "Are you sure you want to disconnect from the BLE device?",
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Disconnect', 
          style: 'destructive',
          onPress: async () => {
            await disconnectFromDevice();
            setJustDisconnected(true);
            setModalState('initial');
            
            // Log disconnect completion for STM32WB device
            console.log('Disconnected from STM32WB - device should restart advertising after 3 seconds');
          }
        }
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
        <Text style={styles.deviceName}>{item.name || item.localName || 'Unknown Device'}</Text>

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

          {/* BLE Connection Button - Show when no device connected */}
          {!connectedDevice && (
            <TouchableOpacity 
              style={styles.connectButton}
              onPress={() => {
                setShowBLEModal(true);
                setModalState('initial');
              }}
            >
              <Ionicons name="bluetooth" size={20} color="#8CDBED" />
              <Text style={styles.connectButtonText}>Connect to Extracion Device</Text>
              <Text style={styles.connectButtonSubtext}>Optional - for live data</Text>
            </TouchableOpacity>
          )}

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
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => {
                setShowBLEModal(false);
                setModalState('initial');
              }}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>

            {/* Scrollable Content */}
            <View style={styles.modalBody}>
              {/* French Press Icon */}
              <Image
                source={require('../assets/nonclickable-visual-elements/coffee press unfilled.png')}
                style={styles.frenchPressModalIcon}
              />

              {modalState === 'initial' && (
                <>
                  <Text style={styles.modalTitle}>Turn on your Extracion</Text>
                  <Text style={styles.modalSubtitle}>Connect for live temperature and weight data, or skip to continue without a device.</Text>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                      <Text style={styles.continueButtonText}>connect</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.skipButton} 
                      onPress={() => {
                        setShowBLEModal(false);
                        setModalState('initial');
                      }}
                    >
                      <Text style={styles.skipButtonText}>skip for now</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}

              {modalState === 'searching' && (
                <>
                  <Animated.View 
                    style={[
                      styles.loadingSpinner,
                      { transform: [{ rotate: spinAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg']
                      }) }] }
                    ]}
                  >
                    <View style={styles.spinnerCircle} />
                  </Animated.View>
                  <Text style={styles.modalTitle}>Searching...</Text>
                  <Text style={styles.modalSubtitle}>Make sure your machine is turned on.</Text>
                  <TouchableOpacity 
                    style={styles.skipButton} 
                    onPress={() => {
                      setShowBLEModal(false);
                      setModalState('initial');
                    }}
                  >
                    <Text style={styles.skipButtonText}>cancel search</Text>
                  </TouchableOpacity>
                </>
              )}

              {modalState === 'deviceList' && (
                <>
                  <Text style={styles.modalTitle}>Let's connect to Extracion</Text>
                  <Text style={styles.modalSubtitle}>Choose your Extracion to continue.</Text>
                  
                  <View style={styles.deviceListContainer}>
                    {allDevices.length > 0 ? (
                      allDevices.map((device, index) => (
                        <TouchableOpacity
                          key={device.id}
                          style={styles.deviceItem}
                          onPress={() => handleDeviceConnect(device)}
                        >
                          <View style={styles.wifiIcon}>
                            <Ionicons name="wifi" size={20} color="#333" />
                          </View>
                          <Text style={styles.deviceName}>
                            {device.name || device.localName || 'STM32WB Device'}

                          </Text>
                          <Ionicons name="chevron-forward" size={20} color="#666" />
                        </TouchableOpacity>
                      ))
                    ) : (
                      <Text style={styles.noDevicesText}>No STM32WB devices found</Text>
                    )}
                  </View>


                  <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                      <Text style={styles.continueButtonText}>search again</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.skipButton} 
                      onPress={() => {
                        setShowBLEModal(false);
                        setModalState('initial');
                      }}
                    >
                      <Text style={styles.skipButtonText}>continue without device</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}

              {modalState === 'connecting' && (
                <>
                  <Animated.View 
                    style={[
                      styles.loadingSpinner,
                      { transform: [{ rotate: spinAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg']
                      }) }] }
                    ]}
                  >
                    <View style={styles.spinnerCircle} />
                  </Animated.View>
                  <Text style={styles.modalTitle}>Connecting...</Text>
                  <Text style={styles.modalSubtitle}>Just a moment more, please.</Text>
                  <TouchableOpacity style={styles.cancelButton} onPress={() => setModalState('deviceList')}>
                    <Text style={styles.cancelButtonText}>cancel</Text>
                  </TouchableOpacity>
                </>

              )}

              {modalState === 'connected' && (
                <>
                  <Text style={styles.modalTitle}>Extracion is ready to use</Text>
                  <Text style={styles.modalSubtitle}>Let's brew some magic!</Text>
                  <TouchableOpacity 
                    style={styles.continueButton} 
                    onPress={() => {
                      setShowBLEModal(false);
                      setModalState('initial');
                    }}
                  >
                    <Text style={styles.continueButtonText}>finish</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
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
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "column",
  },
  modalContent: {

    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: '100%',
    maxHeight: '70%',
    minHeight: '50%',
    position: 'relative',

  },
  modalBody: {
    paddingHorizontal: 40,
    flexDirection: "column",
    paddingBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    left: 20,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  statusBar: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E5E5',
    borderRadius: 2,
    position: 'absolute',
    top: 10,
    alignSelf: 'center',
    left: '50%',
    marginLeft: -20,

  },
  frenchPressModalIcon: {
    width: 80,
    height: 80,
    marginBottom: 30,

    resizeMode: 'contain',
    tintColor: '#666666',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 18,
  },
  continueButton: {
    backgroundColor: '#8CDBED',
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 25,
    alignItems: 'center',
    minWidth: 200,
    marginBottom: 12,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  skipButton: {
    backgroundColor: 'transparent',
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 25,
    alignItems: 'center',
    minWidth: 200,
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666666',
  },
  cancelButton: {
    backgroundColor: '#E5E5E5',
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 25,
    alignItems: 'center',
    minWidth: 200,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  loadingSpinner: {
    width: 40,
    height: 40,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinnerCircle: {
    width: 30,
    height: 30,
    borderWidth: 3,
    borderColor: '#E5E5E5',
    borderTopColor: '#8CDBED',
    borderRadius: 15,
  },

  // Device List Styles
  deviceListContainer: {
    width: '100%',
    marginBottom: 30,
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    marginBottom: 8,
  },
  wifiIcon: {
    marginRight: 12,
  },
  deviceName: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
  },
  noDevicesText: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    fontStyle: 'italic',
    marginVertical: 20,

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
