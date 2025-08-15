// README
// Main app navigation setup combining stack and tab navigators.
// Features:
// - Authentication-based navigation flow (logged-in users vs guests).
// - Bottom tab navigation for main app sections (Home, Brew Log, Scan, Extraction, Shop).
// - Nested stack navigators for specific feature areas (e.g., Home stack).
// - Modal-based shop view triggered from Shop tab.
// Notes:
// - Uses React Navigation's native stack and bottom tab navigators.
// - Type definitions for all navigation routes are included in RootStackParamList.
// - Shop tab does not navigate to a screen — it opens a modal with a WebView store.

// -------------------- Imports --------------------
import React, { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import ShopWebViewModal from "../screens/shop/ShopWebViewModal";

// Screens for authentication and onboarding
import LandingScreen from "../screens/login-and-signup/Landing";
import SignUpScreen from "../screens/login-and-signup/SignUp";
import ForgotPassword from "../screens/login-and-signup/ForgotPassword";
import ConfirmEmail from "../screens/login-and-signup/ConfirmEmail";
import ResetLink from "../screens/login-and-signup/ResetLink";

// Main home and feature screens
import HomeScreen from "../screens/home/Home";
import CameraScreen from "../screens/home/Camera";
import ExtracionScreen from "../screens/extracion-screens/ExtracionScreen";
import MainWallet from "../screens/home/wallet/MainWallet";
import AllCouponsScreen from "../screens/home/wallet/AllCoupons";
import FullCouponScreen from "../screens/home/wallet/FullCoupon";
import SearchScreen from "../screens/home/Search";
import BrewLogScreen from "../screens/brew-log/AllBrewLogs";
import BrewLogEditScreen from "../screens/brew-log/EntryEdit";
import BrewLogDetailScreen from "../screens/brew-log/EntryDetail";
import ExtracionConfigScreen from "../screens/extracion-screens/ExtracionConfigScreen";
import ExtracionCoffeeBeanListScreen from "../screens/extracion-screens/ExtracionCoffeeBeanListScreen";
import ExtracionCoffeeBeanInputScreen from "../screens/extracion-screens/ExtracionCoffeeBeanInputScreen";
import CafeFinderScreen from "../screens/home/CafeFinder";
import NewsletterDetailScreen from "../screens/home/NewsletterDetail";
import ExtracionCoffeeToWaterScreen from "../screens/extracion-screens/ExtracionCoffeeToWaterScreen";
import ExtracionPour from "../screens/extracion-screens/ExtracionPour";
import ExtracionBloom from "../screens/extracion-screens/ExtracionBloom";
import ExtracionSpiral from "../screens/extracion-screens/ExtracionSpiral";
import ExtracionBrew from "../screens/extracion-screens/ExtracionBrew";
import DotsMenu from "../screens/home/DotsMenu";

// Type definitions for navigation params
import { coupon } from "../assets/types/coupon";
import { brewLogEntry } from "../assets/types/brew-log/brew-log-entry";
import { newsletterItem } from "../assets/types/newsletter-item";

// -------------------- Navigation Types --------------------
export type RootStackParamList = {
  // Auth flow
  Landing: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  ConfirmEmail: undefined;
  ResetLink: undefined;

  // Main app flow
  MainTabs: undefined;
  Camera: undefined;
  Extraction: undefined;
  Wallet: undefined;
  AllCoupons: undefined;
  SearchScreen: undefined;
  BrewLogScreen: undefined;
  CafeFinderScreen: undefined;
  NewsletterDetail: { item: newsletterItem };

  // Brewing process
  ExtracionPour: {
    waterAmount: string;
    coffeeAmount?: string;
    ratio?: number;
    time: number;
  };
  ExtracionBloom: {
    waterAmount: string;
    coffeeAmount?: string;
    ratio?: number;
    time: number;
  };
  ExtracionSpiral: {
    waterAmount: string;
    coffeeAmount?: string;
    ratio?: number;
    time: number;
  };
  ExtracionBrew: {
    waterAmount: string;
    coffeeAmount?: string;
    ratio?: number;
    time: number;
  };

  // Brew log entries
  BrewLogDetailScreen: { brewLogEntry: brewLogEntry };
  BrewLogEditScreen: { brewLogEntry: brewLogEntry };

  // Coupons
  FullCoupon: { coupon: coupon };

  // Detail screens
  BeanDetail: { beanId: string };
  CafeDetail: { cafeId: string };
  ClassDetail: { classId: string };
  ToolDetail: { toolId: string };
  ItemDetail: { itemId: string };

  // Extraction configurations
  ExtracionConfigScreen?: { ratio?: number };
  ExtracionCoffeeBeanListScreen: undefined;
  ExtracionCoffeeBeanInputScreen: undefined;
  ExtracionCoffeeToWaterScreen: {
    coffeeBeans: string;
    water: string;
    ratio: number;
    onUpdate: (coffeeBeans: string, water: string) => void;
  };

  ExtracionScreen: undefined;
  DotsMenu: undefined;
};

// -------------------- Navigator Instances --------------------
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();

// -------------------- Home Stack Navigator --------------------
function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="MainHome" component={HomeScreen} />
      <HomeStack.Screen name="Wallet" component={MainWallet} />
      <HomeStack.Screen name="AllCoupons" component={AllCouponsScreen} />
      <HomeStack.Screen name="FullCoupon" component={FullCouponScreen} />
      <HomeStack.Screen name="SearchScreen" component={SearchScreen} />
      <HomeStack.Screen
        name="CafeFinderScreen"
        component={CafeFinderScreen}
        options={{
          headerShown: false,
          animation: "fade",
          animationDuration: 300,
        }}
      />
      <HomeStack.Screen
        name="NewsletterDetail"
        component={NewsletterDetailScreen}
      />
    </HomeStack.Navigator>
  );
}

