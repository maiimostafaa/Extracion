import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';

interface BrewLogRatingStarsProps {
  rating: number; // Float between 0 and 5
  onRatingChange?: (rating: number) => void; // Optional - makes it interactive
}

const BrewLogRatingStars: React.FC<BrewLogRatingStarsProps> = ({ rating, onRatingChange }) => {
  // Round down the rating to get the number of filled stars
  const filledStars = Math.floor(rating);
  const maxStars = 5;

  const handleStarTap = (starIndex: number) => {
    if (!onRatingChange) return; // Not interactive
    
    const newRating = starIndex + 1; // Star index is 0-based, rating is 1-based
    
    // If tapping the same star that represents the current rating, reset to 0
    // Otherwise, set to the new rating
    const finalRating = (rating === newRating) ? 0 : newRating;
    
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
            <Image
              source={require('./icons/RatingStar.png')}
              style={[
                styles.star,
                index < filledStars 
                  ? { tintColor: '#FFD700' } // Yellow/gold for filled stars
                  : { tintColor: '#CCCCCC' } // Gray for empty stars
              ]}
            />
          </StarComponent>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginBottom: 30,
  },
  star: {
    width: 26,
    height: 26,
    marginHorizontal: 5,
  },
  interactiveStar: {
    padding: 4, // Add some padding for better touch target
  },
});

export default BrewLogRatingStars;
