// README
// Card component for displaying a newsletter item in a list or grid.
// Features:
// - Shows thumbnail image, category label, title, and creator name.
// - Navigates to NewsletterDetail screen when pressed.
// Notes:
// - Accepts a `newsletterItem` type as `item` prop.
// - `onPress` prop is optional; default behavior is navigation.
// - Styled for use in vertical lists with spacing between cards.

// -------------------- Imports --------------------
import React from "react";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../navigation/AppNavigator";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { newsletterItem } from "../../types/newsletter-item";

// -------------------- Navigation Type --------------------
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// -------------------- Props --------------------
interface Props {
  item: newsletterItem; // Newsletter data (title, thumbnail, etc.)
  onPress?: () => void; // Optional custom press handler
}

// -------------------- Component --------------------
const NewsletterCard = ({ item, onPress }: Props) => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("NewsletterDetail", { item })} // Navigate to detail screen with item data
    >
      {/* ---------- Image & Category Label ---------- */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
        <View style={styles.labelContainer}>
          <Text style={styles.labelText}>{item.category}</Text>
        </View>
      </View>

      {/* ---------- Content Section ---------- */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={3}>
          {item.title}
        </Text>
        <Text style={styles.creator} numberOfLines={1}>
          By {item.createdBy}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// -------------------- Styles --------------------
const styles = StyleSheet.create({
  card: {
    width: "100%",
    height: 400,
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
    fontSize: 18,
    fontWeight: "400",
    color: "#111",
    marginBottom: 4,
    fontFamily: "cardMedium",
  },
  creator: {
    fontSize: 13,
    color: "#777",
    fontFamily: "cardRegular",
  },
});

// -------------------- Export --------------------
export default NewsletterCard;
