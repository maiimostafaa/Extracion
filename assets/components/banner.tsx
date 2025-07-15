import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import { bannerItem } from "../types/banner-item";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Props {
  item: bannerItem;
  onPress?: () => void;
}

const BannerCard = ({ item, onPress }: Props) => {
  const navigation = useNavigation<NavigationProp>();
  return (
    <TouchableOpacity style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image_url }} style={styles.thumbnail} />

        <View style={styles.labelContainer}>
          <Text style={styles.labelText}>{item.category}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    height: 360,
    borderTopLeftRadius: 60,
    backgroundColor: "#fff",
    marginRight: 16,
    overflow: "hidden",
    marginBottom: 20,
  },
  thumbnail: {
    height: 275,
    resizeMode: "cover",
  },
  imageContainer: {
    width: "100%",
    height: 275,
    borderTopLeftRadius: 12,
  },
  labelContainer: {
    top: -25,
    left: -5,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderTopRightRadius: 8,
    alignSelf: "flex-start",
  },
  labelText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    fontFamily: "cardMedium",
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 25,
    fontWeight: "400",
    color: "#111",
    marginBottom: 4,
    fontFamily: "cardRegular",
  },
  sub: {
    fontSize: 13,
    color: "#000",
    fontFamily: "cardLight",
  },
});

export default BannerCard;
