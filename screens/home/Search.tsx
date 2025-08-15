// README
// This is the Search screen placeholder for the app.
// Currently shows a header with a back button and title,
// plus a centered placeholder message indicating search is coming soon.

// -------------------- Imports --------------------
import React from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/AppNavigator";

// -------------------- Types --------------------
// Navigation type for strongly-typed navigation prop
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// -------------------- Component --------------------
export default function SearchScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      {/* ---------- Header with back button and title ---------- */}
      <View style={styles.header}>
        {/* Back button: navigates to previous screen */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        {/* Screen title */}
        <Text style={styles.headerTitle}>Search</Text>
      </View>

      {/* ---------- Main content area ---------- */}
      <View style={styles.content}>
        {/* Placeholder text until search is implemented */}
        <Text style={styles.placeholderText}>
          Search functionality coming soon...
        </Text>
      </View>
    </SafeAreaView>
  );
}

// -------------------- Styles --------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // White background for entire screen
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee", // Light gray bottom border
  },
  backButton: {
    padding: 8, // Touch target padding for back button
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 16, // Space between back button and title
  },
  content: {
    flex: 1,
    justifyContent: "center", // Center vertically
    alignItems: "center", // Center horizontally
    padding: 16,
  },
  placeholderText: {
    fontSize: 16,
    color: "#666", // Medium gray text
    textAlign: "center",
  },
});
