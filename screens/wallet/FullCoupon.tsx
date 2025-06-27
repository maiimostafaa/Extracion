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
import type { RootStackParamList } from "../../navigation/AppNavigator";
import FullView from "../../assets/components/CouponCardViews/FullView";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type FullCouponRouteProp = RouteProp<RootStackParamList, "fullCoupon">;

export default function FullCouponScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<FullCouponRouteProp>();

  // Get the coupon from route parameters
  const { coupon } = route.params;

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
        <Text style={styles.title}>details</Text>
      </View>
      <ScrollView>
        <FullView coupon={coupon} />
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
    fontFamily: "second",
    color: "#ffffff",
    marginTop: "9%",
  },
  couponsContainer: {
    flexDirection: "column",
    width: "100%",
    height: "100%",
  },
});
