import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Image, View } from "react-native";

import LandingScreen from "../screens/login&signup/Landing";
import LoginScreen from "../screens/login&signup/LoginScreen";
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
import { coupon } from "../assets/types/coupon";
import { ShopItem } from "../assets/types/shop-item";
import ShopScreen from "../screens/ShopScreen";
import SearchScreen from "../screens/SearchScreen";
import { brewLogEntry } from "../assets/types/BrewLog/brewLogEntry";
import BrewLogScreen from "../screens/brew-log/BrewLog";
import BrewLogEditScreen from "../screens/brew-log/BrewLogEditScreen";
import BrewLogDetailScreen from "../screens/brew-log/BrewLogDetailScreen";
import ExtracionConfigScreen from "../screens/ExtracionConfigScreen";
import ExtracionCoffeeBeanListScreen from "../screens/ExtracionCoffeeBeanListScreen";
import ExtracionCoffeeBeanInputScreen from "../screens/ExtracionCoffeeBeanInputScreen";
import ShopItemDetailScreen from "../screens/ShopItemDetailScreen";
import CafeFinderScreen from "../screens/CafeFinderScreen";
import { newsletterItem } from "../assets/types/newsletter-item";
import NewsletterDetailScreen from "../screens/NewsletterDetailScreen";
import ExtracionPour from "../screens/ExtracionPour";

export type RootStackParamList = {
  Landing: undefined;
  Login: undefined;
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
  ExtracionPour: undefined;
  BrewLogDetailScreen: { brewLogEntry: brewLogEntry };
  BrewLogEditScreen: { brewLogEntry: brewLogEntry };
  fullCoupon: { coupon: coupon };
  BeanDetail: { beanId: string };
  CafeDetail: { cafeId: string };
  ClassDetail: { classId: string };
  ToolDetail: { toolId: string };
  ItemDetail: { itemId: string };
  ExtracionConfigScreen: undefined;
  ExtracionCoffeeBeanListScreen: undefined;
  ExtracionCoffeeBeanInputScreen: undefined;
  ShopItemDetail: { item: ShopItem };
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
  const navigation = useNavigation();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconSource;

          if (route.name === "home") {
            iconSource = focused
              ? require("../assets/icons/home.png")
              : require("../assets/icons/home.png");
          } else if (route.name === "brew log") {
            iconSource = focused
              ? require("../assets/icons/brew-log.png")
              : require("../assets/icons/brew-log.png");
          } else if (route.name === "scan") {
            iconSource = focused
              ? require("../assets/icons/scan.png")
              : require("../assets/icons/scan.png");
          } else if (route.name === "extracion") {
            iconSource = focused
              ? require("../assets/icons/extracion-icon.png")
              : require("../assets/icons/extracion-icon.png");
          } else if (route.name === "shop") {
            iconSource = focused
              ? require("../assets/icons/shop.png")
              : require("../assets/icons/shop.png");
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
        tabBarStyle: {
          height: 90,
          backgroundColor: "#333333",
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 5,
          marginBottom: 4,
          fontFamily: "cardRegular",
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="home" component={HomeStackScreen} />
      <Tab.Screen name="brew log" component={BrewLogScreen} />
      <Tab.Screen name="scan" component={CameraScreen} />
      <Tab.Screen name="extracion" component={ExtracionScreen} />
      <Tab.Screen name="shop" component={ShopScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Landing"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Landing" component={LandingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="ConfirmEmail" component={ConfirmEmail} />
      <Stack.Screen name="ResetLink" component={ResetLink} />
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
      <Stack.Screen name="Wallet" component={MainWallet} />
      <Stack.Screen name="allCoupons" component={AllCouponsScreen} />
      <Stack.Screen name="fullCoupon" component={FullCouponScreen} />
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
      <Stack.Screen name="BrewLogScreen" component={BrewLogScreen} />
      <Stack.Screen
        name="BrewLogDetailScreen"
        component={BrewLogDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BrewLogEditScreen"
        component={BrewLogEditScreen}
        options={{
          presentation: "modal",
          gestureEnabled: false,
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ExtracionConfigScreen"
        component={ExtracionConfigScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ExtracionCoffeeBeanListScreen"
        component={ExtracionCoffeeBeanListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ExtracionCoffeeBeanInputScreen"
        component={ExtracionCoffeeBeanInputScreen}
        options={{
          presentation: "fullScreenModal",
          gestureEnabled: true,
          headerShown: false,
        }}
      />
      <Stack.Screen name="ExtracionPour" component={ExtracionPour} />
      <Stack.Screen name="ShopScreen" component={ShopScreen} />
      <Stack.Screen name="ShopItemDetail" component={ShopItemDetailScreen} />
      <Stack.Screen
        name="CafeFinderScreen"
        component={CafeFinderScreen}
        options={{
          headerShown: false,
          animation: "fade",
          animationDuration: 300,
        }}
      />
      <Stack.Screen
        name="NewsletterDetail"
        component={NewsletterDetailScreen}
      />
    </Stack.Navigator>
  );
}
