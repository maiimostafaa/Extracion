import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { FontAwesome, Feather } from "@expo/vector-icons";

interface CafeFinderCardProps {
  name: string;
  location: string;
  rating: number;
  image: any;
  onPress: () => void;
}

const CafeFinderCard = ({ name, location, rating, image, onPress }: CafeFinderCardProps) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={image} style={styles.photo} />
      
      <View style={styles.content}>
        <View style={styles.textContent}>
          <Text style={styles.name}>{name}</Text>
          <View style={styles.locationRow}>
            <Feather name="map-pin" size={12} color="#666" />
            <Text style={styles.locationText}>{location}</Text>
          </View>
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
        
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.saveButton}>
            <Feather name="bookmark" size={20} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.pickupButton}>
            <Text style={styles.pickupText}>Pick up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CafeFinderCard;

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
