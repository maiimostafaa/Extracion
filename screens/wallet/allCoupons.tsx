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
import type { RootStackParamList } from "../../navigation/AppNavigator";
import { mockCoupons } from "../../assets/mock_data/mock-coupons";
import CouponCard from "../../assets/components/CouponCard";
import { coupon } from "../../assets/types/coupon";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
export default function AllCouponsScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={{
            padding: 16,
            zIndex: 99,
            marginLeft: "5%",
            marginTop: "9%",
          }}
        >
          <Image source={require("../../assets/icons/back.png")} />
        </TouchableOpacity>
        <Text style={styles.title}>coupons</Text>
      </View>
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
            <CouponCard coupon={coupon} initialViewMode="horizontal" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EAEAEA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: "11%",
    width: "120%",
    height: "18%",
    marginLeft: "-10%",
    marginTop: "-10%",
    backgroundColor: "#333333",
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
