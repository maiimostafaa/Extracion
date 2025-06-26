import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CameraScreen() {
  const [scanMode, setScanMode] = useState<'label' | 'grind'>('label');

  const handleScan = () => {
    // Placeholder for actual camera functionality
    Alert.alert(
      'Scan Complete',
      scanMode === 'label'
        ? 'Coffee label detected! Would you like to save this coffee to your collection?'
        : 'Grind size detected! Would you like to save this setting?'
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Scan Coffee</Text>
      </View>

      <View style={styles.content}>
        {/* Mode Selection */}
        <View style={styles.modeContainer}>
          <TouchableOpacity
            style={[
              styles.modeButton,
              scanMode === 'label' && styles.modeButtonActive,
            ]}
            onPress={() => setScanMode('label')}
          >
            <Ionicons
              name="camera"
              size={24}
              color={scanMode === 'label' ? '#fff' : '#007AFF'}
            />
            <Text
              style={[
                styles.modeButtonText,
                scanMode === 'label' && styles.modeButtonTextActive,
              ]}
            >
              Scan Label
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.modeButton,
              scanMode === 'grind' && styles.modeButtonActive,
            ]}
            onPress={() => setScanMode('grind')}
          >
            <Ionicons
              name="scan"
              size={24}
              color={scanMode === 'grind' ? '#fff' : '#007AFF'}
            />
            <Text
              style={[
                styles.modeButtonText,
                scanMode === 'grind' && styles.modeButtonTextActive,
              ]}
            >
              Scan Grind
            </Text>
          </TouchableOpacity>
        </View>

        {/* Camera Preview Placeholder */}
        <View style={styles.cameraPreview}>
          <Image
            source={{ uri: 'https://picsum.photos/400/600' }}
            style={styles.previewImage}
          />
          <View style={styles.scanOverlay}>
            <View style={styles.scanFrame} />
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.instructions}>
          <Text style={styles.instructionsTitle}>
            {scanMode === 'label'
              ? 'How to scan a coffee label:'
              : 'How to scan grind size:'}
          </Text>
          <Text style={styles.instructionsText}>
            {scanMode === 'label'
              ? '1. Position the coffee bag label within the frame\n2. Ensure good lighting\n3. Hold steady and tap the scan button'
              : '1. Place ground coffee on a white surface\n2. Position within the frame\n3. Hold steady and tap the scan button'}
          </Text>
        </View>

        {/* Scan Button */}
        <TouchableOpacity style={styles.scanButton} onPress={handleScan}>
          <Ionicons name="scan-circle" size={64} color="#007AFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  modeContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    gap: 8,
  },
  modeButtonActive: {
    backgroundColor: '#007AFF',
  },
  modeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  modeButtonTextActive: {
    color: '#fff',
  },
  cameraPreview: {
    flex: 1,
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  scanOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: '80%',
    height: '60%',
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 12,
  },
  instructions: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  scanButton: {
    alignSelf: 'center',
    marginBottom: 16,
  },
}); 