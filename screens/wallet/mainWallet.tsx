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
import type { RootStackParamList } from "../../navigation/AppNavigator";
import Header from "../../navigation/Header";
import FlipCard from "../../assets/components/pointsCard"; // adjust path if needed
import CouponCard from "../../assets/components/CouponCard"; // adjust path as needed
import { mockCoupons } from "../../assets/mock_data/mock-coupons";
import { coupon } from "../../assets/types/coupon";
import AllCouponsScreen from "./allCoupons";

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

      {/* Main Content */}
      <ScrollView
        style={styles.content}
        scrollEnabled={true}
        nestedScrollEnabled={true}
      >
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
            onPress={() => navigation.navigate("allCoupons")}
          >
            coupons
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            nestedScrollEnabled={true}
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
        {/* back Button */}
      </ScrollView>
      <View style={styles.bottomOverlay}>
        <TouchableOpacity style={styles.addButton} onPress={navigation.goBack}>
          <Ionicons name="return-down-back-sharp" size={32} color="#000" />
        </TouchableOpacity>
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

    marginTop: 30,
    zIndex: 1, // Ensure it's above other elements
  },
  couponListContainer: {
    height: 130,
    marginTop: 10,
  },
  couponScrollView: {
    zIndex: 2, // Higher z-index for touch priority
  },
  couponScrollContent: {
    marginTop: 20,
    paddingHorizontal: 0,
    paddingVertical: 5,
    alignItems: "center", // Center items vertically
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
  addButton: {
    position: "absolute",
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#8CDBED",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  bottomOverlay: {
    justifyContent: "flex-end",
  },
});
