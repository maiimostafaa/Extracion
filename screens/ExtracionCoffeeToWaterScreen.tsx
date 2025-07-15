import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

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

  const handleBack = () => {
    navigation.goBack();
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
            <Text style={styles.headerTitle}>Coffee & Water</Text>
            <View style={styles.headerRight} />
          </View>
        </SafeAreaView>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.placeholderText}>
          Coffee to Water Adjustment Screen
        </Text>
        <Text style={styles.valueText}>
          Current Coffee: {coffeeBeans}
        </Text>
        <Text style={styles.valueText}>
          Current Water: {water}
        </Text>
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
    color: '#8CDBED',
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
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
