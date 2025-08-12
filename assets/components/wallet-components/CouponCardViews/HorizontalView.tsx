import React from "react";
import { View, Text, Image, StyleSheet, ImageBackground } from "react-native";
import { coupon } from "../../../types/coupon";

interface HorizontalViewProps {
  coupon: coupon;
}

const HorizontalView: React.FC<HorizontalViewProps> = ({ coupon }) => {
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
    <View
      style={[
        styles.container,
        { opacity: coupon.isActive ? 1 : 0.5 }, // Dynamically set opacity
      ]}
    >
      <ImageBackground
        source={require("../../../backgrounds/component-backgrounds/coupon.png")}
        style={styles.background}
      >
        <View style={styles.contentContainer}>
          <View style={styles.logoContainer}>
            <Image
              source={{ uri: coupon.organizationLogo }}
              style={styles.logo}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "55%",
            }}
          >
            <View style={styles.textsContainer}>
              <Text style={styles.title}>{formatDiscount()}</Text>
              <Text style={styles.organization}>{coupon.organization}</Text>
              <Text style={styles.expiry} numberOfLines={1}>
                Valid until {formatExpiryDate(coupon.expirationDate)}{" "}
              </Text>
              {!coupon.isActive && (
                <Text style={styles.expiredText}>EXPIRED</Text>
              )}
            </View>
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: coupon.promoImage }}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
          </View>
        </View>
        S
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    padding: 12,
    gap: 12,
    marginVertical: 4,
    height: 145,
  },
  background: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  backgroundInactive: {
    opacity: 0.5,
  },
  textsContainer: {
    flexDirection: "column",
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 35,
  },
  logoContainer: {
    width: "25%",
    height: "100%",
    justifyContent: "center",
    marginLeft: "10%",
    marginBottom: "1%",
  },
  title: {
    fontSize: 20,
    fontWeight: "normal",
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
    textAlign: "left",

    fontSize: 10,
    color: "#ff4444",
    fontWeight: "bold",
    fontFamily: "default",
  },
  organization: {
    fontSize: 12,
    fontWeight: "400",
    color: "#333",
    marginBottom: 5,
  },
  imageWrapper: {
    width: 70,
    height: 70,
    borderRadius: 10,

    overflow: "hidden",

    justifyContent: "flex-end",
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
    resizeMode: "cover",
  },
});

export default HorizontalView;
