import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { Slider } from '@miblanchard/react-native-slider';
import Svg, { Defs, LinearGradient as SvgGradient, Stop, Polygon } from 'react-native-svg';

const beanIcon = require('../../icons/bean_brown.png'); // <-- replace with your actual image path
const { width } = Dimensions.get("window");




interface Props {
  ratio: number;
  onChange: (value: number) => void;
}



const CoffeeRatioSlider: React.FC<Props> = ({ ratio, onChange }) => {
     const minRatio = 10;
  const maxRatio = 20;


  const handleSliderChange = (val: number[]) => {
    const t = val[0]; // value from 0 → 1
    const mappedRatio = Math.round(maxRatio - (maxRatio - minRatio) * t);
    onChange(mappedRatio);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.ratioText}>1:{ratio}</Text>

      <View style={styles.sliderContainer}>
        {/* Triangle Gradient SVG Behind Slider */}
        <Svg height="40" width="100%" viewBox="0 0 100 70" preserveAspectRatio="none" style={{ position: 'absolute',
  top: -5,
  right: 0,
  bottom: 0,
  left: 0}}>
          <Defs>
            <SvgGradient id="coffeeGradient" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor="#FFA726" stopOpacity="1" />
              <Stop offset="1" stopColor="#A0522D" stopOpacity="1" />
            </SvgGradient>
          </Defs>
          <Polygon
            points="0,80 0,70 100,10 100,80"
            fill="url(#coffeeGradient)"
          />
        </Svg>

        {/* Invisible track slider */}
        <Slider
           value={(maxRatio - ratio) / (maxRatio - minRatio)} // inverted
          onValueChange={handleSliderChange}
          minimumValue={0}
          maximumValue={1}
          step={0.01}
          minimumTrackTintColor="transparent"
          maximumTrackTintColor="transparent"
          trackStyle={styles.track}
          renderThumbComponent={() => (
            <Image source={beanIcon} style={styles.thumb} />
          )}
        />
      </View>

      <View style={styles.labelRow}>
        <Text style={styles.label}>light</Text>
        <Text style={styles.label}>strong</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 24,
  },
  ratioText: {
    fontSize: 24,
    fontWeight: '500',
    color: '#444',
    marginBottom: 16,
  },
  sliderContainer: {
    width: '100%',
    height: 40,
    position: 'relative', // This makes children with `absolute` respect this box
    justifyContent: 'center',


 
  },
  track: {
    borderWidth: 1,
    height: 120,
    backgroundColor: 'transparent',
  },
  thumb: {
    width: 40,
    height: 40,
    resizeMode: 'contain',

  },
  labelRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  label: {
    fontSize: 14,
    color: '#555',
  },
});

export default CoffeeRatioSlider;