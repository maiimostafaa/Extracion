import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../navigation/AppNavigator";
import Header from "../../../navigation/Header";
import FlipCard from "../../../assets/components/wallet-components/points-card"; // adjust path if needed
import CouponCard from "../../../assets/components/wallet-components/coupon-card"; // adjust path as needed
import { mockCoupons } from "../../../assets/mock_data/mock-coupons";
import { coupon } from "../../../assets/types/coupon";
import AllCouponsScreen from "./AllCoupons";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get("window");

export default function WalletScreen() {
  const navigation = useNavigation<NavigationProp>();

  const renderCouponItem = ({
    item,
    index,
  }: {
    item: coupon;
    index: number;
  }) => (
    <View style={styles.couponCardWrapper}>
      <CouponCard coupon={item} initialViewMode="compact" />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Header tintColor="#000" />
      </View>

      {/* Main Content - No ScrollView */}
      <View style={styles.content}>
        {/* Card */}
        <View style={styles.section}>
          <Text style={styles.headerTitle}>my wallet</Text>
        </View>
        <View style={styles.cardContainer}>
          <FlipCard
            balance={150}
            name="Mai Mostafa"
            qrData="11011011000"
            expDate="28/09/2029"
            membership="Silver"
          />
        </View>

        {/* coupons */}
        <View style={styles.couponSection}>
          <Text
            style={styles.headerTitle}
            onPress={() => navigation.navigate("AllCoupons")}
          >
            coupons
          </Text>

          <View style={styles.couponListContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={16}
              decelerationRate="fast"
              bounces={true}
              scrollEnabled={true}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    backgroundColor: "f5f5f5",
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
    marginTop: 10, // Reduced from 30 to move coupons up
  },
  couponListContainer: {
    height: 130,
    marginTop: 10,
  },
  couponScrollView: {
    marginTop: 10,
    maxHeight: 130, // Constrain height to prevent conflicts
  },
  couponScrollContent: {
    paddingVertical: 5,
    paddingHorizontal: 0,
    alignItems: "flex-start", // Align items to start instead of center
  },
  couponCardWrapper: {
    marginTop: 10,
    width: 220, // Fixed width for horizontal scrolling
    height: 110, // Fixed height for compact view
  },
  couponSpacing: {
    marginRight: 18, // Spacing between cards
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
});
