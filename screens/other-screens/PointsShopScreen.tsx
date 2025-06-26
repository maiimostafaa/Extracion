import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock data for redeemable items
const redeemableItems = [
  {
    id: '1',
    name: 'Free Coffee',
    points: 100,
    image: 'https://picsum.photos/200/200?random=1',
    description: 'Redeem for a free coffee of your choice',
  },
  {
    id: '2',
    name: 'Coffee Mug',
    points: 250,
    image: 'https://picsum.photos/200/200?random=2',
    description: 'Stylish coffee mug with our logo',
  },
  {
    id: '3',
    name: 'Coffee Beans Pack',
    points: 300,
    image: 'https://picsum.photos/200/200?random=3',
    description: '250g pack of premium coffee beans',
  },
  {
    id: '4',
    name: 'Coffee Workshop',
    points: 500,
    image: 'https://picsum.photos/200/200?random=4',
    description: 'Join our coffee brewing workshop',
  },
  {
    id: '5',
    name: 'VIP Membership',
    points: 1000,
    image: 'https://picsum.photos/200/200?random=5',
    description: '3 months of VIP membership benefits',
  },
];

const PointsShopScreen = () => {
  const [userPoints, setUserPoints] = useState(0);

  // Load user points when component mounts
  useEffect(() => {
    loadUserPoints();
  }, []);

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

  const handleRedeem = async (item: typeof redeemableItems[0]) => {
    if (userPoints >= item.points) {
      Alert.alert(
        'Confirm Redemption',
        `Would you like to redeem ${item.points} points for ${item.name}?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Redeem',
            onPress: async () => {
              try {
                const newPoints = userPoints - item.points;
                setUserPoints(newPoints);
                await AsyncStorage.setItem('userPoints', newPoints.toString());

                // Save redemption history
                const history = await AsyncStorage.getItem('redemptionHistory');
                const redemptionHistory = history ? JSON.parse(history) : [];
                redemptionHistory.push({
                  id: Date.now(),
                  item: item.name,
                  points: item.points,
                  date: new Date().toISOString(),
                });
                await AsyncStorage.setItem('redemptionHistory', JSON.stringify(redemptionHistory));

                Alert.alert('Success', `You have successfully redeemed ${item.name}!`);
              } catch (error) {
                console.error('Error saving redemption:', error);
                Alert.alert('Error', 'Failed to process redemption. Please try again.');
              }
            },
          },
        ]
      );
    } else {
      Alert.alert('Not Enough Points', 'You need more points to redeem this item.');
    }
  };

  const renderItem = ({ item }: { item: typeof redeemableItems[0] }) => (
    <TouchableOpacity
      style={styles.itemCard}
      onPress={() => handleRedeem(item)}
    >
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
        <View style={styles.pointsContainer}>
          <Ionicons name="star" size={20} color="#FFD700" />
          <Text style={styles.pointsText}>{item.points} points</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Points Shop</Text>
        <View style={styles.pointsDisplay}>
          <Ionicons name="star" size={24} color="#FFD700" />
          <Text style={styles.pointsText}>{userPoints} points</Text>
        </View>
      </View>

      <FlatList
        data={redeemableItems}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  pointsDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 8,
    borderRadius: 20,
  },
  pointsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 4,
  },
  listContainer: {
    padding: 16,
  },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  itemImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  itemInfo: {
    padding: 16,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
});

export default PointsShopScreen; 