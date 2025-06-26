import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Dimensions,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/AppNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface BrewingMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
  defaultRatio: number;
  defaultTime: number;
}

const brewingMethods: BrewingMethod[] = [
  {
    id: "french_press",
    name: "French Press",
    icon: "cafe",
    description: "Full-bodied coffee with rich flavors",
    defaultRatio: 15,
    defaultTime: 240,
  },
  {
    id: "pour_over",
    name: "Pour Over",
    icon: "water",
    description: "Clean and bright coffee with clarity",
    defaultRatio: 16,
    defaultTime: 180,
  },
  {
    id: "cold_drip",
    name: "Cold Drip",
    icon: "snow",
    description: "Smooth and sweet cold brew",
    defaultRatio: 8,
    defaultTime: 7200,
  },
  {
    id: "brew_bar",
    name: "Brew Bar",
    icon: "flask",
    description: "Professional brewing with precise control",
    defaultRatio: 17,
    defaultTime: 300,
  },
];

export default function ExtractionScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [isConnected, setIsConnected] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<BrewingMethod | null>(
    null
  );
  const [coffeeWeight, setCoffeeWeight] = useState(0);
  const [waterRatio, setWaterRatio] = useState(0);
  const [isBrewing, setIsBrewing] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [progress] = useState(new Animated.Value(0));
  const [ratio, setRatio] = useState(15);

  const handleConnect = () => {
    setIsConnected(true);
    Alert.alert("Connected", "Device connected successfully!");
  };

  const handleMethodSelect = (method: BrewingMethod) => {
    setSelectedMethod(method);
    setRatio(method.defaultRatio);
    setTimeRemaining(method.defaultTime);
    if (coffeeWeight > 0) {
      const newWaterRatio = Number(
        (coffeeWeight * method.defaultRatio).toFixed(2)
      );
      setWaterRatio(newWaterRatio);
    }
  };

  const handleCoffeeWeightChange = (weight: number) => {
    setCoffeeWeight(weight);
    if (selectedMethod) {
      const newWaterRatio = Number(
        (weight * selectedMethod.defaultRatio).toFixed(2)
      );
      setWaterRatio(newWaterRatio);
    }
  };

  const handleRatioChange = (newRatio: number) => {
    setRatio(newRatio);
    if (coffeeWeight > 0) {
      const newWaterRatio = Number((coffeeWeight * newRatio).toFixed(2));
      setWaterRatio(newWaterRatio);
    }
  };

  const handleTimerChange = (seconds: number) => {
    setTimeRemaining(seconds);
  };

  const startBrewing = () => {
    if (!selectedMethod || coffeeWeight <= 0) {
      Alert.alert(
        "Error",
        "Please select a brewing method and add coffee first"
      );
      return;
    }

    setIsBrewing(true);

    Animated.timing(progress, {
      toValue: 1,
      duration: timeRemaining * 1000,
      useNativeDriver: true,
    }).start();

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsBrewing(false);
          Alert.alert("Brewing Complete", "Your coffee is ready!");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const renderBrewingMethod = (method: BrewingMethod) => (
    <TouchableOpacity
      key={method.id}
      style={[
        styles.methodCard,
        selectedMethod?.id === method.id && styles.selectedMethodCard,
      ]}
      onPress={() => handleMethodSelect(method)}
    >
      <Ionicons name={method.icon as any} size={32} color="#007AFF" />
      <Text style={styles.methodName}>{method.name}</Text>
      <Text style={styles.methodDesc}>{method.description}</Text>
      <View style={styles.methodDetails}>
        <Text style={styles.methodDetail}>1:{method.defaultRatio} ratio</Text>
        <Text style={styles.methodDetail}>
          {formatTime(method.defaultTime)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderRatioMeter = () => (
    <View style={styles.ratioMeterContainer}>
      <Text style={styles.sectionTitle}>Coffee:Water Ratio</Text>
      <View style={styles.ratioMeter}>
        <View style={styles.ratioScale}>
          {[8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((value) => (
            <TouchableOpacity
              key={value}
              style={styles.ratioMark}
              onPress={() => handleRatioChange(value)}
            >
              <Text
                style={[
                  styles.ratioMarkText,
                  ratio === value && styles.ratioMarkTextActive,
                ]}
              >
                1:{value}
              </Text>
              <View
                style={[
                  styles.ratioMarkLine,
                  ratio === value && styles.ratioMarkLineActive,
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.ratioValueContainer}>
          <Text style={styles.ratioValueText}>1:{ratio}</Text>
        </View>
      </View>
    </View>
  );

  const renderTimerAdjustment = () => (
    <View style={styles.timerSection}>
      <Text style={styles.sectionTitle}>Brew Time</Text>
      <View style={styles.timerInput}>
        <TouchableOpacity
          style={styles.timerButton}
          onPress={() => handleTimerChange(Math.max(30, timeRemaining - 30))}
        >
          <Ionicons name="remove" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
        <TouchableOpacity
          style={styles.timerButton}
          onPress={() => handleTimerChange(timeRemaining + 30)}
        >
          <Ionicons name="add" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (!isConnected) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Extraction</Text>
          <View style={styles.headerRight} />
        </View>

        <View style={styles.connectContainer}>
          <Ionicons name="bluetooth" size={64} color="#007AFF" />
          <Text style={styles.connectTitle}>Connect to Extraction</Text>
          <Text style={styles.connectDesc}>
            Make sure your Extraction device is turned on and nearby
          </Text>
          <TouchableOpacity
            style={styles.connectButton}
            onPress={handleConnect}
          >
            <Text style={styles.connectButtonText}>Connect</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Extraction</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {!selectedMethod ? (
          <View style={styles.methodsContainer}>
            <Text style={styles.sectionTitle}>Select Brewing Method</Text>
            <View style={styles.methodsGrid}>
              {brewingMethods.map(renderBrewingMethod)}
            </View>
          </View>
        ) : isBrewing ? (
          <View style={styles.brewingContainer}>
            <View style={styles.timerContainer}>
              <View style={styles.timerCircle}>
                <Animated.View
                  style={[
                    styles.timerProgress,
                    {
                      transform: [
                        {
                          rotate: progress.interpolate({
                            inputRange: [0, 1],
                            outputRange: ["0deg", "360deg"],
                          }),
                        },
                      ],
                    },
                  ]}
                />
                <Text style={styles.timerText}>
                  {formatTime(timeRemaining)}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.stopButton}
              onPress={() => setIsBrewing(false)}
            >
              <Text style={styles.stopButtonText}>Stop</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.brewingSetup}>
            <View style={styles.weightSection}>
              <Text style={styles.sectionTitle}>Coffee Weight</Text>
              <View style={styles.weightInput}>
                <TouchableOpacity
                  style={styles.weightButton}
                  onPress={() =>
                    handleCoffeeWeightChange(Math.max(0, coffeeWeight - 1))
                  }
                >
                  <Ionicons name="remove" size={24} color="#007AFF" />
                </TouchableOpacity>
                <Text style={styles.weightText}>{coffeeWeight}g</Text>
                <TouchableOpacity
                  style={styles.weightButton}
                  onPress={() => handleCoffeeWeightChange(coffeeWeight + 1)}
                >
                  <Ionicons name="add" size={24} color="#007AFF" />
                </TouchableOpacity>
              </View>
            </View>

            {renderRatioMeter()}

            <View style={styles.ratioSection}>
              <Text style={styles.sectionTitle}>Water Level</Text>
              <View style={styles.ratioInput}>
                <TouchableOpacity
                  style={styles.ratioButton}
                  onPress={() =>
                    setWaterRatio(
                      Number(Math.max(0, waterRatio - 10).toFixed(2))
                    )
                  }
                >
                  <Ionicons name="remove" size={24} color="#007AFF" />
                </TouchableOpacity>
                <Text style={styles.ratioText}>{waterRatio.toFixed(2)}ml</Text>
                <TouchableOpacity
                  style={styles.ratioButton}
                  onPress={() =>
                    setWaterRatio(Number((waterRatio + 10).toFixed(2)))
                  }
                >
                  <Ionicons name="add" size={24} color="#007AFF" />
                </TouchableOpacity>
              </View>
            </View>

            {renderTimerAdjustment()}

            <TouchableOpacity style={styles.startButton} onPress={startBrewing}>
              <Text style={styles.startButtonText}>Start Brewing</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  headerRight: {
    width: 40,
  },
  settingsButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  connectContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  connectTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 24,
    marginBottom: 8,
  },
  connectDesc: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
  },
  connectButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 32,
  },
  connectButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  brewingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  timerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  timerCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#f8f9fa",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 8,
    borderColor: "#E5E5E5",
  },
  timerProgress: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 100,
    borderWidth: 8,
    borderColor: "#007AFF",
    borderTopColor: "transparent",
    borderRightColor: "transparent",
  },
  timerText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#333",
  },
  stopButton: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 32,
    marginTop: 32,
  },
  stopButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  brewingSetup: {
    flex: 1,
  },
  weightSection: {
    marginBottom: 24,
  },
  weightInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
  },
  weightButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  weightText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginHorizontal: 24,
  },
  ratioSection: {
    marginBottom: 32,
  },
  ratioInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
  },
  ratioButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  ratioText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginHorizontal: 24,
  },
  startButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  startButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  ratioMeterContainer: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  ratioMeter: {
    height: 80,
    position: "relative",
    marginTop: 16,
  },
  ratioScale: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  ratioMark: {
    alignItems: "center",
    padding: 8,
  },
  ratioMarkText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  ratioMarkTextActive: {
    color: "#007AFF",
    fontWeight: "bold",
  },
  ratioMarkLine: {
    width: 2,
    height: 8,
    backgroundColor: "#ccc",
  },
  ratioMarkLineActive: {
    backgroundColor: "#007AFF",
    height: 12,
  },
  ratioValueContainer: {
    alignItems: "center",
    marginTop: 8,
  },
  ratioValueText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#007AFF",
  },
  timerSection: {
    marginBottom: 24,
  },
  timerInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
  },
  timerButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 24,
  },
  methodsContainer: {
    flex: 1,
  },
  methodsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  methodCard: {
    width: "48%",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
  },
  selectedMethodCard: {
    backgroundColor: "#E3F2FD",
    borderColor: "#007AFF",
    borderWidth: 2,
  },
  methodName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 12,
    marginBottom: 4,
  },
  methodDesc: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 8,
  },
  methodDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 8,
  },
  methodDetail: {
    fontSize: 12,
    color: "#007AFF",
    fontWeight: "500",
  },
});
