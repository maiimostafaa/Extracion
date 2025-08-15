/**
 * editable-star-rating.tsx
 * 
 * An interactive star rating component that allows users to select a rating by tapping on stars, with optional read-only mode.
 */

import React from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";

interface BrewLogRatingStarsProps {
  rating: number; // Float between 0 and 5
  onRatingChange?: (rating: number) => void; // Optional - makes it interactive
}

const BrewLogRatingStars: React.FC<BrewLogRatingStarsProps> = ({
  rating,
  onRatingChange,
}) => {
  // Round down the rating to get the number of filled stars
  const filledStars = Math.floor(rating);
  const maxStars = 5;

  const handleStarTap = (starIndex: number) => {
    if (!onRatingChange) return; // Not interactive

    const newRating = starIndex + 1; // Star index is 0-based, rating is 1-based

    // If tapping the same star that represents the current rating, reset to 0
    // Otherwise, set to the new rating
    const finalRating = rating === newRating ? 0 : newRating;

    onRatingChange(finalRating);
  };

  return (
    <View style={styles.starsContainer}>
      {Array.from({ length: maxStars }, (_, index) => {
        const StarComponent = onRatingChange ? TouchableOpacity : View;

        return (
          <StarComponent
            key={`star-${index}-${rating}`}
            onPress={onRatingChange ? () => handleStarTap(index) : undefined}
            activeOpacity={onRatingChange ? 0.7 : 1}
            style={onRatingChange ? styles.interactiveStar : undefined}
          >
            <AntDesign
              name={"star"}
              size={30}
              style={[
                styles.star,
                index < filledStars
                  ? { color: "#FFD700" } // Yellow/gold for filled stars
                  : { color: "#CCCCCC" }, // Gray for empty stars
              ]}
            />
          </StarComponent>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  // Main container (horizontal layout for stars)
  starsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginBottom: 30,
  },
  
  // Individual star styling
  star: {
    width: 30,
    height: 30,
    marginHorizontal: 5,
  },
  
  // Interactive star touch target
  interactiveStar: {
    padding: 4, // Add some padding for better touch target
  },
});

export default BrewLogRatingStars;
