import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
  color = '#FFD700',
  outlineColor = '#E0E0E0'
}) => {
  const renderStars = () => {
    const stars = [];
    
    for (let i = 1; i <= maxStars; i++) {
      let starName: 'star' | 'star-outline';
      let starColor: string;
      
      if (i <= Math.floor(rating)) {
        // Full star
        starName = 'star';
        starColor = color;
      } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
        // Partial star - for now we'll show as outline, but you could implement half-stars
        starName = 'star-outline';
        starColor = outlineColor;
      } else {
        // Empty star
        starName = 'star-outline';
        starColor = outlineColor;
      }
      
      stars.push(
        <Ionicons
          key={i}
          name={starName}
          size={size}
          color={starColor}
          style={styles.star}
        />
      );
    }
    
    return stars;
  };

  return (
    <View style={styles.container}>
      {renderStars()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    marginRight: 1,
  },
});

export default StarRating;
