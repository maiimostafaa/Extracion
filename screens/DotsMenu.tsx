import { useAuth } from "../context/AuthContext";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { Ionicons } from "@expo/vector-icons";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function DotsMenu() {
  const { logout } = useAuth();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();

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
      <Ionicons
        name="close"
        size={24}
        color="#000"
        style={{ margin: 16 }}
        onPress={handleBack}
      />
      <Text>Menu</Text>
      <TouchableOpacity onPress={logout} style={{ marginTop: 20 }}>
        <Text style={{ color: "red" }}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}
