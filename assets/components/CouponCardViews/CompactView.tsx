import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native";
import { coupon } from "../../types/coupon";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../navigation/AppNavigator";

interface CompactViewProps {
  coupon: coupon;
}

const CompactView: React.FC<CompactViewProps> = ({ coupon }) => {
  const formatDiscount = () => {
    if (coupon.discountType === "percentage") {
      return `${coupon.discountValue}% OFF`;
    }
    if (coupon.discountType === "fixed") {
      return `$${coupon.discountValue} OFF`;
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
    <View style={[styles.container, !coupon.isActive && styles.inactive]}>
      <View style={styles.logoContainer}>
        <Image source={{ uri: coupon.organizationLogo }} style={styles.logo} />
      </View>
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
    borderWidth: 0,
    borderRadius: 1,
    borderRightWidth: 2,
    borderRightColor: "#ccc",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    justifyContent: "flex-start",
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

export default CompactView;
