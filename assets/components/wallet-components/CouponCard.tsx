import { TouchableOpacity } from "react-native";
import CompactView from "./coupon-card-views/compactView";
import HorizontalView from "./coupon-card-views/horizontalView";
import FullView from "./coupon-card-views/fullView";
import React, { useState } from "react";
import { coupon } from "../../types/coupon";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../navigation/AppNavigator";

interface CouponCardProps {
  coupon: coupon;
  initialViewMode?: "compact" | "horizontal" | "full";
}
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function CouponCard({
  coupon,
  initialViewMode = "compact",
}: CouponCardProps) {
  const navigation = useNavigation<NavigationProp>();

  const [viewMode, setViewMode] = useState<"compact" | "horizontal" | "full">(
    initialViewMode
  );

  const handlePress = () => {
    if (viewMode === "compact" || viewMode === "horizontal") {
      navigation.navigate("FullCoupon", { coupon });
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      delayPressIn={100} // Add slight delay to distinguish from scroll
      delayPressOut={100}
      style={{ flex: 1 }} // Ensure it takes full space
    >
      {viewMode === "compact" && <CompactView coupon={coupon} />}
      {viewMode === "horizontal" && <HorizontalView coupon={coupon} />}
      {viewMode === "full" && coupon && <FullView coupon={coupon} />}
    </TouchableOpacity>
  );
}
