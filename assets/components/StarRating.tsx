import React from "react";
import { View, StyleSheet, Text, Platform } from "react-native";
import { AntDesign } from "@expo/vector-icons";

interface StarRatingProps {
  rating: number; // Rating value (e.g., 4.4)
  maxStars?: number; // Maximum number of stars (default: 5)
  size?: number; // Size of each star (default: 14)
  color?: string; // Color of filled stars (default: '#FFD700')
  outlineColor?: string; // Color of outline stars (default: '#E0E0E0')
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  size = 14,
  color = "#FFD700",
  outlineColor = "#E0E0E0",
}) => {
  const renderStars = () => {
    const stars = [];

    for (let i = 0; i < maxStars; i++) {
      const fillPercent = Math.min(Math.max(rating - i, 0), 1); // value between 0 and 1

      stars.push(
        <View
          key={i}
          style={{
            position: "relative",
            width: size,
            height: size,
            marginRight: 1,
          }}
        >
          {/* Outline star */}
          <AntDesign
            name="star"
            size={size}
            color={outlineColor}
            style={{ position: "absolute", top: 0, left: 0 }}
          />

          {/* Filled portion */}
          {fillPercent > 0 && (
            <View
              style={{
                width: size * fillPercent,
                overflow: "hidden",
                position: "absolute",
                top: 0,
                left: 0,
              }}
            >
              <AntDesign name="star" size={size} color={color} />
            </View>
          )}
        </View>
      );
    }

    return stars;
  };

  return (
    <View style={styles.container}>
      {renderStars()}
      <Text style={styles.ratingText}> {rating.toFixed(1)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontFamily: "cardRegular",
    color: "#58595B",
    fontSize: 12,
    marginLeft: 4,
  },
});

export default StarRating;
