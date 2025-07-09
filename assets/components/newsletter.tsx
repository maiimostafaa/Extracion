import React from "react";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import Video from "react-native-video";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageSourcePropType,
} from "react-native";
import { newsletterItem } from "../types/newsletter-item";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Props {
  item: newsletterItem;
  onPress?: () => void;
}

const NewsletterCard = ({ item, onPress }: Props) => {
  const navigation = useNavigation<NavigationProp>();
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("NewsletterDetail", { item })}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
        <View style={styles.labelContainer}>
          <Text style={styles.labelText}>{item.category}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.creator} numberOfLines={1}>
          By {item.createdBy}
        </Text>
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
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
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
    fontFamily: "main",
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 25,
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

export default NewsletterCard;
