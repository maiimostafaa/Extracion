import React from 'react';
import { View, StyleSheet, Image } from 'react-native';

interface BrewLogRatingStarsProps {
  rating: number; // Float between 0 and 5
}

const BrewLogRatingStars: React.FC<BrewLogRatingStarsProps> = ({ rating }) => {
  // Round down the rating to get the number of filled stars
  const filledStars = Math.floor(rating);
  const maxStars = 5;

  return (
    <View style={styles.starsContainer}>
      {Array.from({ length: maxStars }, (_, index) => (
        <Image
          key={`star-${index}-${rating}`} // Add rating to key to force re-render
          source={require('./icons/RatingStar.png')}
          style={[
            styles.star,
            index < filledStars 
              ? { tintColor: '#FFD700' } // Yellow/gold for filled stars
              : { tintColor: '#CCCCCC' } // Gray for empty stars
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    marginBottom: 30,
  },
  star: {
    width: 26,
    height: 26,
    marginHorizontal: 5,
  },
});

export default BrewLogRatingStars;
