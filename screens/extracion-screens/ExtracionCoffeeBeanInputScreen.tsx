import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import { CoffeeBean, RoasterLevel } from "../../assets/types/coffee-bean";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ExtracionCoffeeBeanInputScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const [formData, setFormData] = useState({
    coffeeName: "",
    origin: "",
    roasterDate: "",
    roasterLevel: "",
    bagWeightG: "",
    rating: 0,
  });

  const handleClose = () => {
    navigation.goBack();
  };

  const handleScan = () => {
    console.log("Scan coffee bag pressed");
    // TODO: Implement camera scanning functionality
  };

  const handleRatingPress = (rating: number) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  const handleSaveChanges = () => {
    // Basic validation
    if (!formData.coffeeName.trim()) {
      Alert.alert("Error", "Please enter a coffee name");
      return;
    }

    // TODO: Save the coffee bean data
    console.log("Saving coffee bean:", formData);

    // Navigate back to the list screen
    navigation.goBack();
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => handleRatingPress(i)}
          style={styles.starButton}
        >
          <Ionicons
            name={i <= formData.rating ? "star" : "star-outline"}
            size={24}
            color={i <= formData.rating ? "#FFD700" : "#CCCCCC"}
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#333333" />

      {/* Header */}
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>add coffee beans</Text>
            <View style={styles.headerRight} />
          </View>
        </View>
      </SafeAreaView>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Scan Section */}
        <TouchableOpacity style={styles.scanSection} onPress={handleScan}>
          <View style={styles.cameraIcon}>
            <Ionicons name="camera" size={40} color="#FFFFFF" />
          </View>
          <Text style={styles.scanTitle}>Scan your coffee</Text>
          <Text style={styles.scanSubtitle}>
            Point your camera at the bag to auto-fill the data
          </Text>
        </TouchableOpacity>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>coffee name</Text>
            <TextInput
              style={styles.textInput}
              placeholder="enter value"
              placeholderTextColor="#CCCCCC"
              value={formData.coffeeName}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, coffeeName: text }))
              }
            />
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>origin</Text>
            <TextInput
              style={styles.textInput}
              placeholder="enter value"
              placeholderTextColor="#CCCCCC"
              value={formData.origin}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, origin: text }))
              }
            />
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>roaster date</Text>
            <TextInput
              style={styles.textInput}
              placeholder="enter value"
              placeholderTextColor="#CCCCCC"
              value={formData.roasterDate}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, roasterDate: text }))
              }
            />
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>roaster level</Text>
            <TextInput
              style={styles.textInput}
              placeholder="enter value"
              placeholderTextColor="#CCCCCC"
              value={formData.roasterLevel}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, roasterLevel: text }))
              }
            />
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>bag weight (g)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="enter value"
              placeholderTextColor="#CCCCCC"
              value={formData.bagWeightG}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, bagWeightG: text }))
              }
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>rating</Text>
            <View style={styles.ratingContainer}>{renderStars()}</View>
          </View>
        </View>

        {/* Save Button */}
        <View style={styles.saveButtonContainer}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveChanges}
          >
            <Text style={styles.saveButtonText}>save changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#333333",
  },
  safeArea: {
    backgroundColor: "#333333",
  },
  header: {
    backgroundColor: "#333333",
    paddingBottom: 16,
  },
  headerContent: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "400",
    color: "#FFFFFF",
    marginLeft: 8,
  },
  headerRight: {
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 24,
  },
  scanSection: {
    alignItems: "center",
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    marginBottom: 20,
  },
  cameraIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#8CDBED",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  scanTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333333",
    marginBottom: 8,
  },
  scanSubtitle: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    lineHeight: 20,
  },
  formContainer: {
    paddingBottom: 20,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingVertical: 8,
  },
  inputLabel: {
    fontSize: 16,
    color: "#333333",
    fontWeight: "400",
    flex: 1,
  },
  textInput: {
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingVertical: 8,
    paddingHorizontal: 0,
    fontSize: 16,
    color: "#333333",
    textAlign: "right",
    flex: 1,
    marginLeft: 16,
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    flex: 1,
    marginLeft: 16,
  },
  starButton: {
    marginLeft: 4,
  },
  saveButtonContainer: {
    paddingVertical: 20,
    paddingBottom: 40,
  },
  saveButton: {
    backgroundColor: "#8CDBED",
    paddingVertical: 16,
    borderRadius: 50,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#000000",
  },
});

export default ExtracionCoffeeBeanInputScreen;
