import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
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

// Mock data for exchangeable items
const exchangeableItems = [
  {
    id: '1',
    name: 'Coffee Class Voucher',
    image: 'https://picsum.photos/400/300?random=1',
    points: 100,
    description: 'Redeem for any coffee class of your choice',
    category: 'Classes',
  },
  {
    id: '2',
    name: 'Premium Coffee Beans',
    image: 'https://picsum.photos/400/300?random=2',
    points: 50,
    description: '250g of specialty coffee beans',
    category: 'Beans',
  },
  {
    id: '3',
    name: 'Coffee Tasting Session',
    image: 'https://picsum.photos/400/300?random=3',
    points: 75,
    description: 'Join a guided coffee tasting session',
    category: 'Experience',
  },
  {
    id: '4',
    name: 'Barista Tool Kit',
    image: 'https://picsum.photos/400/300?random=4',
    points: 150,
    description: 'Essential tools for home brewing',
    category: 'Tools',
  },
];

export default function PointsExchangeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [userPoints, setUserPoints] = useState(250);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Load user points from storage
  useEffect(() => {
    loadUserPoints();
  }, []);

  const loadUserPoints = async () => {
    try {
      const points = await AsyncStorage.getItem('userPoints');
      if (points) {
        setUserPoints(parseInt(points, 10));
      }
    } catch (error) {
      console.error('Error loading points:', error);
    }
  };

  const saveUserPoints = async (points: number) => {
    try {
      await AsyncStorage.setItem('userPoints', points.toString());
    } catch (error) {
      console.error('Error saving points:', error);
    }
  };

  const categories = ['All', 'Classes', 'Beans', 'Experience', 'Tools'];

  const filteredItems = selectedCategory === 'All'
    ? exchangeableItems
    : exchangeableItems.filter(item => item.category === selectedCategory);

  const handleRedeem = (item: any) => {
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
              const newPoints = userPoints - item.points;
              setUserPoints(newPoints);
              await saveUserPoints(newPoints);
              
              // Save redemption history
              try {
                const history = await AsyncStorage.getItem('redemptionHistory');
                const redemptionHistory = history ? JSON.parse(history) : [];
                redemptionHistory.push({
                  id: Date.now(),
                  item: item.name,
                  points: item.points,
                  date: new Date().toISOString(),
                });
                await AsyncStorage.setItem('redemptionHistory', JSON.stringify(redemptionHistory));
              } catch (error) {
                console.error('Error saving redemption history:', error);
              }

              Alert.alert(
                'Success',
                `You have successfully redeemed ${item.name}!`,
                [{ text: 'OK' }]
              );
            },
          },
        ]
      );
    } else {
      Alert.alert(
        'Insufficient Points',
        'You don\'t have enough points to redeem this item.',
        [{ text: 'OK' }]
      );
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.itemCard}
      onPress={() => handleRedeem(item)}
    >
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemContent}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
        <View style={styles.pointsContainer}>
          <Ionicons name="gift" size={16} color="#007AFF" />
          <Text style={styles.pointsText}>{item.points} points</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Points Exchange</Text>
        <View style={styles.pointsDisplay}>
          <Ionicons name="gift" size={20} color="#007AFF" />
          <Text style={styles.pointsText}>{userPoints} points</Text>
        </View>
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
        {categories.map(category => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.selectedCategory,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.selectedCategoryText,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Items List */}
      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.itemsList}
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
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
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
  },
  selectedCategory: {
    backgroundColor: '#007AFF',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  itemsList: {
    padding: 16,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  itemContent: {
    flex: 1,
    padding: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
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
  },
}); 