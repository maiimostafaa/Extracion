import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Stop,
  RadialGradient,
} from "react-native-svg";

const BASE_CIRCLE_RADIUS = 100;
const BASE_STROKE_WIDTH = 30;
const BASE_SIZE = 230;
const MAX_TEMP = 110;

const getTempColor = (temp: number) => {
  if (temp >= 90) return "#e60000";
  if (temp >= 70) return "#ff6600";
  if (temp >= 0) return "#ffcc00";
};

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
};

interface TimerTemperatureRingProps {
  initialTime: number; // seconds
  temp: number; // live value from BLE
  size?: number; // optional size prop, defaults to 230
}

const TimerTemperatureRing: React.FC<TimerTemperatureRingProps> = ({
  initialTime,
  temp,
  size = BASE_SIZE,
}) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  // Calculate scale factor based on size
  const scale = size / BASE_SIZE;
  const CIRCLE_RADIUS = BASE_CIRCLE_RADIUS * scale;
  const STROKE_WIDTH = BASE_STROKE_WIDTH * scale;
  const svgCenter = size / 2;

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const timeProgress = 1 - timeLeft / initialTime;
  const tempProgress = Math.min(temp / MAX_TEMP, 1);
  const timeCircumference = 2 * Math.PI * CIRCLE_RADIUS;
  const tempRadius = CIRCLE_RADIUS - STROKE_WIDTH / 2 - 8 * scale;
  const tempCircumference = 2 * Math.PI * tempRadius;

  const styles = getStyles(size, scale);

  return (
    <View style={styles.container}>
      {/* Outer shadow container */}
      <View style={styles.shadowContainer}>
        {/* Main circle container with inner shadow */}
        <View style={styles.circleContainer}>
          <Svg height={size} width={size} style={styles.svgContainer}>
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
            <Circle fill="none" cx={svgCenter} cy={svgCenter} r={70 * scale} />

            {/* Time Ring Background */}
            <Circle
              stroke="url(#timeGradient)"
              fill="none"
              cx={svgCenter}
              cy={svgCenter}
              r={CIRCLE_RADIUS}
              strokeWidth={STROKE_WIDTH}
              opacity={0.4}
            />

            {/* Time Ring Shadow Layer */}
            <Circle
              stroke="url(#timeShadowGradient)"
              fill="none"
              cx={svgCenter}
              cy={svgCenter}
              r={CIRCLE_RADIUS}
              strokeWidth={STROKE_WIDTH}
              strokeDasharray={timeCircumference}
              strokeDashoffset={timeCircumference * (1 - timeProgress)}
              strokeLinecap="round"
              transform={`rotate(-90 ${svgCenter} ${svgCenter})`}
              opacity={0.4}
            />

            {/* Time Ring Progress */}
            <Circle
              stroke="url(#timeGradient)"
              fill="none"
              cx={svgCenter}
              cy={svgCenter}
              r={CIRCLE_RADIUS}
              strokeWidth={STROKE_WIDTH}
              strokeDasharray={timeCircumference}
              strokeDashoffset={timeCircumference * (1 - timeProgress)}
              strokeLinecap="round"
              transform={`rotate(-90 ${svgCenter} ${svgCenter})`}
              opacity={0.9}
            />

            {/* Temp Ring Background */}
            <Circle
              stroke="url(#tempGradient)"
              fill="none"
              cx={svgCenter + 0.2 * scale}
              cy={svgCenter}
              r={CIRCLE_RADIUS - STROKE_WIDTH / 2 - 10 * scale}
              strokeWidth={STROKE_WIDTH - 10 * scale}
              opacity={0.4}
            />

            {/* Temp Ring Shadow Layer */}
            <Circle
              stroke="url(#tempShadowGradient)"
              fill="none"
              cx={svgCenter + 0.2 * scale}
              cy={svgCenter}
              r={CIRCLE_RADIUS - STROKE_WIDTH / 2 - 10 * scale}
              strokeWidth={STROKE_WIDTH - 10 * scale}
              strokeDasharray={tempCircumference}
              strokeDashoffset={tempCircumference * (1 - tempProgress)}
              strokeLinecap="round"
              transform={`rotate(-90 ${svgCenter} ${svgCenter})`}
              opacity={0.7}
            />

            {/* Temp Ring Progress */}
            <Circle
              stroke="url(#tempGradient)"
              fill="none"
              cx={svgCenter + 0.2 * scale}
              cy={svgCenter}
              r={CIRCLE_RADIUS - STROKE_WIDTH / 2 - 10 * scale}
              strokeWidth={STROKE_WIDTH - 10 * scale}
              strokeDasharray={tempCircumference}
              strokeDashoffset={tempCircumference * (1 - tempProgress)}
              strokeLinecap="round"
              transform={`rotate(-90 ${svgCenter} ${svgCenter})`}
              opacity={0.9}
            />
          </Svg>

          {/* Center Text */}
          <View style={styles.centerText}>
            <Text style={styles.timeText}>{formatTime(timeLeft)}</Text>
            <Text style={styles.tempText}>{`${temp}°C`}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const getStyles = (size: number, scale: number) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
    },
    shadowContainer: {
      shadowColor: "#f0f0f0",
      shadowOffset: {
        width: 0,
        height: 2 * scale,
      },
      shadowOpacity: 0.25,
      shadowRadius: 12 * scale,
      elevation: 15,
      borderRadius: 140 * scale,
      backgroundColor: "transparent",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: size,
      height: size,
    },
    circleContainer: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: -2 * scale,
      },
      shadowOpacity: 0.15,
      shadowRadius: 6 * scale,
      elevation: Platform.OS === "android" ? 5 : 0,
      borderRadius: 160 * scale,
      backgroundColor: "#ffffff",
      width: size,
      height: size,
      borderWidth: Platform.OS === "android" ? 1 * scale : 0,
      borderColor: "#e0e0e0",
    },
    svgContainer: {
      backgroundColor: "transparent",
    },
    centerText: {
      position: "absolute",
      ...(Platform.OS === "ios" && {
        top: 90 * scale,
        left: 85 * scale,
      }),
      ...(Platform.OS === "android" && {
        top: 85 * scale,
        left: 85 * scale,
      }),
      alignItems: "center",
    },
    timeText: {
      fontSize: 24 * scale,
      fontWeight: "600",
      color: "#333",
    },
    tempText: {
      fontSize: 22 * scale,
      color: "#333",
    },
  });

export default TimerTemperatureRing;
