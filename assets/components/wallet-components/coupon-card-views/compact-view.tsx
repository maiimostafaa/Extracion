// README
// Compact coupon card layout for displaying brief coupon details.
// Features:
// - Shows organization logo, discount, organization name, and expiry date.
// - Displays "EXPIRED" label if the coupon is inactive.
// - Formats percentage, fixed amount, or item-based discounts.
// - Formats expiry date in "Day Month Year" format (Australian English).
// Notes:
// - Designed to be used within CouponCard's "compact" mode.
// - Styling is optimized for horizontal list or grid placement.

// -------------------- Imports --------------------
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { coupon } from "../../../types/coupon";

// -------------------- Props --------------------
interface CompactViewProps {
  coupon: coupon; // Coupon data (discount, organization, expiry, status)
}

// -------------------- Component --------------------
const CompactView: React.FC<CompactViewProps> = ({ coupon }) => {
  // Format the discount string based on type (percentage, fixed, item)
  const formatDiscount = () => {
    if (coupon.discountType === "percentage") {
      return `${coupon.discountValue}% OFF`;
    }
    if (coupon.discountType === "fixed") {
      return `$${coupon.discountValue} OFF`;
    }
    return `${coupon.item} `;
  };

  // Format expiry date to readable format (e.g., "31 December 2025")
  const formatExpiryDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-AU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <View style={[styles.container, !coupon.isActive && styles.inactive]}>
      {/* ---------- Logo Section ---------- */}
      <View style={styles.logoContainer}>
        <Image source={{ uri: coupon.organizationLogo }} style={styles.logo} />
      </View>

      {/* ---------- Text Details Section ---------- */}
      <View style={styles.textsContainer}>
        <Text style={styles.title}>{formatDiscount()}</Text>
        <Text style={styles.organization}>{coupon.organization}</Text>
        <Text style={styles.expiry}>
          Valid until {formatExpiryDate(coupon.expirationDate)}
        </Text>
        {!coupon.isActive && <Text style={styles.expiredText}>EXPIRED</Text>}
      </View>
    </View>
  );
};

// -------------------- Styles --------------------
const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    flexDirection: "row",
    height: "100%",
    width: "100%",
  },
  inactive: {
    opacity: 0.5,
    backgroundColor: "#f5f5f5",
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 8,
    borderRadius: 30,
    resizeMode: "cover",
    marginLeft: "-4%",
  },
  textsContainer: {
    flexDirection: "column",
    marginLeft: "5%",
  },
  logoContainer: {
    width: "30%",
    height: "100%",
    justifyContent: "center",
    borderRightWidth: 2,
    borderRightColor: "#ccc",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: "4%",
  },
  expiry: {
    marginTop: "15%",
    fontSize: 10,
    color: "#666",
    textAlign: "center",
    fontFamily: "cardRegular",
  },
  expiredText: {
    fontSize: 10,
    color: "#ff4444",
    fontWeight: "bold",
    marginLeft: "3%",
  },
  organization: {
    fontSize: 12,
    fontWeight: "400",
    color: "#333",
    marginBottom: 5,
  },
});

// -------------------- Export --------------------
export default CompactView;
