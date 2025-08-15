// README
// Coffee brewing ratio slider component.
// Features:
// - Displays brewing ratio in "1:XX" format.
// - Interactive slider allows adjusting ratio between MIN_RATIO and MAX_RATIO.
// - Slider is reversed: left = stronger brew (lower ratio), right = lighter brew (higher ratio).
// - Coffee bean icon is used as the slider thumb.
// - Gradient background visually indicates strength progression.
// Notes:
// - Uses `@miblanchard/react-native-slider` for slider functionality.
// - The polygon shape with gradient is rendered using `react-native-svg`.
// - Constants MIN_RATIO and MAX_RATIO define range (default: 10 to 20).

// -------------------- Imports --------------------
import React from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import { Slider } from "@miblanchard/react-native-slider";
import Svg, {
  Defs,
  LinearGradient as SvgGradient,
  Stop,
  Polygon,
} from "react-native-svg";

// Coffee bean icon for the slider thumb
const beanIcon = require("../../graphics/extracion/config-graphics/extracion-coffeebean.png");
const { width } = Dimensions.get("window");

// -------------------- Constants --------------------
const MIN_RATIO = 10; // Lightest brew ratio
const MAX_RATIO = 20; // Strongest brew ratio
const SLIDER_HEIGHT = 40; // Height of slider track and background
const THUMB_SIZE = 40; // Size of slider thumb icon

// -------------------- Props --------------------
interface Props {
  ratio: number; // Current brew ratio
  onChange: (value: number) => void; // Callback when ratio changes
}

// -------------------- Component --------------------
const CoffeeRatioSlider: React.FC<Props> = ({ ratio, onChange }) => {
  // Convert ratio to normalized slider value (0 to 1)
  // Slider is reversed so that left = MAX_RATIO, right = MIN_RATIO
  const sliderValue = (MAX_RATIO - ratio) / (MAX_RATIO - MIN_RATIO);

  // Handle slider value change
  const handleSliderChange = (values: number[]) => {
    const normalizedValue = values[0]; // Value between 0 and 1
    // Reverse calculation to get new ratio
    const newRatio = Math.round(
      MAX_RATIO - normalizedValue * (MAX_RATIO - MIN_RATIO)
    );
    onChange(newRatio);
  };

  return (
    <View style={styles.container}>
      {/* ---------- Ratio Display ---------- */}
      <Text style={styles.ratioText}>1:{ratio}</Text>

      {/* ---------- Slider with Gradient Background ---------- */}
      <View style={styles.sliderWrapper}>
        {/* Background gradient polygon */}
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
                <Stop offset="1" stopColor="#965F29" stopOpacity="1" />
              </SvgGradient>
            </Defs>
            <Polygon points="0,40 100,0 100,40" fill="url(#coffeeGradient)" />
          </Svg>
        </View>

        {/* Slider track & thumb */}
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

      {/* ---------- Labels ---------- */}
      <View style={styles.labelRow}>
        <Text style={styles.label}>light</Text>
        <Text style={styles.label}>strong</Text>
      </View>
    </View>
  );
};

// -------------------- Styles --------------------
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
    marginTop: 0,
  },
  gradientContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
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
    paddingTop: 18, // Push track & thumb down into gradient
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

// -------------------- Export --------------------
export default CoffeeRatioSlider;
