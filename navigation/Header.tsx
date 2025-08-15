// README
// Custom header component displayed at the top of various screens.
// Features:
// - Displays app logo (tinted dynamically if tintColor prop is provided).
// - Notification bell icon (currently placeholder, can be wired to notifications).
// - Dots menu icon that navigates to the DotsMenu screen.
// Notes:
// - tintColor is optional and defaults to white.
// - Logo image is local and styled to scale proportionally.
// - All icons use vector icons from Expo libraries.

// -------------------- Imports --------------------
import React from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";

// -------------------- Navigation Types --------------------
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// -------------------- Props --------------------
interface CustomHeaderProps {
  tintColor?: string; // Optional tint color for icons and logo
}

// -------------------- Component --------------------
export default function Header({ tintColor = "#fff" }: CustomHeaderProps) {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();

  // Navigate to DotsMenu screen when dots icon is pressed
  const handleDots = () => {
    navigation.navigate("DotsMenu");
  };

  return (
    <View style={styles.header}>
      {/* ---------- Top Row: Logo + Action Icons ---------- */}
      <View style={styles.topRow}>
        {/* App logo (tinted if tintColor provided) */}
        <Image
          source={require("../assets/graphics/logos/get-the-pong.png")}
          style={[styles.logo, { tintColor }]}
        />
        {/* Action icons row */}
        <View style={styles.iconRow}>
          {/* Notification bell (currently non-functional) */}
          <TouchableOpacity style={styles.iconWrapper}>
            <FontAwesome6 name="bell" size={21} color={tintColor} />
          </TouchableOpacity>
          {/* Dots menu button */}
          <TouchableOpacity style={styles.iconWrapper} onPress={handleDots}>
            <Entypo name="dots-three-horizontal" size={21} color={tintColor} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// -------------------- Styles --------------------
const styles = StyleSheet.create({
  header: {
    paddingTop: 0,
    paddingBottom: 30,
    width: "100%",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    width: 80,
    height: 18,
    resizeMode: "contain",
    // tintColor is dynamically applied via inline style
  },
  iconRow: {
    flexDirection: "row",
  },
  iconWrapper: {
    marginLeft: 10,
  },
});
