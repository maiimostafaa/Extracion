import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  Home: undefined;
  CreatePost: undefined;
  SocialFeed: undefined;
  RecycleRequest: undefined;
  Camera: undefined;
  Profile: undefined;
  Search: undefined;
  PointsExchange: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Mock data for recycling tools
const recyclingTools = [
  { id: 1, name: 'Coffee Grounds Container', description: '5L container for storing coffee grounds' },
  { id: 2, name: 'Compost Bin', description: '10L bin for composting coffee grounds' },
  { id: 3, name: 'Recycling Bag', description: 'Biodegradable bag for coffee grounds' },
];

// Mock data for pickup locations
const pickupLocations = [
  {
    id: 1,
    name: 'Central Recycling Center',
    address: '123 Main Street, Bangkok',
  },
  {
    id: 2,
    name: 'Green Coffee Shop',
    address: '456 Coffee Road, Bangkok',
  },
];

// Add time periods array
const timePeriods = [
  { id: 1, label: 'Morning (9:00 - 12:00)' },
  { id: 2, label: 'Afternoon (12:00 - 15:00)' },
  { id: 3, label: 'Evening (15:00 - 18:00)' },
];

export default function RecycleRequestScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [selectedTool, setSelectedTool] = useState<number>(1);
  const [selectedLocation, setSelectedLocation] = useState<number>(1);
  const [weight, setWeight] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<number>(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [userPoints, setUserPoints] = useState(0);

  // Load user points when component mounts
  useEffect(() => {
    const loadUserPoints = async () => {
      try {
        const points = await AsyncStorage.getItem('userPoints');
        if (points) {
          setUserPoints(parseInt(points));
        } else {
          // Initialize points if not set
          await AsyncStorage.setItem('userPoints', '250');
          setUserPoints(250);
        }
      } catch (error) {
        console.error('Error loading points:', error);
      }
    };

    loadUserPoints();
  }, []);

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleSubmit = async () => {
    if (!weight) {
      Alert.alert('Error', 'Please enter the weight of coffee grounds');
      return;
    }

    // Calculate points based on coffee grounds amount
    const groundsAmount = parseFloat(weight);
    const pointsEarned = Math.floor(groundsAmount * 10); // 10 points per kg

    try {
      // Get the selected tool, location, and time period
      const selectedToolData = recyclingTools.find(tool => tool.id === selectedTool);
      const selectedLocationData = pickupLocations.find(loc => loc.id === selectedLocation);
      const selectedTimeData = timePeriods.find(time => time.id === selectedTimePeriod);

      if (!selectedToolData || !selectedLocationData || !selectedTimeData) {
        throw new Error('Invalid selection');
      }

      // Create a new recycling request
      const newRequest = {
        id: Date.now(),
        tool: selectedToolData.name,
        location: selectedLocationData.name,
        weight: weight,
        date: selectedDate.toISOString(),
        timePeriod: selectedTimeData.label,
        status: 'pending',
        timestamp: new Date().toISOString(),
        pointsEarned: pointsEarned
      };

      // Save to AsyncStorage
      const existingRequests = await AsyncStorage.getItem('recyclingRequests');
      const requests = existingRequests ? JSON.parse(existingRequests) : [];
      await AsyncStorage.setItem('recyclingRequests', JSON.stringify([...requests, newRequest]));

      // Update user points
      const currentPoints = await AsyncStorage.getItem('userPoints');
      const newPoints = (parseInt(currentPoints || '0') + pointsEarned).toString();
      await AsyncStorage.setItem('userPoints', newPoints);
      setUserPoints(parseInt(newPoints));

      // Create notification with request details
      const notification = {
        id: Date.now(),
        type: 'recycle',
        title: 'Recycling Request Submitted',
        message: `Your recycling request has been submitted successfully. You earned ${pointsEarned} points!`,
        timestamp: 'Just now',
        read: false,
        requestDetails: {
          location: selectedLocationData.name,
          address: selectedLocationData.address,
          date: selectedDate.toLocaleDateString(),
          timePeriod: selectedTimeData.label,
          weight: `${weight} kg`,
          tool: selectedToolData.name,
          toolDescription: selectedToolData.description,
          pointsEarned: pointsEarned
        },
      };

      // Save notification
      const existingNotifications = await AsyncStorage.getItem('notifications');
      const notifications = existingNotifications ? JSON.parse(existingNotifications) : [];
      await AsyncStorage.setItem('notifications', JSON.stringify([notification, ...notifications]));

      Alert.alert(
        'Success',
        `Recycling request submitted! You earned ${pointsEarned} points!`,
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.goBack();
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error submitting request:', error);
      Alert.alert('Error', 'Failed to submit request. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Recycle Coffee Grounds</Text>
        <View style={styles.pointsDisplay}>
          <Ionicons name="gift" size={20} color="#007AFF" />
          <Text style={styles.pointsText}>{userPoints} points</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color="#007AFF" />
          <Text style={styles.infoText}>
            Recycle your coffee grounds and earn points! Each kilogram of coffee grounds recycled earns you 10 points.
          </Text>
        </View>

        {/* Tools Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Recycling Tool</Text>
          {recyclingTools.map((tool) => (
            <TouchableOpacity
              key={tool.id}
              style={[
                styles.toolCard,
                selectedTool === tool.id && styles.selectedToolCard,
              ]}
              onPress={() => setSelectedTool(tool.id)}
            >
              <View style={styles.toolInfo}>
                <Text style={styles.toolName}>{tool.name}</Text>
                <Text style={styles.toolDescription}>{tool.description}</Text>
              </View>
              {selectedTool === tool.id && (
                <Ionicons name="checkmark-circle" size={24} color="#007AFF" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Date Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Pickup Date</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar" size={24} color="#007AFF" />
            <Text style={styles.dateText}>
              {selectedDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}
        </View>

        {/* Time Period Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Time Period</Text>
          {timePeriods.map((time) => (
            <TouchableOpacity
              key={time.id}
              style={[
                styles.timeCard,
                selectedTimePeriod === time.id && styles.selectedTimeCard,
              ]}
              onPress={() => setSelectedTimePeriod(time.id)}
            >
              <Text style={styles.timeText}>{time.label}</Text>
              {selectedTimePeriod === time.id && (
                <Ionicons name="checkmark-circle" size={24} color="#007AFF" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Location Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Pickup Location</Text>
          {pickupLocations.map((location) => (
            <TouchableOpacity
              key={location.id}
              style={[
                styles.locationCard,
                selectedLocation === location.id && styles.selectedLocationCard,
              ]}
              onPress={() => setSelectedLocation(location.id)}
            >
              <Text style={styles.locationName}>{location.name}</Text>
              <Text style={styles.locationAddress}>{location.address}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Weight Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Coffee Grounds Weight (kg)</Text>
          <View style={styles.weightInput}>
            <TextInput
              style={styles.input}
              keyboardType="decimal-pad"
              placeholder="Enter weight"
              value={weight}
              onChangeText={setWeight}
            />
            <Text style={styles.unit}>kg</Text>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Submit Request</Text>
        </TouchableOpacity>
      </ScrollView>
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  toolCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedToolCard: {
    backgroundColor: '#e6f2ff',
    borderColor: '#007AFF',
    borderWidth: 1,
  },
  toolInfo: {
    flex: 1,
  },
  toolName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  toolDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  locationCard: {
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedLocationCard: {
    backgroundColor: '#e6f2ff',
    borderColor: '#007AFF',
    borderWidth: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  locationAddress: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  weightInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#333',
  },
  unit: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  dateText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  timeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedTimeCard: {
    backgroundColor: '#e6f2ff',
    borderColor: '#007AFF',
    borderWidth: 1,
  },
  timeText: {
    fontSize: 16,
    color: '#333',
  },
  pointsDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pointsText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
}); 