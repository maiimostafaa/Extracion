import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { enableScreens } from "react-native-screens";
import AppNavigator from "./navigation/AppNavigator";
import { useFonts } from "expo-font";
import { Text } from "react-native";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { BLEProvider } from "./context/BLEContext";
import { AuthProvider } from "./context/AuthContext";

// import { Buffer } from "buffer";
// global.Buffer = Buffer;

/* Import Apollo for shopify */
import { ApolloProvider } from "@apollo/client";
import shopifyClient from "./services/shopifyClient";

enableScreens();

export default function App() {
  const [fontsLoaded] = useFonts({
    numbers: require("./assets/fonts/technology.ttf"),
    cardLight: require("./assets/fonts/card-light.ttf"),
    cardRegular: require("./assets/fonts/card-regular.ttf"),
    cardMedium: require("./assets/fonts/card-medium.ttf"),
    cardBold: require("./assets/fonts/card-bold.ttf"),
  });

  useEffect(() => {
    const prepare = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        await new Promise((resolve) => setTimeout(resolve, 3000));
      } catch (e) {
        console.warn(e);
      } finally {
        await SplashScreen.hideAsync();
      }
    };

    prepare();
  }, []);

  if (!fontsLoaded) return null;

  return (
    <AuthProvider>
      <ApolloProvider client={shopifyClient}>
        <BLEProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </BLEProvider>
      </ApolloProvider>
    </AuthProvider>
  );
}
