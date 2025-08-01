import { useState, useEffect } from "react";
import { PermissionsAndroid, Platform, Alert } from "react-native";
import * as ExpoDevice from "expo-device";
import {
  BleError,
  BleManager,
  Characteristic,
  Device,
} from "react-native-ble-plx";

// thePong device specifications
const THEPONG_SERVICE_UUID = "00001860-0000-1000-8000-00805f9b34fb";
const TEMPERATURE_CHARACTERISTIC_UUID = "00002a6e-0000-1000-8000-00805f9b34fb";
const WEIGHT_CHARACTERISTIC_UUID = "00002a9d-0000-1000-8000-00805f9b34fb";

const bleManager = new BleManager();

function useBLE() {
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [temperature, setTemperature] = useState(0);
  const [weight, setWeight] = useState(0);

  const requestAndroid31Permissions = async () => {
    const bluetoothScanPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );
    const bluetoothConnectPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );
    const fineLocationPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );

    return (
      bluetoothScanPermission === "granted" &&
      bluetoothConnectPermission === "granted" &&
      fineLocationPermission === "granted"
    );
  };

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "Bluetooth Low Energy requires Location",
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const isAndroid31PermissionsGranted =
          await requestAndroid31Permissions();

        return isAndroid31PermissionsGranted;
      }
    } else {
      return true;
    }
  };

  const connectToDevice = async (device: Device) => {
    try {
      console.log('Connecting to device:', device.id);
      const deviceConnection = await bleManager.connectToDevice(device.id);
      setConnectedDevice(deviceConnection);
      await deviceConnection.discoverAllServicesAndCharacteristics();
      bleManager.stopDeviceScan();
      setIsScanning(false);

      // Monitor connection state - this will detect unexpected disconnections
      deviceConnection.onDisconnected((error, disconnectedDevice) => {
        console.log('Device disconnected:', disconnectedDevice?.id);
        if (error) {
          console.log('Disconnection error:', error);
        }
        
        // Clear app state when device disconnects
        setConnectedDevice(null);
        setTemperature(0);
        setWeight(0);
        
        // Log the disconnection reason
        if (error && error.errorCode) {
          console.log('Disconnection reason code:', error.errorCode);
        }
      });

      startStreamingData(deviceConnection);
      console.log('Device connection established successfully');
      // Removed success alert - connection status is now shown in the modal
    } catch (e) {
      console.log("FAILED TO CONNECT", e);
      Alert.alert("Error", "Failed to connect to device");
    }
  };

  const disconnectFromDevice = async () => {
    if (connectedDevice) {
      try {
        console.log('Starting proper disconnect sequence for device:', connectedDevice.id);
        
        // Step 1: Stop any ongoing characteristic monitoring FIRST
        // This is crucial - we need to stop all subscriptions before disconnecting
        try {
          await bleManager.cancelTransaction('temperature');
          await bleManager.cancelTransaction('weight');
          console.log('Cancelled characteristic monitoring transactions');
        } catch (monitorError) {
          console.log('Error stopping monitoring (may not be active):', monitorError);
        }
        
        // Step 2: Stop all characteristic monitoring for this device
        try {
          // This ensures all subscriptions are properly cancelled
          await connectedDevice.cancelConnection();
          console.log('Cancelled all device subscriptions');
        } catch (subscriptionError) {
          console.log('Error cancelling subscriptions:', subscriptionError);
        }
        
        // Step 3: Stop device scanning (if active)
        try {
          await bleManager.stopDeviceScan();
        } catch (scanError) {
          console.log('Error stopping scan:', scanError);
        }
        
        // Step 4: Check if device is still connected before attempting disconnect
        const isConnected = await connectedDevice.isConnected();
        if (isConnected) {
          console.log('Device is connected, initiating proper GATT disconnect...');
          
          // Step 5: Perform a proper GATT disconnection
          // This sends the proper BLE disconnect packet to the peripheral
          await bleManager.cancelDeviceConnection(connectedDevice.id);
          console.log('GATT disconnect command sent');
          
          // Step 6: Wait for the disconnect to fully propagate to the STM32WB device
          // STM32WB devices may need extra time to process the disconnect and restart advertising
          console.log('Waiting for STM32WB device to process disconnect...');
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Step 7: Verify disconnection status
          try {
            const stillConnected = await connectedDevice.isConnected();
            if (stillConnected) {
              console.log('WARNING: Device may still think it is connected');
              // Force disconnect if needed
              try {
                await connectedDevice.cancelConnection();
                console.log('Forced additional disconnect');
              } catch (forceError) {
                console.log('Force disconnect also failed:', forceError);
              }
            } else {
              console.log('✅ Device successfully disconnected and should return to advertising');
            }
          } catch (checkError) {
            // This is actually expected when device is properly disconnected
            console.log('✅ Device disconnected (connection check failed as expected)');
          }
        } else {
          console.log('Device was already disconnected');
        }
        
        // Step 8: Clear all application state
        setConnectedDevice(null);
        setTemperature(0);
        setWeight(0);
        
        console.log('✅ Complete disconnect sequence finished - STM32WB should be advertising again');
      } catch (error) {
        console.log('❌ Error during disconnect sequence:', error);
        // Force clear the state even if disconnect fails
        setConnectedDevice(null);
        setTemperature(0);
        setWeight(0);
      }
    }
  };

  const isDuplicateDevice = (devices: Device[], nextDevice: Device) =>
    devices.findIndex((device) => nextDevice.id === device.id) > -1;

  const scanForPeripherals = (forceDelay = false) => {
    const startScan = () => {
      setIsScanning(true);
      setAllDevices([]);
      
      bleManager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          console.log('Scan error:', error);
          setIsScanning(false);
          return;
        }

        // Filter for STM32WB devices and thePong devices with names
        if (device && (device.name || device.localName)) {
          const deviceName = device.name || device.localName || '';
          if (deviceName.includes('STM32WB') || deviceName.includes('thePongLocalName')) {
            console.log('Found thePong device:', deviceName, device.id);
            setAllDevices((prevState: Device[]) => {
              if (!isDuplicateDevice(prevState, device)) {
                return [...prevState, device];
              }
              return prevState;
            });
          }
        }
      });

      // Stop scanning after 15 seconds
      setTimeout(() => {
        bleManager.stopDeviceScan();
        setIsScanning(false);
      }, 15000);
    };

    // Add delay if requested (after disconnection) to let STM32WB device reset and restart advertising
    if (forceDelay) {
      console.log('Waiting 3 seconds before scanning to let STM32WB device restart advertising...');
      setTimeout(startScan, 3000);
    } else {
      startScan();
    }
  };

  const parseTemperature = (base64Data: string): number => {
    try {
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(4);
      for (let i = 0; i < binaryString.length && i < 4; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Try interpreting as 32-bit integer first (little-endian)
      const view = new DataView(bytes.buffer);
      const intValue = view.getUint32(0, true); // true for little-endian
      return intValue / 100; // Real temperature = data / 100
    } catch (error) {
      console.log("Temperature parse error:", error);
      return 0;
    }
  };

  // Helper function to parse weight data (3 bytes, ignore first byte, uint16, divide by 20)
  const parseWeight = (base64Data: string): number => {
    try {
      const binaryString = atob(base64Data);
      if (binaryString.length < 3) return 0;

      // Ignore first byte, use bytes 1 and 2 as uint16
      const byte1 = binaryString.charCodeAt(1);
      const byte2 = binaryString.charCodeAt(2);

      // Combine bytes as uint16 (little-endian)
      const uint16Value = byte1 | (byte2 << 8);
      return uint16Value / 20; // Real weight = data / 20
    } catch (error) {
      console.log("Weight parse error:", error);
      return 0;
    }
  };

  const onTemperatureUpdate = (
    error: BleError | null,
    characteristic: Characteristic | null
  ) => {
    if (error) {
      console.log("Temperature error:", error);
      return;
    } else if (!characteristic?.value) {
      console.log("No temperature data received");
      return;
    }

    const temp = parseTemperature(characteristic.value);
    // console.log("Temperature received:", temp, "°C");
    setTemperature(temp);
  };

  const onWeightUpdate = (
    error: BleError | null,
    characteristic: Characteristic | null
  ) => {
    if (error) {
      console.log("Weight error:", error);
      return;
    } else if (!characteristic?.value) {
      console.log("No weight data received");
      return;
    }

    const weightValue = parseWeight(characteristic.value);
    // console.log("Weight received:", weightValue, "g");
    setWeight(weightValue);
  };

  const startStreamingData = async (device: Device) => {
    if (device) {
      try {
        // Monitor temperature updates
        device.monitorCharacteristicForService(
          THEPONG_SERVICE_UUID,
          TEMPERATURE_CHARACTERISTIC_UUID,
          onTemperatureUpdate
        );

        // Monitor weight updates
        device.monitorCharacteristicForService(
          THEPONG_SERVICE_UUID,
          WEIGHT_CHARACTERISTIC_UUID,
          onWeightUpdate
        );
      } catch (error) {
        console.log("Monitoring error:", error);
      }
    } else {
      console.log("No Device Connected");
    }
  };

  useEffect(() => {
    const subscription = bleManager.onStateChange((state) => {
      if (state === "PoweredOff") {
        Alert.alert(
          "Bluetooth",
          "Please turn on Bluetooth to connect to your thePong device"
        );
      }
    }, true);

    return () => subscription.remove();
  }, []);

  return {
    connectToDevice,
    disconnectFromDevice,
    allDevices,
    connectedDevice,
    temperature,
    weight,
    isScanning,
    requestPermissions,
    scanForPeripherals,
    startStreamingData,
  };
}

export default useBLE;
