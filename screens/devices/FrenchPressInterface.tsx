import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Alert,
  FlatList,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

interface BrewingTime {
  id: string;
  name: string;
  duration: number;
  description: string;
}

const brewingTimes: BrewingTime[] = [
  {
    id: '1',
    name: 'Light Roast',
    duration: 180,
    description: 'Perfect for light roasts, brings out bright acidity',
  },
  {
    id: '2',
    name: 'Medium Roast',
    duration: 240,
    description: 'Balanced extraction for medium roasts',
  },
  {
    id: '3',
    name: 'Dark Roast',
    duration: 300,
    description: 'Full-bodied extraction for dark roasts',
  },
  {
    id: '4',
    name: 'Custom',
    duration: 0,
    description: 'Set your own brewing time',
  },
];

export default function FrenchPressInterface() {
  const navigation = useNavigation();
  const [temperature, setTemperature] = useState(95);
  const [isHeating, setIsHeating] = useState(false);
  const [isBrewing, setIsBrewing] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [selectedBrewingTime, setSelectedBrewingTime] = useState<BrewingTime | null>(null);

  const handleTemperatureChange = (newTemp: number) => {
    setTemperature(newTemp);
  };

  const startHeating = () => {
    setIsHeating(true);
    // Simulate heating process
    setTimeout(() => {
      setIsHeating(false);
      Alert.alert('Ready', 'Water has reached the desired temperature!');
    }, 3000);
  };

  const handleBrewingTimeSelect = (time: BrewingTime) => {
    setSelectedBrewingTime(time);
    if (time.id === '4') {
      Alert.prompt(
        'Custom Brewing Time',
        'Enter brewing time in seconds:',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Start',
            onPress: (value) => {
              if (value) {
                const customTime = {
                  ...time,
                  duration: parseInt(value),
                };
                startBrewing(customTime);
              }
            },
          },
        ],
        'plain-text',
        '240'
      );
    } else {
      startBrewing(time);
    }
  };

  const startBrewing = (time: BrewingTime) => {
    setIsBrewing(true);
    setTimeRemaining(time.duration);
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsBrewing(false);
          Alert.alert('Brewing Complete', 'Your coffee is ready!');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderBrewingTime = ({ item }: { item: BrewingTime }) => (
    <TouchableOpacity
      style={styles.brewingTimeCard}
      onPress={() => handleBrewingTimeSelect(item)}
    >
      <Text style={styles.brewingTimeName}>{item.name}</Text>
      <Text style={styles.brewingTimeDuration}>
        {item.id === '4' ? 'Custom' : `${item.duration / 60} min`}
      </Text>
      <Text style={styles.brewingTimeDesc}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>French Press</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.content}>
        <View style={styles.deviceImageContainer}>
          <Image
            source={{ uri: 'https://picsum.photos/400/400' }}
            style={styles.deviceImage}
          />
        </View>

        {isBrewing ? (
          <View style={styles.brewingTimer}>
            <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
            <TouchableOpacity
              style={styles.stopButton}
              onPress={() => setIsBrewing(false)}
            >
              <Text style={styles.stopButtonText}>Stop</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.controls}>
              <Text style={styles.sectionTitle}>Temperature Control</Text>
              <View style={styles.temperatureControl}>
                <TouchableOpacity
                  style={styles.tempButton}
                  onPress={() => handleTemperatureChange(Math.max(80, temperature - 5))}
                >
                  <Ionicons name="remove" size={24} color="#007AFF" />
                </TouchableOpacity>
                <Text style={styles.temperatureText}>{temperature}°C</Text>
                <TouchableOpacity
                  style={styles.tempButton}
                  onPress={() => handleTemperatureChange(Math.min(100, temperature + 5))}
                >
                  <Ionicons name="add" size={24} color="#007AFF" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.heatButton, isHeating && styles.heatButtonActive]}
                onPress={startHeating}
                disabled={isHeating}
              >
                <Ionicons
                  name={isHeating ? 'flame' : 'flame-outline'}
                  size={24}
                  color="#fff"
                />
                <Text style={styles.heatButtonText}>
                  {isHeating ? 'Heating...' : 'Start Heating'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.brewingSection}>
              <Text style={styles.sectionTitle}>Select Brewing Time</Text>
              <FlatList
                data={brewingTimes}
                renderItem={renderBrewingTime}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.brewingTimesContainer}
              />
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.infoTitle}>Recommended Settings</Text>
              <View style={styles.infoItem}>
                <Ionicons name="water" size={20} color="#007AFF" />
                <Text style={styles.infoText}>Water Temperature: 90-96°C</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="time" size={20} color="#007AFF" />
                <Text style={styles.infoText}>Steep Time: 4 minutes</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="scale" size={20} color="#007AFF" />
                <Text style={styles.infoText}>Coffee to Water Ratio: 1:15</Text>
              </View>
            </View>
          </>
        )}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  deviceImageContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  deviceImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  controls: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  temperatureControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  tempButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  temperatureText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 24,
  },
  heatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
  },
  heatButtonActive: {
    backgroundColor: '#FF3B30',
  },
  heatButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  brewingSection: {
    marginBottom: 24,
  },
  brewingTimesContainer: {
    paddingRight: 16,
  },
  brewingTimeCard: {
    width: width * 0.7,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginRight: 16,
  },
  brewingTimeName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  brewingTimeDuration: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  brewingTimeDesc: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  brewingTimer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 32,
  },
  stopButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 32,
  },
  stopButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  infoSection: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
}); 