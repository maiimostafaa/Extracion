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
      const deviceConnection = await bleManager.connectToDevice(device.id);
      setConnectedDevice(deviceConnection);
      await deviceConnection.discoverAllServicesAndCharacteristics();
      bleManager.stopDeviceScan();
      setIsScanning(false);

      startStreamingData(deviceConnection);
      Alert.alert("Success", "Connected to thePong device!");
    } catch (e) {
      console.log("FAILED TO CONNECT", e);
      Alert.alert("Error", "Failed to connect to device");
    }
  };

  const disconnectFromDevice = () => {
    if (connectedDevice) {
      bleManager.cancelDeviceConnection(connectedDevice.id);
      setConnectedDevice(null);
      setTemperature(0);
      setWeight(0);
    }
  };

  const isDuplicateDevice = (devices: Device[], nextDevice: Device) =>
    devices.findIndex((device) => nextDevice.id === device.id) > -1;

  const scanForPeripherals = () => {
    setIsScanning(true);
    setAllDevices([]);
    
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
        setIsScanning(false);
        return;
      }

      // Only show devices that have a name (filter out unknown devices)
      if (device && (device.name || device.localName)) {
        console.log('Found device:', device.name || device.localName, device.id);
        setAllDevices((prevState: Device[]) => {
          if (!isDuplicateDevice(prevState, device)) {
            return [...prevState, device];
          }
          return prevState;
        });
      }
    });

    // Stop scanning after 15 seconds (longer for more discovery time)
    setTimeout(() => {
      bleManager.stopDeviceScan();
      setIsScanning(false);
    }, 15000);
  };

  // Helper function to parse temperature data (4 bytes float, divide by 100)
  const parseTemperature = (base64Data: string): number => {
    try {
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(4);
      for (let i = 0; i < binaryString.length && i < 4; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      // Convert bytes to float (little-endian)
      const view = new DataView(bytes.buffer);
      const floatValue = view.getFloat32(0, true); // true for little-endian
      return floatValue / 100; // Real temperature = data / 100
    } catch (error) {
      console.log('Temperature parse error:', error);
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
      console.log('Weight parse error:', error);
      return 0;
    }
  };

  const onTemperatureUpdate = (
    error: BleError | null,
    characteristic: Characteristic | null
  ) => {
    if (error) {
      console.log('Temperature error:', error);
      return;
    } else if (!characteristic?.value) {
      console.log("No temperature data received");
      return;
    }

    const temp = parseTemperature(characteristic.value);
    console.log('Temperature received:', temp, '°C');
    setTemperature(temp);
  };

  const onWeightUpdate = (
    error: BleError | null,
    characteristic: Characteristic | null
  ) => {
    if (error) {
      console.log('Weight error:', error);
      return;
    } else if (!characteristic?.value) {
      console.log("No weight data received");
      return;
    }

    const weightValue = parseWeight(characteristic.value);
    console.log('Weight received:', weightValue, 'g');
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
        console.log('Monitoring error:', error);
      }
    } else {
      console.log("No Device Connected");
    }
  };

  useEffect(() => {
    const subscription = bleManager.onStateChange((state) => {
      if (state === 'PoweredOff') {
        Alert.alert('Bluetooth', 'Please turn on Bluetooth to connect to your thePong device');
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