// README
// Root entry point of the React Native application.
// Features:
// - Loads custom fonts before rendering the app.
// - Displays a splash screen until fonts and initial setup are complete.
// - Sets up core providers: Authentication, Apollo (Shopify), and BLE (Bluetooth Low Energy).
// - Wraps the app in React Navigation's NavigationContainer for routing.
// Notes:
// - `enableScreens()` improves navigation performance by using native screen primitives.
// - Splash screen duration is hardcoded to 3 seconds for branding/UX purposes.
// - All navigation is handled via `AppNavigator`.

// -------------------- Imports --------------------
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { enableScreens } from "react-native-screens";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

// Context Providers
import { BLEProvider } from "./context/BLEContext";
import { AuthProvider } from "./context/AuthContext";

// Apollo Client (Shopify)
import { ApolloProvider } from "@apollo/client";
import shopifyClient from "./services/shopifyClient";

// App navigation
import AppNavigator from "./navigation/AppNavigator";

enableScreens(); // Improves performance for navigation by using native primitives

// -------------------- Component --------------------
export default function App() {
  // Load custom fonts before rendering UI
  const [fontsLoaded] = useFonts({
    numbers: require("./assets/fonts/technology.ttf"),
    cardLight: require("./assets/fonts/card-light.ttf"),
    cardRegular: require("./assets/fonts/card-regular.ttf"),
    cardMedium: require("./assets/fonts/card-medium.ttf"),
    cardBold: require("./assets/fonts/card-bold.ttf"),
  });

  // Splash screen handling — waits for fonts + 3 second delay before hiding
  useEffect(() => {
    const prepare = async () => {
      try {
        await SplashScreen.preventAutoHideAsync(); // Keep splash visible
        await new Promise((resolve) => setTimeout(resolve, 3000)); // Artificial delay
      } catch (e) {
        console.warn(e);
      } finally {
        await SplashScreen.hideAsync(); // Hide splash after setup
      }
    };

    prepare();
  }, []);

  // Prevent UI rendering until fonts are ready
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
