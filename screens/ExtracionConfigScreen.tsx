import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import ExtracionParameterTile from '../assets/components/ExtracionParameterTile';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ExtracionConfigScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  
  // State for parameter values
  const [coffeeBeans, setCoffeeBeans] = useState('18g');
  const [water, setWater] = useState('270ml');
  const [grind, setGrind] = useState('Medium');
  const [brewTime, setBrewTime] = useState('4:00');
  const [cupCount, setCupCount] = useState(1);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleNavigateToCoffeeBeans = () => {
    navigation.navigate('ExtracionCoffeeBeanListScreen');
  };

  const handleTilePress = (tileType: string) => {
    // Handle tile press - for now just log
    console.log(`Pressed ${tileType} tile`);
  };

  const handleCupCountChange = (increment: boolean) => {
    if (increment) {
      setCupCount(prev => Math.min(prev + 1, 8)); // Max 8 cups for French Press
    } else {
      setCupCount(prev => Math.max(prev - 1, 1)); // Min 1 cup
    }
  };

  const handleStart = () => {
    console.log('Starting brewing process...');
    // Navigate to brewing screen or start process
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#333333" />
      
      {/* Header */}
      <View style={styles.header}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>french press</Text>
            <View style={styles.headerRight} />
          </View>
        </SafeAreaView>
      </View>

      {/* Navigation Bar */}
      <View style={styles.selectCoffeeBeansContainer}>
        <View style={styles.selectCoffeeBeans}>
          <TouchableOpacity style={styles.navLeft} onPress={handleNavigateToCoffeeBeans}>
            <Image 
              source={require('../assets/icons/extracion_coffeebean.png')} 
              style={styles.navIcon}
            />
            <Text style={styles.navText}>select coffee beans</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navRight} onPress={handleNavigateToCoffeeBeans}>
            <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Cup Counter */}
        <View style={styles.cupCounterContainer}>
          {/* <Text style={styles.cupCounterLabel}>Number of cups</Text> */}
          <View style={styles.cupCounter}>
            <TouchableOpacity 
              style={styles.cupButton} 
              onPress={() => handleCupCountChange(false)}
            >
              <Ionicons name="remove" size={14} color="#007AFF" />
            </TouchableOpacity>
            <Text style={styles.cupCountText}>{cupCount}x</Text>
            <TouchableOpacity 
              style={styles.cupButton} 
              onPress={() => handleCupCountChange(true)}
            >
              <Ionicons name="add" size={14} color="#007AFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Parameter Tiles Grid */}
        <View style={styles.grid}>
          <ExtracionParameterTile
            icon={require('../assets/icons/extracion_coffeebean.png')}
            title="coffee beans"
            value={coffeeBeans}
            onPress={() => handleTilePress('coffee beans')}
          />
          <ExtracionParameterTile
            icon={require('../assets/icons/extracion_water.png')}
            title="water"
            value={water}
            onPress={() => handleTilePress('water')}
          />
          <ExtracionParameterTile
            icon={require('../assets/icons/extracion_grindsize.png')}
            title="grind"
            value={grind}
            onPress={() => handleTilePress('grind')}
          />
          <ExtracionParameterTile
            icon={require('../assets/icons/extracion_timer.png')}
            title="brewTime"
            value={brewTime}
            onPress={() => handleTilePress('brewTime')}
          />
        </View>

        {/* Start Button */}
        <View style={styles.startButtonContainer}>
          <TouchableOpacity style={styles.startButton} onPress={handleStart}>
            <Text style={styles.startButtonText}>start</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#333333',
    paddingTop: 0, // Remove top padding to extend to top
  },
  headerContent: {
    height: 44, // Standard iOS header height
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8, // Add margin to stick next to back arrow
  },
  headerRight: {
    flex: 1, // Take remaining space to push title left
  },
  selectCoffeeBeans: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#58595B',
    borderRadius: 50,
  },
  selectCoffeeBeansContainer: {
    paddingTop: 40,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
  },
  navLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  navIcon: {
    width: 20,
    height: 20,
    tintColor: '#FFFFFF',
    marginRight: 8,
    resizeMode: "contain",
  },
  navText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  navRight: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'flex-start', // Changed from default to start from top
  },
  cupCounterContainer: {
    marginBottom: 32,
  },
  cupCounterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  cupCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  cupButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cupCountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 280, // 130px * 2 + 20px gap
    alignSelf: 'center',
    gap: 20,
    marginBottom: 40,
  },
  startButtonContainer: {
    marginTop: 'auto', // Push to bottom
    paddingBottom: 80,
    paddingHorizontal: 10,
  },
  startButton: {
    backgroundColor: '#8CDBED', // Theme blue color
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 50,
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000', // Black text
  },
});

export default ExtracionConfigScreen;
