import React from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import { Slider } from "@miblanchard/react-native-slider";
import Svg, {
  Defs,
  LinearGradient as SvgGradient,
  Stop,
  Polygon,
} from "react-native-svg";

const beanIcon = require("../../graphics/extracion/config-graphics/extracion-coffeebean.png");
const { width } = Dimensions.get("window");

// Configuration constants
const MIN_RATIO = 10;
const MAX_RATIO = 20;
const SLIDER_HEIGHT = 40;
const THUMB_SIZE = 40; // Increased from 32 to 40

interface Props {
  ratio: number;
  onChange: (value: number) => void;
}

const CoffeeRatioSlider: React.FC<Props> = ({ ratio, onChange }) => {
  // Convert ratio to slider value (0-1) - reversed so left=20, right=10
  const sliderValue = (MAX_RATIO - ratio) / (MAX_RATIO - MIN_RATIO);

  const handleSliderChange = (values: number[]) => {
    const normalizedValue = values[0]; // 0 to 1
    // Reverse the calculation: 0 = MAX_RATIO (20), 1 = MIN_RATIO (10)
    const newRatio = Math.round(
      MAX_RATIO - normalizedValue * (MAX_RATIO - MIN_RATIO)
    );
    onChange(newRatio);
  };
  return (
    <View style={styles.container}>
      {/* Ratio Display */}
      <Text style={styles.ratioText}>1:{ratio}</Text>

      {/* Slider Container with Background */}
      <View style={styles.sliderWrapper}>
        {/* Gradient Background Triangle */}
        <View style={styles.gradientContainer}>
          <Svg
            height={SLIDER_HEIGHT}
            width="100%"
            viewBox="0 0 70 40"
            preserveAspectRatio="none"
            style={styles.gradientSvg}
          >
            <Defs>
              <SvgGradient id="coffeeGradient" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor="#F79E1B" stopOpacity="1" />
                {/* <Stop offset="0.6" stopColor="#E76F51" stopOpacity="1" /> */}
                <Stop offset="1" stopColor="#965F29" stopOpacity="1" />
              </SvgGradient>
            </Defs>
            <Polygon points="0,40 100,0 100,40" fill="url(#coffeeGradient)" />
          </Svg>
        </View>

        {/* Slider */}
        <View style={styles.sliderContainer}>
          <Slider
            value={sliderValue}
            onValueChange={handleSliderChange}
            minimumValue={0}
            maximumValue={1}
            step={0.01}
            minimumTrackTintColor="transparent"
            maximumTrackTintColor="transparent"
            trackStyle={styles.track}
            thumbStyle={styles.thumbContainer}
            renderThumbComponent={() => (
              <View style={styles.thumbWrapper}>
                <Image source={beanIcon} style={styles.thumb} />
              </View>
            )}
          />
        </View>
      </View>

      {/* Labels */}
      <View style={styles.labelRow}>
        <Text style={styles.label}>light</Text>
        <Text style={styles.label}>strong</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    marginVertical: 32,
    paddingHorizontal: 20,
  },
  ratioText: {
    fontSize: 42,
    fontWeight: "300",
    color: "#2C2C2C",
    marginBottom: 32,
    letterSpacing: 2,
  },
  sliderWrapper: {
    width: "100%",
    height: SLIDER_HEIGHT,
    position: "relative",
    marginBottom: 16,
    marginTop: 0, // Added margin to shift slider down
  },
  gradientContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden", // Removed borderRadius for sharp corners
  },
  gradientSvg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sliderContainer: {
    position: "relative",
    height: SLIDER_HEIGHT,
    justifyContent: "center",
    zIndex: 1,
    paddingTop: 18, // Push the slider track (and coffee bean) down within the gradient
  },
  track: {
    height: 4,
    backgroundColor: "transparent",
    borderRadius: 2,
  },
  thumbContainer: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    backgroundColor: "transparent",
  },
  thumbWrapper: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    resizeMode: "contain",
  },
  labelRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingHorizontal: 8,
  },
  label: {
    fontSize: 16,
    color: "#666666",
    fontWeight: "400",
  },
});

export default CoffeeRatioSlider;
