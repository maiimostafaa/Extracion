import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { FontAwesome, Feather } from "@expo/vector-icons";


interface CafeCardProps {
  name: string;
  location: string;
  rating: number;
  image: any;
  onReserve: () => void;
}

const CafeCard = ({ name, location, rating, image, onReserve }: CafeCardProps) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;

  return (
    <View style={styles.card}>
      <Image source={image} style={styles.photo} />

      <View style={styles.content}>
        <Text style={styles.name}>{name}</Text>
        <View style={styles.locationRow}>
          <Feather name="map-pin" size={14} color="#666" />
          <Text style={styles.locationText}>{location}</Text>
        </View>

        <View style={styles.ratingRow}>
          {[...Array(fullStars)].map((_, i) => (
            <FontAwesome key={i} name="star" size={14} color="#1E9BD6" />
          ))}
          {hasHalfStar && (
            <FontAwesome name="star-half-full" size={14} color="#1E9BD6" />
          )}
          <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
        </View>

        <TouchableOpacity style={styles.reserveButton} onPress={onReserve}>
          <Text style={styles.reserveText}>Reserve</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CafeCard;

const styles = StyleSheet.create({
card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    width: "60%",
    height: "100%",
},
photo: {
    width: "100%",
    height: "50%",
    borderRadius: 10, 
},
content: {
    padding: 10,
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
},
name: {
    fontSize: 18,
    color: "#078CC9",
    fontFamily: "cardMedium",
},
locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
},
locationText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 5,
    fontFamily: "cardRegular",
},
ratingRow: {
    flexDirection: "row",
    marginTop: 5,
},
ratingText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 5,
    fontFamily: "cardRegular",
},
reserveButton: {
    backgroundColor: "#8CDBED",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: "center",
},
reserveText: {
    color: "#58595B",
    fontSize: 18,
    fontFamily: "cardMedium",
},
});
