import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image, View } from "react-native";
import { useAuth } from "../context/AuthContext";

import LandingScreen from "../screens/login&signup/Landing";
import SignUpScreen from "../screens/login&signup/SignUp";
import ForgotPassword from "../screens/login&signup/ForgotPassword";
import ConfirmEmail from "../screens/login&signup/ConfirmEmail";
import ResetLink from "../screens/login&signup/ResetLink";
import HomeScreen from "../screens/HomeScreen";
import ExploreScreen from "../screens/other-screens/ExploreScreen";
import RecycleScreen from "../screens/other-screens/RecycleScreen";
import CalendarScreen from "../screens/other-screens/CalendarScreen";
import CreatePostScreen from "../screens/other-screens/CreatePostScreen";
import EditPostScreen from "../screens/other-screens/EditPostScreen";
import MerchantNavigator from "./MerchantNavigator";
import ConnectScreen from "../screens/other-screens/ConnectScreen";
import CameraScreen from "../screens/CameraScreen";
import DeviceScreen from "../screens/other-screens/DeviceScreen";
import DevicesScreen from "../screens/devices/DevicesScreen";
import ExtracionScreen from "../screens/ExtracionScreen";
import MainWallet from "../screens/wallet/mainWallet";
import AllCouponsScreen from "../screens/wallet/allCoupons";
import FullCouponScreen from "../screens/wallet/FullCoupon";
import ProfileScreen from "../screens/ProfileScreen";
import ShopScreen from "../screens/ShopScreen";
import SearchScreen from "../screens/SearchScreen";
import BrewLogScreen from "../screens/brew-log/BrewLog";
import BrewLogEditScreen from "../screens/brew-log/BrewLogEditScreen";
import BrewLogDetailScreen from "../screens/brew-log/BrewLogDetailScreen";
import ExtracionConfigScreen from "../screens/ExtracionConfigScreen";
import ExtracionCoffeeBeanListScreen from "../screens/ExtracionCoffeeBeanListScreen";
import ExtracionCoffeeBeanInputScreen from "../screens/ExtracionCoffeeBeanInputScreen";
import CafeFinderScreen from "../screens/CafeFinderScreen";
import NewsletterDetailScreen from "../screens/NewsletterDetailScreen";
import ExtracionCoffeeToWaterScreen from "../screens/ExtracionCoffeeToWaterScreen";
import ExtracionPour from "../screens/ExtracionPour";
import ExtracionBloom from "../screens/ExtracionBloom";
import ExtracionSpiral from "../screens/ExtracionSpiral";
import ExtracionBrew from "../screens/ExtracionBrew";
import DotsMenu from "../screens/DotsMenu";

import { coupon } from "../assets/types/coupon";
import { brewLogEntry } from "../assets/types/BrewLog/brewLogEntry";
import { newsletterItem } from "../assets/types/newsletter-item";

export type RootStackParamList = {
  Landing: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  ConfirmEmail: undefined;
  ResetLink: undefined;
  MainTabs: undefined;
  Merchant: undefined;
  Recycle: undefined;
  Calendar: undefined;
  CreatePost: undefined;
  EditPost: undefined;
  Connect: undefined;
  Camera: undefined;
  Device: undefined;
  Devices: undefined;
  Extraction: undefined;
  Wallet: undefined;
  allCoupons: undefined;
  SearchScreen: undefined;
  BrewLogScreen: undefined;
  ShopScreen: undefined;
  CafeFinderScreen: undefined;
  NewsletterDetail: { item: newsletterItem };
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
  BrewLogDetailScreen: { brewLogEntry: brewLogEntry };
  BrewLogEditScreen: { brewLogEntry: brewLogEntry };
  fullCoupon: { coupon: coupon };
  BeanDetail: { beanId: string };
  CafeDetail: { cafeId: string };
  ClassDetail: { classId: string };
  ToolDetail: { toolId: string };
  ItemDetail: { itemId: string };
  ExtracionConfigScreen:
    | {
        ratio?: number;
      }
    | undefined;
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

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="Wallet" component={MainWallet} />
      <HomeStack.Screen name="allCoupons" component={AllCouponsScreen} />
      <HomeStack.Screen name="fullCoupon" component={FullCouponScreen} />
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

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconSource;
          switch (route.name) {
            case "Home":
              iconSource = require("../assets/icons/home.png");
              break;
            case "Brew Log":
              iconSource = require("../assets/icons/brew-log.png");
              break;
            case "Scan":
              iconSource = require("../assets/icons/scan.png");
              break;
            case "Extracion":
              iconSource = require("../assets/icons/extracion-icon.png");
              break;
            case "Shop":
              iconSource = require("../assets/icons/shop.png");
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
      <Tab.Screen name="Shop" component={ShopScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return user ? (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="Merchant" component={MerchantNavigator} />
      <Stack.Screen name="Recycle" component={RecycleScreen} />
      <Stack.Screen name="Calendar" component={CalendarScreen} />
      <Stack.Screen name="CreatePost" component={CreatePostScreen} />
      <Stack.Screen name="EditPost" component={EditPostScreen} />
      <Stack.Screen name="Connect" component={ConnectScreen} />
      <Stack.Screen name="Camera" component={CameraScreen} />
      <Stack.Screen name="Device" component={DeviceScreen} />
      <Stack.Screen name="Devices" component={DevicesScreen} />
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
      <Stack.Screen name="ShopScreen" component={ShopScreen} />
    </Stack.Navigator>
  ) : (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Landing" component={LandingScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="ConfirmEmail" component={ConfirmEmail} />
      <Stack.Screen name="ResetLink" component={ResetLink} />
    </Stack.Navigator>
  );
}
