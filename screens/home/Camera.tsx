import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';

export default function CameraScreen() {
  const [scanMode, setScanMode] = useState<'label' | 'QR'>('label');
  const [permission, requestPermission] = useCameraPermissions();
  const [selectedLens, setSelectedLens] = useState<string>('builtInWideAngleCamera');
  const navigation = useNavigation();
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  // Get available lenses and select the main camera (1x) - iOS only
  useEffect(() => {
    const getMainCamera = async () => {
      if (Platform.OS === 'ios' && cameraRef.current && permission?.granted) {
        try {
          const lenses = await cameraRef.current.getAvailableLensesAsync();
          console.log('Available lenses:', lenses);
          
          // Try to find the main camera lens (typically builtInDualCamera or builtInTripleCamera for main lens)
          // On newer iPhones, these often correspond to the 1x main camera
          const mainLens = lenses.find(lens => 
            lens.includes('builtInDualCamera') || 
            lens.includes('builtInTripleCamera') ||
            lens.includes('builtInTelephotoCamera')
          ) || lenses[0]; // fallback to first available
          
          console.log('Selected lens:', mainLens);
          setSelectedLens(mainLens);
        } catch (error) {
          console.log('Error getting lenses:', error);
        }
      }
    };

    if (permission?.granted) {
      // Small delay to ensure camera is mounted
      setTimeout(getMainCamera, 500);
    }
  }, [permission?.granted]);

  const handleCapture = () => {
    // Placeholder for actual capture functionality
    Alert.alert(
      'Photo Captured',
      scanMode === 'label'
        ? 'Coffee label captured! Processing...'
        : 'QR code captured! Processing...'
    );
  };

  const handleBack = () => {
    navigation.goBack();
  };

  if (!permission) {
    // Camera permissions are still loading
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.cameraContainer}>
          <Text style={styles.placeholderText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.cameraContainer}>
          <Text style={styles.placeholderText}>Camera permission required</Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Black Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Camera Viewfinder */}
      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing="back"
          {...(Platform.OS === 'ios' && { selectedLens: selectedLens })}
          barcodeScannerSettings={{
            barcodeTypes: scanMode === 'QR' ? ['qr'] : [],
          }}
        >
          {/* Overlay for scan mode indication */}
          <View style={styles.scanOverlay}>
            <Text style={styles.scanModeText}>
              {scanMode === 'label' ? 'Position coffee label in frame' : 'Position QR code in frame'}
            </Text>
          </View>
        </CameraView>
      </View>

      
      {/* Mode Toggle Slider */}
      <View style={styles.toggleContainer}>
        <View style={styles.toggleSlider}>
          <TouchableOpacity
            style={[
              styles.toggleOption,
              scanMode === 'label' && styles.toggleOptionActive,
            ]}
            onPress={() => setScanMode('label')}
          >
            <Text
              style={[
                styles.toggleText,
                scanMode === 'label' && styles.toggleTextActive,
              ]}
            >
              Label
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.toggleOption,
              scanMode === 'QR' && styles.toggleOptionActive,
            ]}
            onPress={() => setScanMode('QR')}
          >
            <Text
              style={[
                styles.toggleText,
                scanMode === 'QR' && styles.toggleTextActive,
              ]}
            >
              QR
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Capture Button */}
      <View style={styles.captureContainer}>
        <TouchableOpacity style={styles.captureButton} onPress={handleCapture}>
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>
      </View>

      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    backgroundColor: '#000000',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  cameraPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  placeholderText: {
    color: '#666',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
  placeholderSubtext: {
    color: '#888',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  permissionButton: {
    backgroundColor: '#8CDBED',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  permissionButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  scanOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 40,
  },
  scanModeText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  captureContainer: {
    backgroundColor: '#000',
    alignItems: 'center',
    paddingVertical: 20,
  },
  captureButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#333',
  },
  captureButtonInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
  },
  toggleContainer: {
    backgroundColor: '#000',
    paddingHorizontal: 40,
    paddingBottom: 0,
    paddingTop: 10,
    alignItems: 'center',
  },
  toggleSlider: {
    flexDirection: 'row',
    backgroundColor: '#58595B',
    borderRadius: 20,
    padding: 3,
    width: 160,
  },
  toggleOption: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 17,
    alignItems: 'center',
  },
  toggleOptionActive: {
    backgroundColor: '#8CDBED',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  toggleTextActive: {
    color: '#000',
  },
}); 