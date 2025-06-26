import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
  Modal,
  SafeAreaView,
  Image,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

interface RecycleRequest {
  id: string;
  date: string;
  timeSlot: string;
  store: string;
  weight: number;
  points: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  timestamp: string;
  calendarEventId?: string;
}

interface Reward {
  id: string;
  name: string;
  description: string;
  points: number;
  image: string;
  stock: number;
}

const TIME_SLOTS = [
  '09:00 - 11:00',
  '11:00 - 13:00',
  '13:00 - 15:00',
  '15:00 - 17:00',
  '17:00 - 19:00',
];

const STORES = [
  'Downtown Branch',
  'Westside Branch',
  'Eastside Branch',
  'North Branch',
];

// Mock rewards data
const mockRewards: Reward[] = [
  {
    id: '1',
    name: 'Free Coffee',
    description: 'Redeem a free coffee at any participating cafe',
    points: 100,
    image: 'https://picsum.photos/200/200?random=1',
    stock: 10,
  },
  {
    id: '2',
    name: 'Coffee Mug',
    description: 'Eco-friendly ceramic coffee mug',
    points: 200,
    image: 'https://picsum.photos/200/200?random=2',
    stock: 5,
  },
  {
    id: '3',
    name: 'Coffee Beans (250g)',
    description: 'Premium coffee beans from local roasters',
    points: 300,
    image: 'https://picsum.photos/200/200?random=3',
    stock: 8,
  },
  {
    id: '4',
    name: 'Coffee Workshop',
    description: 'Learn coffee brewing techniques from experts',
    points: 500,
    image: 'https://picsum.photos/200/200?random=4',
    stock: 3,
  },
];

const POINTS_PER_KG = 10; // Points earned per kg of coffee grounds
const STORAGE_KEY = 'recyclePoints';
const REDEEMED_REWARDS_KEY = '@redeemed_rewards';

