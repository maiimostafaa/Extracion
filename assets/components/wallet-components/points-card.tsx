// README
// Flip card component for displaying user loyalty points and membership information.
// Features:
// - Front side: shows balance, membership level, expiry date, and a QR button icon.
// - Back side: shows a scannable QR code and the QR data with a copy-to-clipboard button.
// - Tap the card to flip between front and back using smooth animations.
// Notes:
// - Uses react-native-reanimated for flip animation.
// - QR code is generated using react-native-qrcode-svg.
// - Styling is fixed to a card background image for brand consistency.

// -------------------- Imports --------------------
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import QRCode from "react-native-qrcode-svg";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";

// -------------------- Dimensions --------------------
const width = require("react-native").Dimensions.get("window").width;

// -------------------- Component --------------------
const FlipCard = ({
  balance = 150.0, // Points balance
  name = "Chua Tai Man", // Cardholder's name
  qrData = "11001010101", // Data encoded in QR code
  expDate = "31/12/2025", // Expiry date for membership
  membership = "Silver", // Membership tier
}) => {
  const rotate = useSharedValue(0); // Shared value for animation state
  const [flipped, setFlipped] = useState(false); // Track if card is flipped

  // Front card animation style
  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(
      rotate.value,
      [0, 180],
      [0, 180],
      Extrapolate.CLAMP
    );
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      opacity: rotateY >= 90 ? 0 : 1,
      backfaceVisibility: "hidden",
    };
  });

  // Back card animation style
  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(
      rotate.value,
      [0, 180],
      [180, 360],
      Extrapolate.CLAMP
    );
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      opacity: rotateY >= 90 ? 1 : 0,
      backfaceVisibility: "hidden",
    };
  });

  // Toggle flip state
  const flipCard = () => {
    setFlipped((prev) => !prev);
    rotate.value = withTiming(flipped ? 0 : 180, { duration: 500 });
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={flipCard}>
        <View style={styles.cardWrapper}>
          {/* ---------- Front Side ---------- */}
          <Animated.View
            style={[styles.card, styles.cardFront, frontAnimatedStyle]}
          >
            <ImageBackground
              source={require("../../graphics/backgrounds/component-backgrounds/card.png")}
              style={styles.background}
              imageStyle={{ borderRadius: 15 }}
            >
              {/* Top row: QR data + membership */}
              <View style={styles.topContainer}>
                <Text style={styles.bitString}>{qrData}</Text>
                <Text style={styles.membership}>{membership} Member</Text>
              </View>

              {/* Points balance */}
              <View style={styles.amountContainer}>
                <Text style={styles.amount}>${balance.toFixed(2)}</Text>
              </View>

              {/* Bottom row: name + expiry + QR icon */}
              <View style={styles.bottomContainer}>
                <View style={styles.bottomTextContainer}>
                  <Text style={styles.name}>{name}</Text>
                  <Text style={styles.name}>Expire date {expDate}</Text>
                </View>

                <TouchableOpacity style={styles.qrButtonFront}>
                  <Ionicons name="qr-code-outline" size={32} color="#000" />
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </Animated.View>

          {/* ---------- Back Side ---------- */}
          <Animated.View
            style={[styles.card, styles.cardBack, backAnimatedStyle]}
          >
            <ImageBackground
              source={require("../../graphics/backgrounds/component-backgrounds/card.png")}
              style={styles.background}
              imageStyle={{ borderRadius: 15 }}
            >
              <View style={styles.qrContainer}>
                {/* QR Code */}
                <View style={styles.qrCodeWrapper}>
                  <QRCode value={qrData} size={150} />
                </View>

                {/* Copy QR data to clipboard */}
                <TouchableOpacity
                  onPress={() => Clipboard.setStringAsync(qrData)}
                  style={styles.qrButton}
                >
                  <Ionicons name="copy-outline" size={22} color="#8CDBED" />
                  <Text style={styles.bitStringCopy}>{qrData}</Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

// -------------------- Styles --------------------
const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 350,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    overflow: "hidden",
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  card: {
    width: "100%",
    height: "40%",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    borderRadius: 15,
    overflow: "hidden",
    backfaceVisibility: "hidden",
  },
  cardFront: {
    position: "absolute",
    top: 15,
    left: 0,
    width: "100%",
    height: "100%",
    borderRadius: 15,
    overflow: "hidden",
  },
  cardBack: {
    top: 15,
    width: "100%",
    height: "100%",
    borderRadius: 15,
    overflow: "hidden",
  },
  amount: {
    fontSize: 70,
    fontWeight: "bold",
    color: "#fff",
  },
  name: {
    fontSize: 18,
    color: "#fff",
    fontFamily: "cardRegular",
  },
  bitString: {
    fontSize: 18,
    marginTop: 10,
    color: "#fff",
    fontFamily: "cardRegular",
  },
  bitStringCopy: {
    fontSize: 16,
    marginLeft: "2%",
    color: "#000",
    fontFamily: "cardRegular",
  },
  membership: {
    fontSize: 18,
    color: "#fff",
    marginTop: 10,
    fontFamily: "cardRegular",
  },
  qrButton: {
    paddingHorizontal: 10,
    borderRadius: 15,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    height: "14%",
  },
  qrButtonFront: {
    borderRadius: 15,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    width: "17%",
  },
  bottomContainer: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "85%",
    marginTop: 17,
  },
  topContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    marginTop: "2%",
    marginBottom: "5%",
  },
  amountContainer: {
    padding: 15,
    flexDirection: "row",
    alignContent: "flex-start",
    width: "100%",
    marginTop: 25,
  },
  bottomTextContainer: {
    flexDirection: "column",
    alignContent: "flex-start",
    width: "100%",
    paddingHorizontal: 10,
    marginTop: 10,
  },
  cardWrapper: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    overflow: "hidden",
  },
  qrContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  qrCodeWrapper: {
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 20,
    borderRadius: 10,
  },
});

// -------------------- Export --------------------
export default FlipCard;
