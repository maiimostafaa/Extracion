import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface CustomHeaderProps {
  tintColor?: string; // Optional prop for tint color
}
export default function Header({ tintColor = "#fff" }: CustomHeaderProps) {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const handleDots = () => {
    navigation.navigate("DotsMenu");
  };
  return (
    <View style={styles.header}>
      {/* Top Row: Logo + Icons */}
      <View style={styles.topRow}>
        <Image
          source={require("../assets/nonclickable-visual-elements/getthepong-logo.png")}
          style={[styles.logo, { tintColor }]} // Apply tintColor to the logo
        />
        <View style={styles.iconRow}>
          <TouchableOpacity style={styles.iconWrapper}>
            <FontAwesome6 name="bell" size={21} color={tintColor} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconWrapper} onPress={handleDots}>
            <Entypo name="dots-three-horizontal" size={21} color={tintColor} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 0,
    paddingBottom: 30,
    width: "100%",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    width: 80,
    height: 18,
    resizeMode: "contain",
    // tintColor will be dynamically applied via inline style
  },
  iconRow: {
    flexDirection: "row",
  },
  iconWrapper: {
    marginLeft: 10,
  },
});
