import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { coupon } from "../../types/coupon";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../../navigation/AppNavigator";

type FullCouponRouteProp = RouteProp<RootStackParamList, "fullCoupon">;
interface FullViewProps {
  coupon: coupon;
}

const FullView: React.FC<FullViewProps> = ({ coupon: propCoupon }) => {
  const route = useRoute<FullCouponRouteProp>();
  const coupon = propCoupon || route.params.coupon;

  const formatDiscount = () => {
    if (coupon.discountType === "percentage") {
      return `${coupon.discountValue}% Off`;
    }
    if (coupon.discountType === "fixed") {
      return `$${coupon.discountValue} Off`;
    } else {
      return `${coupon.item} `;
    }
  };

  const formatExpiryDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-AU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={[styles.container, !coupon.isActive && styles.inactive]}>
        <Image source={{ uri: coupon.organizationLogo }} style={styles.logo} />
        <Text style={styles.organization}>{coupon.organization}</Text>
        <Text style={styles.title}>{formatDiscount()}</Text>
        <Text style={styles.description}>{coupon.description}</Text>

        {coupon.termsAndConditions && (
          <View style={styles.bulletList}>
            <Text style={styles.termsTitle}>Terms & Conditions:</Text>
            {coupon.termsAndConditions.map((term, index) => (
              <Text key={index} style={styles.bullet}>
                • {term}
              </Text>
            ))}
          </View>
        )}

        {coupon.isActive && (
          <View style={styles.qrContainer}>
            <QRCode value={coupon.QRcode} size={120} />
          </View>
        )}

        <Text style={styles.expiry}>
          Valid until {formatExpiryDate(coupon.expirationDate)}
        </Text>

        {!coupon.isActive && <Text style={styles.expiredText}>EXPIRED</Text>}

        {coupon.usageCount !== undefined && (
          <Text style={styles.usageCount}>Used {coupon.usageCount} times</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  container: {
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  inactive: {
    opacity: 0.5,
    backgroundColor: "#f5f5f5",
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 10,
    borderRadius: 30,
  },
  organization: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 8,
    color: "#555",
    paddingHorizontal: 20,
  },
  bulletList: {
    alignSelf: "flex-start",
    marginTop: 16,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  termsTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  bullet: {
    fontSize: 13,
    marginBottom: 4,
    color: "#666",
  },
  qrContainer: {
    marginVertical: 20,
    padding: 20,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
  },
  expiry: {
    fontSize: 14,
    color: "#666",
    marginTop: 16,
  },
  expiredText: {
    fontSize: 16,
    color: "#ff4444",
    fontWeight: "bold",
    marginTop: 8,
  },
  usageCount: {
    fontSize: 12,
    color: "#999",
    marginTop: 8,
  },
});

export default FullView;
