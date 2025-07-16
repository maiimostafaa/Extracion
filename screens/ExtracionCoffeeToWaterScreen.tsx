import React from 'react';
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
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Slider from '@react-native-community/slider';
import type { RootStackParamList } from '../navigation/AppNavigator';
import ExtracionCoffeeToWaterInstructionBanner from '../assets/components/extracion/ExtracionCoffeeToWaterInstructionBanner';
import CoffeeRatioSlider from '../assets/components/extracion/RatioSlider';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface RouteParams {
  coffeeBeans: string;
  water: string;
  onUpdate: (coffeeBeans: string, water: string) => void;
}

const ExtracionCoffeeToWaterScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { coffeeBeans, water, onUpdate } = route.params as RouteParams;
  const [ratio, setRatio] = React.useState(20); // Default to middle of range (10-30)

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#333333" />
      
      {/* Header */}
      <View style={styles.header}>
        <SafeAreaView>

          {/* Header */}
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>coffee to water ratio</Text>
            <View style={styles.headerRight} />
          </View>
        </SafeAreaView>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <ExtracionCoffeeToWaterInstructionBanner text="Step 1: Adjust your coffee to water ratio" />
        
        <CoffeeRatioSlider ratio={ratio} onChange={setRatio} />
        
        <ExtracionCoffeeToWaterInstructionBanner text={"Step 2: Pour the coffee beans\nto get your water volume"} />
        
        {/* Coffee and Water Display */}
        <View style={styles.measurementContainer}>
          <View style={styles.measurementItem}>
            <Image 
              source={require('../assets/icons/extracion_coffeebean.png')} 
              style={styles.iconImage}
            />
            <Text style={styles.measurementValue}>1g</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.measurementItem}>
            <Image 
              source={require('../assets/icons/extracion_water.png')} 
              style={styles.iconImage}
            />
            <Text style={styles.measurementValue}>{ratio}ml</Text>
          </View>
        </View>
        
        {/* Save Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleBack}>
            <Text style={styles.saveButtonText}>save changes</Text>
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
  },
  headerContent: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  measurementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 32,
    marginVertical: 32,
    width: '100%',
    maxWidth: 320,
    minHeight: 120,
  },
  measurementItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconImage: {
    width: 40,
    height: 40,
    marginBottom: 12,
    resizeMode: 'contain',
    tintColor: '#58595B', // Coffee brown color to match the bean slider
  },
  measurementValue: {
    fontSize: 24,
    fontWeight: '300',
    color: '#2C2C2C',
    letterSpacing: 1,
  },
  divider: {
    width: 2,
    height: 80,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 24,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 'auto',
    marginBottom: 40,
  },
  saveButton: {
    backgroundColor: '#8CDBED',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    width: '100%',
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  placeholderText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 20,
    textAlign: 'center',
  },
  valueText: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default ExtracionCoffeeToWaterScreen;
