import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from 'react-native';

// Import the coffee machine image
const coffeeMachineImage = require('../../nonclickable-visual-elements/extracion_coffeeMachine.png');

interface BrewingMethodCardProps {
  title: string;
  image?: ImageSourcePropType;
  onPress?: () => void;
  isSelected?: boolean;
}

const BrewingMethodCard: React.FC<BrewingMethodCardProps> = ({
  title,
  image,
  onPress,
  isSelected = false,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.card, isSelected && styles.selectedCard]}>
        {/* Image Container */}
        <View style={styles.imageContainer}>
          <Image source={image || coffeeMachineImage} style={styles.image} resizeMode="contain" />
        </View>
        
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.underline} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 40, // Increased padding
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 400, // Much taller to match the screenshot
    minWidth: 280, // Wider
    maxWidth: 320, // Wider max
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  selectedCard: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0,
    width: '100%',
  },
  image: {
    width: 350,
    height: 350,
    maxWidth: '100%',
    maxHeight: '80%',
  },
  placeholderImage: {
    width: 150,
    height: 150,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  placeholderText: {
    color: '#999',
    fontSize: 14,
    fontWeight: '500',
  },
  titleContainer: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 22, // Larger text to match design
    fontWeight: '400', // Lighter weight to match design
    color: '#333',
    textAlign: 'center',
    lineHeight: 28,
    marginTop: 8, // Add some space above the title
  },
  underline: {
    width: 180,
    height: 2,
    backgroundColor: '#757575',
    marginTop: 8,
    borderRadius: 1,
  },
});

export default BrewingMethodCard;