// -------------------- Main Tabs Navigator --------------------
function MainTabs() {
  const [showShopModal, setShowShopModal] = useState(false);

  // Simple placeholder for the Shop tab
  const ShopTabComponent = () => (
    <View style={{ flex: 1, backgroundColor: "#333333" }} />
  );

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconSource;
            switch (route.name) {
              case "Home":
                iconSource = require("../assets/graphics/nav-icons/home.png");
                break;
              case "Brew Log":
                iconSource = require("../assets/graphics/nav-icons/brew-log.png");
                break;
              case "Scan":
                iconSource = require("../assets/graphics/nav-icons/scan.png");
                break;
              case "Extracion":
                iconSource = require("../assets/graphics/nav-icons/extracion-icon.png");
                break;
              case "Shop":
                iconSource = require("../assets/graphics/nav-icons/shop.png");
                break;
            }
            return (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  paddingTop: 10,
                }}
              >
                <Image
                  source={iconSource}
                  style={{
                    width: size,
                    height: size,
                    tintColor: color,
                    resizeMode: "contain",
                  }}
                />
              </View>
            );
          },
          tabBarActiveTintColor: "#8CDBED",
          tabBarInactiveTintColor: "#FFFFFF",
          tabBarStyle: { height: 90, backgroundColor: "#333333" },
          tabBarLabelStyle: {
            fontSize: 12,
            marginTop: 5,
            marginBottom: 4,
            fontFamily: "cardRegular",
          },
          headerShown: false,
        })}
      >
        <Tab.Screen name="Home" component={HomeStackScreen} />
        <Tab.Screen name="Brew Log" component={BrewLogScreen} />
        <Tab.Screen name="Scan" component={CameraScreen} />
        <Tab.Screen name="Extracion" component={ExtracionScreen} />
        <Tab.Screen
          name="Shop"
          component={ShopTabComponent}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              setShowShopModal(true);
            },
          }}
        />
      </Tab.Navigator>

      {/* Shop modal triggered from the Shop tab */}
      <ShopWebViewModal
        visible={showShopModal}
        onClose={() => setShowShopModal(false)}
      />
    </>
  );
}

// -------------------- App Navigator (Auth-aware) --------------------
export default function AppNavigator() {
  const { user, loading } = useAuth();

  // While auth state is loading, render nothing
  if (loading) return null;

  // Logged-in user navigation
  return user ? (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="Camera" component={CameraScreen} />
      <Stack.Screen name="Extraction" component={ExtracionScreen} />
      <Stack.Screen name="BrewLogScreen" component={BrewLogScreen} />
      <Stack.Screen name="DotsMenu" component={DotsMenu} />
      <Stack.Screen
        name="BrewLogDetailScreen"
        component={BrewLogDetailScreen}
      />
      <Stack.Screen
        name="BrewLogEditScreen"
        component={BrewLogEditScreen}
        options={{ presentation: "modal", gestureEnabled: false }}
      />
      <Stack.Screen name="ExtracionScreen" component={ExtracionScreen} />
      <Stack.Screen
        name="ExtracionConfigScreen"
        component={ExtracionConfigScreen}
      />
      <Stack.Screen
        name="ExtracionCoffeeBeanListScreen"
        component={ExtracionCoffeeBeanListScreen}
      />
      <Stack.Screen
        name="ExtracionCoffeeBeanInputScreen"
        component={ExtracionCoffeeBeanInputScreen}
        options={{ presentation: "fullScreenModal", gestureEnabled: true }}
      />
      <Stack.Screen
        name="ExtracionCoffeeToWaterScreen"
        component={ExtracionCoffeeToWaterScreen}
      />
      <Stack.Screen name="ExtracionBloom" component={ExtracionBloom} />
      <Stack.Screen name="ExtracionPour" component={ExtracionPour} />
      <Stack.Screen name="ExtracionSpiral" component={ExtracionSpiral} />
      <Stack.Screen name="ExtracionBrew" component={ExtracionBrew} />
    </Stack.Navigator>
  ) : (
    // Guest navigation
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Landing" component={LandingScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="ConfirmEmail" component={ConfirmEmail} />
      <Stack.Screen name="ResetLink" component={ResetLink} />
    </Stack.Navigator>
  );
}
