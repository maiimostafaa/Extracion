// README
// Main Wallet screen for displaying user's membership card and available coupons.
// Features:
// - Header with navigation controls.
// - FlipCard component displaying membership details (QR code, balance, membership tier).
// - Horizontal scroll list of available coupons in compact format.
// Notes:
// - Uses mock data for coupons (replace with API data when backend is connected).
// - Coupon cards navigate to their respective detail screens if hooked up in navigation.
// - All visual styles are defined locally in this file.

// -------------------- Imports --------------------
import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../navigation/AppNavigator";

// Custom components
import Header from "../../../navigation/Header";
import FlipCard from "../../../assets/components/wallet-components/points-card";
import CouponCard from "../../../assets/components/wallet-components/coupon-card";

// Mock data
import { mockCoupons } from "../../../assets/mock_data/mock-coupons";
import { coupon } from "../../../assets/types/coupon";

// -------------------- Navigation Types --------------------
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// -------------------- Layout Constants --------------------
const { width } = Dimensions.get("window");

// -------------------- Component --------------------
export default function WalletScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      {/* ---------- Header section ---------- */}
      <View style={styles.header}>
        <Header tintColor="#000" />
      </View>

      {/* ---------- Main Content ---------- */}
      <View style={styles.content}>
        {/* Wallet title */}
        <View style={styles.section}>
          <Text style={styles.headerTitle}>my wallet</Text>
        </View>

        {/* FlipCard membership card */}
        <View style={styles.cardContainer}>
          <FlipCard
            balance={150}
            name="Mai Mostafa"
            qrData="11011011000"
            expDate="28/09/2029"
            membership="Silver"
          />
        </View>

        {/* ---------- Coupons section ---------- */}
        <View style={styles.couponSection}>
          {/* Section title - navigates to AllCoupons screen */}
          <Text
            style={styles.headerTitle}
            onPress={() => navigation.navigate("AllCoupons")}
          >
            coupons
          </Text>

          {/* Horizontal coupon list */}
          <View style={styles.couponListContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={16}
              decelerationRate="fast"
              bounces={true}
              contentContainerStyle={styles.couponScrollContent}
              style={{ flex: 1 }}
            >
              {mockCoupons.map((coupon, index) => (
                <View
                  key={coupon.id}
                  style={[
                    styles.couponCardWrapper,
                    index < mockCoupons.length - 1 && styles.couponSpacing,
                  ]}
                >
                  {/* Compact coupon card */}
                  <CouponCard coupon={coupon} initialViewMode="compact" />
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

// -------------------- Styles --------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    backgroundColor: "f5f5f5", // Light background
  },
  cardContainer: {
    width: "100%",
    height: 360,
    marginTop: -40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    marginBottom: -30,
  },
  headerTitle: {
    fontSize: 24,
    color: "#078CC9",
    fontFamily: "cardRegular",
  },
  content: {
    flex: 1,
    width: "100%",
  },
  section: {
    padding: 16,
    width: "100%",
  },
  couponSection: {
    padding: 16,
    width: "100%",
    marginTop: 10,
  },
  couponListContainer: {
    height: 130,
    marginTop: 10,
  },
  couponScrollContent: {
    paddingVertical: 5,
    paddingHorizontal: 0,
    alignItems: "flex-start",
  },
  couponCardWrapper: {
    marginTop: 10,
    width: 220,
    height: 110,
  },
  couponSpacing: {
    marginRight: 18,
  },
});
