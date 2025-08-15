// README
// Reusable card component for selecting a brewing method in the coffee app.
// Features:
// - Displays an image (custom or default coffee machine) and a title.
// - Highlights visually when selected (border color + background change).
// - Accepts a custom image and an onPress handler for interaction.
// Notes:
// - Designed for use in brewing method selection screens.
// - Supports accessibility for touch by using TouchableOpacity.
// - Default image is located in `graphics/extracion/method-card/`.

// -------------------- Imports --------------------
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from "react-native";

// Default coffee machine image if no image prop is provided
const coffeeMachineImage = require("../../graphics/extracion/method-card/extracion-coffee-machine.png");

// -------------------- Props --------------------
interface BrewingMethodCardProps {
  title: string; // Brewing method title (e.g., "Espresso", "Pour Over")
  image?: ImageSourcePropType; // Optional custom image for the card
  onPress?: () => void; // Optional tap handler
  isSelected?: boolean; // Whether this card is currently selected
}

// -------------------- Component --------------------
const BrewingMethodCard: React.FC<BrewingMethodCardProps> = ({
  title,
  image,
  onPress,
  isSelected = false,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8} // Slight fade effect on press
    >
      <View style={[styles.card, isSelected && styles.selectedCard]}>
        {/* ---------- Image Section ---------- */}
        <View style={styles.imageContainer}>
          <Image
            source={image || coffeeMachineImage} // Use provided image or default
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        {/* ---------- Title Section ---------- */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.underline} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

// -------------------- Styles --------------------
const styles = StyleSheet.create({
  container: {
    marginLeft: "17%",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 40, // Increased padding for spacious layout
    alignItems: "center",
    justifyContent: "center",
    minHeight: 440, // Matches design proportions
    minWidth: 240,
    maxWidth: 240,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  selectedCard: {
    borderColor: "#007AFF", // Blue highlight when selected
    backgroundColor: "#F0F8FF",
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  image: {
    width: 240,
    height: 400,
  },
  placeholderImage: {
    width: 150,
    height: 150,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E0E0E0",
    borderStyle: "dashed",
  },
  placeholderText: {
    color: "#999",
    fontSize: 14,
    fontWeight: "500",
  },
  titleContainer: {
    width: "100%",
    alignItems: "center",
  },
  title: {
    fontSize: 22, // Larger text for emphasis
    color: "#58595B",
    textAlign: "center",
    lineHeight: 28,
    marginTop: 8, // Space between image and title
    fontFamily: "cardRegular",
  },
  underline: {
    width: 180,
    height: 2,
    backgroundColor: "#757575",
    marginTop: 8,
    borderRadius: 1,
  },
});

// -------------------- Export --------------------
export default BrewingMethodCard;
