import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { ShopItem } from "../types/shop-item";

interface ShopItemCardProps {
  item: ShopItem;
  onPress: () => void;
}

const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2; // 16px padding on each side + 16px gap

export default function ShopItemCard({ item, onPress }: ShopItemCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <TouchableOpacity style={styles.favoriteButton}>
          <Ionicons name="heart-outline" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.brand}>{item.brand || "Get the Pong"}</Text>
        <Text style={styles.name} numberOfLines={2}>
          {item.name}
        </Text>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>${item.price}</Text>
          {item.originalPrice && (
            <Text style={styles.originalPrice}>${item.originalPrice}</Text>
          )}
        </View>

        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    borderRadius: 12,
    marginBottom: 16,
    marginRight: 25,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 150,
    borderRadius: 12,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  favoriteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    padding: 12,
    position: "relative",
  },
  brand: {
    fontSize: 12,
    color: "#666",
    fontFamily: "cardRegular",
    marginBottom: 4,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    fontFamily: "cardMedium",
    lineHeight: 18,
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    fontFamily: "cardMedium",
  },
  originalPrice: {
    fontSize: 14,
    color: "#999",
    textDecorationLine: "line-through",
    marginLeft: 8,
    fontFamily: "cardRegular",
  },
  addButton: {
    position: "absolute",
    bottom: 12,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 7,
    backgroundColor: "#8CDBED",
    justifyContent: "center",
    alignItems: "center",
  },
});
