// README
// All Coupons screen for displaying all available coupons in a scrollable list.
// Features:
// - Header with back navigation button.
// - Displays list of coupons using mock data.
// - Each coupon is rendered via the reusable CouponCard component in horizontal layout.
// Notes:
// - Currently uses mockCoupons from local mock data (replace with API data when available).
// - Styling is designed for a dark header with light background content area.

// -------------------- Imports --------------------
import React from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../navigation/AppNavigator";
import { mockCoupons } from "../../../assets/mock_data/mock-coupons";
import CouponCard from "../../../assets/components/wallet-components/coupon-card";
import { coupon } from "../../../assets/types/coupon";
import { Ionicons } from "@expo/vector-icons";

// -------------------- Navigation Types --------------------
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// -------------------- Component --------------------
export default function AllCouponsScreen() {
  const navigation = useNavigation<NavigationProp>();

  // Navigate back to previous screen
  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* ---------- Header section with back button and title ---------- */}
      <View style={styles.header}>
        {/* Back icon */}
        <Ionicons
          name="chevron-back"
          size={35}
          color="#fff"
          style={{ alignSelf: "flex-end", marginBottom: 10 }}
          onPress={handleBack}
        />
        {/* Page title */}
        <Text style={styles.title}>coupons</Text>
      </View>

      {/* ---------- Coupons list ---------- */}
      <ScrollView
        style={styles.couponsContainer}
        showsVerticalScrollIndicator={false}
      >
        {mockCoupons.map((coupon: coupon, index: number) => (
          <TouchableOpacity
            key={index}
            style={{
              width: "100%",
            }}
          >
            {/* Coupon card in horizontal layout */}
            <CouponCard coupon={coupon} initialViewMode="horizontal" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

// -------------------- Styles --------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EAEAEA", // Light gray background
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: "11%",
    width: "120%",
    height: "18%",
    marginTop: "-10%",
    backgroundColor: "#333333", // Dark header background
  },
  title: {
    fontSize: 24,
    fontFamily: "cardRegular",
    color: "#ffffff",
    marginTop: "9%",
  },
  couponsContainer: {
    flexDirection: "column",
    width: "100%",
    height: "70%",
  },
});
