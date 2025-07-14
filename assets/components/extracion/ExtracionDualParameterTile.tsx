import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from 'react-native';

interface ExtracionDualParameterTileProps {
  leftIcon: ImageSourcePropType;
  leftTitle: string;
  leftValue: string;
  rightIcon: ImageSourcePropType;
  rightTitle: string;
  rightValue: string;
  onPress?: () => void;
}

const ExtracionDualParameterTile: React.FC<ExtracionDualParameterTileProps> = ({
  leftIcon,
  leftTitle,
  leftValue,
  rightIcon,
  rightTitle,
  rightValue,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.tile}>
        {/* Left Section - Coffee Beans */}
        <View style={styles.section}>
          <Image source={leftIcon} style={styles.icon} />
          <Text style={styles.title}>{leftTitle}</Text>
          <Text style={styles.value}>{leftValue}</Text>
        </View>
        
        {/* Divider */}
        <View style={styles.divider} />
        
        {/* Right Section - Water */}
        <View style={styles.section}>
          <Image source={rightIcon} style={styles.icon} />
          <Text style={styles.title}>{rightTitle}</Text>
          <Text style={styles.value}>{rightValue}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 20,
  },
  tile: {
    backgroundColor: '#58595B',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  section: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    width: 1,
    height: 60,
    backgroundColor: '#FFFFFF',
    opacity: 0.3,
    marginHorizontal: 20,
  },
  icon: {
    width: 32,
    height: 32,
    tintColor: '#FFFFFF',
    marginBottom: 8,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '400',
    marginBottom: 4,
    textAlign: 'center',
  },
  value: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#8CDBED',
    textAlign: 'center',
  },
});

export default ExtracionDualParameterTile;
