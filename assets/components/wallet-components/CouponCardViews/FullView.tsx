import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Modal,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { coupon } from "../../../types/coupon";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../../../navigation/AppNavigator";

type FullCouponRouteProp = RouteProp<RootStackParamList, "FullCoupon">;
interface FullViewProps {
  coupon: coupon;
}

const FullView: React.FC<FullViewProps> = ({ coupon: propCoupon }) => {
  const route = useRoute<FullCouponRouteProp>();
  const coupon = propCoupon || route.params.coupon;
  const [isQRCodeVisible, setQRCodeVisible] = useState(false); // State for modal visibility

  const showQRCode = () => {
    setQRCodeVisible(true); // Show the QR code popup
  };

  const hideQRCode = () => {
    setQRCodeVisible(false); // Hide the QR code popup
  };

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
    <View style={[styles.container, { opacity: coupon.isActive ? 1 : 0.5 }]}>
      <Modal
        visible={isQRCodeVisible}
        transparent={true}
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
      <ImageBackground
        source={require("../../../backgrounds/component-backgrounds/coupon-details.png")}
        style={styles.background}
      >
        <View style={styles.contentContainer}>
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
          <View style={styles.halfContainer}>
            <View style={styles.qrContainer}>
              <QRCode value={coupon.QRcode} size={180} />
            </View>

            <View style={styles.bottomContainer}>
              <TouchableOpacity
                onPress={coupon.isActive ? showQRCode : undefined} // Only allow press if the coupon is active
                disabled={!coupon.isActive} // Disable the button if the coupon is expired
              >
                <Feather name="arrow-up-right" size={32} color="#078CC9" />
              </TouchableOpacity>
              <View style={styles.expiredInfoContainer}>
                <Text style={styles.expiry}>
                  Valid until {formatExpiryDate(coupon.expirationDate)}
                </Text>
                {!coupon.isActive && (
                  <Text style={styles.expiredText}>EXPIRED</Text>
                )}
              </View>
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
  inactive: {
    opacity: 0.5,
    backgroundColor: "#f5f5f5",
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
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
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
    elevation: 5, // For Android shadow
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
  showQRText: {
    fontSize: 16,
    color: "#078CC9",
    textAlign: "center",
    marginTop: 20,
  },
  image: {
    width: 170,
    height: 170,
    borderRadius: 10,
    resizeMode: "cover",
  },
});

export default FullView;
