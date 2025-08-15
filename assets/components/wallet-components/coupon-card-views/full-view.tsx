// README
// Full coupon detail view component.
// Features:
// - Displays complete coupon details including logo, discount, promo image, description, terms, and QR code.
// - Allows QR code to be enlarged in a modal popup when tapped.
// - Supports both receiving coupon data via props and via React Navigation route params.
// - Handles active/inactive coupons with opacity and disables QR interaction if expired.
// Notes:
// - Designed for the "FullCoupon" screen in navigation.
// - QR code is generated using `react-native-qrcode-svg`.
// - Background styling uses a coupon detail image from local assets.

// -------------------- Imports --------------------
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Modal,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { coupon } from "../../../types/coupon";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../../../navigation/AppNavigator";

// -------------------- Navigation Types --------------------
type FullCouponRouteProp = RouteProp<RootStackParamList, "FullCoupon">;

// -------------------- Props --------------------
interface FullViewProps {
  coupon: coupon; // Coupon data (can also be received from route params)
}

// -------------------- Component --------------------
const FullView: React.FC<FullViewProps> = ({ coupon: propCoupon }) => {
  const route = useRoute<FullCouponRouteProp>();

  // Prefer prop coupon; fallback to route params
  const coupon = propCoupon || route.params.coupon;

  // State to control QR code modal visibility
  const [isQRCodeVisible, setQRCodeVisible] = useState(false);

  // Show QR code modal
  const showQRCode = () => setQRCodeVisible(true);

  // Hide QR code modal
  const hideQRCode = () => setQRCodeVisible(false);

  // Format discount string based on type
  const formatDiscount = () => {
    if (coupon.discountType === "percentage") {
      return `${coupon.discountValue}% Off`;
    }
    if (coupon.discountType === "fixed") {
      return `$${coupon.discountValue} Off`;
    }
    return `${coupon.item} `;
  };

  // Format expiry date into readable format
  const formatExpiryDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-AU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <View style={[styles.container, { opacity: coupon.isActive ? 1 : 0.5 }]}>
      {/* ---------- QR Code Modal ---------- */}
      <Modal
        visible={isQRCodeVisible}
        transparent
        animationType="fade"
        onRequestClose={hideQRCode}
      >
        <View style={styles.modalBackground}>
          <View style={styles.qrPopupContainer}>
            <Text style={styles.qrPopupTitle}>Scan this QR Code</Text>
            <QRCode value={coupon.QRcode} size={200} />
            <TouchableOpacity style={styles.closeButton} onPress={hideQRCode}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ---------- Coupon Background ---------- */}
      <ImageBackground
        source={require("../../../graphics/backgrounds/component-backgrounds/coupon-details.png")}
        style={styles.background}
      >
        <View style={styles.contentContainer}>
          {/* ---------- Top Section: Logo + Discount ---------- */}
          <View style={styles.topContainer}>
            <View style={styles.logoContainer}>
              <Image
                source={{ uri: coupon.organizationLogo }}
                style={styles.logo}
              />
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{formatDiscount()}</Text>
            </View>
          </View>

          {/* ---------- Promo Image ---------- */}
          <View
            style={{
              width: "100%",
              height: 250,
              borderRadius: 10,
              overflow: "hidden",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Image
              source={{ uri: coupon.promoImage }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>

          {/* ---------- Description + Terms ---------- */}
          <View style={styles.middleContainer}>
            <Text style={styles.description}>{coupon.description}</Text>
            <View style={styles.termsContainer}>
              {coupon.termsAndConditions && (
                <View style={styles.bulletList}>
                  {coupon.termsAndConditions.map((term, index) => (
                    <Text key={index} style={styles.bullet}>
                      • {term}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* ---------- Bottom Section: QR + Expiry Info ---------- */}
          <View style={styles.halfContainer}>
            {/* QR code display */}
            <View style={styles.qrContainer}>
              <QRCode value={coupon.QRcode} size={180} />
            </View>

            <View style={styles.bottomContainer}>
              {/* QR Code expand button */}
              <TouchableOpacity
                onPress={coupon.isActive ? showQRCode : undefined}
                disabled={!coupon.isActive}
              >
                <Feather name="arrow-up-right" size={32} color="#078CC9" />
              </TouchableOpacity>

              {/* Expiry date + Expired label */}
              <View style={styles.expiredInfoContainer}>
                <Text style={styles.expiry}>
                  Valid until {formatExpiryDate(coupon.expirationDate)}
                </Text>
                {!coupon.isActive && (
                  <Text style={styles.expiredText}>EXPIRED</Text>
                )}
              </View>

              {/* Info icon (non-functional placeholder) */}
              <Ionicons
                name="information-circle-outline"
                size={32}
                color="#078CC9"
              />
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

// -------------------- Styles --------------------
const styles = StyleSheet.create({
  background: {
    width: "100%",
    height: 850,
    resizeMode: "cover",
  },
  container: {
    flexDirection: "column",
    alignItems: "center",
    padding: 20,
    marginVertical: 4,
  },
  contentContainer: {
    flexDirection: "column",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  topContainer: {
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 20,
    marginTop: "2%",
    marginBottom: "5%",
  },
  middleContainer: {
    flexDirection: "column",
    width: "90%",
    marginTop: "5%",
    marginBottom: "5%",
  },
  termsContainer: {
    flexDirection: "column",
    width: "80%",
    marginTop: "5%",
    marginLeft: "10%",
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
  halfContainer: {
    position: "absolute",
    top: "59%",
    left: 40,
    width: "100%",
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  logoContainer: {
    position: "absolute",
    top: 50,
    left: 50,
    width: "100%",
    height: "20%",
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "regular",
    color: "#333333",
    marginBottom: 8,
  },
  titleContainer: {
    position: "absolute",
    top: 20,
    left: 120,
    padding: 15,
    alignContent: "center",
    width: "100%",
  },
  description: {
    fontSize: 20,
    textAlign: "left",
    color: "#333333",
    fontWeight: "400",
    paddingHorizontal: 20,
  },
  bulletList: {
    alignSelf: "flex-start",
    paddingHorizontal: 20,
  },
  bullet: {
    fontSize: 18,
    paddingVertical: 10,
    color: "#000",
    fontWeight: "200",
  },
  qrContainer: {
    marginTop: 60,
    padding: 20,
    borderRadius: 12,
    marginLeft: "13%",
  },
  expiry: {
    fontSize: 12,
    color: "#666",
    marginTop: 12,
    fontWeight: "100",
  },
  expiredText: {
    fontSize: 16,
    color: "#ff4444",
    fontWeight: "bold",
    marginTop: 2,
    marginLeft: "25%",
  },
  expiredInfoContainer: {
    flexDirection: "column",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  qrPopupContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    width: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  qrPopupTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#078CC9",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  image: {
    width: 170,
    height: 170,
    borderRadius: 10,
    resizeMode: "cover",
  },
});

// -------------------- Export --------------------
export default FullView;
