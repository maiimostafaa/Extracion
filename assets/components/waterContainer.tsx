import React, { useEffect, useRef } from "react";
import { View, Text, Animated } from "react-native";
import Svg, {
  Path,
  ClipPath,
  Defs,
  LinearGradient,
  Stop,
  G,
  Ellipse,
} from "react-native-svg";

interface WaterContainerProps {
  numerator?: number;
  denominator?: number;
}

const WaterContainer: React.FC<WaterContainerProps> = ({
  numerator = 3,
  denominator = 4,
}) => {
  const percentage = Math.min(
    Math.max((numerator / denominator) * 100, 0),
    100
  );
  const waveAnimation1 = useRef(new Animated.Value(0)).current;
  const waveAnimation2 = useRef(new Animated.Value(0)).current;
  const waveAnimation3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Main wave animation
    const animate1 = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(waveAnimation1, {
            toValue: 3,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(waveAnimation1, {
            toValue: -3,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(waveAnimation1, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    // Secondary wave animation (opposite direction)
    const animate2 = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(waveAnimation2, {
            toValue: -2,
            duration: 2500,
            useNativeDriver: true,
          }),
          Animated.timing(waveAnimation2, {
            toValue: 2,
            duration: 2500,
            useNativeDriver: true,
          }),
          Animated.timing(waveAnimation2, {
            toValue: 0,
            duration: 2500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    // Tertiary wave animation (subtle)
    const animate3 = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(waveAnimation3, {
            toValue: -1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(waveAnimation3, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(waveAnimation3, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animate1();
    setTimeout(animate2, 500); // Offset the second animation
    setTimeout(animate3, 1000); // Offset the third animation
  }, [waveAnimation1, waveAnimation2, waveAnimation3]);

  return (
    <View
      style={{
        position: "relative",
        width: 256,
        height: 320,
        overflow: "hidden",
      }}
    >
      {/* Animated water fill and main wave */}
      <Animated.View
        style={{
          transform: [{ translateY: waveAnimation1 }],
        }}
      >
        <Svg
          width="256"
          height="320"
          viewBox="0 0 256 320"
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          <Defs>
            <ClipPath id="containerClip">
              <Path d="M32 32 L32 256 Q32 288 64 288 L192 288 Q224 288 224 256 L224 32 Z" />
            </ClipPath>

            <LinearGradient
              id="waterGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <Stop offset="0%" stopColor="#60a5fa" />
              <Stop offset="50%" stopColor="#3b82f6" />
              <Stop offset="100%" stopColor="#1d4ed8" />
            </LinearGradient>
          </Defs>

          {/* Water fill */}
          <Path
            d={`
              M32 288
              L32 ${288 - (percentage * 256) / 100}
              Q48 ${288 - (percentage * 256) / 100 - 4} 64 ${288 - (percentage * 256) / 100}
              T96 ${288 - (percentage * 256) / 100}
              T128 ${288 - (percentage * 256) / 100}
              T160 ${288 - (percentage * 256) / 100}
              T192 ${288 - (percentage * 256) / 100}
              T224 ${288 - (percentage * 256) / 100}
              L224 288
              Z
            `}
            fill="url(#waterGradient)"
            clipPath="url(#containerClip)"
          />

          {/* Main wave line */}
          {percentage > 0 && (
            <Path
              d={`M32 ${288 - (percentage * 256) / 100} Q48 ${288 - (percentage * 256) / 100 - 4} 64 ${288 - (percentage * 256) / 100} T96 ${288 - (percentage * 256) / 100} T128 ${288 - (percentage * 256) / 100} T160 ${288 - (percentage * 256) / 100} T192 ${288 - (percentage * 256) / 100} T224 ${288 - (percentage * 256) / 100}`}
              fill="none"
              stroke="#60a5fa"
              strokeWidth="2"
              opacity="0.8"
              clipPath="url(#containerClip)"
            />
          )}
        </Svg>
      </Animated.View>

      {/* Secondary wave line */}
      {percentage > 0 && (
        <Animated.View
          style={{
            transform: [{ translateY: waveAnimation2 }],
          }}
        >
          <Svg
            width="256"
            height="320"
            viewBox="0 0 256 320"
            style={{ position: "absolute", top: 0, left: 0 }}
          >
            <Defs>
              <ClipPath id="containerClip2">
                <Path d="M32 32 L32 256 Q32 288 64 288 L192 288 Q224 288 224 256 L224 32 Z" />
              </ClipPath>
            </Defs>
            <Path
              d={`M32 ${288 - (percentage * 256) / 100 + 2} Q56 ${288 - (percentage * 256) / 100 - 2} 80 ${288 - (percentage * 256) / 100 + 2} T112 ${288 - (percentage * 256) / 100 + 2} T144 ${288 - (percentage * 256) / 100 + 2} T176 ${288 - (percentage * 256) / 100 + 2} T208 ${288 - (percentage * 256) / 100 + 2} T224 ${288 - (percentage * 256) / 100 + 2}`}
              fill="none"
              stroke="#93c5fd"
              strokeWidth="1.5"
              opacity="0.6"
              clipPath="url(#containerClip2)"
            />
          </Svg>
        </Animated.View>
      )}

      {/* Tertiary wave line */}
      {percentage > 0 && (
        <Animated.View
          style={{
            transform: [{ translateY: waveAnimation3 }],
          }}
        >
          <Svg
            width="256"
            height="320"
            viewBox="0 0 256 320"
            style={{ position: "absolute", top: 0, left: 0 }}
          >
            <Defs>
              <ClipPath id="containerClip3">
                <Path d="M32 32 L32 256 Q32 288 64 288 L192 288 Q224 288 224 256 L224 32 Z" />
              </ClipPath>
            </Defs>
            <Path
              d={`M32 ${288 - (percentage * 256) / 100 - 1} Q44 ${288 - (percentage * 256) / 100 + 3} 72 ${288 - (percentage * 256) / 100 - 1} T104 ${288 - (percentage * 256) / 100 - 1} T136 ${288 - (percentage * 256) / 100 - 1} T168 ${288 - (percentage * 256) / 100 - 1} T200 ${288 - (percentage * 256) / 100 - 1} T224 ${288 - (percentage * 256) / 100 - 1}`}
              fill="none"
              stroke="#dbeafe"
              strokeWidth="1"
              opacity="0.4"
              clipPath="url(#containerClip3)"
            />
          </Svg>
        </Animated.View>
      )}

      {/* Static container outline */}
      <Svg
        width="256"
        height="320"
        viewBox="0 0 256 320"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <Path
          d="M32 32 L32 256 Q32 288 64 288 L192 288 Q224 288 224 256 L224 32"
          fill="none"
          stroke="#4a5568"
          strokeWidth="8"
        />
        <Ellipse cx="128" cy="288" rx="112" ry="24" fill="#4a5568" />
        <Path
          d="M224 80 Q264 80 264 120 L264 160 Q264 200 224 200"
          fill="none"
          stroke="#4a5568"
          strokeWidth="8"
        />
        <Path
          d="M224 96 Q248 96 248 120 L248 160 Q248 184 224 184"
          fill="white"
        />
      </Svg>

      {/* Text overlay */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: "center",
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        <Text
          style={{
            fontSize: 48,
            fontWeight: "bold",
            color: "white",
            textShadowColor: "rgba(0,0,0,0.8)",
            textShadowOffset: { width: 2, height: 2 },
            textShadowRadius: 4,
          }}
        >
          {numerator}
        </Text>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "600",
            color: "white",
            marginTop: 8,
            textShadowColor: "rgba(0,0,0,0.8)",
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 2,
          }}
        >
          {Math.round(percentage)}%
        </Text>
      </View>
    </View>
  );
};

export default WaterContainer;
