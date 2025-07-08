import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

interface ExtracionParameterTileProps {
  icon: any; // Image source for the icon
  title: string;
  value: string;
  onPress?: () => void;
}

const ExtracionParameterTile: React.FC<ExtracionParameterTileProps> = ({
  icon,
  title,
  value,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={icon} style={styles.icon} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 130,
    height: 130,
    backgroundColor: '#58595B',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  icon: {
    width: 40,
    height: 40,
    tintColor: '#FFFFFF',
    marginBottom: 8,
    resizeMode: 'contain', // Ensure full icon is visible
  },
  title: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  value: {
    fontSize: 18, // Increased from 14 to 18
    fontWeight: '700', // Made bolder
    color: '#8CDBED',
    textAlign: 'center',
  },
});

export default ExtracionParameterTile;
