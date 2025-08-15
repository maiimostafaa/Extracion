// README
// Reusable card component for displaying café information in the Cafe Finder screen.
// Features:
// - Displays café image, name, location, rating (with stars), and action buttons.
// - "Save" button (bookmark icon) for marking a café (functionality can be added later).
// - "Pick up" button for initiating an order or pickup flow.
// Notes:
// - Accepts props for name, location, rating, image, and onPress action.
// - Star rating supports half-star display when applicable.
// - Designed for use inside lists or scroll views.

// -------------------- Imports --------------------
import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome, Feather } from "@expo/vector-icons";

// -------------------- Props Interface --------------------
interface CafeFinderCardProps {
  name: string; // Café name
  location: string; // Café location/address text
  rating: number; // Numerical rating (e.g., 4.5)
  image: any; // Image source for café photo
  onPress: () => void; // Function triggered when card is tapped
}

// -------------------- Component --------------------
const CafeFinderCard = ({
  name,
  location,
  rating,
  image,
  onPress,
}: CafeFinderCardProps) => {
  const fullStars = Math.floor(rating); // Full stars count
  const hasHalfStar = rating - fullStars >= 0.5; // Whether to display a half star

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {/* Café photo */}
      <Image source={image} style={styles.photo} />

      {/* Card content container */}
      <View style={styles.content}>
        {/* ---------- Text & Rating Section ---------- */}
        <View style={styles.textContent}>
          {/* Café name */}
          <Text style={styles.name}>{name}</Text>

          {/* Location row with pin icon */}
          <View style={styles.locationRow}>
            <Feather name="map-pin" size={12} color="#666" />
            <Text style={styles.locationText}>{location}</Text>
          </View>

          {/* Rating row with stars */}
          <View style={styles.ratingRow}>
            {[...Array(fullStars)].map((_, i) => (
              <FontAwesome key={i} name="star" size={12} color="#FFD700" />
            ))}
            {hasHalfStar && (
              <FontAwesome name="star-half-full" size={12} color="#FFD700" />
            )}
            <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
          </View>
        </View>

        {/* ---------- Actions Section ---------- */}
        <View style={styles.actionContainer}>
          {/* Save (bookmark) button */}
          <TouchableOpacity style={styles.saveButton}>
            <Feather name="bookmark" size={20} color="#666" />
          </TouchableOpacity>

          {/* Pick up button */}
          <TouchableOpacity style={styles.pickupButton}>
            <Text style={styles.pickupText}>Pick up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// -------------------- Export --------------------
export default CafeFinderCard;

// -------------------- Styles --------------------
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  photo: {
    width: "100%",
    height: 160,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  content: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  textContent: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E9BD6",
    marginBottom: 4,
    fontFamily: "main",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  locationText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
    fontFamily: "main",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 6,
    fontFamily: "main",
  },
  actionContainer: {
    alignItems: "flex-end",
    gap: 8,
  },
  saveButton: {
    padding: 8,
  },
  pickupButton: {
    backgroundColor: "#8CDBED",
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  pickupText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "main",
  },
});
