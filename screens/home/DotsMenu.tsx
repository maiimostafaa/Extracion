// README
// Simple menu screen opened via a "dots" or options button.
// Features:
// - Close button to navigate back.
// - Menu title text.
// - Logout option that calls the `logout` function from AuthContext.

// -------------------- Imports --------------------
import { useAuth } from "../../context/AuthContext";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import { Ionicons } from "@expo/vector-icons";

// -------------------- Navigation Types --------------------
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// -------------------- Component --------------------
export default function DotsMenu() {
  // Get logout function from AuthContext
  const { logout } = useAuth();

  // Navigation hook for going back
  const navigation = useNavigation<NavigationProp>();

  // Access current route if needed (not used yet, but could be for context-based menus)
  const route = useRoute();

  // Handler for closing the menu and going back to the previous screen
  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View
      style={{
        alignSelf: "center",
        height: "100%",
        flexDirection: "column",
        marginTop: "50%",
      }}
    >
      {/* Close icon in the top-left */}
      <Ionicons
        name="close"
        size={24}
        color="#000"
        style={{ margin: 16 }}
        onPress={handleBack}
      />

      {/* Menu title */}
      <Text>Menu</Text>

      {/* Logout button */}
      <TouchableOpacity onPress={logout} style={{ marginTop: 20 }}>
        <Text style={{ color: "red" }}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}
