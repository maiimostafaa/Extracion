import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Reward {
  id: string;
  name: string;
  description: string;
  points: number;
  image: string;
  stock: number;
}

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

const STORAGE_KEY = '@user_points';
const REDEEMED_REWARDS_KEY = '@redeemed_rewards';

export default function RewardShopScreen() {
  const [userPoints, setUserPoints] = useState(0);
  const [rewards, setRewards] = useState<Reward[]>(mockRewards);
  const [redeemedRewards, setRedeemedRewards] = useState<string[]>([]);

  useEffect(() => {
    loadUserPoints();
    loadRedeemedRewards();
  }, []);

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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reward Shop</Text>
        <View style={styles.pointsContainer}>
          <Ionicons name="leaf" size={24} color="#4CAF50" />
          <Text style={styles.pointsText}>{userPoints} points</Text>
        </View>
      </View>

      <FlatList
        data={rewards}
        renderItem={renderReward}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.rewardsList}
      />
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