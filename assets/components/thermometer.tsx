import React from "react";
import { View, Image, StyleSheet, Text } from "react-native";

const MAX_TEMP = 110;
const MIN_TEMP = 0;

interface ThermometerProps {
  temp: number; // 0 to 110 °C
}

const DynamicThermometer: React.FC<ThermometerProps> = ({ temp }) => {
  // Clamp temperature
  const clampedTemp = Math.min(Math.max(temp, MIN_TEMP), MAX_TEMP);
  const fillHeightPercent = clampedTemp / MAX_TEMP;

  // Fill color based on temperature
  const fillColor =
    clampedTemp >= 90
      ? "#e60000" // red
      : clampedTemp >= 70
        ? "#ff6600" // orange
        : clampedTemp >= 40
          ? "#ffcc00" // yellow
          : "#3399ff"; // blue

  return (
    <View style={styles.container}>
      <Image
        source={require("../nonclickable-visual-elements/thermo-body.png")}
        style={styles.thermometer}
      />
      <View style={styles.fillContainer}>
        <View
          style={[
            styles.fill,
            {
              backgroundColor: fillColor,
              height: `${fillHeightPercent * 95}%`,
            },
          ]}
        />
      </View>
      <Image
        source={require("../nonclickable-visual-elements/thermo-base.png")}
        style={[styles.bulb, { tintColor: fillColor }]}
      />

      <Text
        style={{
          marginTop: 10,
          fontSize: 33,
          fontWeight: 600,
          color: "#078CC9",
        }}
      >
        {temp}
        <Text style={{ fontSize: 23, fontWeight: 600, color: "#078CC9" }}>
          °C
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 240,
    alignItems: "center",
    position: "relative",
  },
  thermometer: {
    width: 40,
    height: 190,
    position: "absolute",
    top: 0,
    zIndex: 1,
    resizeMode: "contain",
  },
  fillContainer: {
    width: 7,
    height: 130,
    position: "absolute",
    top: 12,
    justifyContent: "flex-end",
    overflow: "hidden",
    zIndex: 0,
  },
  fill: {
    width: "100%",
    borderTopRightRadius: 3,
    borderTopLeftRadius: 3,
  },
  bulb: {
    width: 30,
    height: 30,
    marginTop: 142,
    marginLeft: 0.5,
    resizeMode: "contain",
    zIndex: 2,
  },
});

export default DynamicThermometer;
