import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Stop,
  RadialGradient,
} from "react-native-svg";

const CIRCLE_RADIUS = 100;
const STROKE_WIDTH = 30;
const MAX_TEMP = 110;

const getTempColor = (temp: number) => {
  if (temp >= 90) return "#e60000";
  if (temp >= 70) return "#ff6600";
  if (temp >= 40) return "#ffcc00";
  return "#3399ff";
};

interface TimerTemperatureRingProps {
  initialTime: number; // seconds
  temp: number; // live value from BLE
}

const TimerTemperatureRing: React.FC<TimerTemperatureRingProps> = ({
  initialTime,
  temp,
}) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const timeProgress = 1 - timeLeft / initialTime;
  const tempProgress = Math.min(temp / MAX_TEMP, 1);
  const circleCircumference = 2 * Math.PI * CIRCLE_RADIUS;

  return (
    <View style={styles.container}>
      {/* Outer shadow container */}
      <View style={styles.shadowContainer}>
        {/* Main circle container with inner shadow */}
        <View style={styles.circleContainer}>
          <Svg height="250" width="250" style={styles.svgContainer}>
            <Defs>
              {/* Enhanced gradient for the outer ring (time) with more prominent shadows */}
              <LinearGradient
                id="timeGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <Stop offset="0%" stopColor="#e6f7ff" />
                <Stop offset="30%" stopColor="#b3e5ff" />
                <Stop offset="70%" stopColor="#66d9ff" />
                <Stop offset="100%" stopColor="#4dd2ff" />
              </LinearGradient>

              {/* Shadow gradient for outer ring */}
              <LinearGradient
                id="timeShadowGradient"
                x1="100%"
                y1="100%"
                x2="0%"
                y2="0%"
              >
                <Stop offset="0%" stopColor="#0066cc" />
                <Stop offset="50%" stopColor="#4da6ff" />
                <Stop offset="100%" stopColor="#80d4ff" />
              </LinearGradient>

              {/* Enhanced gradient for the inner ring (temp) with lighting */}
              <LinearGradient
                id="tempGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <Stop offset="0%" stopColor={`${getTempColor(temp)}40`} />
                <Stop offset="15%" stopColor={getTempColor(temp)} />
                <Stop offset="85%" stopColor={getTempColor(temp)} />
                <Stop offset="100%" stopColor={`${getTempColor(temp)}60`} />
              </LinearGradient>

              {/* Dramatic shadow gradient for inner ring */}
              <LinearGradient
                id="tempShadowGradient"
                x1="100%"
                y1="100%"
                x2="0%"
                y2="0%"
              >
                <Stop offset="0%" stopColor={`${getTempColor(temp)}80`} />
                <Stop offset="30%" stopColor={`${getTempColor(temp)}B0`} />
                <Stop offset="70%" stopColor={getTempColor(temp)} />
                <Stop offset="100%" stopColor={`${getTempColor(temp)}C0`} />
              </LinearGradient>

              {/* Enhanced radial gradient for center background */}
              <RadialGradient
                id="centerGradient"
                cx="30%"
                cy="20%"
                r={CIRCLE_RADIUS}
              >
                <Stop offset="0%" stopColor="#ffffff" />
                <Stop offset="40%" stopColor="#f5f5f5" />
                <Stop offset="80%" stopColor="#e8e8e8" />
                <Stop offset="100%" stopColor="#d0d0d0" />
              </RadialGradient>
            </Defs>

            {/* Center background with gradient */}
            <Circle fill="none" cx="125" cy="125" r="70" />

            {/* Time Ring Background */}
            <Circle
              stroke="url(#timeGradient)"
              fill="none"
              cx="126"
              cy="126"
              r={CIRCLE_RADIUS}
              strokeWidth={STROKE_WIDTH}
              opacity={0.4}
            />

            {/* Time Ring Shadow Layer */}
            <Circle
              stroke="url(#timeShadowGradient)"
              fill="none"
              cx="127"
              cy="127"
              r={CIRCLE_RADIUS}
              strokeWidth={STROKE_WIDTH}
              strokeDasharray={circleCircumference}
              strokeDashoffset={circleCircumference * (1 - timeProgress)}
              strokeLinecap="round"
              transform="rotate(-90 127 127)"
              opacity={0.4}
            />

            {/* Time Ring Progress */}
            <Circle
              stroke="url(#timeGradient)"
              fill="none"
              cx="125"
              cy="125"
              r={CIRCLE_RADIUS}
              strokeWidth={STROKE_WIDTH}
              strokeDasharray={circleCircumference}
              strokeDashoffset={circleCircumference * (1 - timeProgress)}
              strokeLinecap="round"
              transform="rotate(-90 125 125)"
              opacity={0.9}
            />

            {/* Temp Ring Background */}
            <Circle
              stroke="url(#tempGradient)"
              fill="none"
              cx="126.5"
              cy="126.25"
              r={CIRCLE_RADIUS - STROKE_WIDTH / 2 - 10}
              strokeWidth={STROKE_WIDTH - 10}
              opacity={0.4}
            />

            {/* Temp Ring Shadow Layer */}
            <Circle
              stroke="url(#tempShadowGradient)"
              fill="none"
              cx="126.5"
              cy="126.25"
              r={CIRCLE_RADIUS - STROKE_WIDTH / 2 - 10}
              strokeWidth={STROKE_WIDTH - 10}
              strokeDasharray={circleCircumference}
              strokeDashoffset={circleCircumference * (1 - tempProgress)}
              strokeLinecap="round"
              transform="rotate(-90 127 127)"
              opacity={0.7}
            />

            {/* Temp Ring Progress */}
            <Circle
              stroke="url(#tempGradient)"
              fill="none"
              cx="126.5"
              cy="126.25"
              r={CIRCLE_RADIUS - STROKE_WIDTH / 2 - 10}
              strokeWidth={STROKE_WIDTH - 10}
              strokeDasharray={circleCircumference}
              strokeDashoffset={circleCircumference * (1 - tempProgress)}
              strokeLinecap="round"
              transform="rotate(-90 125 125)"
              opacity={0.9}
            />
          </Svg>

          {/* Center Text */}
          <View style={styles.centerText}>
            <Text style={styles.timeText}>
              {`00:${timeLeft < 10 ? `0${timeLeft}` : timeLeft}`}
            </Text>
            <Text style={styles.tempText}>{`${temp}°C`}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};
export default TimerTemperatureRing;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",

    flex: 1,
  },
  shadowContainer: {
    // Outer shadow (drop shadow)
    shadowColor: "#f0f0f0",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    // Android shadow
    elevation: 15,

    // Make it circular for better shadow rendering
    borderRadius: 140,
    backgroundColor: "transparent",
  },
  circleContainer: {
    // Inner shadow effect
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    // Android inner shadow simulation
    elevation: Platform.OS === "android" ? 5 : 0,

    borderRadius: 125,
    backgroundColor: "#ffffff",
    width: 250,
    height: 250,

    // Additional styling for depth
    borderWidth: Platform.OS === "android" ? 1 : 0,
    borderColor: "#e0e0e0",
  },
  svgContainer: {
    backgroundColor: "transparent",
  },
  centerText: {
    position: "absolute",
    ...(Platform.OS === "ios" && {
      top: 100,
      left: 95,
    }),
    ...(Platform.OS === "android" && {
      top: 95,
      left: 95,
    }),
    alignItems: "center",
  },
  timeText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
  },
  tempText: {
    fontSize: 22,
    color: "#333",
  },
});