export default function RecycleScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [selectedStore, setSelectedStore] = useState('');
  const [weight, setWeight] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [userPoints, setUserPoints] = useState(0);
  const [recycleHistory, setRecycleHistory] = useState<RecycleRequest[]>([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [markedDates, setMarkedDates] = useState({});
  const [rewards, setRewards] = useState<Reward[]>(mockRewards);
  const [redeemedRewards, setRedeemedRewards] = useState<string[]>([]);
  const [showRewards, setShowRewards] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    loadUserPoints();
    loadRecycleHistory();
    loadRedeemedRewards();
  }, []);

  useEffect(() => {
    // Update marked dates whenever recycle history changes
    const marked = recycleHistory.reduce((acc: any, request) => {
      acc[request.date] = {
        marked: true,
        dotColor: request.status === 'completed' ? '#4CAF50' : '#007AFF',
      };
      return acc;
    }, {});
    setMarkedDates(marked);
  }, [recycleHistory]);

  const loadUserPoints = async () => {
    try {
      const points = await AsyncStorage.getItem(STORAGE_KEY);
      if (points) {
        setUserPoints(parseInt(points));
      }
    } catch (error) {
      console.error('Error loading points:', error);
    }
  };

  const loadRecycleHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('recycleHistory');
      if (history) {
        setRecycleHistory(JSON.parse(history));
      }
    } catch (error) {
      console.error('Error loading recycle history:', error);
    }
  };

  const loadRedeemedRewards = async () => {
    try {
      const redeemed = await AsyncStorage.getItem(REDEEMED_REWARDS_KEY);
      if (redeemed) {
        setRedeemedRewards(JSON.parse(redeemed));
      }
    } catch (error) {
      console.error('Error loading redeemed rewards:', error);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowCalendar(false);
    }
    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
  };

  const handleSubmit = async () => {
    if (!selectedTimeSlot || !selectedStore || !weight) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const weightNum = parseFloat(weight);
    if (isNaN(weightNum) || weightNum <= 0) {
      Alert.alert('Error', 'Please enter a valid weight');
      return;
    }

    const points = Math.floor(weightNum * POINTS_PER_KG);
    const newRequest: RecycleRequest = {
      id: Date.now().toString(),
      date: selectedDate.toISOString().split('T')[0],
      timeSlot: selectedTimeSlot,
      store: selectedStore,
      weight: weightNum,
      points,
      status: 'pending',
      timestamp: new Date().toISOString(),
    };

    try {
      // Update recycle history
      const updatedHistory = [newRequest, ...recycleHistory];
      await AsyncStorage.setItem('recycleHistory', JSON.stringify(updatedHistory));
      setRecycleHistory(updatedHistory);

      // Add points immediately
      const newPoints = userPoints + points;
      await AsyncStorage.setItem(STORAGE_KEY, newPoints.toString());
      setUserPoints(newPoints);

      // Create notification for the new request
      const newNotification = {
        id: Date.now().toString(),
        title: 'Recycle Request Scheduled',
        message: `Your recycle pickup has been scheduled for ${newRequest.date} at ${newRequest.timeSlot}. You earned ${points} points!`,
        timestamp: new Date().toISOString(),
        read: false,
      };

      // Get existing notifications
      const storedNotifications = await AsyncStorage.getItem('notifications');
      const notifications = storedNotifications ? JSON.parse(storedNotifications) : [];
      
      // Add new notification
      const updatedNotifications = [newNotification, ...notifications];
      await AsyncStorage.setItem('notifications', JSON.stringify(updatedNotifications));

      // Reset form
      setSelectedTimeSlot('');
      setSelectedStore('');
      setWeight('');

      Alert.alert(
        'Success',
        `Your recycle pickup has been scheduled. You earned ${points} points!`,
        [
          {
            text: 'View Rewards',
            onPress: () => setShowRewards(true),
          },
          {
            text: 'Continue',
            style: 'cancel',
          },
        ]
      );
    } catch (error) {
      console.error('Error submitting recycle request:', error);
      Alert.alert('Error', 'Failed to submit request. Please try again.');
    }
  };

  const handleRedeem = async (reward: Reward) => {
    if (userPoints < reward.points) {
      Alert.alert('Insufficient Points', 'You don\'t have enough points to redeem this reward.');
      return;
    }

    if (reward.stock <= 0) {
      Alert.alert('Out of Stock', 'This reward is currently out of stock.');
      return;
    }

    Alert.alert(
      'Confirm Redemption',
      `Are you sure you want to redeem ${reward.name} for ${reward.points} points?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Redeem',
          onPress: async () => {
            try {
              // Update points
              const newPoints = userPoints - reward.points;
              await AsyncStorage.setItem(STORAGE_KEY, newPoints.toString());
              setUserPoints(newPoints);

              // Update stock
              const updatedRewards = rewards.map(r => {
                if (r.id === reward.id) {
                  return { ...r, stock: r.stock - 1 };
                }
                return r;
              });
              setRewards(updatedRewards);

              // Save redeemed reward
              const newRedeemedRewards = [...redeemedRewards, reward.id];
              await AsyncStorage.setItem(REDEEMED_REWARDS_KEY, JSON.stringify(newRedeemedRewards));
              setRedeemedRewards(newRedeemedRewards);

              Alert.alert('Success', 'Reward redeemed successfully!');
            } catch (error) {
              console.error('Error redeeming reward:', error);
              Alert.alert('Error', 'Failed to redeem reward. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleDeleteRequest = async (requestId: string) => {
    try {
      // Find the request to get its points
      const requestToDelete = recycleHistory.find(r => r.id === requestId);
      if (!requestToDelete) return;

      // Deduct points if the request was pending
      if (requestToDelete.status === 'pending') {
        const updatedPoints = userPoints - requestToDelete.points;
        setUserPoints(updatedPoints);
        await AsyncStorage.setItem(STORAGE_KEY, updatedPoints.toString());
      }

      // Remove the request from the list
      const updatedRequests = recycleHistory.filter(r => r.id !== requestId);
      setRecycleHistory(updatedRequests);
      await AsyncStorage.setItem('recycleHistory', JSON.stringify(updatedRequests));

      Alert.alert('Success', 'Recycle request deleted successfully');
    } catch (error) {
      console.error('Error deleting recycle request:', error);
      Alert.alert('Error', 'Failed to delete recycle request. Please try again.');
    }
  };

  const renderReward = ({ item }: { item: Reward }) => (
    <View style={styles.rewardCard}>
      <Image source={{ uri: item.image }} style={styles.rewardImage} />
      <View style={styles.rewardInfo}>
        <Text style={styles.rewardName}>{item.name}</Text>
        <Text style={styles.rewardDescription}>{item.description}</Text>
        <View style={styles.rewardDetails}>
          <Text style={styles.pointsText}>{item.points} points</Text>
          <Text style={styles.stockText}>Stock: {item.stock}</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.redeemButton,
            (userPoints < item.points || item.stock <= 0) && styles.redeemButtonDisabled,
          ]}
          onPress={() => handleRedeem(item)}
          disabled={userPoints < item.points || item.stock <= 0}
        >
          <Text style={styles.redeemButtonText}>Redeem</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTimeSlot = (slot: string) => (
    <TouchableOpacity
      key={slot}
      style={[
        styles.timeSlot,
        selectedTimeSlot === slot && styles.selectedTimeSlot,
      ]}
      onPress={() => setSelectedTimeSlot(slot)}
    >
      <Text
        style={[
          styles.timeSlotText,
          selectedTimeSlot === slot && styles.selectedTimeSlotText,
        ]}
      >
        {slot}
      </Text>
    </TouchableOpacity>
  );

  const renderStore = (store: string) => (
    <TouchableOpacity
      key={store}
      style={[
        styles.storeOption,
        selectedStore === store && styles.selectedStore,
      ]}
      onPress={() => setSelectedStore(store)}
    >
      <Text
        style={[
          styles.storeText,
          selectedStore === store && styles.selectedStoreText,
        ]}
      >
        {store}
      </Text>
    </TouchableOpacity>
  );

  const renderRecycleRequest = ({ item }: { item: RecycleRequest }) => (
    <View style={styles.requestCard}>
      <View style={styles.requestHeader}>
        <Text style={styles.requestType}>{item.store}</Text>
        <Text style={styles.requestPoints}>+{item.points} points</Text>
      </View>
      <Text style={styles.requestStatus}>Status: {item.status}</Text>
      <Text style={styles.requestTimestamp}>{item.timestamp}</Text>
      {item.status === 'pending' && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => {
            Alert.alert(
              'Delete Request',
              'Are you sure you want to delete this request? This will deduct the points.',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: () => handleDeleteRequest(item.id),
                },
              ]
            );
          }}
        >
          <Ionicons name="trash-outline" size={24} color="#FF3B30" />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderContent = () => (
    <>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Date</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowCalendar(true)}
        >
          <Ionicons name="calendar" size={24} color="#007AFF" />
          <Text style={styles.dateText}>
            {selectedDate.toLocaleDateString()}
          </Text>
        </TouchableOpacity>
        {Platform.OS === 'ios' && showCalendar && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="spinner"
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}
        {Platform.OS === 'android' && showCalendar && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Time Slot</Text>
        <View style={styles.timeSlotsContainer}>
          {TIME_SLOTS.map(renderTimeSlot)}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Store</Text>
        <View style={styles.storesContainer}>
          {STORES.map(renderStore)}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Enter Weight (kg)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
          placeholder="Enter weight in kilograms"
        />
        <Text style={styles.pointsInfo}>
          You will earn {parseFloat(weight) * POINTS_PER_KG || 0} points
        </Text>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Schedule Pickup</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.rewardsButton}
        onPress={() => setShowRewards(true)}
      >
        <Ionicons name="gift" size={24} color="#fff" />
        <Text style={styles.rewardsButtonText}>View Rewards</Text>
      </TouchableOpacity>

      <View style={styles.historySection}>
        <Text style={styles.sectionTitle}>Recent Requests</Text>
        <FlatList
          data={recycleHistory}
          renderItem={renderRecycleRequest}
          keyExtractor={(item) => item.id}
          style={styles.historyList}
          scrollEnabled={false}
        />
      </View>
    </>
  );

  const clearAllData = async () => {
    try {
      // Clear all AsyncStorage data
      await AsyncStorage.multiRemove([
        'recyclePoints',
        'recycleHistory',
        '@redeemed_rewards',
        'notifications',
        'posts'
      ]);
      
      // Reset all state
      setUserPoints(0);
      setRecycleHistory([]);
      setRedeemedRewards([]);
      setRewards(mockRewards);
      
      Alert.alert('Success', 'All data has been cleared successfully');
    } catch (error) {
      console.error('Error clearing data:', error);
      Alert.alert('Error', 'Failed to clear data. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Recycle Coffee Grounds</Text>
        <View style={styles.pointsContainer}>
          <Ionicons name="leaf" size={24} color="#4CAF50" />
          <Text style={styles.pointsText}>{userPoints} points</Text>
        </View>
      </View>

      <FlatList
        data={[1]}
        renderItem={() => renderContent()}
        keyExtractor={() => 'content'}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        visible={showRewards}
        transparent
        animationType="slide"
        onRequestClose={() => setShowRewards(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Reward Shop</Text>
              <TouchableOpacity
                onPress={() => setShowRewards(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={rewards}
              renderItem={renderReward}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.rewardsList}
            />
          </View>
        </View>
      </Modal>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pointsText: {
    marginLeft: 4,
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
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
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  timeSlotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeSlot: {
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    minWidth: '30%',
  },
  selectedTimeSlot: {
    backgroundColor: '#007AFF',
  },
  timeSlotText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  selectedTimeSlotText: {
    color: '#fff',
  },
  storesContainer: {
    gap: 8,
  },
  storeOption: {
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  selectedStore: {
    backgroundColor: '#007AFF',
  },
  storeText: {
    fontSize: 16,
    color: '#333',
  },
  selectedStoreText: {
    color: '#fff',
  },
  input: {
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    fontSize: 16,
  },
  pointsInfo: {
    fontSize: 14,
    color: '#4CAF50',
    marginTop: 8,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  rewardsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    padding: 16,
    margin: 16,
    borderRadius: 8,
  },
  rewardsButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  historySection: {
    padding: 16,
  },
  historyList: {
    marginTop: 8,
  },
  requestCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#eee',
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  requestType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  requestPoints: {
    fontSize: 14,
    color: '#4CAF50',
  },
  requestStatus: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  requestTimestamp: {
    fontSize: 14,
    color: '#999',
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  rewardsList: {
    padding: 16,
  },
  rewardCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  rewardImage: {
    width: '100%',
    height: 200,
  },
  rewardInfo: {
    padding: 16,
  },
  rewardName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  rewardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  rewardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  stockText: {
    fontSize: 14,
    color: '#666',
  },
  redeemButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  redeemButtonDisabled: {
    backgroundColor: '#ccc',
  },
  redeemButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 