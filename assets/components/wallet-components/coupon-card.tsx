// README
// Wrapper component for rendering a coupon in different view modes.
// Features:
// - Supports three layouts: compact, horizontal, and full view.
// - Navigates to FullCoupon screen when tapped in compact or horizontal mode.
// - Accepts an initial view mode via props (defaults to compact).
// Notes:
// - Uses specific subcomponents for each layout: CompactView, HorizontalView, FullView.
// - The coupon data type is defined in `../../types/coupon`.
// - Navigation is handled using React Navigation stack navigator.

// -------------------- Imports --------------------
import { TouchableOpacity } from "react-native";
import CompactView from "./coupon-card-views/compact-view";
import HorizontalView from "./coupon-card-views/horizontal-view";
import FullView from "./coupon-card-views/full-view";
import React, { useState } from "react";
import { coupon } from "../../types/coupon";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../navigation/AppNavigator";

// -------------------- Props --------------------
interface CouponCardProps {
  coupon: coupon; // Coupon data to display
  initialViewMode?: "compact" | "horizontal" | "full"; // Default layout mode
}

// Navigation type for this stack
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// -------------------- Component --------------------
export default function CouponCard({
  coupon,
  initialViewMode = "compact",
}: CouponCardProps) {
  const navigation = useNavigation<NavigationProp>();

  // Track current view mode (compact, horizontal, or full)
  const [viewMode] = useState<"compact" | "horizontal" | "full">(
    initialViewMode
  );

  // Handle card tap
  const handlePress = () => {
    // Only navigate to full view if not already in full mode
    if (viewMode === "compact" || viewMode === "horizontal") {
      navigation.navigate("FullCoupon", { coupon });
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      delayPressIn={100} // Slight delay to help distinguish from scroll gestures
      delayPressOut={100}
      style={{ flex: 1 }} // Allow component to expand fully
    >
      {/* Render appropriate coupon layout based on viewMode */}
      {viewMode === "compact" && <CompactView coupon={coupon} />}
      {viewMode === "horizontal" && <HorizontalView coupon={coupon} />}
      {viewMode === "full" && coupon && <FullView coupon={coupon} />}
    </TouchableOpacity>
  );
}
