import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import screens (we'll create these next)
import MerchantHomeScreen from '../screens/merchant/MerchantHomeScreen';
import MerchantProductsScreen from '../screens/merchant/MerchantProductsScreen';
import MerchantEventsScreen from '../screens/merchant/MerchantEventsScreen';
import MerchantProfileScreen from '../screens/merchant/MerchantProfileScreen';

const Tab = createBottomTabNavigator();

export default function MerchantNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Products') {
            iconName = focused ? 'cafe' : 'cafe-outline';
          } else if (route.name === 'Events') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={MerchantHomeScreen} />
      <Tab.Screen name="Products" component={MerchantProductsScreen} />
      <Tab.Screen name="Events" component={MerchantEventsScreen} />
      <Tab.Screen name="Profile" component={MerchantProfileScreen} />
    </Tab.Navigator>
  );
} 