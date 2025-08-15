// README
// Full Coupon screen for displaying detailed information about a single coupon.
// Features:
// - Header with back navigation button.
// - Displays coupon details using the reusable FullView component.
// Notes:
// - Coupon data is passed via route parameters from navigation.
// - Uses consistent header styling with the AllCoupons screen for visual continuity.

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
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../navigation/AppNavigator";
import FullView from "../../../assets/components/wallet-components/coupon-card-views/full-view";
import { Ionicons } from "@expo/vector-icons";

// -------------------- Navigation Types --------------------
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type FullCouponRouteProp = RouteProp<RootStackParamList, "FullCoupon">;

// -------------------- Component --------------------
export default function FullCouponScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<FullCouponRouteProp>();

  // Retrieve coupon object from route params
  const { coupon } = route.params;

  // Navigate back to previous screen
  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* ---------- Header with back button and title ---------- */}
      <View style={styles.header}>
        {/* Back button */}
        <Ionicons
          name="chevron-back"
          size={35}
          color="#fff"
          style={{ alignSelf: "flex-end", marginBottom: 10 }}
          onPress={handleBack}
        />
        {/* Screen title */}
        <Text style={styles.title}>details</Text>
      </View>

      {/* ---------- Coupon details ---------- */}
      <ScrollView>
        {/* Full coupon display using reusable component */}
        <FullView coupon={coupon} />
      </ScrollView>
    </View>
  );
}

// -------------------- Styles --------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EAEAEA", // Light background color for content area
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
    height: "100%",
  },
});
